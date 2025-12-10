package services

import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.play.PlaySpec
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.Await
import java.io.{File, PrintWriter}
import scala.io.Source

class DataInputServiceSpec extends PlaySpec with Matchers {

  val dataInputService = new DataInputService()

  def createTempFile(content: String, extension: String): File = {
    val tempFile = File.createTempFile("test", extension)
    tempFile.deleteOnExit()
    val writer = new PrintWriter(tempFile)
    try {
      writer.write(content)
    } finally {
      writer.close()
    }
    tempFile
  }

  "DataInputService" should {

    "read CSV file correctly" in {
      val csvContent = """review,rating,reviewer
                         |Great product!,5,John
                         |Not good,2,Jane
                         |Average quality,3,Bob""".stripMargin
      
      val csvFile = createTempFile(csvContent, ".csv")
      val result = Await.result(dataInputService.readCSVFile(csvFile), 5.seconds)
      
      result should have length 3
      result(0).reviewText shouldBe "Great product!"
      result(0).rating shouldBe Some(5)
      result(0).reviewerName shouldBe Some("John")
      
      result(1).reviewText shouldBe "Not good"
      result(1).rating shouldBe Some(2)
      result(1).reviewerName shouldBe Some("Jane")
    }

    "read JSON file correctly" in {
      val jsonContent = """[
                          |  {"review": "Excellent product!", "rating": 5, "reviewer": "Alice"},
                          |  {"text": "Poor quality", "score": 1, "name": "Charlie"}
                          |]""".stripMargin
      
      val jsonFile = createTempFile(jsonContent, ".json")
      val result = Await.result(dataInputService.readJSONFile(jsonFile), 5.seconds)
      
      result should have length 2
      result(0).reviewText shouldBe "Excellent product!"
      result(0).rating shouldBe Some(5)
      result(0).reviewerName shouldBe Some("Alice")
      
      result(1).reviewText shouldBe "Poor quality"
      result(1).rating shouldBe Some(1)
      result(1).reviewerName shouldBe Some("Charlie")
    }

    "detect dataset format correctly" in {
      val csvFile = createTempFile("test,data", ".csv")
      val jsonFile = createTempFile("""{"test": "data"}""", ".json")
      val excelFile = createTempFile("test", ".xlsx")
      
      Await.result(dataInputService.detectDatasetFormat(csvFile), 5.seconds) shouldBe "csv"
      Await.result(dataInputService.detectDatasetFormat(jsonFile), 5.seconds) shouldBe "json"
      Await.result(dataInputService.detectDatasetFormat(excelFile), 5.seconds) shouldBe "excel"
    }

    "validate dataset format correctly" in {
      val csvFile = createTempFile("test", ".csv")
      val jsonFile = createTempFile("test", ".json")
      val excelFile = createTempFile("test", ".xlsx")
      val txtFile = createTempFile("test", ".txt")
      
      Await.result(dataInputService.validateDataset(csvFile, "csv"), 5.seconds) shouldBe true
      Await.result(dataInputService.validateDataset(jsonFile, "json"), 5.seconds) shouldBe true
      Await.result(dataInputService.validateDataset(excelFile, "excel"), 5.seconds) shouldBe true
      Await.result(dataInputService.validateDataset(txtFile, "csv"), 5.seconds) shouldBe false
    }

    "validate review data correctly" in {
      val validReviews = Seq(
        ReviewData("This is a good product with detailed review"),
        ReviewData("Another detailed review about the product quality"),
        ReviewData("Short") // This should be filtered out
      )
      
      val (filtered, errors) = dataInputService.validateReviewData(validReviews)
      
      filtered should have length 2
      errors should not be empty
      errors.head should include("Filtered out")
    }

    "handle empty datasets correctly" in {
      val emptyReviews = Seq.empty[ReviewData]
      val (filtered, errors) = dataInputService.validateReviewData(emptyReviews)
      
      filtered shouldBe empty
      errors should not be empty
      errors should contain("No reviews found in dataset")
    }

    "process different file formats" in {
      val csvFile = createTempFile("review\nGreat product!", ".csv")
      val jsonFile = createTempFile("""[{"review": "Great product!"}]""", ".json")
      
      val csvResult = Await.result(dataInputService.processDatasetFile(csvFile, "csv"), 5.seconds)
      val jsonResult = Await.result(dataInputService.processDatasetFile(jsonFile, "json"), 5.seconds)
      
      csvResult should have length 1
      jsonResult should have length 1
      csvResult(0).reviewText shouldBe "Great product!"
      jsonResult(0).reviewText shouldBe "Great product!"
    }

    "handle invalid file format gracefully" in {
      val file = createTempFile("test", ".txt")
      
      assertThrows[IllegalArgumentException] {
        Await.result(dataInputService.processDatasetFile(file, "invalid"), 5.seconds)
      }
    }
  }
}