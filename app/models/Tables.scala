package models

import slick.jdbc.PostgresProfile.api._
import slick.lifted.{TableQuery, Tag}
import play.api.libs.json.JsValue
import java.time.ZonedDateTime
import java.sql.Timestamp
import models._

object Tables {
  // Custom column types for enums and JSON
  implicit val inputTypeMapper = MappedColumnType.base[InputType, String](
    { inputType =>
      inputType match {
        case InputType.Dataset => "DATASET"
        case InputType.URL => "URL"
      }
    },
    { str =>
      str match {
        case "DATASET" => InputType.Dataset
        case "URL" => InputType.URL
      }
    }
  )

  implicit val sentimentTypeMapper = MappedColumnType.base[SentimentType, String](
    { sentimentType =>
      sentimentType match {
        case SentimentType.Positive => "POSITIVE"
        case SentimentType.Neutral => "NEUTRAL"
        case SentimentType.Negative => "NEGATIVE"
      }
    },
    { str =>
      str match {
        case "POSITIVE" => SentimentType.Positive
        case "NEUTRAL" => SentimentType.Neutral
        case "NEGATIVE" => SentimentType.Negative
      }
    }
  )

  // JSON column type for PostgreSQL JSONB
  implicit val jsonMapper = MappedColumnType.base[JsValue, String](
    _.toString,
    play.api.libs.json.Json.parse
  )

  // ZonedDateTime column type
  implicit val zonedDateTimeMapper = MappedColumnType.base[ZonedDateTime, Timestamp](
    zdt => Timestamp.from(zdt.toInstant),
    ts => ZonedDateTime.ofInstant(ts.toInstant, java.time.ZoneId.systemDefault())
  )

  // History category mapper
  implicit val historyCategoryMapper = MappedColumnType.base[HistoryCategory, String](
    { category =>
      category match {
        case HistoryCategory.Dataset => "dataset"
        case HistoryCategory.Compare => "compare"
        case HistoryCategory.MultiCompare => "multi-compare"
        case HistoryCategory.DatasetProduct => "dataset-product"
      }
    },
    { str =>
      str match {
        case "dataset" => HistoryCategory.Dataset
        case "compare" => HistoryCategory.Compare
        case "multi-compare" => HistoryCategory.MultiCompare
        case "dataset-product" => HistoryCategory.DatasetProduct
      }
    }
  )

  // History status mapper
  implicit val historyStatusMapper = MappedColumnType.base[HistoryStatus, String](
    { status =>
      status match {
        case HistoryStatus.Completed => "completed"
        case HistoryStatus.Failed => "failed"
        case HistoryStatus.Processing => "processing"
      }
    },
    { str =>
      str match {
        case "completed" => HistoryStatus.Completed
        case "failed" => HistoryStatus.Failed
        case "processing" => HistoryStatus.Processing
      }
    }
  )

  // Table definitions
  class ProductsTable(tag: Tag) extends Table[Product](tag, "products") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def name = column[String]("name")
    def url = column[Option[String]]("url")
    def price = column[Option[String]]("price")
    def originalPrice = column[Option[String]]("original_price")
    def discount = column[Option[String]]("discount")
    def rating = column[Option[Double]]("rating")
    def reviewCount = column[Option[Int]]("review_count")
    def metadata = column[Option[JsValue]]("metadata")
    def createdAt = column[Option[ZonedDateTime]]("created_at")
    def updatedAt = column[Option[ZonedDateTime]]("updated_at")

