// @GENERATOR:play-routes-compiler
// @SOURCE:conf/routes

package router

import play.core.routing._
import play.core.routing.HandlerInvokerFactory._

import play.api.mvc._

import _root_.controllers.Assets.Asset

class Routes(
  override val errorHandler: play.api.http.HttpErrorHandler, 
  // @LINE:6
  HomeController_4: controllers.HomeController,
  // @LINE:9
  SimpleController_0: controllers.SimpleController,
  // @LINE:50
  SparkController_2: controllers.SparkController,
  // @LINE:55
  FlipkartScraperController_1: controllers.FlipkartScraperController,
  // @LINE:61
  Assets_3: controllers.Assets,
  val prefix: String
) extends GeneratedRouter {

   @javax.inject.Inject()
   def this(errorHandler: play.api.http.HttpErrorHandler,
    // @LINE:6
    HomeController_4: controllers.HomeController,
    // @LINE:9
    SimpleController_0: controllers.SimpleController,
    // @LINE:50
    SparkController_2: controllers.SparkController,
    // @LINE:55
    FlipkartScraperController_1: controllers.FlipkartScraperController,
    // @LINE:61
    Assets_3: controllers.Assets
  ) = this(errorHandler, HomeController_4, SimpleController_0, SparkController_2, FlipkartScraperController_1, Assets_3, "/")

  def withPrefix(addPrefix: String): Routes = {
    val prefix = play.api.routing.Router.concatPrefix(addPrefix, this.prefix)
    router.RoutesPrefix.setPrefix(prefix)
    new Routes(errorHandler, HomeController_4, SimpleController_0, SparkController_2, FlipkartScraperController_1, Assets_3, prefix)
  }

  private[this] val defaultPrefix: String = {
    if (this.prefix.endsWith("/")) "" else "/"
  }

  def documentation = List(
    ("""GET""", this.prefix, """controllers.HomeController.index()"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/health""", """controllers.SimpleController.health()"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/info""", """controllers.SimpleController.info()"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/spark/info""", """controllers.SparkController.getSparkInfo()"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/spark/webui""", """controllers.SparkController.redirectToWebUI()"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/spark/test""", """controllers.SparkController.testSpark()"""),
    ("""POST""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/scrape-flipkart""", """controllers.FlipkartScraperController.scrapeFlipkart()"""),
    ("""POST""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/test-selectors""", """controllers.FlipkartScraperController.testSelectors()"""),
    ("""POST""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/batch-train""", """controllers.FlipkartScraperController.batchTrain()"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """api/scraper/stats""", """controllers.FlipkartScraperController.getStats()"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """assets/""" + "$" + """file<.+>""", """controllers.Assets.versioned(path:String = "/public", file:Asset)"""),
    Nil
  ).foldLeft(List.empty[(String,String,String)]) { (s,e) => e.asInstanceOf[Any] match {
    case r @ (_,_,_) => s :+ r.asInstanceOf[(String,String,String)]
    case l => s ++ l.asInstanceOf[List[(String,String,String)]]
  }}


  // @LINE:6
  private[this] lazy val controllers_HomeController_index0_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix)))
  )
  private[this] lazy val controllers_HomeController_index0_invoker = createInvoker(
    HomeController_4.index(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.HomeController",
      "index",
      Nil,
      "GET",
      this.prefix + """""",
      """ Home page""",
      Seq()
    )
  )

  // @LINE:9
  private[this] lazy val controllers_SimpleController_health1_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/health")))
  )
  private[this] lazy val controllers_SimpleController_health1_invoker = createInvoker(
    SimpleController_0.health(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SimpleController",
      "health",
      Nil,
      "GET",
      this.prefix + """api/health""",
      """ Simple health check (no database required)""",
      Seq()
    )
  )

  // @LINE:10
  private[this] lazy val controllers_SimpleController_info2_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/info")))
  )
  private[this] lazy val controllers_SimpleController_info2_invoker = createInvoker(
    SimpleController_0.info(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SimpleController",
      "info",
      Nil,
      "GET",
      this.prefix + """api/info""",
      """""",
      Seq()
    )
  )

  // @LINE:50
  private[this] lazy val controllers_SparkController_getSparkInfo3_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/spark/info")))
  )
  private[this] lazy val controllers_SparkController_getSparkInfo3_invoker = createInvoker(
    SparkController_2.getSparkInfo(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SparkController",
      "getSparkInfo",
      Nil,
      "GET",
      this.prefix + """api/spark/info""",
      """ Spark endpoints""",
      Seq()
    )
  )

  // @LINE:51
  private[this] lazy val controllers_SparkController_redirectToWebUI4_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/spark/webui")))
  )
  private[this] lazy val controllers_SparkController_redirectToWebUI4_invoker = createInvoker(
    SparkController_2.redirectToWebUI(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SparkController",
      "redirectToWebUI",
      Nil,
      "GET",
      this.prefix + """api/spark/webui""",
      """""",
      Seq()
    )
  )

  // @LINE:52
  private[this] lazy val controllers_SparkController_testSpark5_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/spark/test")))
  )
  private[this] lazy val controllers_SparkController_testSpark5_invoker = createInvoker(
    SparkController_2.testSpark(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SparkController",
      "testSpark",
      Nil,
      "GET",
      this.prefix + """api/spark/test""",
      """""",
      Seq()
    )
  )

  // @LINE:55
  private[this] lazy val controllers_FlipkartScraperController_scrapeFlipkart6_route = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/scrape-flipkart")))
  )
  private[this] lazy val controllers_FlipkartScraperController_scrapeFlipkart6_invoker = createInvoker(
    FlipkartScraperController_1.scrapeFlipkart(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.FlipkartScraperController",
      "scrapeFlipkart",
      Nil,
      "POST",
      this.prefix + """api/scrape-flipkart""",
      """ Flipkart Scraper Training endpoints""",
      Seq()
    )
  )

  // @LINE:56
  private[this] lazy val controllers_FlipkartScraperController_testSelectors7_route = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/test-selectors")))
  )
  private[this] lazy val controllers_FlipkartScraperController_testSelectors7_invoker = createInvoker(
    FlipkartScraperController_1.testSelectors(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.FlipkartScraperController",
      "testSelectors",
      Nil,
      "POST",
      this.prefix + """api/test-selectors""",
      """""",
      Seq()
    )
  )

  // @LINE:57
  private[this] lazy val controllers_FlipkartScraperController_batchTrain8_route = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/batch-train")))
  )
  private[this] lazy val controllers_FlipkartScraperController_batchTrain8_invoker = createInvoker(
    FlipkartScraperController_1.batchTrain(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.FlipkartScraperController",
      "batchTrain",
      Nil,
      "POST",
      this.prefix + """api/batch-train""",
      """""",
      Seq()
    )
  )

  // @LINE:58
  private[this] lazy val controllers_FlipkartScraperController_getStats9_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("api/scraper/stats")))
  )
  private[this] lazy val controllers_FlipkartScraperController_getStats9_invoker = createInvoker(
    FlipkartScraperController_1.getStats(),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.FlipkartScraperController",
      "getStats",
      Nil,
      "GET",
      this.prefix + """api/scraper/stats""",
      """""",
      Seq()
    )
  )

  // @LINE:61
  private[this] lazy val controllers_Assets_versioned10_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/"), DynamicPart("file", """.+""",false)))
  )
  private[this] lazy val controllers_Assets_versioned10_invoker = createInvoker(
    Assets_3.versioned(fakeValue[String], fakeValue[Asset]),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Assets",
      "versioned",
      Seq(classOf[String], classOf[Asset]),
      "GET",
      this.prefix + """assets/""" + "$" + """file<.+>""",
      """ Static assets""",
      Seq()
    )
  )


  def routes: PartialFunction[RequestHeader, Handler] = {
  
    // @LINE:6
    case controllers_HomeController_index0_route(params@_) =>
      call { 
        controllers_HomeController_index0_invoker.call(HomeController_4.index())
      }
  
    // @LINE:9
    case controllers_SimpleController_health1_route(params@_) =>
      call { 
        controllers_SimpleController_health1_invoker.call(SimpleController_0.health())
      }
  
    // @LINE:10
    case controllers_SimpleController_info2_route(params@_) =>
      call { 
        controllers_SimpleController_info2_invoker.call(SimpleController_0.info())
      }
  
    // @LINE:50
    case controllers_SparkController_getSparkInfo3_route(params@_) =>
      call { 
        controllers_SparkController_getSparkInfo3_invoker.call(SparkController_2.getSparkInfo())
      }
  
    // @LINE:51
    case controllers_SparkController_redirectToWebUI4_route(params@_) =>
      call { 
        controllers_SparkController_redirectToWebUI4_invoker.call(SparkController_2.redirectToWebUI())
      }
  
    // @LINE:52
    case controllers_SparkController_testSpark5_route(params@_) =>
      call { 
        controllers_SparkController_testSpark5_invoker.call(SparkController_2.testSpark())
      }
  
    // @LINE:55
    case controllers_FlipkartScraperController_scrapeFlipkart6_route(params@_) =>
      call { 
        controllers_FlipkartScraperController_scrapeFlipkart6_invoker.call(FlipkartScraperController_1.scrapeFlipkart())
      }
  
    // @LINE:56
    case controllers_FlipkartScraperController_testSelectors7_route(params@_) =>
      call { 
        controllers_FlipkartScraperController_testSelectors7_invoker.call(FlipkartScraperController_1.testSelectors())
      }
  
    // @LINE:57
    case controllers_FlipkartScraperController_batchTrain8_route(params@_) =>
      call { 
        controllers_FlipkartScraperController_batchTrain8_invoker.call(FlipkartScraperController_1.batchTrain())
      }
  
    // @LINE:58
    case controllers_FlipkartScraperController_getStats9_route(params@_) =>
      call { 
        controllers_FlipkartScraperController_getStats9_invoker.call(FlipkartScraperController_1.getStats())
      }
  
    // @LINE:61
    case controllers_Assets_versioned10_route(params@_) =>
      call(Param[String]("path", Right("/public")), params.fromPath[Asset]("file", None)) { (path, file) =>
        controllers_Assets_versioned10_invoker.call(Assets_3.versioned(path, file))
      }
  }
}
