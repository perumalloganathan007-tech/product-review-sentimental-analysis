// @GENERATOR:play-routes-compiler
// @SOURCE:conf/routes

package controllers;

import router.RoutesPrefix;

public class routes {
  
  public static final controllers.ReverseAssets Assets = new controllers.ReverseAssets(RoutesPrefix.byNamePrefix());
  public static final controllers.ReverseHomeController HomeController = new controllers.ReverseHomeController(RoutesPrefix.byNamePrefix());
  public static final controllers.ReverseSimpleController SimpleController = new controllers.ReverseSimpleController(RoutesPrefix.byNamePrefix());
  public static final controllers.ReverseSparkController SparkController = new controllers.ReverseSparkController(RoutesPrefix.byNamePrefix());
  public static final controllers.ReverseFlipkartScraperController FlipkartScraperController = new controllers.ReverseFlipkartScraperController(RoutesPrefix.byNamePrefix());

  public static class javascript {
    
    public static final controllers.javascript.ReverseAssets Assets = new controllers.javascript.ReverseAssets(RoutesPrefix.byNamePrefix());
    public static final controllers.javascript.ReverseHomeController HomeController = new controllers.javascript.ReverseHomeController(RoutesPrefix.byNamePrefix());
    public static final controllers.javascript.ReverseSimpleController SimpleController = new controllers.javascript.ReverseSimpleController(RoutesPrefix.byNamePrefix());
    public static final controllers.javascript.ReverseSparkController SparkController = new controllers.javascript.ReverseSparkController(RoutesPrefix.byNamePrefix());
    public static final controllers.javascript.ReverseFlipkartScraperController FlipkartScraperController = new controllers.javascript.ReverseFlipkartScraperController(RoutesPrefix.byNamePrefix());
  }

}
