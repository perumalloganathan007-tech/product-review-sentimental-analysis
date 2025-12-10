package services

import org.apache.spark.sql.SparkSession
import javax.inject._
import play.api.Configuration
import play.api.Logger

@Singleton
class SparkService @Inject()(config: Configuration) {
  private val logger = Logger(this.getClass)

  // Initialize Spark Session with proper configuration
  lazy val spark: SparkSession = {
    try {
      logger.info("🚀 Initializing Apache Spark Session...")

      val appName = config.getOptional[String]("spark.app.name").getOrElse("Sentiment Analysis App")
      val master = config.getOptional[String]("spark.master").getOrElse("local[*]")
      val uiPort = config.getOptional[String]("spark.ui.port").getOrElse("4040")

      // Set Hadoop home to avoid warnings
      System.setProperty("hadoop.home.dir", "C:/")

      val sparkSession = SparkSession.builder()
        .appName(appName)
        .master(master)
        .config("spark.ui.port", uiPort)
        .config("spark.ui.enabled", "true")
        .config("spark.driver.memory", "2g")
        .config("spark.executor.memory", "2g")
        .config("spark.sql.shuffle.partitions", "4")
        .config("spark.driver.host", "localhost")
        .config("spark.driver.bindAddress", "localhost")
        // Disable problematic features
        .config("spark.ui.prometheus.enabled", "false")
        .config("spark.sql.warehouse.dir", "file:///D:/scala project/spark-warehouse")
        .getOrCreate()

      // Set log level to reduce noise
      sparkSession.sparkContext.setLogLevel("WARN")

      logger.info(s"✅ Spark Session initialized successfully!")
      logger.info(s"🌐 Spark Web UI: http://localhost:${uiPort}")
      logger.info(s"📊 Application: ${appName}")
      logger.info(s"🔧 Master: ${master}")

      sparkSession
    } catch {
      case e: Exception =>
        logger.error("❌ Failed to initialize Spark Session", e)
        throw e
    }
  }

  def isRunning: Boolean = {
    try {
      !spark.sparkContext.isStopped
    } catch {
      case _: Exception => false
    }
  }

  def getWebUIUrl: String = {
    spark.sparkContext.uiWebUrl.getOrElse("http://localhost:4040")
  }

  def stop(): Unit = {
    if (isRunning) {
      logger.info("🛑 Stopping Spark Session...")
      spark.stop()
      logger.info("✅ Spark Session stopped")
    }
  }
}
