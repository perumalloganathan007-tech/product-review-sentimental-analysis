package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import scala.concurrent.{ExecutionContext, Future}
import services.WebScrapingService
import scala.util.{Try, Success, Failure}

@Singleton
class FlipkartScraperController @Inject()(
  val controllerComponents: ControllerComponents,
  webScrapingService: WebScrapingService
)(implicit ec: ExecutionContext) extends BaseController {

  case class ScrapeRequest(url: String)
  case class ScrapeResponse(
    productName: String,
    price: Option[String],
    originalPrice: Option[String],
    discount: Option[String],
    rating: Option[Double],
    reviewCount: Option[Int],
    reviewsFound: Int,
    selectors: Map[String, String],
    dataQuality: Int
  )

  implicit val scrapeRequestFormat: Format[ScrapeRequest] = Json.format[ScrapeRequest]
  implicit val scrapeResponseFormat: Format[ScrapeResponse] = Json.format[ScrapeResponse]

  /**
   * Main endpoint for Flipkart scraping training
   */
  def scrapeFlipkart(): Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.body.validate[ScrapeRequest] match {
      case JsSuccess(scrapeReq, _) =>
        if (!scrapeReq.url.contains("flipkart.com")) {
          Future.successful(BadRequest(Json.obj(
            "error" -> "Invalid URL",
            "message" -> "URL must be from Flipkart"
          )))
        } else {
          webScrapingService.scrapeProductReviews(scrapeReq.url).map {
            case (productInfo, reviews) =>
              val dataQuality = calculateDataQuality(productInfo, reviews.size)
              
              val response = ScrapeResponse(
                productName = productInfo.name,
                price = extractPriceFromMetadata(productInfo.metadata),
                originalPrice = extractOriginalPriceFromMetadata(productInfo.metadata),
                discount = extractDiscountFromMetadata(productInfo.metadata),
                rating = productInfo.averageRating,
                reviewCount = productInfo.totalReviews,
                reviewsFound = reviews.size,
                selectors = Map(
                  "productName" -> "span.VU-ZEz",
                  "price" -> "div.Nx9bqj",
                  "rating" -> "div.XQDdHH"
                ),
                dataQuality = dataQuality
              )
              
              Ok(Json.toJson(response))
          }.recover {
            case ex: Exception =>
              InternalServerError(Json.obj(
                "error" -> "Scraping failed",
                "message" -> ex.getMessage,
                "suggestion" -> "Check if the URL is valid and accessible"
              ))
          }
        }
        
      case JsError(errors) =>
        Future.successful(BadRequest(Json.obj(
          "error" -> "Invalid request",
          "details" -> errors.toString()
        )))
    }
  }

  /**
   * Test endpoint to verify specific selectors
   */
  def testSelectors(): Action[JsValue] = Action.async(parse.json) { implicit request =>
    val url = (request.body \ "url").asOpt[String].getOrElse("")
    val selectorType = (request.body \ "type").asOpt[String].getOrElse("all")
    
    if (url.isEmpty || !url.contains("flipkart.com")) {
      Future.successful(BadRequest(Json.obj(
        "error" -> "Invalid URL"
      )))
    } else {
      // Return mock selector test results for now
      Future.successful(Ok(Json.obj(
        "selectors" -> Json.obj(
          "productName" -> Json.arr(
            Json.obj("selector" -> "span.VU-ZEz", "working" -> true),
            Json.obj("selector" -> "span.B_NuCI", "working" -> true),
            Json.obj("selector" -> "h1.yhB1nd", "working" -> false)
          ),
          "price" -> Json.arr(
            Json.obj("selector" -> "div.Nx9bqj", "working" -> true),
            Json.obj("selector" -> "div._30jeq3", "working" -> false)
          ),
          "rating" -> Json.arr(
            Json.obj("selector" -> "div.XQDdHH", "working" -> true),
            Json.obj("selector" -> "div._3LWZlK", "working" -> true)
          )
        )
      )))
    }
  }

  /**
   * Batch training endpoint - scrape multiple URLs
   */
  def batchTrain(): Action[JsValue] = Action.async(parse.json) { implicit request =>
    val urls = (request.body \ "urls").asOpt[Seq[String]].getOrElse(Seq.empty)
    
    if (urls.isEmpty) {
      Future.successful(BadRequest(Json.obj(
        "error" -> "No URLs provided"
      )))
    } else {
      val validUrls = urls.filter(_.contains("flipkart.com"))
      
      if (validUrls.isEmpty) {
        Future.successful(BadRequest(Json.obj(
          "error" -> "No valid Flipkart URLs found"
        )))
      } else {
        webScrapingService.batchScrapeReviews(validUrls).map { results =>
          val responses = results.map { case (productInfo, reviews) =>
            Json.obj(
              "url" -> productInfo.url,
              "productName" -> productInfo.name,
              "price" -> extractPriceFromMetadata(productInfo.metadata),
              "rating" -> productInfo.averageRating,
              "reviewCount" -> reviews.size,
              "success" -> true
            )
          }
          
          Ok(Json.obj(
            "total" -> urls.size,
            "successful" -> responses.size,
            "failed" -> (urls.size - responses.size),
            "results" -> responses
          ))
        }.recover {
          case ex: Exception =>
            InternalServerError(Json.obj(
              "error" -> "Batch training failed",
              "message" -> ex.getMessage
            ))
        }
      }
    }
  }

  /**
   * Get scraper statistics and performance metrics
   */
  def getStats(): Action[AnyContent] = Action { implicit request =>
    Ok(Json.obj(
      "version" -> "1.0.0",
      "supportedPlatforms" -> Json.arr("flipkart", "amazon", "myntra"),
      "selectors" -> Json.obj(
        "flipkart" -> Json.obj(
          "productName" -> 6,
          "price" -> 5,
          "rating" -> 5,
          "reviewCount" -> 3
        )
      ),
      "lastUpdated" -> "2024-12-09",
      "status" -> "operational"
    ))
  }

  // Helper methods
  private def calculateDataQuality(productInfo: services.ProductInfo, reviewCount: Int): Int = {
    var score = 0
    if (productInfo.name.nonEmpty && !productInfo.name.contains("Unknown")) score += 20
    if (extractPriceFromMetadata(productInfo.metadata).isDefined) score += 30
    if (productInfo.averageRating.isDefined) score += 30
    if (reviewCount > 0) score += 10
    if (productInfo.totalReviews.isDefined) score += 10
    score
  }

  private def extractPriceFromMetadata(metadata: Option[JsValue]): Option[String] = {
    metadata.flatMap { json =>
      (json \ "price").asOpt[String]
    }
  }

  private def extractOriginalPriceFromMetadata(metadata: Option[JsValue]): Option[String] = {
    metadata.flatMap { json =>
      (json \ "originalPrice").asOpt[String]
    }
  }

  private def extractDiscountFromMetadata(metadata: Option[JsValue]): Option[String] = {
    metadata.flatMap { json =>
      (json \ "discount").asOpt[String]
    }
  }
}
