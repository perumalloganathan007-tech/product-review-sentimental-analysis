package services

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import models._
import models.Tables._
import java.sql.Timestamp
import play.api.mvc.MultipartFormData
import controllers.{ComparisonProduct, ComparisonDataset}
import java.io.File

case class ComparisonResult(
  comparison: Comparison,
  analyses: Seq[AnalysisWithProduct],
  bestProduct: Option[Product],
  comparisonSummary: ComparisonSummary
)

case class ComparisonSummary(
  totalProducts: Int,
  bestProductId: Long,
  bestProductScore: Double,
  averagePositivePercentage: Double,
  averageNegativePercentage: Double,
  recommendation: String
)

@Singleton
class ComparisonService @Inject()(
  dbConfigProvider: DatabaseConfigProvider,
  analysisService: AnalysisService,
  dataInputService: DataInputService,
  webScrapingService: WebScrapingService,
  nlpService: NLPService
)(implicit ec: ExecutionContext) {
  
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._
  import profile.api._

  /**
   * Compares multiple datasets
   */
  def compareDatasets(
    name: String, 
    description: Option[String],
    datasetFiles: Seq[MultipartFormData.FilePart[play.api.libs.Files.TemporaryFile]],
    productNames: Seq[String],
    isPreprocessedFlags: Seq[Boolean],
    datasetTypes: Seq[String]
  ): Future[ComparisonResult] = {
    
    // Analyze each dataset
    val analysisFutures = datasetFiles.zipWithIndex.map { case (filePart, index) =>
      val productName = productNames.lift(index).getOrElse(s"Product ${index + 1}")
      val isPreprocessed = isPreprocessedFlags.lift(index).getOrElse(false)
      val datasetType = datasetTypes.lift(index).getOrElse("csv")
      
      // Create temporary file
      val tempFile = new File(filePart.filename.getOrElse(s"dataset_$index"))
      filePart.ref.copyTo(tempFile, replace = true)
      
      analysisService.analyzeDatasetFile(tempFile, productName, isPreprocessed, datasetType)
        .andThen { case _ => tempFile.delete() } // Clean up temp file
    }
    
    for {
      analyses <- Future.sequence(analysisFutures)
      comparisonResult <- createComparison(name, description, analyses)
    } yield comparisonResult
  }

  /**
   * Compares multiple products from URLs
   */
  def compareUrls(
    name: String, 
    description: Option[String],
    products: Seq[ComparisonProduct]
  ): Future[ComparisonResult] = {
    
    // Analyze each product's URLs
    val analysisFutures = products.map { product =>
      analysisService.analyzeUrls(product.urls, Some(Seq(product.name)))
        .map(_.headOption) // Take first analysis if multiple URLs
        .map(_.getOrElse(throw new RuntimeException(s"Failed to analyze ${product.name}")))
    }
    
    for {
      analyses <- Future.sequence(analysisFutures)
      comparisonResult <- createComparison(name, description, analyses)
    } yield comparisonResult
  }

  /**
   * Creates comparison record and calculates best product
   */
  private def createComparison(
    name: String, 
    description: Option[String],
    analyses: Seq[Analysis]
  ): Future[ComparisonResult] = {
    
    // Calculate best product based on sentiment scores
    val bestAnalysis = calculateBestProduct(analyses)
    val comparisonSummary = calculateComparisonSummary(analyses, bestAnalysis)
    
    for {
      // Create comparison record
      comparison <- createComparisonRecord(name, description, bestAnalysis.productId)
      
      // Link analyses to comparison
      _ <- linkAnalysesToComparison(comparison.id.get, analyses.map(_.id.get))
      
      // Get analyses with product details
      analysesWithProducts <- getAnalysesWithProducts(analyses.map(_.id.get))
      
      // Get best product details
      bestProduct <- getProductById(bestAnalysis.productId)
      
    } yield ComparisonResult(
      comparison = comparison,
      analyses = analysesWithProducts,
      bestProduct = bestProduct,
      comparisonSummary = comparisonSummary
    )
  }

  /**
   * Calculates which product is best based on sentiment analysis
   */
  private def calculateBestProduct(analyses: Seq[Analysis]): Analysis = {
    // Scoring algorithm:
    // Score = (positive% * 2) - (negative% * 1.5) + (total_reviews * 0.01)
    // Higher positive sentiment gets more weight, negative sentiment penalized more
    
    val scoredAnalyses = analyses.map { analysis =>
      val score = (analysis.positivePercentage.toDouble * 2.0) - 
                 (analysis.negativePercentage.toDouble * 1.5) + 
                 (analysis.totalReviews * 0.01)
      
      (analysis, score)
    }
    
    scoredAnalyses.maxBy(_._2)._1
  }

  /**
   * Calculates comparison summary statistics
   */
  private def calculateComparisonSummary(analyses: Seq[Analysis], bestAnalysis: Analysis): ComparisonSummary = {
    val totalProducts = analyses.length
    val avgPositive = analyses.map(_.positivePercentage.toDouble).sum / totalProducts
    val avgNegative = analyses.map(_.negativePercentage.toDouble).sum / totalProducts
    
    val bestScore = (bestAnalysis.positivePercentage.toDouble * 2.0) - 
                   (bestAnalysis.negativePercentage.toDouble * 1.5) + 
                   (bestAnalysis.totalReviews * 0.01)
    
    val recommendation = generateComparisonRecommendation(analyses, bestAnalysis)
    
    ComparisonSummary(
      totalProducts = totalProducts,
      bestProductId = bestAnalysis.productId,
      bestProductScore = bestScore,
      averagePositivePercentage = avgPositive,
      averageNegativePercentage = avgNegative,
      recommendation = recommendation
    )
  }

  /**
   * Generates recommendation based on comparison results
   */
  private def generateComparisonRecommendation(analyses: Seq[Analysis], bestAnalysis: Analysis): String = {
    val bestPositive = bestAnalysis.positivePercentage.toDouble
    val bestNegative = bestAnalysis.negativePercentage.toDouble
    
    val recommendation = if (bestPositive > 70) {
      s"Strongly recommend the best product with ${bestPositive.formatted("%.1f")}% positive reviews."
    } else if (bestPositive > 50 && bestNegative < 30) {
      s"Recommend the best product, though consider reading individual reviews for better insight."
    } else if (bestNegative > 40) {
      s"Caution recommended - even the best product has ${bestNegative.formatted("%.1f")}% negative reviews."
    } else {
      s"Mixed results across all products. Detailed review analysis recommended."
    }
    
    val comparison = if (analyses.length > 1) {
      val otherProducts = analyses.filterNot(_.id == bestAnalysis.id)
      val avgOtherPositive = otherProducts.map(_.positivePercentage.toDouble).sum / otherProducts.length
      val improvementMargin = bestPositive - avgOtherPositive
      
      if (improvementMargin > 15) {
        s" The recommended product significantly outperforms others by ${improvementMargin.formatted("%.1f")}%."
      } else if (improvementMargin > 5) {
        s" The recommended product moderately outperforms others by ${improvementMargin.formatted("%.1f")}%."
      } else {
        s" Products are quite similar in sentiment scores. Consider other factors like price and features."
      }
    } else ""
    
    recommendation + comparison
  }

  /**
   * Gets comparison by ID with full details
   */
  def getComparisonById(id: Long): Future[Option[ComparisonResult]] = {
    val query = for {
      comparison <- comparisons.filter(_.id === id)
      comparisonAnalysis <- comparisonAnalyses.filter(_.comparisonId === comparison.id)
      analysis <- analyses.filter(_.id === comparisonAnalysis.analysisId)
      product <- products.filter(_.id === analysis.productId)
    } yield (comparison, analysis, product)
    
    db.run(query.result).map { results =>
      if (results.nonEmpty) {
        val comparison = results.head._1
        val analysesWithProducts = results.map { case (_, analysis, product) =>
          AnalysisWithProduct(analysis, product)
        }.toSeq
        
        val analyses = analysesWithProducts.map(_.analysis)
        val bestAnalysis = calculateBestProduct(analyses)
        val comparisonSummary = calculateComparisonSummary(analyses, bestAnalysis)
        val bestProduct = analysesWithProducts.find(_.analysis.id == bestAnalysis.id).map(_.product)
        
        Some(ComparisonResult(
          comparison = comparison,
          analyses = analysesWithProducts,
          bestProduct = bestProduct,
          comparisonSummary = comparisonSummary
        ))
      } else {
        None
      }
    }
  }

  // Helper methods for database operations
  
  private def createComparisonRecord(name: String, description: Option[String], bestProductId: Long): Future[Comparison] = {
    val comparison = Comparison(
      name = name,
      description = description,
      bestProductId = Some(bestProductId),
      createdAt = Some(new Timestamp(System.currentTimeMillis()))
    )
    
    val insertQuery = (comparisons returning comparisons.map(_.id) into ((comparison, id) => comparison.copy(id = Some(id)))) += comparison
    db.run(insertQuery)
  }

  private def linkAnalysesToComparison(comparisonId: Long, analysisIds: Seq[Long]): Future[Seq[ComparisonAnalysis]] = {
    val comparisonAnalyses = analysisIds.map { analysisId =>
      ComparisonAnalysis(
        comparisonId = comparisonId,
        analysisId = analysisId,
        createdAt = Some(new Timestamp(System.currentTimeMillis()))
      )
    }
    
    db.run((Tables.comparisonAnalyses returning Tables.comparisonAnalyses.map(_.id) into ((ca, id) => ca.copy(id = Some(id)))) ++= comparisonAnalyses)
  }

  private def getAnalysesWithProducts(analysisIds: Seq[Long]): Future[Seq[AnalysisWithProduct]] = {
    val query = analyses
      .filter(_.id.inSet(analysisIds))
      .join(products).on(_.productId === _.id)
    
    db.run(query.result).map { results =>
      results.map { case (analysis, product) =>
        AnalysisWithProduct(analysis, product)
      }.toSeq
    }
  }

  private def getProductById(productId: Long): Future[Option[Product]] = {
    db.run(products.filter(_.id === productId).result.headOption)
  }
}

// JSON formatters
import play.api.libs.json._

object ComparisonResult {
  implicit val comparisonSummaryFormat: Format[ComparisonSummary] = Json.format[ComparisonSummary]
  implicit val comparisonResultFormat: Format[ComparisonResult] = Json.format[ComparisonResult]
}