package controllers

import play.api.mvc._
import play.api.libs.json._
import services.DatabaseTestService
import javax.inject._
import scala.concurrent.ExecutionContext

@Singleton
class DatabaseTestController @Inject()(
  val controllerComponents: ControllerComponents,
  databaseTestService: DatabaseTestService
)(implicit ec: ExecutionContext) extends BaseController {

  def testConnection() = Action.async { implicit request =>
    databaseTestService.testDatabaseConnection().map { result =>
      Ok(Json.obj(
        "status" -> "success",
        "message" -> result
      ))
    }.recover {
      case ex =>
        BadRequest(Json.obj(
          "status" -> "error",
          "message" -> s"Database connection failed: ${ex.getMessage}",
          "details" -> ex.toString
        ))
    }
  }

  def stats() = Action.async { implicit request =>
    databaseTestService.getDatabaseStats().map { stats =>
      Ok(Json.obj(
        "status" -> "success",
        "stats" -> stats
      ))
    }.recover {
      case ex =>
        BadRequest(Json.obj(
          "status" -> "error",
          "message" -> s"Failed to get stats: ${ex.getMessage}"
        ))
    }
  }

  def searchTest(q: String) = Action.async { implicit request =>
    databaseTestService.testFullTextSearch(q).map { result =>
      Ok(Json.obj(
        "status" -> "success",
        "searchResult" -> result
      ))
    }.recover {
      case ex =>
        BadRequest(Json.obj(
          "status" -> "error",
          "message" -> s"Search failed: ${ex.getMessage}"
        ))
    }
  }
}
