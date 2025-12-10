name := "sentiment-analysis-nlp"
version := "1.0.0"
scalaVersion := "2.12.17"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    libraryDependencies ++= Seq(
      guice,

      // Database - PostgreSQL
      "org.postgresql" % "postgresql" % "42.7.3",
      "com.typesafe.play" %% "play-slick" % "5.0.0",
      "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0",

      // Basic dependencies
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test
    )
  )
