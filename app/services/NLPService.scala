package services

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.collection.JavaConverters._
import edu.stanford.nlp.pipeline._
import edu.stanford.nlp.ling.CoreAnnotations._
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations._
import edu.stanford.nlp.neural.rnn.RNNCoreAnnotations
import edu.stanford.nlp.trees.Tree
import edu.stanford.nlp.util.CoreMap
import java.util.Properties
import models.SentimentType

case class SentimentResult(
  text: String,
  sentiment: SentimentType,
  score: Double,
  confidence: Double
)

case class TextProcessingResult(
  originalText: String,
  cleanedText: String,
  isPreprocessed: Boolean
)

@Singleton
class NLPService @Inject()()(implicit ec: ExecutionContext) {

  // Initialize Stanford CoreNLP pipeline
  private lazy val pipeline: StanfordCoreNLP = {
    val props = new Properties()
    props.setProperty("annotators", "tokenize,ssplit,pos,lemma,parse,sentiment")
    props.setProperty("parse.model", "edu/stanford/nlp/models/srparser/englishSR.ser.gz")
    props.setProperty("sentiment.model", "edu/stanford/nlp/models/sentiment/sentiment.ser.gz")
    new StanfordCoreNLP(props)
  }

  /**
   * Analyzes sentiment of a single text
   */
  def analyzeSentiment(text: String): Future[SentimentResult] = Future {
    val document = new Annotation(text)
    pipeline.annotate(document)

    val sentences = document.get(classOf[SentencesAnnotation]).asScala

    if (sentences.nonEmpty) {
      // For multiple sentences, calculate average sentiment
      val sentiments = sentences.map { sentence =>
        val tree = sentence.get(classOf[SentimentAnnotatedTree])
        val sentimentScore = RNNCoreAnnotations.getPredictedClass(tree)
        val confidence = getConfidence(tree)
        (sentimentScore, confidence)
      }

      val avgSentiment = sentiments.map(_._1).sum.toDouble / sentiments.length
      val avgConfidence = sentiments.map(_._2).sum / sentiments.length

      val sentimentType = avgSentiment match {
        case s if s <= 1.5 => SentimentType.Negative
        case s if s >= 2.5 => SentimentType.Positive
        case _ => SentimentType.Neutral
      }

      SentimentResult(text, sentimentType, avgSentiment, avgConfidence)
    } else {
      SentimentResult(text, SentimentType.Neutral, 2.0, 0.0)
    }
  }

  /**
   * Batch processes multiple texts for sentiment analysis
   */
  def batchAnalyzeSentiment(texts: Seq[String]): Future[Seq[SentimentResult]] = {
    Future.sequence(texts.map(analyzeSentiment))
  }

  /**
   * Preprocesses text by removing noise, normalizing, etc.
   */
  def preprocessText(text: String): Future[TextProcessingResult] = Future {
    val cleaned = cleanText(text)
    val isAlreadyProcessed = detectPreprocessing(text)

    TextProcessingResult(
      originalText = text,
      cleanedText = if (isAlreadyProcessed) text else cleaned,
      isPreprocessed = isAlreadyProcessed
    )
  }

  /**
   * Batch preprocesses multiple texts
   */
  def batchPreprocessText(texts: Seq[String]): Future[Seq[TextProcessingResult]] = {
    Future.sequence(texts.map(preprocessText))
  }

  /**
   * Detects if text is already preprocessed
   */
  def detectPreprocessing(text: String): Boolean = {
    val indicators = Seq(
      text.matches(".*[^a-zA-Z0-9\\s].*"), // Contains special characters
      text.exists(_.isUpper), // Contains uppercase letters
      text.split("\\s+").exists(_.length > 15), // Contains very long words
      text.contains("http"), // Contains URLs
      text.contains("@"), // Contains mentions/emails
      text.contains("#") // Contains hashtags
    )

    // If less than 2 indicators are present, likely preprocessed
    indicators.count(identity) < 2
  }

