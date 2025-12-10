package repositories

import models._
import models.Tables._
import slick.jdbc.PostgresProfile.api._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ProductRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._

  def all(): Future[Seq[Product]] = db.run(products.result)

  def findById(id: Long): Future[Option[Product]] = {
    db.run(products.filter(_.id === id).result.headOption)
  }

  def findByName(name: String): Future[Option[Product]] = {
    db.run(products.filter(_.name === name).result.headOption)
  }

  def create(product: Product): Future[Product] = {
    val insertQuery = products returning products.map(_.id) into ((product, id) => product.copy(id = Some(id)))
    db.run(insertQuery += product)
  }

  def update(id: Long, product: Product): Future[Option[Product]] = {
    val updateQuery = products.filter(_.id === id).update(product.copy(id = Some(id)))
    db.run(updateQuery).map { rowsAffected =>
      if (rowsAffected > 0) Some(product.copy(id = Some(id))) else None
    }
  }

  def delete(id: Long): Future[Boolean] = {
    db.run(products.filter(_.id === id).delete).map(_ > 0)
  }

  def search(searchTerm: String): Future[Seq[Product]] = {
    db.run(products.filter(_.name.toLowerCase like s"%${searchTerm.toLowerCase}%").result)
  }

  def count(): Future[Long] = {
    db.run(products.length.result.map(_.toLong))
  }

  def list(): Future[Seq[Product]] = all()
}

@Singleton
class AnalysisRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._

  def all(): Future[Seq[Analysis]] = db.run(analyses.result)

  def findById(id: Long): Future[Option[Analysis]] = {
    db.run(analyses.filter(_.id === id).result.headOption)
  }

  def findByProductId(productId: Long): Future[Seq[Analysis]] = {
    db.run(analyses.filter(_.productId === productId).result)
  }

  def create(analysis: Analysis): Future[Analysis] = {
    val insertQuery = analyses returning analyses.map(_.id) into ((analysis, id) => analysis.copy(id = Some(id)))
    db.run(insertQuery += analysis)
  }

  def update(id: Long, analysis: Analysis): Future[Option[Analysis]] = {
    val updateQuery = analyses.filter(_.id === id).update(analysis.copy(id = Some(id)))
    db.run(updateQuery).map { rowsAffected =>
      if (rowsAffected > 0) Some(analysis.copy(id = Some(id))) else None
    }
  }

  def delete(id: Long): Future[Boolean] = {
    db.run(analyses.filter(_.id === id).delete).map(_ > 0)
  }

  def findWithProduct(id: Long): Future[Option[(Analysis, Product)]] = {
    val query = for {
      (analysis, product) <- analyses.filter(_.id === id) join products on (_.productId === _.id)
    } yield (analysis, product)
    db.run(query.result.headOption)
  }

  def findBySentiment(sentiment: SentimentType): Future[Seq[Analysis]] = {
    db.run(analyses.filter(_.overallSentiment === sentiment).result)
  }

  def count(): Future[Long] = {
    db.run(analyses.length.result.map(_.toLong))
  }
}

