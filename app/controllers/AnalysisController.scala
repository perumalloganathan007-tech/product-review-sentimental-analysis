package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import scala.concurrent.{ExecutionContext, Future}
import services._
import models._
import repositories._
import java.io.File
import java.nio.file.{Files, Paths}
import java.time.ZonedDateTime

@Singleton
class AnalysisController @Inject()(
  val controllerComponents: ControllerComponents,
  productRepo: ProductRepository,
  analysisRepo: AnalysisRepository,
  reviewRepo: ReviewRepository,
  databaseTestService: DatabaseTestService
)(implicit ec: ExecutionContext) extends BaseController {

  case class DatasetAnalysisRequest(
    productName: String,
    isPreprocessed: Boolean,
    datasetType: String // csv, json, excel
  )

  case class UrlAnalysisRequest(
    urls: Seq[String],
    productNames: Option[Seq[String]] = None
  )

  case class AnalysisResponse(
    id: Long,
    productName: String,
    inputType: String,
    totalReviews: Int,
    positiveCount: Int,
    neutralCount: Int,
    negativeCount: Int,
    positivePercentage: BigDecimal,
    neutralPercentage: BigDecimal,
    negativePercentage: BigDecimal,
    overallSentiment: String,
    overallSuggestion: Option[String],
    createdAt: Option[ZonedDateTime]
  )

  case class AnalysisWithProductResponse(
    analysis: AnalysisResponse,
    product: ProductResponse
  )

  case class ProductResponse(
    id: Long,
    name: String,
    url: Option[String]
  )

  implicit val datasetAnalysisRequestFormat: Format[DatasetAnalysisRequest] = Json.format[DatasetAnalysisRequest]
  implicit val urlAnalysisRequestFormat: Format[UrlAnalysisRequest] = Json.format[UrlAnalysisRequest]
  implicit val analysisResponseFormat: Format[AnalysisResponse] = Json.format[AnalysisResponse]
  implicit val productResponseFormat: Format[ProductResponse] = Json.format[ProductResponse]
  implicit val analysisWithProductResponseFormat: Format[AnalysisWithProductResponse] = Json.format[AnalysisWithProductResponse]

  def analyzeDataset(): Action[AnyContent] = Action.async { implicit request =>
    request.body.asMultipartFormData match {
      case Some(formData) =>
        formData.file("dataset") match {
          case Some(filePart) =>
            try {
              val productName = formData.asFormUrlEncoded.get("productName").head.head
              val isPreprocessed = formData.asFormUrlEncoded.get("isPreprocessed").flatMap(_.headOption).contains("true")
              val datasetType = formData.asFormUrlEncoded.get("datasetType").head.head

              // For demo purposes, create a sample analysis
              for {
                // Create product
                product <- productRepo.create(Product(
                  name = productName,
                  url = Some(s"dataset://${filePart.filename.getOrElse("dataset.csv")}"),
                  metadata = Some(Json.obj(
                    "datasetType" -> datasetType,
                    "isPreprocessed" -> isPreprocessed,
                    "originalFilename" -> filePart.filename.getOrElse("dataset.csv")
                  ))
                ))

                // Create analysis with sample data
                analysis <- analysisRepo.create(Analysis(
                  productId = product.id.get,
                  inputType = InputType.Dataset,
                  preprocessingStatus = isPreprocessed,
                  positiveCount = 45,
                  neutralCount = 20,
                  negativeCount = 15,
                  totalReviews = 80,
                  positivePercentage = BigDecimal(56.25),
                  neutralPercentage = BigDecimal(25.00),
                  negativePercentage = BigDecimal(18.75),
                  overallSentiment = SentimentType.Positive,
                  overallSuggestion = Some("This product shows strong positive sentiment among customers. Most reviews highlight excellent quality and customer satisfaction."),
                  sentimentCounts = Some(Json.obj("positive" -> 45, "neutral" -> 20, "negative" -> 15)),
                  percentages = Some(Json.obj("positive" -> 56.25, "neutral" -> 25.00, "negative" -> 18.75))
                ))

                // Create sample reviews
                sampleReviews = Seq(
                  Review(analysis.id.get, "This product is absolutely amazing! Love it!", SentimentType.Positive, BigDecimal(0.92)),
                  Review(analysis.id.get, "Good quality, meets expectations.", SentimentType.Positive, BigDecimal(0.75)),
                  Review(analysis.id.get, "It's okay, nothing special.", SentimentType.Neutral, BigDecimal(0.05)),
                  Review(analysis.id.get, "Not worth the money, disappointing.", SentimentType.Negative, BigDecimal(-0.78))
                )

                _ <- reviewRepo.createBatch(sampleReviews)

              } yield {
                val response = AnalysisResponse(
                  id = analysis.id.get,
                  productName = product.name,
                  inputType = "DATASET",
                  totalReviews = analysis.totalReviews,
                  positiveCount = analysis.positiveCount,
                  neutralCount = analysis.neutralCount,
                  negativeCount = analysis.negativeCount,
                  positivePercentage = analysis.positivePercentage,
                  neutralPercentage = analysis.neutralPercentage,
                  negativePercentage = analysis.negativePercentage,
                  overallSentiment = analysis.overallSentiment.toString,
                  overallSuggestion = analysis.overallSuggestion,
                  createdAt = analysis.createdAt
                )
                Ok(Json.toJson(response))
              }
            } catch {
              case ex: Exception =>
                Future.successful(BadRequest(Json.obj(
                  "error" -> "Error processing dataset",
                  "message" -> ex.getMessage
                )))
            }
          case None =>
            Future.successful(BadRequest(Json.obj("error" -> "No dataset file provided")))
        }
      case None =>
        Future.successful(BadRequest(Json.obj("error" -> "Invalid request format")))
    }
  }

  def analyzeUrls(): Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.body.validate[UrlAnalysisRequest] match {
      case JsSuccess(urlRequest, _) =>
        val analysisFutures = urlRequest.urls.zipWithIndex.map { case (url, index) =>
          val productName = urlRequest.productNames.flatMap(_.lift(index)).getOrElse(s"Product from ${extractDomainFromUrl(url)}")

          for {
            // Create product
            product <- productRepo.create(Product(
              name = productName,
              url = Some(url),
              metadata = Some(Json.obj(
                "sourceUrl" -> url,
                "extractedDomain" -> extractDomainFromUrl(url)
              ))
            ))

            // Create sample analysis (in real implementation, would scrape and analyze)
            analysis <- analysisRepo.create(Analysis(
              productId = product.id.get,
              inputType = InputType.URL,
              preprocessingStatus = false,
              positiveCount = 32,
              neutralCount = 18,
              negativeCount = 12,
              totalReviews = 62,
              positivePercentage = BigDecimal(51.61),
              neutralPercentage = BigDecimal(29.03),
              negativePercentage = BigDecimal(19.35),
              overallSentiment = SentimentType.Positive,
              overallSuggestion = Some(s"Analysis of ${productName} shows moderate positive sentiment with room for improvement in customer satisfaction."),
              sentimentCounts = Some(Json.obj("positive" -> 32, "neutral" -> 18, "negative" -> 12)),
              percentages = Some(Json.obj("positive" -> 51.61, "neutral" -> 29.03, "negative" -> 19.35))
            ))

            // Create sample reviews
            sampleReviews = Seq(
              Review(analysis.id.get, "Great product from this website!", SentimentType.Positive, BigDecimal(0.85)),
              Review(analysis.id.get, "Decent quality for the price.", SentimentType.Neutral, BigDecimal(0.15)),
              Review(analysis.id.get, "Could be better, had some issues.", SentimentType.Negative, BigDecimal(-0.65))
            )

            _ <- reviewRepo.createBatch(sampleReviews)

          } yield AnalysisResponse(
            id = analysis.id.get,
            productName = product.name,
            inputType = "URL",
            totalReviews = analysis.totalReviews,
            positiveCount = analysis.positiveCount,
            neutralCount = analysis.neutralCount,
            negativeCount = analysis.negativeCount,
            positivePercentage = analysis.positivePercentage,
            neutralPercentage = analysis.neutralPercentage,
            negativePercentage = analysis.negativePercentage,
            overallSentiment = analysis.overallSentiment.toString,
            overallSuggestion = analysis.overallSuggestion,
            createdAt = analysis.createdAt
          )
        }

        Future.sequence(analysisFutures).map { results =>
          Ok(Json.toJson(results))
        }
      case JsError(errors) =>
        Future.successful(BadRequest(Json.obj("errors" -> errors.toString())))
    }
  }

  def getAnalysis(id: Long): Action[AnyContent] = Action.async { implicit request =>
    for {
      analysisWithProduct <- analysisRepo.findWithProduct(id)
      reviews <- reviewRepo.findByAnalysisId(id)
    } yield {
      analysisWithProduct match {
        case Some((analysis, product)) =>
          val response = AnalysisWithProductResponse(
            analysis = AnalysisResponse(
              id = analysis.id.get,
              productName = product.name,
              inputType = analysis.inputType.toString,
              totalReviews = analysis.totalReviews,
              positiveCount = analysis.positiveCount,
              neutralCount = analysis.neutralCount,
              negativeCount = analysis.negativeCount,
              positivePercentage = analysis.positivePercentage,
              neutralPercentage = analysis.neutralPercentage,
              negativePercentage = analysis.negativePercentage,
              overallSentiment = analysis.overallSentiment.toString,
              overallSuggestion = analysis.overallSuggestion,
              createdAt = analysis.createdAt
            ),
            product = ProductResponse(
              id = product.id.get,
              name = product.name,
              url = product.url
            )
          )
          Ok(Json.toJson(response))
        case None =>
          NotFound(Json.obj("error" -> "Analysis not found"))
      }
    }
  }

  def getAllAnalyses(): Action[AnyContent] = Action.async { implicit request =>
    for {
      analyses <- analysisRepo.all()
      products <- Future.sequence(analyses.map(a => productRepo.findById(a.productId)))
    } yield {
      val results = analyses.zip(products).collect {
        case (analysis, Some(product)) =>
          AnalysisWithProductResponse(
            analysis = AnalysisResponse(
              id = analysis.id.get,
              productName = product.name,
              inputType = analysis.inputType.toString,
              totalReviews = analysis.totalReviews,
              positiveCount = analysis.positiveCount,
              neutralCount = analysis.neutralCount,
              negativeCount = analysis.negativeCount,
              positivePercentage = analysis.positivePercentage,
              neutralPercentage = analysis.neutralPercentage,
              negativePercentage = analysis.negativePercentage,
              overallSentiment = analysis.overallSentiment.toString,
              overallSuggestion = analysis.overallSuggestion,
              createdAt = analysis.createdAt
            ),
            product = ProductResponse(
              id = product.id.get,
              name = product.name,
              url = product.url
            )
          )
      }
      Ok(Json.toJson(results))
    }
  }

  private def extractDomainFromUrl(url: String): String = {
    try {
      val uri = new java.net.URI(url)
      uri.getHost match {
        case null => "Unknown"
        case host => host.replaceFirst("^www\\.", "")
      }
    } catch {
      case _: Exception => "Unknown"
    }
  }
}
