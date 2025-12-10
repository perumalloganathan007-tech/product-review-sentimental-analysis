package services

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import models._
import models.Tables._
import com.itextpdf.text.{List => _, _}
import com.itextpdf.text.pdf._
import java.io.{ByteArrayOutputStream, StringWriter}
import java.text.SimpleDateFormat
import com.github.tototoshi.csv._

@Singleton
class ReportService @Inject()(
  dbConfigProvider: DatabaseConfigProvider,
  analysisService: AnalysisService
)(implicit ec: ExecutionContext) {

  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._
  import profile.api._

  /**
   * Generates PDF report for analysis
   */
  def generatePDFReport(analysisId: Long): Future[Option[Array[Byte]]] = {
    analysisService.getAnalysisById(analysisId).map {
      case Some(analysisDetails) =>
        val pdfBytes = createPDFReport(analysisDetails)
        Some(pdfBytes)
      case None => None
    }
  }

  /**
   * Generates CSV report for analysis
   */
  def generateCSVReport(analysisId: Long): Future[Option[String]] = {
    analysisService.getAnalysisById(analysisId).map {
      case Some(analysisDetails) =>
        val csvContent = createCSVReport(analysisDetails)
        Some(csvContent)
      case None => None
    }
  }

  /**
   * Creates PDF report using iText
   */
  private def createPDFReport(analysisDetails: AnalysisWithDetails): Array[Byte] = {
    val document = new Document(PageSize.A4)
    val outputStream = new ByteArrayOutputStream()
    val writer = PdfWriter.getInstance(document, outputStream)

    document.open()

    try {
      // Title
      val titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK)
      val title = new Paragraph("Product Review Sentiment Analysis Report", titleFont)
      title.setAlignment(Element.ALIGN_CENTER)
      title.setSpacingAfter(20f)
      document.add(title)

      // Product Information Section
      addSection(document, "Product Information", Seq(
        ("Product Name", analysisDetails.product.name),
        ("Analysis Date", formatTimestamp(analysisDetails.analysis.createdAt)),
        ("Input Type", analysisDetails.analysis.inputType match {
          case InputType.Dataset => "Dataset"
          case InputType.URL => "URL"
        }),
        ("Preprocessing Applied", if (analysisDetails.analysis.preprocessingStatus) "Yes" else "No"),
        ("Total Reviews Analyzed", analysisDetails.analysis.totalReviews.toString)
      ))

      // Sentiment Analysis Results Section
      addSection(document, "Sentiment Analysis Results", Seq(
        ("Positive Reviews", s"${analysisDetails.analysis.positiveCount} (${analysisDetails.analysis.positivePercentage}%)"),
        ("Neutral Reviews", s"${analysisDetails.analysis.neutralCount} (${analysisDetails.analysis.neutralPercentage}%)"),
        ("Negative Reviews", s"${analysisDetails.analysis.negativeCount} (${analysisDetails.analysis.negativePercentage}%)"),
        ("Overall Sentiment", analysisDetails.analysis.overallSentiment match {
          case SentimentType.Positive => "Positive"
          case SentimentType.Neutral => "Neutral"
          case SentimentType.Negative => "Negative"
        })
      ))

      // Recommendation Section
      if (analysisDetails.analysis.overallSuggestion.nonEmpty) {
        addSection(document, "Recommendation", Seq(
          ("System Recommendation", analysisDetails.analysis.overallSuggestion.get)
        ))
      }

      // Sample Reviews Section (first 10 reviews)
      if (analysisDetails.reviews.nonEmpty) {
        addSampleReviewsSection(document, analysisDetails.reviews.take(10))
      }

      // Summary Statistics
      addSummarySection(document, analysisDetails)

      // Footer
      addFooter(document)

    } finally {
      document.close()
    }

    outputStream.toByteArray
  }

  /**
   * Creates CSV report
   */
  private def createCSVReport(analysisDetails: AnalysisWithDetails): String = {
    val stringWriter = new StringWriter()
    val csvWriter = CSVWriter.open(stringWriter)

    try {
      // Header information
      csvWriter.writeRow(List("Sentiment Analysis Report"))
      csvWriter.writeRow(List(""))
      csvWriter.writeRow(List("Product Information"))
      csvWriter.writeRow(List("Product Name", analysisDetails.product.name))
      csvWriter.writeRow(List("Analysis Date", formatTimestamp(analysisDetails.analysis.createdAt)))
      csvWriter.writeRow(List("Input Type", analysisDetails.analysis.inputType match {
        case InputType.Dataset => "Dataset"
        case InputType.URL => "URL"
      }))
      csvWriter.writeRow(List("Preprocessing Applied", if (analysisDetails.analysis.preprocessingStatus) "Yes" else "No"))
      csvWriter.writeRow(List("Total Reviews", analysisDetails.analysis.totalReviews.toString))
      csvWriter.writeRow(List(""))

      // Sentiment Results
      csvWriter.writeRow(List("Sentiment Analysis Results"))
      csvWriter.writeRow(List("Sentiment", "Count", "Percentage"))
      csvWriter.writeRow(List("Positive", analysisDetails.analysis.positiveCount.toString, s"${analysisDetails.analysis.positivePercentage}%"))
      csvWriter.writeRow(List("Neutral", analysisDetails.analysis.neutralCount.toString, s"${analysisDetails.analysis.neutralPercentage}%"))
      csvWriter.writeRow(List("Negative", analysisDetails.analysis.negativeCount.toString, s"${analysisDetails.analysis.negativePercentage}%"))
      csvWriter.writeRow(List(""))

      // Overall Assessment
      csvWriter.writeRow(List("Overall Assessment"))
      csvWriter.writeRow(List("Overall Sentiment", analysisDetails.analysis.overallSentiment match {
        case SentimentType.Positive => "Positive"
        case SentimentType.Neutral => "Neutral"
        case SentimentType.Negative => "Negative"
      }))

      if (analysisDetails.analysis.overallSuggestion.nonEmpty) {
        csvWriter.writeRow(List("Recommendation", analysisDetails.analysis.overallSuggestion.get))
      }

      csvWriter.writeRow(List(""))

      // Individual Reviews
      if (analysisDetails.reviews.nonEmpty) {
        csvWriter.writeRow(List("Individual Reviews"))
        csvWriter.writeRow(List("Review Text", "Sentiment", "Sentiment Score"))

        analysisDetails.reviews.foreach { review =>
          val sentimentText = review.sentiment match {
            case SentimentType.Positive => "Positive"
            case SentimentType.Neutral => "Neutral"
            case SentimentType.Negative => "Negative"
          }

          csvWriter.writeRow(List(
            review.reviewText,
            sentimentText,
            review.sentimentScore.toString
          ))
        }
      }

    } finally {
      csvWriter.close()
    }

    stringWriter.toString
  }

  // Helper methods for PDF generation

  private def addSection(document: Document, title: String, content: Seq[(String, String)]): Unit = {
    val sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK)
    val contentFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BaseColor.BLACK)

    // Section title
    val sectionTitle = new Paragraph(title, sectionFont)
    sectionTitle.setSpacingBefore(15f)
    sectionTitle.setSpacingAfter(10f)
    document.add(sectionTitle)

    // Create table for content
    val table = new PdfPTable(2)
    table.setWidthPercentage(100)
    table.setWidths(Array(30f, 70f))

    content.foreach { case (label, value) =>
      val labelCell = new PdfPCell(new Phrase(label, contentFont))
      labelCell.setBorder(Rectangle.NO_BORDER)
      labelCell.setPadding(5f)
      labelCell.setBackgroundColor(BaseColor.LIGHT_GRAY)

      val valueCell = new PdfPCell(new Phrase(value, contentFont))
      valueCell.setBorder(Rectangle.NO_BORDER)
      valueCell.setPadding(5f)

      table.addCell(labelCell)
      table.addCell(valueCell)
    }

    document.add(table)
  }

  private def addSampleReviewsSection(document: Document, reviews: Seq[Review]): Unit = {
    val sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK)
    val contentFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK)

    val sectionTitle = new Paragraph("Sample Reviews", sectionFont)
    sectionTitle.setSpacingBefore(15f)
    sectionTitle.setSpacingAfter(10f)
    document.add(sectionTitle)

    val table = new PdfPTable(3)
    table.setWidthPercentage(100)
    table.setWidths(Array(60f, 20f, 20f))

    // Header row
    val headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE)
    val headers = Seq("Review Text", "Sentiment", "Score")
    headers.foreach { header =>
      val headerCell = new PdfPCell(new Phrase(header, headerFont))
      headerCell.setBackgroundColor(BaseColor.DARK_GRAY)
      headerCell.setPadding(5f)
      table.addCell(headerCell)
    }

    // Data rows
    reviews.foreach { review =>
      val reviewCell = new PdfPCell(new Phrase(truncateText(review.reviewText, 200), contentFont))
      reviewCell.setPadding(5f)

      val sentimentText = review.sentiment match {
        case SentimentType.Positive => "Positive"
        case SentimentType.Neutral => "Neutral"
        case SentimentType.Negative => "Negative"
      }
      val sentimentCell = new PdfPCell(new Phrase(sentimentText, contentFont))
      sentimentCell.setPadding(5f)

      val scoreCell = new PdfPCell(new Phrase(f"${review.sentimentScore}%.2f", contentFont))
      scoreCell.setPadding(5f)

      table.addCell(reviewCell)
      table.addCell(sentimentCell)
      table.addCell(scoreCell)
    }

    document.add(table)
  }

  private def addSummarySection(document: Document, analysisDetails: AnalysisWithDetails): Unit = {
    val analysis = analysisDetails.analysis
    val positiveDominant = analysis.positivePercentage > analysis.negativePercentage && analysis.positivePercentage > analysis.neutralPercentage
    val negativeDominant = analysis.negativePercentage > analysis.positivePercentage && analysis.negativePercentage > analysis.neutralPercentage

    val summaryText = if (positiveDominant) {
      s"This product shows strong positive sentiment with ${analysis.positivePercentage}% positive reviews. " +
      s"The analysis of ${analysis.totalReviews} reviews indicates high customer satisfaction."
    } else if (negativeDominant) {
      s"This product shows concerning negative sentiment with ${analysis.negativePercentage}% negative reviews. " +
      s"Consider investigating customer concerns from the ${analysis.totalReviews} reviews analyzed."
    } else {
      s"This product shows mixed sentiment across ${analysis.totalReviews} reviews. " +
      s"With ${analysis.neutralPercentage}% neutral sentiment, customer opinions are balanced."
    }

    addSection(document, "Analysis Summary", Seq(
      ("Key Insights", summaryText)
    ))
  }

  private def addFooter(document: Document): Unit = {
    val footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, BaseColor.GRAY)
    val footer = new Paragraph(s"Report generated on ${new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())} | Sentiment Analysis NLP System", footerFont)
    footer.setAlignment(Element.ALIGN_CENTER)
    footer.setSpacingBefore(20f)
    document.add(footer)
  }

  private def formatTimestamp(timestamp: Option[Timestamp]): String = {
    timestamp match {
      case Some(ts) => new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(ts)
      case None => "N/A"
    }
  }

  private def truncateText(text: String, maxLength: Int): String = {
    if (text.length <= maxLength) text
    else text.take(maxLength) + "..."
  }
}
