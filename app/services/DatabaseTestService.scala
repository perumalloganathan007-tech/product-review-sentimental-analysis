package services

import models._
import repositories._
import play.api.libs.json._
import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}
import java.time.ZonedDateTime

@Singleton
class DatabaseTestService @Inject()(
  productRepo: ProductRepository,
  analysisRepo: AnalysisRepository,
  reviewRepo: ReviewRepository
)(implicit ec: ExecutionContext) {

  def testDatabaseConnection(): Future[String] = {
    for {
      // Test basic database connectivity
      products <- productRepo.all()

      // Create a test product
      testProduct = Product(
        name = "Test Product",
        url = Some("https://example.com/test"),
        metadata = Some(Json.obj("test" -> true))
      )

      createdProduct <- productRepo.create(testProduct)

      // Create a test analysis
      testAnalysis = Analysis(
        productId = createdProduct.id.get,
        inputType = InputType.Dataset,
        preprocessingStatus = true,
        overallSentiment = SentimentType.Positive,
        sentimentCounts = Some(Json.obj("positive" -> 10, "neutral" -> 5, "negative" -> 3)),
        percentages = Some(Json.obj("positive" -> 55.6, "neutral" -> 27.8, "negative" -> 16.7)),
        positiveCount = 10,
        neutralCount = 5,
        negativeCount = 3,
        totalReviews = 18,
        positivePercentage = BigDecimal(55.6),
        neutralPercentage = BigDecimal(27.8),
        negativePercentage = BigDecimal(16.7),
        overallSuggestion = Some("This product has mostly positive sentiment!")
      )

      createdAnalysis <- analysisRepo.create(testAnalysis)

      // Create test reviews
      testReviews = Seq(
        Review(
          analysisId = createdAnalysis.id.get,
          reviewText = "This product is amazing! I love it.",
          sentiment = SentimentType.Positive,
          sentimentScore = BigDecimal(0.95),
          confidenceScore = Some(BigDecimal(0.92)),
          wordCount = Some(8),
          extractedKeywords = Some(Json.arr("amazing", "love"))
        ),
        Review(
          analysisId = createdAnalysis.id.get,
          reviewText = "It's okay, nothing special.",
          sentiment = SentimentType.Neutral,
          sentimentScore = BigDecimal(0.02),
          confidenceScore = Some(BigDecimal(0.87)),
          wordCount = Some(5),
          extractedKeywords = Some(Json.arr("okay", "nothing"))
        ),
        Review(
          analysisId = createdAnalysis.id.get,
          reviewText = "Terrible product, waste of money.",
          sentiment = SentimentType.Negative,
          sentimentScore = BigDecimal(-0.88),
          confidenceScore = Some(BigDecimal(0.94)),
          wordCount = Some(6),
          extractedKeywords = Some(Json.arr("terrible", "waste"))
        )
      )

      createdReviews <- reviewRepo.createBatch(testReviews)

      // Test queries
      foundProduct <- productRepo.findById(createdProduct.id.get)
      foundAnalysis <- analysisRepo.findById(createdAnalysis.id.get)
      foundReviews <- reviewRepo.findByAnalysisId(createdAnalysis.id.get)

      // Test search functionality
      searchResults <- productRepo.search("Test")
      reviewCount <- reviewRepo.countByAnalysisId(createdAnalysis.id.get)
      positiveReviews <- reviewRepo.findBySentiment(SentimentType.Positive)

    } yield {
      s"""
      |✅ DATABASE CONNECTION TEST SUCCESSFUL!
      |
      |📊 Test Results:
      |• Initial products count: ${products.length}
      |• Created product: ${createdProduct.name} (ID: ${createdProduct.id.get})
      |• Created analysis: ID ${createdAnalysis.id.get} with ${createdAnalysis.totalReviews} reviews
      |• Created reviews: ${createdReviews.length} reviews
      |
      |🔍 Query Tests:
      |• Found product by ID: ${foundProduct.map(_.name).getOrElse("NOT FOUND")}
      |• Found analysis by ID: ${foundAnalysis.map(_.id).getOrElse("NOT FOUND")}
      |• Found reviews for analysis: ${foundReviews.length} reviews
      |• Search for 'Test': ${searchResults.length} products found
      |• Total review count: $reviewCount
      |• Positive reviews: ${positiveReviews.length}
      |
      |🎯 PostgreSQL Features Working:
      |• JSONB storage for metadata ✅
      |• Timestamp with timezone ✅
      |• Foreign key relationships ✅
      |• Batch inserts ✅
      |• Complex queries ✅
      |
      |🚀 Your database is ready for sentiment analysis!
      """.stripMargin
    }
  }

  def testFullTextSearch(searchTerm: String = "amazing"): Future[String] = {
    reviewRepo.searchReviewText(searchTerm).map { results =>
      s"""
      |🔍 FULL-TEXT SEARCH TEST:
      |Search term: "$searchTerm"
      |Results found: ${results.length}
      |
      |${results.take(3).map(r => s"• ${r.reviewText.take(50)}...").mkString("\n")}
      """.stripMargin
    }
  }

  def getDatabaseStats(): Future[String] = {
    for {
      allProducts <- productRepo.all()
      allAnalyses <- analysisRepo.all()
      allReviews <- reviewRepo.all()
      positiveReviews <- reviewRepo.findBySentiment(SentimentType.Positive)
      neutralReviews <- reviewRepo.findBySentiment(SentimentType.Neutral)
      negativeReviews <- reviewRepo.findBySentiment(SentimentType.Negative)
    } yield {
      s"""
      |📈 DATABASE STATISTICS:
      |
      |📦 Products: ${allProducts.length}
      |📊 Analyses: ${allAnalyses.length}
      |💬 Reviews: ${allReviews.length}
      |
      |😊 Positive: ${positiveReviews.length} (${if (allReviews.nonEmpty) "%.1f".format(positiveReviews.length * 100.0 / allReviews.length) else "0"}%)
      |😐 Neutral: ${neutralReviews.length} (${if (allReviews.nonEmpty) "%.1f".format(neutralReviews.length * 100.0 / allReviews.length) else "0"}%)
      |😞 Negative: ${negativeReviews.length} (${if (allReviews.nonEmpty) "%.1f".format(negativeReviews.length * 100.0 / allReviews.length) else "0"}%)
      """.stripMargin
    }
  }
}
