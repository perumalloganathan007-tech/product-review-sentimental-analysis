package services

import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.play.PlaySpec
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.Await

class NLPServiceSpec extends PlaySpec with Matchers {

  val nlpService = new NLPService()

  "NLPService" should {

    "analyze positive sentiment correctly" in {
      val text = "This product is amazing! I love it so much. Great quality and excellent service."
      val result = Await.result(nlpService.analyzeSentiment(text), 10.seconds)
      
      result.text shouldBe text
      result.sentiment shouldBe models.SentimentType.Positive
      result.score should be > 2.0
    }

    "analyze negative sentiment correctly" in {
      val text = "This product is terrible. Worst purchase ever. Complete waste of money."
      val result = Await.result(nlpService.analyzeSentiment(text), 10.seconds)
      
      result.text shouldBe text
      result.sentiment shouldBe models.SentimentType.Negative
      result.score should be < 2.0
    }

    "analyze neutral sentiment correctly" in {
      val text = "The product is okay. It works as expected but nothing special."
      val result = Await.result(nlpService.analyzeSentiment(text), 10.seconds)
      
      result.text shouldBe text
      result.sentiment shouldBe models.SentimentType.Neutral
    }

    "preprocess text correctly" in {
      val text = "This PRODUCT is AMAZING!!! http://example.com @user #hashtag"
      val result = Await.result(nlpService.preprocessText(text), 5.seconds)
      
      result.originalText shouldBe text
      result.cleanedText should not contain "http://"
      result.cleanedText should not contain "@user"
      result.cleanedText should not contain "#hashtag"
      result.isPreprocessed shouldBe false
    }

    "detect preprocessed text correctly" in {
      val preprocessedText = "this product is amazing"
      val unprocessedText = "This PRODUCT is AMAZING!!! http://example.com"
      
      nlpService.detectPreprocessing(preprocessedText) shouldBe true
      nlpService.detectPreprocessing(unprocessedText) shouldBe false
    }

    "batch analyze sentiments correctly" in {
      val texts = Seq(
        "Great product, highly recommend!",
        "Terrible quality, don't buy",
        "It's okay, nothing special"
      )
      
      val results = Await.result(nlpService.batchAnalyzeSentiment(texts), 15.seconds)
      
      results should have length 3
      results(0).sentiment shouldBe models.SentimentType.Positive
      results(1).sentiment shouldBe models.SentimentType.Negative
      results(2).sentiment shouldBe models.SentimentType.Neutral
    }

    "extract keywords correctly" in {
      val text = "This smartphone has excellent camera quality and long battery life. The display is crystal clear and the performance is outstanding."
      val keywords = Await.result(nlpService.extractKeywords(text, 5), 10.seconds)
      
      keywords should not be empty
      keywords.length should be <= 5
      // Should contain relevant keywords like "smartphone", "camera", "battery", etc.
    }

    "calculate sentiment distribution correctly" in {
      val sentiments = Seq(
        SentimentResult("positive", models.SentimentType.Positive, 3.0, 0.8),
        SentimentResult("positive", models.SentimentType.Positive, 3.5, 0.9),
        SentimentResult("negative", models.SentimentType.Negative, 1.0, 0.7),
        SentimentResult("neutral", models.SentimentType.Neutral, 2.0, 0.6)
      )
      
      val (positive, negative, neutral, percentages) = nlpService.calculateSentimentDistribution(sentiments)
      
      positive shouldBe 2
      negative shouldBe 1
      neutral shouldBe 1
      percentages("positive") shouldBe 50.0
      percentages("negative") shouldBe 25.0
      percentages("neutral") shouldBe 25.0
    }

    "generate appropriate recommendations" in {
      val highPositiveRec = nlpService.generateRecommendation(80.0, 10.0, 10.0)
      highPositiveRec should include("Highly Recommended")
      
      val highNegativeRec = nlpService.generateRecommendation(20.0, 60.0, 20.0)
      highNegativeRec should include("Not Recommended")
      
      val balancedRec = nlpService.generateRecommendation(40.0, 30.0, 30.0)
      balancedRec should include("Recommended")
    }
  }
}