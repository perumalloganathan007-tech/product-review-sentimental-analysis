// @GENERATOR:play-routes-compiler
// @SOURCE:conf/routes

import play.api.mvc.Call


import _root_.controllers.Assets.Asset

// @LINE:6
package controllers {

  // @LINE:61
  class ReverseAssets(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:61
    def versioned(file:Asset): Call = {
      implicit lazy val _rrc = new play.core.routing.ReverseRouteContext(Map(("path", "/public"))); _rrc
      Call("GET", _prefix + { _defaultPrefix } + "assets/" + implicitly[play.api.mvc.PathBindable[Asset]].unbind("file", file))
    }
  
  }

  // @LINE:6
  class ReverseHomeController(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:6
    def index(): Call = {
      
      Call("GET", _prefix)
    }
  
  }

  // @LINE:9
  class ReverseSimpleController(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:9
    def health(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "api/health")
    }
  
    // @LINE:10
    def info(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "api/info")
    }
  
  }

  // @LINE:50
  class ReverseSparkController(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:50
    def getSparkInfo(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "api/spark/info")
    }
  
    // @LINE:51
    def redirectToWebUI(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "api/spark/webui")
    }
  
    // @LINE:52
    def testSpark(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "api/spark/test")
    }
  
  }

  // @LINE:55
  class ReverseFlipkartScraperController(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:55
    def scrapeFlipkart(): Call = {
      
      Call("POST", _prefix + { _defaultPrefix } + "api/scrape-flipkart")
    }
  
    // @LINE:56
    def testSelectors(): Call = {
      
      Call("POST", _prefix + { _defaultPrefix } + "api/test-selectors")
    }
  
    // @LINE:57
    def batchTrain(): Call = {
      
      Call("POST", _prefix + { _defaultPrefix } + "api/batch-train")
    }
  
    // @LINE:58
    def getStats(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "api/scraper/stats")
    }
  
  }


}
