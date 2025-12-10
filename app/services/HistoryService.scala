package services

import akka.actor.ActorSystem
import akka.stream.Materializer
import javax.inject.{Inject, Singleton}
import models._
import models.Tables._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{JsValue, Json}
import slick.jdbc.JdbcProfile
import scala.concurrent.{ExecutionContext, Future}
import java.time.ZonedDateTime

@Singleton
class HistoryService @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider
)(implicit ec: ExecutionContext, system: ActorSystem, materializer: Materializer)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._

  /**
   * Add an analysis to history
   */
  def addHistoryEntry(
      category: HistoryCategory,
      title: String,
      analysisData: JsValue,
      summaryData: JsValue,
      itemsAnalyzed: Int = 0,
      processingTimeMs: Option[Int] = None,
      sessionId: Option[String] = None,
      userAgent: Option[String] = None
  ): Future[AnalysisHistory] = {
    val history = AnalysisHistory(
      category = category,
      title = title,
      analysisData = analysisData,
      summaryData = summaryData,
      itemsAnalyzed = itemsAnalyzed,
      processingTimeMs = processingTimeMs,
      status = HistoryStatus.Completed,
      sessionId = sessionId,
      userAgent = userAgent,
      createdAt = Some(ZonedDateTime.now()),
      updatedAt = Some(ZonedDateTime.now())
    )

    val insertQuery = (analysisHistory returning analysisHistory.map(_.id)
      into ((history, id) => history.copy(id = Some(id)))) += history

    db.run(insertQuery)
  }

  /**
   * Get all history entries with optional filtering
   */
  def getHistory(
      category: Option[HistoryCategory] = None,
      sessionId: Option[String] = None,
      limit: Int = 100,
      offset: Int = 0
  ): Future[Seq[AnalysisHistory]] = {
    var query = analysisHistory.sortBy(_.createdAt.desc)

    // Apply filters
    category.foreach { cat =>
      query = query.filter(_.category === cat)
    }
    sessionId.foreach { sid =>
      query = query.filter(_.sessionId === sid)
    }

    db.run(query.drop(offset).take(limit).result)
  }

  /**
   * Get history entry by ID
   */
  def getHistoryById(id: Long): Future[Option[AnalysisHistory]] = {
    db.run(analysisHistory.filter(_.id === id).result.headOption)
  }

  /**
   * Update history entry status
   */
  def updateHistoryStatus(id: Long, status: HistoryStatus): Future[Boolean] = {
    val updateQuery = analysisHistory
      .filter(_.id === id)
      .map(h => (h.status, h.updatedAt))
      .update((status, Some(ZonedDateTime.now())))

    db.run(updateQuery).map(_ > 0)
  }

  /**
   * Delete history entry
   */
  def deleteHistoryEntry(id: Long): Future[Boolean] = {
    db.run(analysisHistory.filter(_.id === id).delete).map(_ > 0)
  }

  /**
   * Clear all history for a session (or all if no session specified)
   */
  def clearHistory(sessionId: Option[String] = None): Future[Int] = {
    var query = analysisHistory

    sessionId.foreach { sid =>
      query = query.filter(_.sessionId === sid)
    }

    db.run(query.delete)
  }

  /**
   * Search history entries by title
   */
  def searchHistory(
      searchTerm: String,
      category: Option[HistoryCategory] = None,
      limit: Int = 50
  ): Future[Seq[AnalysisHistory]] = {
    var query = analysisHistory.filter(_.title.toLowerCase like s"%${searchTerm.toLowerCase}%")

    category.foreach { cat =>
      query = query.filter(_.category === cat)
    }

    db.run(query.sortBy(_.createdAt.desc).take(limit).result)
  }

  /**
   * Get history statistics
   */
  def getHistoryStats(sessionId: Option[String] = None): Future[Map[String, Int]] = {
    var query = analysisHistory

    sessionId.foreach { sid =>
      query = query.filter(_.sessionId === sid)
    }

    for {
      total <- db.run(query.length.result)
      byCategory <- db.run(query.groupBy(_.category).map { case (cat, group) =>
        (cat, group.length)
      }.result)
      byStatus <- db.run(query.groupBy(_.status).map { case (status, group) =>
        (status, group.length)
      }.result)
    } yield {
      val categoryStats = byCategory.map { case (cat, count) =>
        cat match {
          case HistoryCategory.Dataset => "dataset" -> count
          case HistoryCategory.Compare => "compare" -> count
          case HistoryCategory.MultiCompare => "multi-compare" -> count
          case HistoryCategory.DatasetProduct => "dataset-product" -> count
        }
      }.toMap

      val statusStats = byStatus.map { case (status, count) =>
        status match {
          case HistoryStatus.Completed => "completed" -> count
          case HistoryStatus.Failed => "failed" -> count
          case HistoryStatus.Processing => "processing" -> count
        }
      }.toMap

      Map("total" -> total) ++ categoryStats ++ statusStats
    }
  }
}
