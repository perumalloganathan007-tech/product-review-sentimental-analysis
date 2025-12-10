package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import scala.concurrent.{Future, ExecutionContext}
import repositories._

@Singleton
class TestController @Inject()(
  val controllerComponents: ControllerComponents,
  productRepository: ProductRepository,
  analysisRepository: AnalysisRepository,
  reviewRepository: ReviewRepository,
  comparisonRepository: ComparisonRepository
)(implicit ec: ExecutionContext) extends BaseController {

  implicit val statsFormat = Json.format[DatabaseStats]

  case class DatabaseStats(
    products: Long,
    analyses: Long,
    reviews: Long,
    comparisons: Long,
    totalRecords: Long
  )

  def testDatabaseConnection() = Action.async { implicit request =>
    productRepository.list().map { products =>
      Ok(Json.obj(
        "status" -> "success",
        "message" -> "Database connection successful",
        "database" -> "PostgreSQL",
        "products_count" -> products.length,
        "timestamp" -> java.time.ZonedDateTime.now().toString
      ))
    }.recover {
      case ex: Exception =>
        InternalServerError(Json.obj(
          "status" -> "error",
          "message" -> "Database connection failed",
          "error" -> ex.getMessage,
          "timestamp" -> java.time.ZonedDateTime.now().toString
        ))
    }
  }

  def getDatabaseStats() = Action.async { implicit request =>
    for {
      productCount <- productRepository.count()
      analysisCount <- analysisRepository.count()
      reviewCount <- reviewRepository.count()
      comparisonCount <- comparisonRepository.count()
    } yield {
      val stats = DatabaseStats(
        products = productCount,
        analyses = analysisCount,
        reviews = reviewCount,
        comparisons = comparisonCount,
        totalRecords = productCount + analysisCount + reviewCount + comparisonCount
      )

      Ok(Json.obj(
        "status" -> "success",
        "stats" -> Json.toJson(stats),
        "database_info" -> Json.obj(
          "type" -> "PostgreSQL",
          "database" -> "sentiment_analysis",
          "tables" -> Json.arr("products", "analyses", "reviews", "comparisons", "comparison_analyses")
        ),
        "timestamp" -> java.time.ZonedDateTime.now().toString
      ))
    }.recover {
      case ex: Exception =>
        InternalServerError(Json.obj(
          "status" -> "error",
          "message" -> "Failed to get database statistics",
          "error" -> ex.getMessage,
          "timestamp" -> java.time.ZonedDateTime.now().toString
        ))
    }
  }

  def testPage() = Action { implicit request =>
    Ok(views.html.test())
  }

  def index() = Action { implicit request =>
    Redirect(routes.TestController.testPage())
  }
}
