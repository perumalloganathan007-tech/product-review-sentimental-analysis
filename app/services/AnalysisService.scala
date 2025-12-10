package services

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import models._
import models.Tables._
import java.io.File
import java.sql.Timestamp
import play.api.mvc.MultipartFormData

@Singleton
class AnalysisService @Inject()(
  dbConfigProvider: DatabaseConfigProvider,
  nlpService: NLPService,
  dataInputService: DataInputService,
  webScrapingService: WebScrapingService
)(implicit ec: ExecutionContext) {
  
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._
  import profile.api._

  /**
   * Analyzes dataset file and stores results
   */
  def analyzeDatasetFile(file: File, productName: String, isPreprocessed: Boolean, datasetType: String): Future[Analysis] = {
    for {
      // Validate and process dataset
      reviewsData <- dataInputService.processDatasetFile(file, datasetType)
      (validReviews, errors) = dataInputService.validateReviewData(reviewsData)
      
      // Create product
      product <- createProduct(productName, None)
      
      // Process reviews for sentiment analysis
      processedReviews <- if (isPreprocessed) {
        Future.successful(validReviews.map(_.reviewText))
      } else {
        nlpService.batchPreprocessText(validReviews.map(_.reviewText)).map(_.map(_.cleanedText))
      }
      
      // Analyze sentiments
      sentimentResults <- nlpService.batchAnalyzeSentiment(processedReviews)
      
      // Calculate statistics
      (positiveCount, negativeCount, neutralCount, percentages) = nlpService.calculateSentimentDistribution(sentimentResults)
      
      // Determine overall sentiment
      overallSentiment = if (percentages("positive") > percentages("negative") && percentages("positive") > percentages("neutral")) {
        SentimentType.Positive
      } else if (percentages("negative") > percentages("positive") && percentages("negative") > percentages("neutral")) {
        SentimentType.Negative
      } else {
        SentimentType.Neutral
      }
      
      // Generate recommendation
      recommendation = nlpService.generateRecommendation(
        percentages("positive"), 
        percentages("negative"), 
        percentages("neutral")
      )
      
      // Create analysis record
      analysis = Analysis(
        productId = product.id.get,
        inputType = InputType.Dataset,
        preprocessingStatus = isPreprocessed,
        positiveCount = positiveCount,
        negativeCount = negativeCount,
        neutralCount = neutralCount,
        totalReviews = sentimentResults.length,
        positivePercentage = BigDecimal(percentages("positive")).setScale(2, BigDecimal.RoundingMode.HALF_UP),
        neutralPercentage = BigDecimal(percentages("neutral")).setScale(2, BigDecimal.RoundingMode.HALF_UP),
        negativePercentage = BigDecimal(percentages("negative")).setScale(2, BigDecimal.RoundingMode.HALF_UP),
        overallSentiment = overallSentiment,
        overallSuggestion = Some(recommendation),
        createdAt = Some(new Timestamp(System.currentTimeMillis())),
        updatedAt = Some(new Timestamp(System.currentTimeMillis()))
      )
      
      // Save analysis
      savedAnalysis <- createAnalysis(analysis)
      
      // Save individual reviews
      _ <- saveReviews(savedAnalysis.id.get, validReviews.zip(sentimentResults))
      
    } yield savedAnalysis
  }

  /**
   * Analyzes URLs and stores results
   */
  def analyzeUrls(urls: Seq[String], productNames: Option[Seq[String]] = None): Future[Seq[Analysis]] = {
    val analysisFutures = urls.zipWithIndex.map { case (url, index) =>
      val productName = productNames.flatMap(_.lift(index)).getOrElse(s"Product from URL ${index + 1}")
      
      for {
        // Scrape reviews from URL
        (productInfo, scrapedReviews) <- webScrapingService.scrapeProductReviews(url)
        
        // Create product
        product <- createProduct(productInfo.name, Some(url))
        
        // Convert scraped reviews to ReviewData
        reviewsData = webScrapingService.convertToReviewData(scrapedReviews, productInfo.name)
        
        // Validate reviews
        (validReviews, errors) = dataInputService.validateReviewData(reviewsData)
        
        // Preprocess and analyze
        processedReviews <- nlpService.batchPreprocessText(validReviews.map(_.reviewText))
        sentimentResults <- nlpService.batchAnalyzeSentiment(processedReviews.map(_.cleanedText))
        
        // Calculate statistics
        (positiveCount, negativeCount, neutralCount, percentages) = nlpService.calculateSentimentDistribution(sentimentResults)
        
        // Determine overall sentiment
        overallSentiment = if (percentages("positive") > percentages("negative") && percentages("positive") > percentages("neutral")) {
          SentimentType.Positive
        } else if (percentages("negative") > percentages("positive") && percentages("negative") > percentages("neutral")) {
          SentimentType.Negative
        } else {
          SentimentType.Neutral
        }
        
        // Generate recommendation
        recommendation = nlpService.generateRecommendation(
          percentages("positive"), 
          percentages("negative"), 
          percentages("neutral")
        )
        
        // Create analysis record
        analysis = Analysis(
          productId = product.id.get,
          inputType = InputType.URL,
          preprocessingStatus = false, // URLs are typically not preprocessed
          positiveCount = positiveCount,
          negativeCount = negativeCount,
          neutralCount = neutralCount,
          totalReviews = sentimentResults.length,
          positivePercentage = BigDecimal(percentages("positive")).setScale(2, BigDecimal.RoundingMode.HALF_UP),
          neutralPercentage = BigDecimal(percentages("neutral")).setScale(2, BigDecimal.RoundingMode.HALF_UP),
          negativePercentage = BigDecimal(percentages("negative")).setScale(2, BigDecimal.RoundingMode.HALF_UP),
          overallSentiment = overallSentiment,
          overallSuggestion = Some(recommendation),
          createdAt = Some(new Timestamp(System.currentTimeMillis())),
          updatedAt = Some(new Timestamp(System.currentTimeMillis()))
        )
        
        // Save analysis
        savedAnalysis <- createAnalysis(analysis)
        
        // Save individual reviews
        _ <- saveReviews(savedAnalysis.id.get, validReviews.zip(sentimentResults))
        
      } yield savedAnalysis
    }
    
    Future.sequence(analysisFutures)
  }

  /**
   * Gets analysis by ID with associated data
   */
  def getAnalysisById(id: Long): Future[Option[AnalysisWithDetails]] = {
    val query = for {
      ((analysis, product), reviews) <- analyses
        .filter(_.id === id)
        .join(products).on(_.productId === _.id)
        .joinLeft(reviews).on(_._1.id === _.analysisId)
    } yield (analysis, product, reviews)
    
    db.run(query.result).map { results =>
      if (results.nonEmpty) {
        val (analysis, product, reviewsOpt) = results.head
        val allReviews = results.flatMap(_._3).toSeq
        
        Some(AnalysisWithDetails(
          analysis = analysis,
          product = product,
          reviews = allReviews,
          keywords = Seq.empty // TODO: Implement keyword extraction
        ))
      } else {
        None
      }
    }
  }

  /**
   * Gets all analyses with pagination
   */
  def getAllAnalyses(offset: Int = 0, limit: Int = 50): Future[Seq[AnalysisWithProduct]] = {
    val query = analyses
      .join(products).on(_.productId === _.id)
      .sortBy(_._1.createdAt.desc)
      .drop(offset)
      .take(limit)
    
    db.run(query.result).map { results =>
      results.map { case (analysis, product) =>
        AnalysisWithProduct(analysis, product)
      }.toSeq
    }
  }

  /**
   * Creates a new product
   */
  private def createProduct(name: String, url: Option[String]): Future[Product] = {
    val product = Product(
      name = name,
      url = url,
      createdAt = Some(new Timestamp(System.currentTimeMillis()))
    )
    
    val insertQuery = (products returning products.map(_.id) into ((product, id) => product.copy(id = Some(id)))) += product
    db.run(insertQuery)
  }

  /**
   * Creates a new analysis
   */
  private def createAnalysis(analysis: Analysis): Future[Analysis] = {
    val insertQuery = (analyses returning analyses.map(_.id) into ((analysis, id) => analysis.copy(id = Some(id)))) += analysis
    db.run(insertQuery)
  }

  /**
   * Saves individual reviews
   */
  private def saveReviews(analysisId: Long, reviewsWithSentiments: Seq[(ReviewData, SentimentResult)]): Future[Seq[Review]] = {
    val reviewsToInsert = reviewsWithSentiments.map { case (reviewData, sentimentResult) =>
      Review(
        analysisId = analysisId,
        reviewText = reviewData.reviewText,
        sentiment = sentimentResult.sentiment,
        sentimentScore = BigDecimal(sentimentResult.score).setScale(2, BigDecimal.RoundingMode.HALF_UP),
        createdAt = Some(new Timestamp(System.currentTimeMillis()))
      )
    }
    
    db.run((reviews returning reviews.map(_.id) into ((review, id) => review.copy(id = Some(id)))) ++= reviewsToInsert)
  }
}

// Helper case classes for complex responses
case class AnalysisWithDetails(
  analysis: Analysis,
  product: Product,
  reviews: Seq[Review],
  keywords: Seq[String]
)

case class AnalysisWithProduct(
  analysis: Analysis,
  product: Product
)

// JSON formatters
import play.api.libs.json._

object AnalysisWithDetails {
  implicit val analysisWithDetailsFormat: Format[AnalysisWithDetails] = Json.format[AnalysisWithDetails]
}

object AnalysisWithProduct {
  implicit val analysisWithProductFormat: Format[AnalysisWithProduct] = Json.format[AnalysisWithProduct]
}