// Sample Spark commands to test job execution
// Copy and paste these into your running spark-shell to see jobs appear in Spark UI

object TestSparkCommands {
  def main(args: Array[String]): Unit = {
    // Note: This is for reference only - these commands are meant for spark-shell
    // To actually run, use spark-shell and paste the commands below

    // 1. Simple parallel collection
    // val data = sc.parallelize(1 to 1000)
    // val result = data.map(_ * 2).reduce(_ + _)
    // println(s"Result: $result")

    // 2. Simulate sentiment analysis
    /*
    case class Review(id: Int, text: String, rating: Double)
    val reviews = Seq(
      Review(1, "This product is excellent and amazing!", 5.0),
      Review(2, "Very good quality, highly recommended", 4.5),
      Review(3, "Okay product, nothing special", 3.0),
      Review(4, "Poor quality, very disappointed", 2.0),
      Review(5, "Terrible experience, waste of money", 1.0)
    )

    val reviewsRDD = sc.parallelize(reviews)
    val sentiments = reviewsRDD.map(r => {
      val sentiment = if (r.rating >= 4) "POSITIVE"
                      else if (r.rating >= 3) "NEUTRAL"
                      else "NEGATIVE"
      (sentiment, 1)
    }).reduceByKey(_ + _)

    println("Sentiment Analysis Results:")
    sentiments.collect().foreach(println)

    // 3. DataFrame operations (creates more visible jobs)
    import spark.implicits._
    val df = reviews.toDF()
    df.show()
    df.groupBy("rating").count().show()
    */

    println("This file contains Spark commands for reference.")
    println("To run these commands, start spark-shell and copy-paste the commented code above.")

    // Additional commands for spark-shell:
    // val avgRating = df.agg(avg("rating")).first().getDouble(0)
    // println(s"Average Rating: $avgRating")
    // After running these, check http://localhost:4040/jobs/ to see the jobs!
  }
}
