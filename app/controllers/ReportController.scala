package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import scala.concurrent.{ExecutionContext, Future}
import repositories._
import java.time.format.DateTimeFormatter

@Singleton
class ReportController @Inject()(
  val controllerComponents: ControllerComponents,
  analysisRepo: AnalysisRepository,
  productRepo: ProductRepository,
  reviewRepo: ReviewRepository
)(implicit ec: ExecutionContext) extends BaseController {

  def generatePDF(id: Long): Action[AnyContent] = Action.async { implicit request =>
    for {
      analysisWithProduct <- analysisRepo.findWithProduct(id)
      reviews <- reviewRepo.findByAnalysisId(id)
    } yield {
      analysisWithProduct match {
        case Some((analysis, product)) =>
          // For demo purposes, return a simple text response
          // In a real implementation, you would generate actual PDF bytes
          val reportContent = generateTextReport(analysis, product, reviews)
          Ok(reportContent).as("text/plain")
            .withHeaders(
              "Content-Disposition" -> s"attachment; filename=analysis_report_$id.txt"
            )
        case None =>
          NotFound(Json.obj("error" -> "Analysis not found"))
      }
    }
  }

  def generateCSV(id: Long): Action[AnyContent] = Action.async { implicit request =>
    for {
      analysisWithProduct <- analysisRepo.findWithProduct(id)
      reviews <- reviewRepo.findByAnalysisId(id)
    } yield {
      analysisWithProduct match {
        case Some((analysis, product)) =>
          val csvContent = generateCSVContent(analysis, product, reviews)
          Ok(csvContent).as("text/csv")
            .withHeaders(
              "Content-Disposition" -> s"attachment; filename=analysis_report_$id.csv"
            )
        case None =>
          NotFound(Json.obj("error" -> "Analysis not found"))
      }
    }
  }

  private def generateTextReport(analysis: Analysis, product: Product, reviews: Seq[Review]): String = {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
    val createdDate = analysis.createdAt.map(_.format(formatter)).getOrElse("Unknown")

    s"""
    |SENTIMENT ANALYSIS REPORT
    |========================
    |
    |Product: ${product.name}
    |URL: ${product.url.getOrElse("N/A")}
    |Analysis Date: $createdDate
    |Input Type: ${analysis.inputType}
    |
    |SUMMARY STATISTICS
    |-----------------
    |Total Reviews: ${analysis.totalReviews}
    |Positive Reviews: ${analysis.positiveCount} (${analysis.positivePercentage}%)
    |Neutral Reviews: ${analysis.neutralCount} (${analysis.neutralPercentage}%)
    |Negative Reviews: ${analysis.negativeCount} (${analysis.negativePercentage}%)
    |Overall Sentiment: ${analysis.overallSentiment}
    |
    |RECOMMENDATION
    |-------------
    |${analysis.overallSuggestion.getOrElse("No recommendation available")}
    |
    |SAMPLE REVIEWS
    |-------------
    |${reviews.take(10).map(r => s"[${r.sentiment}] ${r.reviewText}").mkString("\n")}
    |
    |Report generated on: ${java.time.ZonedDateTime.now().format(formatter)}
    """.stripMargin
  }

  private def generateCSVContent(analysis: Analysis, product: Product, reviews: Seq[Review]): String = {
    val header = "Review ID,Product Name,Review Text,Sentiment,Sentiment Score,Confidence Score,Created Date"
    val rows = reviews.map { review =>
      val createdDate = review.createdDate.map(_.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).getOrElse("")
      val escapedReviewText = review.reviewText.replace("\"", "\"\"")
      val escapedProductName = product.name.replace("\"", "\"\"")
      s"""${review.id.getOrElse("")},"$escapedProductName","$escapedReviewText",${review.sentiment},${review.sentimentScore},${review.confidenceScore.getOrElse("")},$createdDate"""
    }

    val summaryRows = Seq(
      "",
      "SUMMARY STATISTICS",
      s"Total Reviews,${analysis.totalReviews}",
      s"Positive Count,${analysis.positiveCount}",
      s"Neutral Count,${analysis.neutralCount}",
      s"Negative Count,${analysis.negativeCount}",
      s"Positive Percentage,${analysis.positivePercentage}%",
      s"Neutral Percentage,${analysis.neutralPercentage}%",
      s"Negative Percentage,${analysis.negativePercentage}%",
      s"Overall Sentiment,${analysis.overallSentiment}",
      s"Recommendation,\"${analysis.overallSuggestion.getOrElse("").replace("\"", "\"\"")}\""
    )

    (Seq(header) ++ rows ++ summaryRows).mkString("\n")
  }
}
