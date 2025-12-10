// ============================================
// PROTOTYPE: Dataset Analysis with Spark
// Standalone Scala/Spark Program
// ============================================

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._

object DatasetAnalysisPrototype {

  /**
   * Load dataset from CSV file
   */
  def loadDatasetFromCSV(spark: SparkSession, csvPath: String) = {
    spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv(csvPath)
  }

  /**
   * Create sample dataset for demonstration
   */
  def createSampleDataset(spark: SparkSession) = {
    import spark.implicits._

    val sampleData = Seq(
      ("iPhone 15 Pro", "Smartphones", 4.5, 1250, 129900, "Excellent camera and performance"),
      ("Samsung Galaxy S24", "Smartphones", 4.3, 890, 79999, "Great display and battery life"),
      ("Google Pixel 8", "Smartphones", 4.4, 650, 69999, "Best in class AI features"),
      ("OnePlus 12", "Smartphones", 4.2, 420, 59999, "Fast charging and smooth UI"),
      ("MacBook Pro M3", "Laptops", 4.8, 980, 199900, "Powerful performance for professionals"),
      ("Dell XPS 15", "Laptops", 4.4, 560, 159900, "Beautiful display and build quality"),
      ("HP Pavilion", "Laptops", 4.0, 340, 65900, "Good value for money"),
      ("Sony WH-1000XM5", "Audio", 4.7, 1100, 29990, "Best noise cancellation"),
      ("AirPods Pro", "Audio", 4.6, 2300, 24900, "Seamless Apple integration"),
      ("JBL Flip 6", "Audio", 4.3, 780, 11999, "Great sound for portable speaker")
    )

    sampleData.toDF(
      "product_name",
      "category",
      "rating",
      "reviews_count",
      "price",
      "review_summary"
    )
  }