  /**
   * Cleans raw text for better sentiment analysis
   */
  private def cleanText(text: String): String = {
    text
      .toLowerCase() // Convert to lowercase
      .replaceAll("http\\S+", "") // Remove URLs
      .replaceAll("@\\w+", "") // Remove mentions
      .replaceAll("#\\w+", "") // Remove hashtags
      .replaceAll("[^a-zA-Z0-9\\s]", "") // Remove special characters
      .replaceAll("\\s+", " ") // Normalize whitespace
      .trim()
  }

  /**
   * Gets confidence score for sentiment prediction
   */
  private def getConfidence(tree: Tree): Double = {
    val predictions = RNNCoreAnnotations.getPredictions(tree)
    if (predictions != null && predictions.length > 0) {
      predictions.max
    } else {
      0.0
    }
  }

  /**
   * Extracts keywords from text using NLP
   */
  def extractKeywords(text: String, maxKeywords: Int = 10): Future[Seq[String]] = Future {
    val document = new Annotation(text)
    pipeline.annotate(document)

    val sentences = document.get(classOf[SentencesAnnotation]).asScala
    val keywords = sentences.flatMap { sentence =>
      val tokens = sentence.get(classOf[TokensAnnotation]).asScala
      tokens
        .filter { token =>
          val pos = token.get(classOf[PartOfSpeechAnnotation])
          val lemma = token.get(classOf[LemmaAnnotation])
          // Filter for meaningful words (nouns, adjectives, verbs)
          (pos.startsWith("NN") || pos.startsWith("JJ") || pos.startsWith("VB")) &&
            lemma.length > 2 &&
            !isStopWord(lemma.toLowerCase)
        }
        .map(_.get(classOf[LemmaAnnotation]).toLowerCase)
    }

    // Count frequency and return top keywords
    keywords
      .groupBy(identity)
      .mapValues(_.size)
      .toSeq
      .sortBy(-_._2)
      .take(maxKeywords)
      .map(_._1)
  }

  /**
   * Simple stopwords list
   */
  private def isStopWord(word: String): Boolean = {
    val stopWords = Set(
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
      "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they", "am", "is",
      "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
      "will", "would", "could", "should", "may", "might", "must", "can", "shall"
    )
    stopWords.contains(word)
  }

  /**
   * Calculates overall sentiment distribution
   */
  def calculateSentimentDistribution(sentiments: Seq[SentimentResult]): (Int, Int, Int, Map[String, Double]) = {
    val total = sentiments.length
    val positive = sentiments.count(_.sentiment == SentimentType.Positive)
    val negative = sentiments.count(_.sentiment == SentimentType.Negative)
    val neutral = sentiments.count(_.sentiment == SentimentType.Neutral)

    val percentages = Map(
      "positive" -> (positive.toDouble / total * 100),
      "negative" -> (negative.toDouble / total * 100),
      "neutral" -> (neutral.toDouble / total * 100)
    )

    (positive, negative, neutral, percentages)
  }

  /**
   * Determines overall product recommendation based on sentiment
   */
  def generateRecommendation(positivePercentage: Double, negativePercentage: Double, neutralPercentage: Double): String = {
    val recommendation = if (positivePercentage > 60) {
      "Highly Recommended - Strong positive sentiment indicates excellent customer satisfaction."
    } else if (positivePercentage > 40 && negativePercentage < 30) {
      "Recommended - Generally positive reviews with manageable concerns."
    } else if (negativePercentage > 50) {
      "Not Recommended - High negative sentiment indicates significant customer dissatisfaction."
    } else if (neutralPercentage > 50) {
      "Mixed Reviews - Consider reading individual reviews for detailed insights."
    } else {
      "Moderate Recommendation - Balanced sentiment requires careful consideration."
    }

    recommendation + s" (Positive: ${positivePercentage.formatted("%.1f")}%, Negative: ${negativePercentage.formatted("%.1f")}%, Neutral: ${neutralPercentage.formatted("%.1f")}%)"
  }
}
