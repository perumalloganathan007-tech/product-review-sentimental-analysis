// @GENERATOR:play-routes-compiler
// @SOURCE:conf/routes

import play.api.routing.JavaScriptReverseRoute


import _root_.controllers.Assets.Asset

// @LINE:6
package controllers.javascript {

  // @LINE:61
  class ReverseAssets(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:61
    def versioned: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Assets.versioned",
      """
        function(file1) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "assets/" + (""" + implicitly[play.api.mvc.PathBindable[Asset]].javascriptUnbind + """)("file", file1)})
        }
      """
    )
  
  }

  // @LINE:6
  class ReverseHomeController(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:6
    def index: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.HomeController.index",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + """"})
        }
      """
    )
  
  }

  // @LINE:9
  class ReverseSimpleController(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:9
    def health: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SimpleController.health",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "api/health"})
        }
      """
    )
  
    // @LINE:10
    def info: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SimpleController.info",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "api/info"})
        }
      """
    )
  
  }

  // @LINE:50
  class ReverseSparkController(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:50
    def getSparkInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SparkController.getSparkInfo",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "api/spark/info"})
        }
      """
    )
  
    // @LINE:51
    def redirectToWebUI: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SparkController.redirectToWebUI",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "api/spark/webui"})
        }
      """
    )
  
    // @LINE:52
    def testSpark: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SparkController.testSpark",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "api/spark/test"})
        }
      """
    )
  
  }

  // @LINE:55
  class ReverseFlipkartScraperController(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:55
    def scrapeFlipkart: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.FlipkartScraperController.scrapeFlipkart",
      """
        function() {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + "api/scrape-flipkart"})
        }
      """
    )
  
    // @LINE:56
    def testSelectors: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.FlipkartScraperController.testSelectors",
      """
        function() {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + "api/test-selectors"})
        }
      """
    )
  
    // @LINE:57
    def batchTrain: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.FlipkartScraperController.batchTrain",
      """
        function() {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + "api/batch-train"})
        }
      """
    )
  
    // @LINE:58
    def getStats: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.FlipkartScraperController.getStats",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "api/scraper/stats"})
        }
      """
    )
  
  }


}