@Singleton
class ReviewRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._

  def all(): Future[Seq[Review]] = db.run(reviews.result)

  def findById(id: Long): Future[Option[Review]] = {
    db.run(reviews.filter(_.id === id).result.headOption)
  }

  def findByAnalysisId(analysisId: Long): Future[Seq[Review]] = {
    db.run(reviews.filter(_.analysisId === analysisId).result)
  }

  def create(review: Review): Future[Review] = {
    val insertQuery = reviews returning reviews.map(_.id) into ((review, id) => review.copy(id = Some(id)))
    db.run(insertQuery += review)
  }

  def createBatch(reviewsList: Seq[Review]): Future[Seq[Review]] = {
    val insertQuery = reviews returning reviews.map(_.id) into ((review, id) => review.copy(id = Some(id)))
    db.run(insertQuery ++= reviewsList)
  }

  def update(id: Long, review: Review): Future[Option[Review]] = {
    val updateQuery = reviews.filter(_.id === id).update(review.copy(id = Some(id)))
    db.run(updateQuery).map { rowsAffected =>
      if (rowsAffected > 0) Some(review.copy(id = Some(id))) else None
    }
  }

  def delete(id: Long): Future[Boolean] = {
    db.run(reviews.filter(_.id === id).delete).map(_ > 0)
  }

  def findBySentiment(sentiment: SentimentType): Future[Seq[Review]] = {
    db.run(reviews.filter(_.sentiment === sentiment).result)
  }

  def findByAnalysisIdAndSentiment(analysisId: Long, sentiment: SentimentType): Future[Seq[Review]] = {
    db.run(reviews.filter(r => r.analysisId === analysisId && r.sentiment === sentiment).result)
  }

  def countByAnalysisId(analysisId: Long): Future[Int] = {
    db.run(reviews.filter(_.analysisId === analysisId).length.result)
  }

  def countBySentimentAndAnalysisId(analysisId: Long, sentiment: SentimentType): Future[Int] = {
    db.run(reviews.filter(r => r.analysisId === analysisId && r.sentiment === sentiment).length.result)
  }

  // PostgreSQL full-text search
  def searchReviewText(searchTerm: String): Future[Seq[Review]] = {
    db.run(sql"""
      SELECT * FROM reviews
      WHERE to_tsvector('english', review_text) @@ plainto_tsquery('english', $searchTerm)
      ORDER BY ts_rank(to_tsvector('english', review_text), plainto_tsquery('english', $searchTerm)) DESC
    """.as[Review])
  }

  def count(): Future[Long] = {
    db.run(reviews.length.result.map(_.toLong))
  }
}

@Singleton
class ComparisonRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._

  def all(): Future[Seq[Comparison]] = db.run(comparisons.result)

  def findById(id: Long): Future[Option[Comparison]] = {
    db.run(comparisons.filter(_.id === id).result.headOption)
  }

  def create(comparison: Comparison): Future[Comparison] = {
    val insertQuery = comparisons returning comparisons.map(_.id) into ((comparison, id) => comparison.copy(id = Some(id)))
    db.run(insertQuery += comparison)
  }

  def update(id: Long, comparison: Comparison): Future[Option[Comparison]] = {
    val updateQuery = comparisons.filter(_.id === id).update(comparison.copy(id = Some(id)))
    db.run(updateQuery).map { rowsAffected =>
      if (rowsAffected > 0) Some(comparison.copy(id = Some(id))) else None
    }
  }

  def delete(id: Long): Future[Boolean] = {
    db.run(comparisons.filter(_.id === id).delete).map(_ > 0)
  }

  def findWithAnalyses(id: Long): Future[Option[(Comparison, Seq[Analysis])]] = {
    val query = for {
      comparison <- comparisons.filter(_.id === id)
      compAnalyses <- comparisonAnalyses.filter(_.comparisonId === id)
      analysis <- analyses.filter(_.id === compAnalyses.analysisId)
    } yield (comparison, analysis)

    db.run(query.result).map { results =>
      results.headOption.map { case (comp, _) =>
        val analysesSeq = results.map(_._2).distinct
        (comp, analysesSeq)
      }
    }
  }

  def count(): Future[Long] = {
    db.run(comparisons.length.result.map(_.toLong))
  }
}

@Singleton
class ComparisonAnalysisRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._

  def create(comparisonAnalysis: ComparisonAnalysis): Future[ComparisonAnalysis] = {
    val insertQuery = comparisonAnalyses returning comparisonAnalyses.map(_.id) into ((ca, id) => ca.copy(id = Some(id)))
    db.run(insertQuery += comparisonAnalysis)
  }

  def findByComparisonId(comparisonId: Long): Future[Seq[ComparisonAnalysis]] = {
    db.run(comparisonAnalyses.filter(_.comparisonId === comparisonId).result)
  }

  def delete(comparisonId: Long, analysisId: Long): Future[Boolean] = {
    db.run(comparisonAnalyses.filter(ca => ca.comparisonId === comparisonId && ca.analysisId === analysisId).delete).map(_ > 0)
  }
}
