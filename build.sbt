name := "sentiment-analysis-nlp"
version := "1.0.0"
scalaVersion := "2.13.8"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    // Force resolve version conflicts
    ThisBuild / libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always,
    ThisBuild / evictionErrorLevel := Level.Info,

    libraryDependencies ++= Seq(
      // Play Framework Core
      guice,

      // Database - PostgreSQL
      "org.postgresql" % "postgresql" % "42.6.0",
      "com.typesafe.play" %% "play-slick" % "5.0.0",
      "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0",

      // Apache Spark 2.4.8 (compatible with Play Framework)
      "org.apache.spark" %% "spark-core" % "2.4.8" exclude("org.slf4j", "slf4j-log4j12") exclude("log4j", "log4j"),
      "org.apache.spark" %% "spark-sql" % "2.4.8" exclude("org.slf4j", "slf4j-log4j12") exclude("log4j", "log4j"),
      "org.apache.spark" %% "spark-mllib" % "2.4.8" exclude("org.slf4j", "slf4j-log4j12") exclude("log4j", "log4j"),

      // SLF4J bridge to redirect Log4j to SLF4J/Logback
      "org.slf4j" % "log4j-over-slf4j" % "1.7.30",

      // Stanford CoreNLP for sentiment analysis
      "edu.stanford.nlp" % "stanford-corenlp" % "4.5.4",
      "edu.stanford.nlp" % "stanford-corenlp" % "4.5.4" classifier "models",

      // HTTP Client - STTP
      "com.softwaremill.sttp.client3" %% "core" % "3.8.13",

      // CSV Processing
      "com.github.tototoshi" %% "scala-csv" % "1.3.10",

      // Apache POI for Excel processing
      "org.apache.poi" % "poi" % "5.2.3",
      "org.apache.poi" % "poi-ooxml" % "5.2.3",

      // iText for PDF generation
      "com.itextpdf" % "itextpdf" % "5.5.13.3",

      // JSoup for HTML parsing
      "org.jsoup" % "jsoup" % "1.15.4",

      // Testing
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
    )
  )
