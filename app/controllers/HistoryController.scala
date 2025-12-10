package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import services.HistoryService
import models._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Success, Failure}

@Singleton
class HistoryController @Inject()(
    val controllerComponents: ControllerComponents,
    historyService: HistoryService
)(implicit ec: ExecutionContext) extends BaseController {

  /**
   * Get all history entries with optional filtering
   * GET /api/history?category=dataset&limit=50&offset=0
   */
  def getHistory(
      category: Option[String] = None,
      limit: Int = 100,
      offset: Int = 0,
      sessionId: Option[String] = None
  ) = Action.async { request =>
    val categoryEnum = category.flatMap { cat =>
      cat match {
        case "dataset" => Some(HistoryCategory.Dataset)
        case "compare" => Some(HistoryCategory.Compare)
        case "multi-compare" => Some(HistoryCategory.MultiCompare)
        case "dataset-product" => Some(HistoryCategory.DatasetProduct)
        case _ => None
      }
    }

    val sessionIdToUse = sessionId.orElse(request.session.get("sessionId"))

    historyService.getHistory(categoryEnum, sessionIdToUse, limit, offset).map { history =>
      Ok(Json.obj(
        "history" -> history,
        "total" -> history.length,
        "limit" -> limit,
        "offset" -> offset
      ))
    }.recover {
      case ex =>
        Logger.error("Error getting history", ex)
        InternalServerError(Json.obj("error" -> "Failed to retrieve history"))
    }
  }

  /**
   * Add a new history entry
   * POST /api/history
   */
  def addHistory = Action.async(parse.json) { request =>
    val sessionId = request.session.get("sessionId").getOrElse(java.util.UUID.randomUUID().toString)
    val userAgent = request.headers.get("User-Agent")

    request.body.validate[JsObject] match {
      case JsSuccess(data, _) =>
        val category = (data \ "category").asOpt[String].getOrElse("dataset")
        val title = (data \ "title").asOpt[String].getOrElse("Analysis")
        val analysisData = (data \ "analysisData").getOrElse(Json.obj())
        val summaryData = (data \ "summaryData").getOrElse(Json.obj())
        val itemsAnalyzed = (data \ "itemsAnalyzed").asOpt[Int].getOrElse(0)
        val processingTimeMs = (data \ "processingTimeMs").asOpt[Int]

        val categoryEnum = category match {
          case "dataset" => HistoryCategory.Dataset
          case "compare" => HistoryCategory.Compare
          case "multi-compare" => HistoryCategory.MultiCompare
          case "dataset-product" => HistoryCategory.DatasetProduct
          case _ => HistoryCategory.Dataset
        }

        historyService.addHistoryEntry(
          categoryEnum,
          title,
          analysisData,
          summaryData,
          itemsAnalyzed,
          processingTimeMs,
          Some(sessionId),
          userAgent
        ).map { history =>
          Ok(Json.toJson(history)).withSession("sessionId" -> sessionId)
        }.recover {
          case ex =>
            Logger.error("Error adding history entry", ex)
            InternalServerError(Json.obj("error" -> "Failed to add history entry"))
        }

      case JsError(errors) =>
        Future.successful(BadRequest(Json.obj("error" -> "Invalid JSON data", "details" -> JsError.toJson(errors))))
    }
  }

  /**
   * Get history entry by ID
   * GET /api/history/:id
   */
  def getHistoryById(id: Long) = Action.async { request =>
    historyService.getHistoryById(id).map {
      case Some(history) => Ok(Json.toJson(history))
      case None => NotFound(Json.obj("error" -> "History entry not found"))
    }.recover {
      case ex =>
        Logger.error(s"Error getting history entry $id", ex)
        InternalServerError(Json.obj("error" -> "Failed to retrieve history entry"))
    }
  }

  /**
   * Update history entry status
   * PUT /api/history/:id/status
   */
  def updateHistoryStatus(id: Long) = Action.async(parse.json) { request =>
    (request.body \ "status").asOpt[String] match {
      case Some(statusStr) =>
        val status = statusStr match {
          case "completed" => HistoryStatus.Completed
          case "failed" => HistoryStatus.Failed
          case "processing" => HistoryStatus.Processing
          case _ => HistoryStatus.Completed
        }

        historyService.updateHistoryStatus(id, status).map { updated =>
          if (updated) {
            Ok(Json.obj("success" -> true, "message" -> "Status updated"))
          } else {
            NotFound(Json.obj("error" -> "History entry not found"))
          }
        }.recover {
          case ex =>
            Logger.error(s"Error updating history status for $id", ex)
            InternalServerError(Json.obj("error" -> "Failed to update status"))
        }

      case None =>
        Future.successful(BadRequest(Json.obj("error" -> "Status field is required")))
    }
  }

  /**
   * Delete history entry
   * DELETE /api/history/:id
   */
  def deleteHistory(id: Long) = Action.async { request =>
    historyService.deleteHistoryEntry(id).map { deleted =>
      if (deleted) {
        Ok(Json.obj("success" -> true, "message" -> "History entry deleted"))
      } else {
        NotFound(Json.obj("error" -> "History entry not found"))
      }
    }.recover {
      case ex =>
        Logger.error(s"Error deleting history entry $id", ex)
        InternalServerError(Json.obj("error" -> "Failed to delete history entry"))
    }
  }

  /**
   * Clear all history
   * DELETE /api/history
   */
  def clearHistory(sessionId: Option[String] = None) = Action.async { request =>
    val sessionIdToUse = sessionId.orElse(request.session.get("sessionId"))

    historyService.clearHistory(sessionIdToUse).map { deletedCount =>
      Ok(Json.obj(
        "success" -> true,
        "message" -> s"Deleted $deletedCount history entries"
      ))
    }.recover {
      case ex =>
        Logger.error("Error clearing history", ex)
        InternalServerError(Json.obj("error" -> "Failed to clear history"))
    }
  }

  /**
   * Search history
   * GET /api/history/search?q=searchTerm&category=dataset&limit=50
   */
  def searchHistory(
      q: String,
      category: Option[String] = None,
      limit: Int = 50
  ) = Action.async { request =>
    val categoryEnum = category.flatMap { cat =>
      cat match {
        case "dataset" => Some(HistoryCategory.Dataset)
        case "compare" => Some(HistoryCategory.Compare)
        case "multi-compare" => Some(HistoryCategory.MultiCompare)
        case "dataset-product" => Some(HistoryCategory.DatasetProduct)
        case _ => None
      }
    }

    historyService.searchHistory(q, categoryEnum, limit).map { results =>
      Ok(Json.obj(
        "results" -> results,
        "searchTerm" -> q,
        "total" -> results.length
      ))
    }.recover {
      case ex =>
        Logger.error("Error searching history", ex)
        InternalServerError(Json.obj("error" -> "Failed to search history"))
    }
  }

  /**
   * Get history statistics
   * GET /api/history/stats
   */
  def getHistoryStats(sessionId: Option[String] = None) = Action.async { request =>
    val sessionIdToUse = sessionId.orElse(request.session.get("sessionId"))

    historyService.getHistoryStats(sessionIdToUse).map { stats =>
      Ok(Json.toJson(stats))
    }.recover {
      case ex =>
        Logger.error("Error getting history stats", ex)
        InternalServerError(Json.obj("error" -> "Failed to get history statistics"))
    }
  }
}
