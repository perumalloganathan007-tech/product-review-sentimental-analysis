package services

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Try, Success, Failure}
import org.jsoup.Jsoup
import org.jsoup.nodes.{Document, Element}
import scala.jdk.CollectionConverters._
import sttp.client3._
import scala.concurrent.duration._
import java.net.URL

case class ScrapedReview(
  reviewText: String,
  rating: Option[Int] = None,
  reviewerName: Option[String] = None,
  reviewDate: Option[String] = None,
  verified: Option[Boolean] = None
)

case class ProductInfo(
  name: String,
  url: String,
  averageRating: Option[Double] = None,
  totalReviews: Option[Int] = None
)

@Singleton
class WebScrapingService @Inject()()(implicit ec: ExecutionContext) {

  private val backend = HttpURLConnectionBackend()
  private val userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

  /**
   * Scrapes reviews from product URLs
   */
  def scrapeProductReviews(productUrl: String): Future[(ProductInfo, Seq[ScrapedReview])] = {
    detectPlatform(productUrl) match {
      case Some("amazon") => scrapeAmazonReviews(productUrl)
      case Some("flipkart") => scrapeFlipkartReviews(productUrl)
      case Some("generic") => scrapeGenericReviews(productUrl)
      case _ => Future.failed(new IllegalArgumentException(s"Unsupported platform or invalid URL: $productUrl"))
    }
  }

  /**
   * Detects the e-commerce platform from URL
   */
  private def detectPlatform(url: String): Option[String] = {
    val lowerUrl = url.toLowerCase
    if (lowerUrl.contains("amazon.")) Some("amazon")
    else if (lowerUrl.contains("flipkart.")) Some("flipkart")
    else if (isValidUrl(url)) Some("generic")
    else None
  }

  /**
   * Validates if string is a valid URL
   */
  private def isValidUrl(url: String): Boolean = {
    Try(new URL(url)).isSuccess
  }

  /**
   * Scrapes Amazon product reviews
   */
  private def scrapeAmazonReviews(productUrl: String): Future[(ProductInfo, Seq[ScrapedReview])] = {
    fetchPageContent(productUrl).flatMap { document =>
      val productName = extractAmazonProductName(document)
      val (averageRating, totalReviews) = extractAmazonRatingInfo(document)

      val productInfo = ProductInfo(
        name = productName,
        url = productUrl,
        averageRating = averageRating,
        totalReviews = totalReviews
      )

      // Get reviews URL
      val reviewsUrl = buildAmazonReviewsUrl(productUrl)

      scrapeAmazonReviewsFromUrl(reviewsUrl).map { reviews =>
        (productInfo, reviews)
      }
    }
  }

  /**
   * Scrapes Flipkart product reviews with pagination support
   */
  private def scrapeFlipkartReviews(productUrl: String): Future[(ProductInfo, Seq[ScrapedReview])] = {
    fetchPageContent(productUrl).flatMap { document =>
      val productName = extractFlipkartProductName(document)
      val (averageRating, totalReviews) = extractFlipkartRatingInfo(document)

      val productInfo = ProductInfo(
        name = productName,
        url = productUrl,
        averageRating = averageRating,
        totalReviews = totalReviews
      )

      // Try to get reviews from current page first
      val currentPageReviews = extractFlipkartReviews(document)

      // If we found reviews, try to get more from pagination
      if (currentPageReviews.nonEmpty) {
        val maxPages = 3 // Limit to 3 pages to avoid long scraping times
        scrapeFlipkartReviewPages(productUrl, maxPages).map { paginatedReviews =>
          val allReviews = (currentPageReviews ++ paginatedReviews).distinct
          (productInfo, allReviews)
        }.recover {
          case ex: Exception =>
            println(s"Warning: Pagination failed, using current page reviews only: ${ex.getMessage}")
            (productInfo, currentPageReviews)
        }
      } else {
        // No reviews found on current page, return what we have
        Future.successful((productInfo, currentPageReviews))
      }
    }
  }

