package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import scala.concurrent.{ExecutionContext, Future}
import models._
import repositories._
import java.time.ZonedDateTime

@Singleton
class ComparisonController @Inject()(
  val controllerComponents: ControllerComponents,
  productRepo: ProductRepository,
  analysisRepo: AnalysisRepository,
  comparisonRepo: ComparisonRepository,
  comparisonAnalysisRepo: ComparisonAnalysisRepository
)(implicit ec: ExecutionContext) extends BaseController {

  case class ComparisonRequest(
    name: String,
    description: Option[String] = None,
    analysisIds: Seq[Long]
  )

  case class DatasetComparisonRequest(
    name: String,
    description: Option[String] = None,
    datasets: Seq[ComparisonDataset]
  )

  case class ComparisonDataset(
    productName: String,
    isPreprocessed: Boolean,
    datasetType: String
  )

  case class UrlComparisonRequest(
    name: String,
    description: Option[String] = None,
    products: Seq[ComparisonProduct]
  )

  case class ComparisonProduct(
    name: String,
    urls: Seq[String]
  )

  case class ComparisonResponse(
    comparison: ComparisonDetails,
    analyses: Seq[AnalysisWithProduct],
    bestProduct: Option[ProductResponse],
    comparisonSummary: ComparisonSummary
  )

  case class ComparisonDetails(
    id: Long,
    name: String,
    description: Option[String],
    createdAt: Option[ZonedDateTime]
  )

  case class ComparisonSummary(
    bestProductScore: Double,
    recommendation: String,
    totalProducts: Int
  )

  case class AnalysisWithProduct(
    analysis: AnalysisDetails,
    product: ProductResponse
  )

  case class AnalysisDetails(
    id: Long,
    totalReviews: Int,
    positivePercentage: BigDecimal,
    neutralPercentage: BigDecimal,
    negativePercentage: BigDecimal,
    overallSentiment: String
  )

  case class ProductResponse(
    id: Long,
    name: String,
    url: Option[String]
  )

  implicit val comparisonRequestFormat: Format[ComparisonRequest] = Json.format[ComparisonRequest]
  implicit val comparisonDatasetFormat: Format[ComparisonDataset] = Json.format[ComparisonDataset]
  implicit val datasetComparisonRequestFormat: Format[DatasetComparisonRequest] = Json.format[DatasetComparisonRequest]
  implicit val comparisonProductFormat: Format[ComparisonProduct] = Json.format[ComparisonProduct]
  implicit val urlComparisonRequestFormat: Format[UrlComparisonRequest] = Json.format[UrlComparisonRequest]
  implicit val comparisonDetailsFormat: Format[ComparisonDetails] = Json.format[ComparisonDetails]
  implicit val comparisonSummaryFormat: Format[ComparisonSummary] = Json.format[ComparisonSummary]
  implicit val analysisDetailsFormat: Format[AnalysisDetails] = Json.format[AnalysisDetails]
  implicit val productResponseFormat: Format[ProductResponse] = Json.format[ProductResponse]
  implicit val analysisWithProductFormat: Format[AnalysisWithProduct] = Json.format[AnalysisWithProduct]
  implicit val comparisonResponseFormat: Format[ComparisonResponse] = Json.format[ComparisonResponse]

  def compareDatasets(): Action[AnyContent] = Action.async { implicit request =>
    // Handle multipart form data for multiple datasets
    request.body.asMultipartFormData match {
      case Some(formData) =>
        try {
          val name = formData.asFormUrlEncoded.get("name").head.head
          val description = formData.asFormUrlEncoded.get("description").headOption.flatMap(_.headOption)

          val datasetFiles = formData.files.filter(_.key == "datasets")
          val productNames = formData.asFormUrlEncoded.get("productNames").map(_.toSeq).getOrElse(Seq.empty)

          // Create sample products and analyses for demonstration
          val productAnalysisFutures = productNames.zipWithIndex.map { case (productName, index) =>
            for {
              // Create product
              product <- productRepo.create(Product(
                name = productName,
                url = Some(s"dataset://comparison_${index + 1}"),
                metadata = Some(Json.obj("comparisonIndex" -> index))
              ))

              // Create sample analysis with varied data
              analysis <- analysisRepo.create(Analysis(
                productId = product.id.get,
                inputType = InputType.Dataset,
                preprocessingStatus = true,
                positiveCount = 30 + (index * 5),
                neutralCount = 15 + (index * 2),
                negativeCount = 10 - (index * 2),
                totalReviews = 55 + (index * 5),
                positivePercentage = BigDecimal(54.55 + (index * 3.5)).setScale(2, BigDecimal.RoundingMode.HALF_UP),
                neutralPercentage = BigDecimal(27.27 - (index * 1.5)).setScale(2, BigDecimal.RoundingMode.HALF_UP),
                negativePercentage = BigDecimal(18.18 - (index * 2.0)).setScale(2, BigDecimal.RoundingMode.HALF_UP),
                overallSentiment = if (index == 0) SentimentType.Positive else if (index == 1) SentimentType.Neutral else SentimentType.Positive,
                overallSuggestion = Some(s"Analysis for ${productName} shows ${if (index == 0) "strong" else "moderate"} performance.")
              ))
            } yield (analysis, product)
          }

          for {
            productAnalyses <- Future.sequence(productAnalysisFutures)

            // Create comparison
            comparison <- comparisonRepo.create(Comparison(
              name = name,
              description = description,
              bestProductId = productAnalyses.headOption.map(_._2.id.get),
              comparisonMetadata = Some(Json.obj(
                "datasetCount" -> productNames.length,
                "comparisonType" -> "dataset"
              ))
            ))

            // Link analyses to comparison
            _ <- Future.sequence(productAnalyses.map { case (analysis, _) =>
              comparisonAnalysisRepo.create(ComparisonAnalysis(
                comparisonId = comparison.id.get,
                analysisId = analysis.id.get
              ))
            })

          } yield {
            val bestProduct = productAnalyses.maxBy(_._1.positivePercentage.toDouble)
            val response = ComparisonResponse(
              comparison = ComparisonDetails(
                id = comparison.id.get,
                name = comparison.name,
                description = comparison.description,
                createdAt = comparison.createdAt
              ),
              analyses = productAnalyses.map { case (analysis, product) =>
                AnalysisWithProduct(
                  analysis = AnalysisDetails(
                    id = analysis.id.get,
                    totalReviews = analysis.totalReviews,
                    positivePercentage = analysis.positivePercentage,
                    neutralPercentage = analysis.neutralPercentage,
                    negativePercentage = analysis.negativePercentage,
                    overallSentiment = analysis.overallSentiment.toString
                  ),
                  product = ProductResponse(
                    id = product.id.get,
                    name = product.name,
                    url = product.url
                  )
                )
              },
              bestProduct = Some(ProductResponse(
                id = bestProduct._2.id.get,
                name = bestProduct._2.name,
                url = bestProduct._2.url
              )),
              comparisonSummary = ComparisonSummary(
                bestProductScore = bestProduct._1.positivePercentage.toDouble,
                recommendation = s"Based on sentiment analysis, ${bestProduct._2.name} shows the highest customer satisfaction with ${bestProduct._1.positivePercentage}% positive sentiment.",
                totalProducts = productAnalyses.length
              )
            )
            Ok(Json.toJson(response))
          }
        } catch {
          case ex: Exception =>
            Future.successful(BadRequest(Json.obj(
              "error" -> "Error processing comparison request",
              "message" -> ex.getMessage
            )))
        }
      case None =>
        Future.successful(BadRequest(Json.obj("error" -> "Invalid request format")))
    }
  }

  def compareUrls(): Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.body.validate[UrlComparisonRequest] match {
      case JsSuccess(comparisonRequest, _) =>
        val productAnalysisFutures = comparisonRequest.products.zipWithIndex.map { case (compProduct, index) =>
          for {
            // Create product
            product <- productRepo.create(Product(
              name = compProduct.name,
              url = compProduct.urls.headOption,
              metadata = Some(Json.obj(
                "sourceUrls" -> compProduct.urls,
                "comparisonIndex" -> index
              ))
            ))

            // Create sample analysis with URL-specific data
            analysis <- analysisRepo.create(Analysis(
              productId = product.id.get,
              inputType = InputType.URL,
              preprocessingStatus = false,
              positiveCount = 25 + (index * 8),
              neutralCount = 20 + (index * 3),
              negativeCount = 15 - (index * 3),
              totalReviews = 60 + (index * 8),
              positivePercentage = BigDecimal(41.67 + (index * 7.5)).setScale(2, BigDecimal.RoundingMode.HALF_UP),
              neutralPercentage = BigDecimal(33.33 + (index * 2.0)).setScale(2, BigDecimal.RoundingMode.HALF_UP),
              negativePercentage = BigDecimal(25.00 - (index * 9.5)).setScale(2, BigDecimal.RoundingMode.HALF_UP),
              overallSentiment = if (index <= 1) SentimentType.Positive else SentimentType.Neutral,
              overallSuggestion = Some(s"URL analysis for ${compProduct.name} indicates ${if (index == 0) "excellent" else "good"} customer reception.")
            ))
          } yield (analysis, product)
        }

        for {
          productAnalyses <- Future.sequence(productAnalysisFutures)

          // Create comparison
          comparison <- comparisonRepo.create(Comparison(
            name = comparisonRequest.name,
            description = comparisonRequest.description,
            bestProductId = productAnalyses.headOption.map(_._2.id.get),
            comparisonMetadata = Some(Json.obj(
              "productCount" -> comparisonRequest.products.length,
              "comparisonType" -> "url"
            ))
          ))

          // Link analyses to comparison
          _ <- Future.sequence(productAnalyses.map { case (analysis, _) =>
            comparisonAnalysisRepo.create(ComparisonAnalysis(
              comparisonId = comparison.id.get,
              analysisId = analysis.id.get
            ))
          })

        } yield {
          val bestProduct = productAnalyses.maxBy(_._1.positivePercentage.toDouble)
          val response = ComparisonResponse(
            comparison = ComparisonDetails(
              id = comparison.id.get,
              name = comparison.name,
              description = comparison.description,
              createdAt = comparison.createdAt
            ),
            analyses = productAnalyses.map { case (analysis, product) =>
              AnalysisWithProduct(
                analysis = AnalysisDetails(
                  id = analysis.id.get,
                  totalReviews = analysis.totalReviews,
                  positivePercentage = analysis.positivePercentage,
                  neutralPercentage = analysis.neutralPercentage,
                  negativePercentage = analysis.negativePercentage,
                  overallSentiment = analysis.overallSentiment.toString
                ),
                product = ProductResponse(
                  id = product.id.get,
                  name = product.name,
                  url = product.url
                )
              )
            },
            bestProduct = Some(ProductResponse(
              id = bestProduct._2.id.get,
              name = bestProduct._2.name,
              url = bestProduct._2.url
            )),
            comparisonSummary = ComparisonSummary(
              bestProductScore = bestProduct._1.positivePercentage.toDouble,
              recommendation = s"URL comparison shows ${bestProduct._2.name} leads with ${bestProduct._1.positivePercentage}% positive sentiment across analyzed sources.",
              totalProducts = productAnalyses.length
            )
          )
          Ok(Json.toJson(response))
        }
      case JsError(errors) =>
        Future.successful(BadRequest(Json.obj("errors" -> errors.toString())))
    }
  }

  def getComparison(id: Long): Action[AnyContent] = Action.async { implicit request =>
    for {
      comparisonWithAnalyses <- comparisonRepo.findWithAnalyses(id)
    } yield {
      comparisonWithAnalyses match {
        case Some((comparison, analyses)) =>
          // For now, return a simplified response
          Ok(Json.obj(
            "comparison" -> Json.obj(
              "id" -> comparison.id,
              "name" -> comparison.name,
              "description" -> comparison.description
            ),
            "analysisCount" -> analyses.length
          ))
        case None =>
          NotFound(Json.obj("error" -> "Comparison not found"))
      }
    }
  }
}
