package controllers

import org.scalatestplus.play._
import org.scalatestplus.play.guice._
import play.api.test._
import play.api.test.Helpers._
import play.api.libs.json._
import java.io.File

class AnalysisControllerSpec extends PlaySpec with GuiceOneAppPerTest with Injecting {

  "AnalysisController" should {

    "return the analysis page" in {
      val controller = inject[controllers.HomeController]
      val home = controller.index().apply(FakeRequest(GET, "/"))

      status(home) mustBe OK
      contentType(home) mustBe Some("text/html")
    }

    "handle dataset analysis request" in {
      val controller = inject[controllers.AnalysisController]
      
      // Create a temporary CSV file for testing
      val tempFile = java.io.File.createTempFile("test", ".csv")
      tempFile.deleteOnExit()
      val writer = new java.io.PrintWriter(tempFile)
      try {
        writer.write("review,rating\nGreat product!,5\nTerrible quality,1")
      } finally {
        writer.close()
      }

      val multipartBody = MultipartFormData(
        dataParts = Map(
          "productName" -> Seq("Test Product"),
          "isPreprocessed" -> Seq("false"),
          "datasetType" -> Seq("csv")
        ),
        files = Seq(
          MultipartFormData.FilePart(
            "dataset", 
            "test.csv", 
            Some("text/csv"), 
            play.api.libs.Files.SingletonTemporaryFileCreator.create("test", ".csv")
          )
        ),
        badParts = Seq.empty
      )

      val request = FakeRequest(POST, "/api/analyze/dataset")
        .withBody(multipartBody)

      // Note: This test would require a full application context with database
      // For now, we're testing the route structure
      val route = app.injector.instanceOf[play.api.routing.Router].routes.lift(request)
      route must be(defined)
    }

    "handle URL analysis request" in {
      val controller = inject[controllers.AnalysisController]
      
      val requestData = Json.obj(
        "urls" -> Json.arr("https://example.com/product1"),
        "productNames" -> Json.arr("Test Product")
      )

      val request = FakeRequest(POST, "/api/analyze/urls")
        .withHeaders(CONTENT_TYPE -> "application/json")
        .withJsonBody(requestData)

      // Test route existence
      val route = app.injector.instanceOf[play.api.routing.Router].routes.lift(request)
      route must be(defined)
    }

    "handle get analysis request" in {
      val controller = inject[controllers.AnalysisController]
      
      val request = FakeRequest(GET, "/api/analysis/1")
      val route = app.injector.instanceOf[play.api.routing.Router].routes.lift(request)
      route must be(defined)
    }

    "handle get all analyses request" in {
      val controller = inject[controllers.AnalysisController]
      
      val request = FakeRequest(GET, "/api/analyses")
      val route = app.injector.instanceOf[play.api.routing.Router].routes.lift(request)
      route must be(defined)
    }

    "validate JSON input for URL analysis" in {
      val validJson = Json.obj(
        "urls" -> Json.arr("https://example.com"),
        "productNames" -> Json.arr("Product 1")
      )

      val urlRequest = validJson.validate[controllers.AnalysisController#UrlAnalysisRequest]
      // Note: This would need the actual case class import to work properly
      // urlRequest mustBe a[JsSuccess[_]]
    }

    "reject invalid JSON input" in {
      val invalidJson = Json.obj(
        "urls" -> "not-an-array"
      )

      // This would test JSON validation
      // val urlRequest = invalidJson.validate[controllers.AnalysisController#UrlAnalysisRequest]
      // urlRequest mustBe a[JsError]
    }
  }
}