  /**
   * Scrapes multiple pages of Flipkart reviews
   */
  private def scrapeFlipkartReviewPages(baseUrl: String, maxPages: Int): Future[Seq[ScrapedReview]] = {
    val reviewsUrl = buildFlipkartReviewsUrl(baseUrl)

    val pageFutures = (1 to maxPages).map { pageNum =>
      val pageUrl = if (pageNum == 1) reviewsUrl else s"$reviewsUrl&page=$pageNum"

      fetchPageContent(pageUrl).map { document =>
        extractFlipkartReviews(document)
      }.recover {
        case ex: Exception =>
          println(s"Failed to scrape page $pageNum: ${ex.getMessage}")
          Seq.empty[ScrapedReview]
      }
    }

    Future.sequence(pageFutures).map(_.flatten)
  }

  /**
   * Builds Flipkart reviews URL from product URL
   */
  private def buildFlipkartReviewsUrl(productUrl: String): String = {
    // Flipkart product URLs contain product ID, extract and build review URL
    val productIdPattern = """/(p|product)/[^/]+/([^?]+)""".r
    productIdPattern.findFirstMatchIn(productUrl) match {
      case Some(matcher) =>
        val productId = matcher.group(2)
        s"https://www.flipkart.com/reviews/$productId"
      case None =>
        // If pattern doesn't match, append reviews section
        if (productUrl.contains("?")) {
          productUrl.split("\\?").head + "#reviews"
        } else {
          productUrl + "#reviews"
        }
    }
  }

  /**
   * Generic web scraping for other e-commerce sites
   */
  private def scrapeGenericReviews(productUrl: String): Future[(ProductInfo, Seq[ScrapedReview])] = {
    fetchPageContent(productUrl).map { document =>
      val productName = extractGenericProductName(document)
      val reviews = extractGenericReviews(document)

      val productInfo = ProductInfo(
        name = productName,
        url = productUrl
      )

      (productInfo, reviews)
    }
  }

  /**
   * Fetches page content using HTTP client
   */
  private def fetchPageContent(url: String): Future[Document] = Future {
    val request = basicRequest
      .get(uri"$url")
      .header("User-Agent", userAgent)
      .readTimeout(30.seconds)

    val response = request.send(backend)

    response.body match {
      case Right(html) => Jsoup.parse(html)
      case Left(error) => throw new RuntimeException(s"Failed to fetch content from $url: $error")
    }
  }

  // Amazon-specific extraction methods
  private def extractAmazonProductName(document: Document): String = {
    val selectors = Seq(
      "#productTitle",
      ".product-title",
      "h1.a-size-large",
      "[data-testid='product-title']"
    )

    selectors.flatMap(selector => Option(document.select(selector).first()))
      .headOption
      .map(_.text().trim)
      .getOrElse("Unknown Amazon Product")
  }

  private def extractAmazonRatingInfo(document: Document): (Option[Double], Option[Int]) = {
    val ratingText = Option(document.select(".a-icon-alt").first()).map(_.attr("alt"))
    val rating = ratingText.flatMap { text =>
      Try(text.split(" ").head.toDouble).toOption
    }

    val totalReviewsText = Option(document.select("[data-hook='total-review-count']").first()).map(_.text())
    val totalReviews = totalReviewsText.flatMap { text =>
      Try(text.replaceAll("[^0-9]", "").toInt).toOption
    }

    (rating, totalReviews)
  }

  private def buildAmazonReviewsUrl(productUrl: String): String = {
    // Extract ASIN from product URL and build reviews URL
    val asinPattern = """/dp/([A-Z0-9]{10})""".r
    asinPattern.findFirstMatchIn(productUrl) match {
      case Some(matcher) =>
        val asin = matcher.group(1)
        s"https://www.amazon.com/product-reviews/$asin"
      case None => productUrl + "#reviews"
    }
  }

  private def scrapeAmazonReviewsFromUrl(reviewsUrl: String): Future[Seq[ScrapedReview]] = {
    fetchPageContent(reviewsUrl).map { document =>
      val reviewElements = document.select("[data-hook='review']")

      reviewElements.asScala.map { reviewElement =>
        val reviewText = Option(reviewElement.select("[data-hook='review-body'] span").first())
          .map(_.text().trim)
          .getOrElse("")

        val ratingElement = reviewElement.select(".a-icon-alt").first()
        val rating = Option(ratingElement).flatMap { elem =>
          Try(elem.attr("alt").split(" ").head.toDouble.toInt).toOption
        }

        val reviewerName = Option(reviewElement.select(".a-profile-name").first())
          .map(_.text().trim)

        val reviewDate = Option(reviewElement.select("[data-hook='review-date']").first())
          .map(_.text().trim)

        val verified = reviewElement.select("[data-hook='avp-badge']").size() > 0

        ScrapedReview(
          reviewText = reviewText,
          rating = rating,
          reviewerName = reviewerName,
          reviewDate = reviewDate,
          verified = Some(verified)
        )
      }.filter(_.reviewText.nonEmpty).toSeq
    }
  }