  def main(args: Array[String]): Unit = {
    println("\n" + "="*70)
    println("🚀 Dataset Analysis Prototype")
    println("   Standalone Spark Application")
    println("="*70 + "\n")

    // Create Spark Session
    val spark = SparkSession.builder()
      .appName("Dataset Analysis Prototype")
      .master("local[*]")
      .config("spark.ui.port", "4040")
      .config("spark.driver.memory", "2g")
      .config("spark.executor.memory", "2g")
      .getOrCreate()

    import spark.implicits._

    println("✅ Spark Session Created")
    println(s"   Spark Version: ${spark.version}")
    println(s"   Web UI: http://localhost:4040")
    println()

    // Get dataset from user
    val productsDF = if (args.length > 0) {
      // Option 1: CSV file path provided as argument
      val csvPath = args(0)
      println(s"📂 Loading dataset from: $csvPath")
      loadDatasetFromCSV(spark, csvPath)
    } else {
      // Option 2: Interactive prompt for file path
      println("📂 Dataset Input Options:")
      println("   1. Enter CSV file path")
      println("   2. Use sample data (default)")
      print("\nYour choice (1 or 2): ")

      val choice = try {
        scala.io.StdIn.readLine().trim
      } catch {
        case _: Exception => "2"
      }

      if (choice == "1") {
        print("Enter CSV file path: ")
        val csvPath = scala.io.StdIn.readLine().trim
        if (csvPath.nonEmpty && new java.io.File(csvPath).exists()) {
          println(s"📂 Loading dataset from: $csvPath")
          loadDatasetFromCSV(spark, csvPath)
        } else {
          println("⚠️  File not found, using sample data instead")
          createSampleDataset(spark)
        }
      } else {
        println("📊 Using built-in sample dataset")
        createSampleDataset(spark)
      }
    }

    println("✅ Dataset Loaded Successfully")
    println(s"   Total Products: ${productsDF.count()}")
    println(s"   Columns: ${productsDF.columns.mkString(", ")}")
    println()

    // Show sample data
    println("📋 Sample Data:")
    productsDF.show(5, truncate = false)
    println()

    // ============================================
    // Analysis 1: Sentiment Classification
    // ============================================
    println("\n" + "="*70)
    println("📈 ANALYSIS 1: Sentiment Classification")
    println("="*70)

    val withSentiment = productsDF.withColumn("sentiment",
      when($"rating" >= 4.5, "POSITIVE")
      .when($"rating" >= 4.0, "GOOD")
      .when($"rating" >= 3.5, "NEUTRAL")
      .otherwise("NEGATIVE")
    )

    val sentimentDistribution = withSentiment
      .groupBy("sentiment")
      .agg(
        count("*").as("count"),
        round(avg("rating"), 2).as("avg_rating")
      )
      .orderBy(desc("count"))

    println("\nSentiment Distribution:")
    sentimentDistribution.show()

    // ============================================
    // Analysis 2: Category Analysis
    // ============================================
    println("\n" + "="*70)
    println("📊 ANALYSIS 2: Category Performance")
    println("="*70)

    val categoryAnalysis = productsDF
      .groupBy("category")
      .agg(
        count("*").as("product_count"),
        round(avg("rating"), 2).as("avg_rating"),
        sum("reviews_count").as("total_reviews"),
        round(avg("price"), 2).as("avg_price"),
        max("rating").as("max_rating")
      )
      .orderBy(desc("avg_rating"))

    println("\nCategory Performance:")
    categoryAnalysis.show()

    // ============================================
    // Analysis 3: Top Products
    // ============================================
    println("\n" + "="*70)
    println("🏆 ANALYSIS 3: Top Rated Products")
    println("="*70)

    val topProducts = productsDF
      .orderBy(desc("rating"), desc("reviews_count"))
      .limit(5)
      .select("product_name", "category", "rating", "reviews_count", "price")

    println("\nTop 5 Products:")
    topProducts.show(truncate = false)

    // ============================================
    // Analysis 4: Price vs Rating Correlation
    // ============================================
    println("\n" + "="*70)
    println("💰 ANALYSIS 4: Price vs Rating Analysis")
    println("="*70)

    val priceRanges = productsDF
      .withColumn("price_range",
        when($"price" < 30000, "Budget (< ₹30K)")
        .when($"price" < 100000, "Mid-Range (₹30K-1L)")
        .otherwise("Premium (> ₹1L)")
      )
      .groupBy("price_range")
      .agg(
        count("*").as("count"),
        round(avg("rating"), 2).as("avg_rating"),
        round(avg("price"), 0).as("avg_price")
      )
      .orderBy("avg_price")

    println("\nPrice Range Analysis:")
    priceRanges.show()

    // ============================================
    // Analysis 5: Review Volume Analysis
    // ============================================
    println("\n" + "="*70)
    println("📝 ANALYSIS 5: Review Volume Insights")
    println("="*70)

    val reviewVolume = productsDF
      .withColumn("review_category",
        when($"reviews_count" >= 1000, "High Volume (1000+)")
        .when($"reviews_count" >= 500, "Medium Volume (500-1000)")
        .otherwise("Low Volume (< 500)")
      )
      .groupBy("review_category")
      .agg(
        count("*").as("product_count"),
        round(avg("rating"), 2).as("avg_rating")
      )

    println("\nReview Volume vs Rating:")
    reviewVolume.show()

    // ============================================
    // Analysis 6: Statistical Summary
    // ============================================
    println("\n" + "="*70)
    println("📊 ANALYSIS 6: Statistical Summary")
    println("="*70)

    val overallStats = productsDF.agg(
      count("*").as("total_products"),
      round(avg("rating"), 2).as("avg_rating"),
      round(stddev("rating"), 2).as("rating_stddev"),
      min("rating").as("min_rating"),
      max("rating").as("max_rating"),
      sum("reviews_count").as("total_reviews"),
      round(avg("price"), 0).as("avg_price")
    )

    println("\nOverall Statistics:")
    overallStats.show()

    // ============================================
    // Analysis 7: Detailed Category Breakdown
    // ============================================
    println("\n" + "="*70)
    println("📂 ANALYSIS 7: Detailed Category Breakdown")
    println("="*70)

    productsDF.groupBy("category").agg(
      countDistinct("product_name").as("unique_products"),
      round(avg("rating"), 2).as("avg_rating"),
      max("rating").as("best_rating"),
      min("rating").as("worst_rating"),
      sum("reviews_count").as("total_reviews")
    ).orderBy(desc("avg_rating")).show()

    // ============================================
    // Analysis 8: Best Products by Category
    // ============================================
    println("\n" + "="*70)
    println("🥇 ANALYSIS 8: Best Product in Each Category")
    println("="*70)

    import org.apache.spark.sql.expressions.Window

    val windowSpec = Window.partitionBy("category").orderBy(desc("rating"), desc("reviews_count"))

    val bestByCategory = productsDF
      .withColumn("rank", row_number().over(windowSpec))
      .filter($"rank" === 1)
      .select("category", "product_name", "rating", "reviews_count", "price")
      .orderBy("category")

    println("\nBest Product per Category:")
    bestByCategory.show(truncate = false)

    // ============================================
    // Analysis 9: Value Score Calculation
    // ============================================
    println("\n" + "="*70)
    println("💎 ANALYSIS 9: Value Score Analysis")
    println("="*70)

    val withValueScore = productsDF
      .withColumn("value_score",
        round(($"rating" * 10 + log10($"reviews_count" + 1) * 5) - log10($"price" + 1) * 2, 2)
      )
      .orderBy(desc("value_score"))
      .select("product_name", "category", "rating", "price", "value_score")

    println("\nTop Products by Value Score:")
    withValueScore.show(10, truncate = false)

    // ============================================
    // Save Results (Optional)
    // ============================================
    println("\n" + "="*70)
    println("💾 Saving Results")
    println("="*70)

    // Save to CSV (commented out - uncomment to save)
    // categoryAnalysis.coalesce(1).write.mode("overwrite").option("header", "true").csv("output/category_analysis")
    // topProducts.coalesce(1).write.mode("overwrite").option("header", "true").csv("output/top_products")

    println("✅ Analysis Complete!")
    println("   Note: Uncomment save statements to persist results")
    println()

    // ============================================
    // Summary Report
    // ============================================
    println("\n" + "="*70)
    println("📋 SUMMARY REPORT")
    println("="*70)

    val summary = productsDF.agg(
      count("*").as("total"),
      countDistinct("category").as("categories"),
      round(avg("rating"), 2).as("avg_rating"),
      sum("reviews_count").as("total_reviews")
    ).first()

    println(s"\n✨ Dataset Overview:")
    println(s"   Total Products: ${summary.getLong(0)}")
    println(s"   Categories: ${summary.getLong(1)}")
    println(s"   Average Rating: ${summary.getDouble(2)}")
    println(s"   Total Reviews: ${summary.getLong(3)}")

    println("\n📊 View Results in Spark UI:")
    println("   http://localhost:4040/jobs/")
    println()

    println("="*70)
    println("✅ Prototype Execution Complete!")
    println("="*70 + "\n")

    // Keep Spark UI open for inspection
    println("Press Enter to stop Spark session...")
    scala.io.StdIn.readLine()

    spark.stop()
  }
}

// ============================================
// Additional Helper Functions
// ============================================

object DatasetAnalysisHelpers {

  /**
   * Load CSV data from file
   */
  def loadCSV(spark: SparkSession, path: String) = {
    spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv(path)
  }

  /**
   * Calculate sentiment score based on rating
   */
  def calculateSentiment(rating: Double): String = {
    if (rating >= 4.5) "POSITIVE"
    else if (rating >= 4.0) "GOOD"
    else if (rating >= 3.5) "NEUTRAL"
    else if (rating >= 3.0) "POOR"
    else "NEGATIVE"
  }

  /**
   * Generate price category
   */
  def getPriceCategory(price: Double): String = {
    if (price < 30000) "Budget"
    else if (price < 100000) "Mid-Range"
    else "Premium"
  }

  /**
   * Calculate value score
   * Higher rating, more reviews, lower price = better value
   */
  def calculateValueScore(rating: Double, reviewCount: Int, price: Double): Double = {
    val ratingScore = rating * 10
    val popularityScore = math.log10(reviewCount + 1) * 5
    val pricePenalty = math.log10(price + 1) * 2
    math.round((ratingScore + popularityScore - pricePenalty) * 100) / 100.0
  }
}
