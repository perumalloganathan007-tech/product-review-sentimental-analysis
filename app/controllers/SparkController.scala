package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import services.SparkService
import scala.util.{Try, Success, Failure}

@Singleton
class SparkController @Inject()(
  val controllerComponents: ControllerComponents,
  sparkService: SparkService
) extends BaseController {

  def getSparkInfo() = Action { implicit request =>
    Try {
      val spark = sparkService.spark
      val sc = spark.sparkContext

      Json.obj(
        "status" -> "running",
        "webUI" -> sparkService.getWebUIUrl,
        "appName" -> sc.appName,
        "applicationId" -> sc.applicationId,
        "sparkVersion" -> sc.version,
        "master" -> sc.master,
        "isRunning" -> sparkService.isRunning
      )
    } match {
      case Success(info) => Ok(info)
      case Failure(ex) =>
        InternalServerError(Json.obj(
          "status" -> "error",
          "message" -> ex.getMessage
        ))
    }
  }

  def redirectToWebUI() = Action { implicit request =>
    Redirect(sparkService.getWebUIUrl)
  }

  def testSpark() = Action { implicit request =>
    Try {
      val spark = sparkService.spark
      import spark.implicits._

      // Create a simple test DataFrame
      val data = Seq(
        ("Product A", 4.5, 100),
        ("Product B", 3.8, 85),
        ("Product C", 4.9, 150)
      )
      val df = data.toDF("product", "rating", "reviews")

      val count = df.count()
      val avgRating = df.agg(Map("rating" -> "avg")).first().getDouble(0)

      Ok(Json.obj(
        "status" -> "success",
        "message" -> "Spark is working!",
        "test" -> Json.obj(
          "rowCount" -> count,
          "avgRating" -> avgRating,
          "webUI" -> sparkService.getWebUIUrl
        )
      ))
    } match {
      case Success(result) => result
      case Failure(ex) =>
        InternalServerError(Json.obj(
          "status" -> "error",
          "message" -> ex.getMessage
        ))
    }
  }
}
