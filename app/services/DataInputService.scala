package services

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Try, Success, Failure}
import play.api.libs.json._
import java.io.{File, FileInputStream}
import com.github.tototoshi.csv._
import org.apache.poi.ss.usermodel._
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import scala.io.Source

case class ReviewData(
  reviewText: String,
  rating: Option[Int] = None,
  reviewerName: Option[String] = None,
  reviewDate: Option[String] = None,
  productName: Option[String] = None
)

@Singleton
class DataInputService @Inject()()(implicit ec: ExecutionContext) {

  /**
   * Reads CSV file and extracts review data
   */
  def readCSVFile(file: File): Future[Seq[ReviewData]] = Future {
    val reader = CSVReader.open(file)
    try {
      val rows = reader.all()
      if (rows.isEmpty) return Future.successful(Seq.empty)
      
      val headers = rows.head.map(_.toLowerCase.trim)
      val dataRows = rows.tail
      
      // Find relevant column indices
      val reviewTextIdx = findColumnIndex(headers, Seq("review", "text", "comment", "feedback", "content"))
      val ratingIdx = findColumnIndex(headers, Seq("rating", "score", "stars"))
      val reviewerIdx = findColumnIndex(headers, Seq("reviewer", "name", "user", "customer"))
      val dateIdx = findColumnIndex(headers, Seq("date", "timestamp", "time"))
      val productIdx = findColumnIndex(headers, Seq("product", "item", "title"))
      
      if (reviewTextIdx.isEmpty) {
        throw new IllegalArgumentException("No review text column found. Expected columns: review, text, comment, feedback, or content")
      }
      
      dataRows.map { row =>
        ReviewData(
          reviewText = row.lift(reviewTextIdx.get).getOrElse(""),
          rating = ratingIdx.flatMap(idx => row.lift(idx).flatMap(r => Try(r.toInt).toOption)),
          reviewerName = reviewerIdx.flatMap(idx => row.lift(idx)),
          reviewDate = dateIdx.flatMap(idx => row.lift(idx)),
          productName = productIdx.flatMap(idx => row.lift(idx))
        )
      }.filter(_.reviewText.nonEmpty)
      
    } finally {
      reader.close()
    }
  }

  /**
   * Reads Excel file and extracts review data
   */
  def readExcelFile(file: File): Future[Seq[ReviewData]] = Future {
    val workbook: Workbook = if (file.getName.endsWith(".xlsx")) {
      new XSSFWorkbook(new FileInputStream(file))
    } else {
      new HSSFWorkbook(new FileInputStream(file))
    }
    
    try {
      val sheet = workbook.getSheetAt(0)
      val headerRow = sheet.getRow(0)
      
      if (headerRow == null) return Future.successful(Seq.empty)
      
      // Extract headers
      val headers = (0 until headerRow.getLastCellNum).map { colIdx =>
        Option(headerRow.getCell(colIdx))
          .map(_.getStringCellValue.toLowerCase.trim)
          .getOrElse("")
      }
      
      // Find relevant column indices
      val reviewTextIdx = findColumnIndex(headers, Seq("review", "text", "comment", "feedback", "content"))
      val ratingIdx = findColumnIndex(headers, Seq("rating", "score", "stars"))
      val reviewerIdx = findColumnIndex(headers, Seq("reviewer", "name", "user", "customer"))
      val dateIdx = findColumnIndex(headers, Seq("date", "timestamp", "time"))
      val productIdx = findColumnIndex(headers, Seq("product", "item", "title"))
      
      if (reviewTextIdx.isEmpty) {
        throw new IllegalArgumentException("No review text column found. Expected columns: review, text, comment, feedback, or content")
      }
      
      // Process data rows
      val reviews = for {
        rowIdx <- 1 to sheet.getLastRowNum
        row = sheet.getRow(rowIdx)
        if row != null
      } yield {
        def getCellValue(colIdx: Option[Int]): Option[String] = {
          colIdx.flatMap { idx =>
            Option(row.getCell(idx)).map { cell =>
              cell.getCellType match {
                case CellType.STRING => cell.getStringCellValue
                case CellType.NUMERIC => cell.getNumericCellValue.toString
                case CellType.BOOLEAN => cell.getBooleanCellValue.toString
                case _ => ""
              }
            }
          }
        }
        
        val reviewText = getCellValue(reviewTextIdx).getOrElse("")
        if (reviewText.nonEmpty) {
          Some(ReviewData(
            reviewText = reviewText,
            rating = getCellValue(ratingIdx).flatMap(r => Try(r.toDouble.toInt).toOption),
            reviewerName = getCellValue(reviewerIdx),
            reviewDate = getCellValue(dateIdx),
            productName = getCellValue(productIdx)
          ))
        } else {
          None
        }
      }
      
      reviews.flatten.toSeq
      
    } finally {
      workbook.close()
    }
  }

