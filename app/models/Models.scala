package models

import play.api.libs.json._
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import java.time.ZonedDateTime
import java.sql.Timestamp

// Enumerations
sealed trait InputType
object InputType {
  case object Dataset extends InputType
  case object URL extends InputType

  implicit val inputTypeReads: Reads[InputType] = Reads {
    case JsString("DATASET") => JsSuccess(Dataset)
    case JsString("URL") => JsSuccess(URL)
    case _ => JsError("Invalid input type")
  }

  implicit val inputTypeWrites: Writes[InputType] = Writes {
    case Dataset => JsString("DATASET")
    case URL => JsString("URL")
  }
}

sealed trait SentimentType
object SentimentType {
  case object Positive extends SentimentType
  case object Neutral extends SentimentType
  case object Negative extends SentimentType

  implicit val sentimentTypeReads: Reads[SentimentType] = Reads {
    case JsString("POSITIVE") => JsSuccess(Positive)
    case JsString("NEUTRAL") => JsSuccess(Neutral)
    case JsString("NEGATIVE") => JsSuccess(Negative)
    case _ => JsError("Invalid sentiment type")
  }

  implicit val sentimentTypeWrites: Writes[SentimentType] = Writes {
    case Positive => JsString("POSITIVE")
    case Neutral => JsString("NEUTRAL")
    case Negative => JsString("NEGATIVE")
  }
}

// Case Classes
case class Product(
  id: Option[Long] = None,
  name: String,
  url: Option[String] = None,
  price: Option[String] = None,
  originalPrice: Option[String] = None,
  discount: Option[String] = None,
  rating: Option[Double] = None,
  reviewCount: Option[Int] = None,
  metadata: Option[JsValue] = Some(Json.obj()),
  createdAt: Option[ZonedDateTime] = None,
  updatedAt: Option[ZonedDateTime] = None
)

case class Analysis(
  id: Option[Long] = None,
  productId: Long,
  inputType: InputType,
  preprocessingStatus: Boolean,
  sentimentCounts: Option[JsValue] = Some(Json.obj("positive" -> 0, "neutral" -> 0, "negative" -> 0)),
  percentages: Option[JsValue] = Some(Json.obj("positive" -> 0.0, "neutral" -> 0.0, "negative" -> 0.0)),
  positiveCount: Int = 0,
  neutralCount: Int = 0,
  negativeCount: Int = 0,
  totalReviews: Int = 0,
  positivePercentage: BigDecimal = BigDecimal(0),
  neutralPercentage: BigDecimal = BigDecimal(0),
  negativePercentage: BigDecimal = BigDecimal(0),
  overallSentiment: SentimentType,
  overallSuggestion: Option[String] = None,
  mlModelVersion: Option[String] = Some("stanford-corenlp-4.5.4"),
  confidenceScore: Option[BigDecimal] = None,
  processingTimeMs: Option[Int] = None,
  createdAt: Option[ZonedDateTime] = None,
  updatedAt: Option[ZonedDateTime] = None
)

case class Review(
  id: Option[Long] = None,
  analysisId: Long,
  reviewText: String,
  sentiment: SentimentType,
  sentimentScore: BigDecimal,
  confidenceScore: Option[BigDecimal] = None,
  wordCount: Option[Int] = None,
  language: Option[String] = Some("en"),
  sourceUrl: Option[String] = None,
  extractedKeywords: Option[JsValue] = Some(Json.arr()),
  createdAt: Option[ZonedDateTime] = None
)

case class Comparison(
  id: Option[Long] = None,
  name: String,
  description: Option[String] = None,
  bestProductId: Option[Long] = None,
  comparisonMetadata: Option[JsValue] = Some(Json.obj()),
  createdAt: Option[ZonedDateTime] = None,
  updatedAt: Option[ZonedDateTime] = None
)

case class ComparisonAnalysis(
  id: Option[Long] = None,
  comparisonId: Long,
  analysisId: Long,
  rankPosition: Option[Int] = None,
  createdAt: Option[ZonedDateTime] = None
)

// JSON Format Implicits
object Product {
  implicit val productFormat: Format[Product] = Json.format[Product]
}

object Analysis {
  implicit val analysisFormat: Format[Analysis] = Json.format[Analysis]
}

object Review {
  implicit val reviewFormat: Format[Review] = Json.format[Review]
}

object Comparison {
  implicit val comparisonFormat: Format[Comparison] = Json.format[Comparison]
}

object ComparisonAnalysis {
  implicit val comparisonAnalysisFormat: Format[ComparisonAnalysis] = Json.format[ComparisonAnalysis]
}

// History enumerations
sealed trait HistoryCategory
object HistoryCategory {
  case object Dataset extends HistoryCategory
  case object Compare extends HistoryCategory
  case object MultiCompare extends HistoryCategory
  case object DatasetProduct extends HistoryCategory

  implicit val historyCategoryReads: Reads[HistoryCategory] = Reads {
    case JsString("dataset") => JsSuccess(Dataset)
    case JsString("compare") => JsSuccess(Compare)
    case JsString("multi-compare") => JsSuccess(MultiCompare)
    case JsString("dataset-product") => JsSuccess(DatasetProduct)
    case _ => JsError("Invalid history category")
  }

  implicit val historyCategoryWrites: Writes[HistoryCategory] = Writes {
    case Dataset => JsString("dataset")
    case Compare => JsString("compare")
    case MultiCompare => JsString("multi-compare")
    case DatasetProduct => JsString("dataset-product")
  }
}

sealed trait HistoryStatus
object HistoryStatus {
  case object Completed extends HistoryStatus
  case object Failed extends HistoryStatus
  case object Processing extends HistoryStatus

  implicit val historyStatusReads: Reads[HistoryStatus] = Reads {
    case JsString("completed") => JsSuccess(Completed)
    case JsString("failed") => JsSuccess(Failed)
    case JsString("processing") => JsSuccess(Processing)
    case _ => JsError("Invalid history status")
  }

  implicit val historyStatusWrites: Writes[HistoryStatus] = Writes {
    case Completed => JsString("completed")
    case Failed => JsString("failed")
    case Processing => JsString("processing")
  }
}

case class AnalysisHistory(
  id: Option[Long] = None,
  category: HistoryCategory,
  title: String,
  analysisData: JsValue,
  summaryData: JsValue,
  itemsAnalyzed: Int = 0,
  processingTimeMs: Option[Int] = None,
  status: HistoryStatus = HistoryStatus.Completed,
  sessionId: Option[String] = None,
  userAgent: Option[String] = None,
  createdAt: Option[ZonedDateTime] = None,
  updatedAt: Option[ZonedDateTime] = None
)

object AnalysisHistory {
  implicit val analysisHistoryFormat: Format[AnalysisHistory] = Json.format[AnalysisHistory]
}
