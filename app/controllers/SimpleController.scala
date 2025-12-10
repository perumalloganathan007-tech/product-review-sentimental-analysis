package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._

@Singleton
class SimpleController @Inject()(
  val controllerComponents: ControllerComponents
) extends BaseController {

  def health() = Action {
    Ok(Json.obj(
      "status" -> "ok",
      "timestamp" -> System.currentTimeMillis(),
      "service" -> "Sentiment Analysis API"
    ))
  }

  def info() = Action {
    Ok(Json.obj(
      "name" -> "Sentiment Analysis with Spark",
      "version" -> "1.0.0",
      "endpoints" -> Json.arr(
        "/api/health",
        "/api/info",
        "/api/spark/info",
        "/api/spark/test"
      )
    ))
  }
}