  /**
   * Reads JSON file and extracts review data
   */
  def readJSONFile(file: File): Future[Seq[ReviewData]] = Future {
    val jsonContent = Source.fromFile(file).mkString
    val json = Json.parse(jsonContent)
    
    json match {
      case JsArray(reviews) =>
        reviews.map(parseJsonReview).flatten.toSeq
      case obj: JsObject =>
        // Handle single review object or nested structure
        parseJsonReview(obj).toSeq
      case _ =>
        throw new IllegalArgumentException("Invalid JSON format. Expected array of review objects or single review object.")
    }
  }

  /**
   * Parses a single JSON review object
   */
  private def parseJsonReview(json: JsValue): Option[ReviewData] = {
    val reviewTextFields = Seq("review", "text", "comment", "feedback", "content", "reviewText")
    val ratingFields = Seq("rating", "score", "stars")
    val reviewerFields = Seq("reviewer", "name", "user", "customer", "reviewerName")
    val dateFields = Seq("date", "timestamp", "time", "reviewDate")
    val productFields = Seq("product", "item", "title", "productName")
    
    def findField(fields: Seq[String]): Option[String] = {
      fields.flatMap(field => (json \ field).asOpt[String]).headOption
    }
    
    def findRating(fields: Seq[String]): Option[Int] = {
      fields.flatMap(field => (json \ field).asOpt[Int]).headOption
    }
    
    val reviewText = findField(reviewTextFields)
    
    reviewText.map { text =>
      ReviewData(
        reviewText = text,
        rating = findRating(ratingFields),
        reviewerName = findField(reviewerFields),
        reviewDate = findField(dateFields),
        productName = findField(productFields)
      )
    }
  }

  /**
   * Finds column index by matching column names
   */
  private def findColumnIndex(headers: Seq[String], possibleNames: Seq[String]): Option[Int] = {
    possibleNames.flatMap { name =>
      headers.zipWithIndex.find(_._1.contains(name)).map(_._2)
    }.headOption
  }

  /**
   * Validates dataset format and structure
   */
  def validateDataset(file: File, expectedFormat: String): Future[Boolean] = Future {
    expectedFormat.toLowerCase match {
      case "csv" => file.getName.toLowerCase.endsWith(".csv")
      case "json" => file.getName.toLowerCase.endsWith(".json")
      case "excel" => 
        val fileName = file.getName.toLowerCase
        fileName.endsWith(".xlsx") || fileName.endsWith(".xls")
      case _ => false
    }
  }

  /**
   * Auto-detects dataset format based on file extension and content
   */
  def detectDatasetFormat(file: File): Future[String] = Future {
    val fileName = file.getName.toLowerCase
    
    if (fileName.endsWith(".csv")) "csv"
    else if (fileName.endsWith(".json")) "json"
    else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) "excel"
    else {
      // Try to detect by content
      val content = Source.fromFile(file).take(1000).mkString
      if (content.trim.startsWith("[") || content.trim.startsWith("{")) "json"
      else if (content.contains(",")) "csv"
      else "unknown"
    }
  }

  /**
   * Processes dataset file based on format
   */
  def processDatasetFile(file: File, format: String): Future[Seq[ReviewData]] = {
    format.toLowerCase match {
      case "csv" => readCSVFile(file)
      case "json" => readJSONFile(file)
      case "excel" => readExcelFile(file)
      case _ => Future.failed(new IllegalArgumentException(s"Unsupported format: $format"))
    }
  }

  /**
   * Validates review data quality
   */
  def validateReviewData(reviews: Seq[ReviewData]): (Seq[ReviewData], Seq[String]) = {
    val validReviews = reviews.filter { review =>
      review.reviewText.trim.nonEmpty && review.reviewText.length >= 10
    }
    
    val errors = Seq.newBuilder[String]
    
    if (reviews.isEmpty) {
      errors += "No reviews found in dataset"
    }
    
    if (validReviews.isEmpty) {
      errors += "No valid reviews found (reviews must be at least 10 characters long)"
    }
    
    val filteredCount = reviews.length - validReviews.length
    if (filteredCount > 0) {
      errors += s"Filtered out $filteredCount invalid reviews"
    }
    
    (validReviews, errors.result())
  }
}