    def * = (id.?, name, url, price, originalPrice, discount, rating, reviewCount, metadata, createdAt, updatedAt) <> ((Product.apply _).tupled, Product.unapply)
  }

  class AnalysesTable(tag: Tag) extends Table[Analysis](tag, "analyses") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def productId = column[Long]("product_id")
  def inputType = column[InputType]("input_type")
  def preprocessingStatus = column[Boolean]("preprocessing_status")
  def sentimentCounts = column[Option[JsValue]]("sentiment_counts")
  def percentages = column[Option[JsValue]]("percentages")
  def positiveCount = column[Int]("positive_count")
  def neutralCount = column[Int]("neutral_count")
  def negativeCount = column[Int]("negative_count")
  def totalReviews = column[Int]("total_reviews")
  def positivePercentage = column[BigDecimal]("positive_percentage")
  def neutralPercentage = column[BigDecimal]("neutral_percentage")
  def negativePercentage = column[BigDecimal]("negative_percentage")
  def overallSentiment = column[SentimentType]("overall_sentiment")
  def overallSuggestion = column[Option[String]]("overall_suggestion")
  def mlModelVersion = column[Option[String]]("ml_model_version")
  def confidenceScore = column[Option[BigDecimal]]("confidence_score")
  def processingTimeMs = column[Option[Int]]("processing_time_ms")
  def createdAt = column[Option[ZonedDateTime]]("created_at")
  def updatedAt = column[Option[ZonedDateTime]]("updated_at")

  def * = (id.?, productId, inputType, preprocessingStatus, sentimentCounts, percentages,
           positiveCount, neutralCount, negativeCount, totalReviews, positivePercentage,
           neutralPercentage, negativePercentage, overallSentiment, overallSuggestion,
           mlModelVersion, confidenceScore, processingTimeMs, createdAt, updatedAt) <>
           ((Analysis.apply _).tupled, Analysis.unapply)

  def product = foreignKey("fk_analyses_product", productId, TableQuery[ProductsTable])(_.id)
  }

  class ReviewsTable(tag: Tag) extends Table[Review](tag, "reviews") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def analysisId = column[Long]("analysis_id")
  def reviewText = column[String]("review_text")
  def sentiment = column[SentimentType]("sentiment")
  def sentimentScore = column[BigDecimal]("sentiment_score")
  def confidenceScore = column[Option[BigDecimal]]("confidence_score")
  def wordCount = column[Option[Int]]("word_count")
  def language = column[Option[String]]("language")
  def sourceUrl = column[Option[String]]("source_url")
  def extractedKeywords = column[Option[JsValue]]("extracted_keywords")
  def createdAt = column[Option[ZonedDateTime]]("created_at")

  def * = (id.?, analysisId, reviewText, sentiment, sentimentScore, confidenceScore,
           wordCount, language, sourceUrl, extractedKeywords, createdAt) <>
          ((Review.apply _).tupled, Review.unapply)

  def analysis = foreignKey("fk_reviews_analysis", analysisId, TableQuery[AnalysesTable])(_.id)
  }

  class ComparisonsTable(tag: Tag) extends Table[Comparison](tag, "comparisons") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def name = column[String]("name")
  def description = column[Option[String]]("description")
  def bestProductId = column[Option[Long]]("best_product_id")
  def comparisonMetadata = column[Option[JsValue]]("comparison_metadata")
  def createdAt = column[Option[ZonedDateTime]]("created_at")
  def updatedAt = column[Option[ZonedDateTime]]("updated_at")

  def * = (id.?, name, description, bestProductId, comparisonMetadata, createdAt, updatedAt) <>
          ((Comparison.apply _).tupled, Comparison.unapply)

  def bestProduct = foreignKey("fk_comparisons_best_product", bestProductId, TableQuery[ProductsTable])(_.id)
  }

  class ComparisonAnalysesTable(tag: Tag) extends Table[ComparisonAnalysis](tag, "comparison_analyses") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def comparisonId = column[Long]("comparison_id")
    def analysisId = column[Long]("analysis_id")
    def rankPosition = column[Option[Int]]("rank_position")
    def createdAt = column[Option[ZonedDateTime]]("created_at")

    def * = (id.?, comparisonId, analysisId, rankPosition, createdAt) <>
            ((ComparisonAnalysis.apply _).tupled, ComparisonAnalysis.unapply)

    def comparison = foreignKey("fk_comparison_analyses_comparison", comparisonId, TableQuery[ComparisonsTable])(_.id)
    def analysis = foreignKey("fk_comparison_analyses_analysis", analysisId, TableQuery[AnalysesTable])(_.id)
  }

  class AnalysisHistoryTable(tag: Tag) extends Table[AnalysisHistory](tag, "analysis_history") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def category = column[HistoryCategory]("category")
    def title = column[String]("title")
    def analysisData = column[JsValue]("analysis_data")
    def summaryData = column[JsValue]("summary_data")
    def itemsAnalyzed = column[Int]("items_analyzed")
    def processingTimeMs = column[Option[Int]]("processing_time_ms")
    def status = column[HistoryStatus]("status")
    def sessionId = column[Option[String]]("session_id")
    def userAgent = column[Option[String]]("user_agent")
    def createdAt = column[Option[ZonedDateTime]]("created_at")
    def updatedAt = column[Option[ZonedDateTime]]("updated_at")

    def * = (id.?, category, title, analysisData, summaryData, itemsAnalyzed,
             processingTimeMs, status, sessionId, userAgent, createdAt, updatedAt) <>
            ((AnalysisHistory.apply _).tupled, AnalysisHistory.unapply)
  }

  // Table queries
  val products = TableQuery[ProductsTable]
  val analyses = TableQuery[AnalysesTable]
  val reviews = TableQuery[ReviewsTable]
  val comparisons = TableQuery[ComparisonsTable]
  val comparisonAnalyses = TableQuery[ComparisonAnalysesTable]
  val analysisHistory = TableQuery[AnalysisHistoryTable]
}