  // Flipkart-specific extraction methods
  private def extractFlipkartProductName(document: Document): String = {
    val selectors = Seq(
      "span.B_NuCI",           // Main product title (updated selector)
      "h1.yhB1nd",             // Alternative product title
      "span._35KyD6",          // Older product title format
      "h1._6EBuvT",            // New Flipkart layout
      "span.VU-ZEz",           // Product name span
      "div._30jeq3",           // Product header div
      "span[class*='title']",  // Generic title class
      "h1",                     // Fallback h1
      ".title"                  // Generic title class
    )

    selectors.flatMap(selector => Option(document.select(selector).first()))
      .headOption
      .map(_.text().trim)
      .filter(_.nonEmpty)
      .getOrElse("Unknown Flipkart Product")
  }

  private def extractFlipkartRatingInfo(document: Document): (Option[Double], Option[Int]) = {
    // Enhanced rating selectors for different Flipkart layouts
    val ratingSelectors = Seq(
      "div.XQDdHH",           // New rating format 2024
      "div._3LWZlK",          // Common rating div
      "span.XQDdHH",          // Span variant
      "span._1lRcqv",         // Alternative rating
      "div.ipqd2A",           // New rating container
      "div[class*='star']",   // Star rating containers
      "span[class*='rating']", // Generic rating span
      "div[class*='rating']"  // Generic rating class
    )

    val rating = ratingSelectors
      .flatMap(selector => Option(document.select(selector).first()))
      .headOption
      .flatMap { elem =>
        val text = elem.text().trim
        // Extract number from text like "4.3★" or "4.3"
        Try(text.replaceAll("[^0-9.]", "").toDouble).toOption
      }

    // Enhanced total reviews extraction
    val reviewCountSelectors = Seq(
      "span.Wphh3N",                    // Latest review count
      "span._2_R_DZ span",              // Review count span
      "span._13vcmD",                   // Alternative review count
      "span[class*='review'] span",     // Generic review span
      "div._2d4LTz",                    // Review info div
      "span[class*='rating'] + span"    // Next to rating
    )

    val totalReviews = reviewCountSelectors
      .flatMap(selector => Option(document.select(selector).first()))
      .headOption
      .flatMap { elem =>
        val text = elem.text().trim
        // Extract number from texts like "1,234 reviews" or "1234 Ratings" or "1.2k ratings"
        val numText = text.replaceAll("[^0-9kK.]", "")
        if (numText.toLowerCase.contains("k")) {
          Try((numText.replaceAll("[kK]", "").toDouble * 1000).toInt).toOption
        } else {
          Try(numText.toInt).toOption
        }
      }

    (rating, totalReviews)
  }

