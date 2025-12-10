package modules

import com.google.inject.AbstractModule
import play.api.{Configuration, Environment}

class CustomModule(environment: Environment, configuration: Configuration) extends AbstractModule {
  override def configure(): Unit = {
    // Only bind essential services, skip database repositories
    // SparkService will be bound automatically by Guice
    println("✅ Custom module loaded - database dependencies disabled")
  }
}