  private def extractFlipkartReviews(document: Document): Seq[ScrapedReview] = {
    // Try multiple selector patterns for different Flipkart layouts
    val reviewContainerSelectors = Seq(
      "div._27M-vq",           // Classic review container
      "div.col._2wzgFH",       // New layout review container
      "div[class*='review']",  // Generic review class
      "div.cPHDOP",            // Alternative container
      "div._1AtVbE"            // Review text container parent
    )

    val reviewElements = reviewContainerSelectors
      .flatMap(selector => document.select(selector).asScala)
      .distinct
      .take(50) // Limit to 50 reviews per page

    reviewElements.flatMap { reviewElement =>
      // Multiple selectors for review text
      val reviewTextSelectors = Seq(
        "div._1AtVbE div.t-ZTKy",     // Main review text
        "div._1AtVbE div",             // Alternative
        "div.qwjRop div",              // New layout
        "div[class*='text']",          // Generic text
        "p.z9E0IG"                     // Paragraph text
      )

      val reviewText = reviewTextSelectors
        .flatMap(selector => Option(reviewElement.select(selector).first()))
        .headOption
        .map(_.text().trim)
        .filter(_.length >= 10) // Filter very short reviews
        .getOrElse("")

      if (reviewText.isEmpty) {
        None
      } else {
        // Enhanced rating extraction
        val ratingSelectors = Seq(
          "div._3LWZlK",
          "div.XQDdHH",
          "div[class*='rating']",
          "span._1lRcqv"
        )

        val rating = ratingSelectors
          .flatMap(selector => Option(reviewElement.select(selector).first()))
          .headOption
          .flatMap { elem =>
            Try(elem.text().replaceAll("[^0-9]", "").take(1).toInt).toOption
          }

        // Enhanced reviewer name extraction
        val reviewerNameSelectors = Seq(
          "p._2sc7ZR._2V5EHH",   // Reviewer name paragraph
          "p._2sc7ZR",            // Alternative
          "div._2NsDsF",          // New layout
          "span[class*='name']",  // Generic name
          "p.qwjRop:first-child" // First paragraph
        )

        val reviewerName = reviewerNameSelectors
          .flatMap(selector => Option(reviewElement.select(selector).first()))
          .headOption
          .map(_.text().trim)
          .filter(_.nonEmpty)

        // Enhanced date extraction
        val reviewDateSelectors = Seq(
          "p._2sc7ZR._3e3OxA",     // Date paragraph
          "p._3pgARe",              // Alternative date
          "p.row._2Uq-ak",          // Date in row
          "span[class*='date']",    // Generic date
          "p[class*='time']"        // Time element
        )

        val reviewDate = reviewDateSelectors
          .flatMap(selector => Option(reviewElement.select(selector).first()))
          .headOption
          .map(_.text().trim)
          .map(cleanFlipkartDate)

        // Check for verified purchase badge
        val verified = reviewElement.select("div._1_BQL8").size() > 0 ||
                      reviewElement.select("span[class*='certified']").size() > 0

        Some(ScrapedReview(
          reviewText = reviewText,
          rating = rating,
          reviewerName = reviewerName,
          reviewDate = reviewDate,
          verified = Some(verified)
        ))
      }
    }.toSeq
  }

  /**
   * Cleans and normalizes Flipkart date format
   */
  private def cleanFlipkartDate(dateText: String): String = {
    // Flipkart dates can be like "Jan 15, 2024" or "15 days ago"
    dateText
      .replaceAll("Certified Buyer,?", "")
      .replaceAll("[,]+", ",")
      .trim
  }

  // Generic extraction methods
  private def extractGenericProductName(document: Document): String = {
    val selectors = Seq(
      "h1",
      ".product-title",
      ".product-name",
      "[class*='product']",
      "[class*='title']"
    )

    selectors.flatMap(selector => Option(document.select(selector).first()))
      .headOption
      .map(_.text().trim)
      .filter(_.nonEmpty)
      .getOrElse("Unknown Product")
  }

  private def extractGenericReviews(document: Document): Seq[ScrapedReview] = {
    val reviewSelectors = Seq(
      ".review",
      "[class*='review']",
      ".comment",
      "[class*='comment']",
      ".feedback",
      "[class*='feedback']"
    )

    val reviewElements = reviewSelectors.flatMap(selector =>
      document.select(selector).asScala
    ).distinct

    reviewElements.map { reviewElement =>
      val reviewText = reviewElement.text().trim

      ScrapedReview(
        reviewText = reviewText
      )
    }.filter(_.reviewText.length > 10).toSeq
  }

  /**
   * Batch scrapes multiple URLs
   */
  def batchScrapeReviews(urls: Seq[String]): Future[Seq[(ProductInfo, Seq[ScrapedReview])]] = {
    Future.sequence(urls.map(scrapeProductReviews))
  }

  /**
   * Converts scraped reviews to ReviewData format
   */
  def convertToReviewData(scrapedReviews: Seq[ScrapedReview], productName: String): Seq[ReviewData] = {
    scrapedReviews.map { scraped =>
      ReviewData(
        reviewText = scraped.reviewText,
        rating = scraped.rating,
        reviewerName = scraped.reviewerName,
        reviewDate = scraped.reviewDate,
        productName = Some(productName)
      )
    }
  }
}
