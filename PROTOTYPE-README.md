# Dataset Analysis Prototype

## Overview
This is a standalone Scala/Spark prototype for dataset analysis. It demonstrates sentiment analysis, category performance, and statistical insights without integrating into the main project.

## Features

### 9 Analysis Types:
1. **Sentiment Classification** - Classify products based on ratings
2. **Category Performance** - Analyze performance by product category
3. **Top Products** - Identify highest-rated products
4. **Price vs Rating** - Correlation between price and rating
5. **Review Volume** - Impact of review count on ratings
6. **Statistical Summary** - Overall dataset statistics
7. **Category Breakdown** - Detailed category metrics
8. **Best by Category** - Top product in each category
9. **Value Score** - Calculate value-for-money score

## Requirements

- **Scala**: 2.12.18
- **Apache Spark**: 3.5.0
- **Java**: 8 or higher
- **SBT**: 1.9.0 or higher

## Project Structure

```
prototype-DatasetAnalysis.scala  # Main Scala program
prototype-build.sbt              # Build configuration
prototype-dataset-analysis.html  # HTML visualization
sample-products.csv              # Sample dataset
```

## How to Run

### Option 1: Using spark-shell (Quick Start)

```bash
# Start spark-shell
spark-shell

# Load the script
:load prototype-DatasetAnalysis.scala

# Run with sample data
DatasetAnalysisPrototype.main(Array())

# OR run with your own CSV file
DatasetAnalysisPrototype.main(Array("d:/your-data.csv"))
```

When running without file path, you'll see:
```
📂 Dataset Input Options:
   1. Enter CSV file path
   2. Use sample data (default)

Your choice (1 or 2):
```
Enter `1` to provide a CSV path interactively, or `2` for sample data.

### Option 2: Compile and Run with SBT

```bash
# Navigate to project directory
cd "d:\project zip flies\scala project\scala project"

# Compile
sbt compile

# Run with sample data
sbt "runMain DatasetAnalysisPrototype"

# Run with your own CSV file
sbt "runMain DatasetAnalysisPrototype d:/your-data.csv"
```

### Option 3: Create JAR and Run

```bash
# Build fat JAR
sbt assembly

# Run JAR
spark-submit --class DatasetAnalysisPrototype \
  --master local[*] \
  target/scala-2.12/dataset-analysis-prototype-assembly-1.0.0.jar
```

### Option 4: Direct Scala Execution

```bash
# If you have scala installed
scalac -cp "C:\spark\spark-4.0.1-bin-hadoop3\jars\*" prototype-DatasetAnalysis.scala

# Run
scala -cp "C:\spark\spark-4.0.1-bin-hadoop3\jars\*" DatasetAnalysisPrototype
```

## Using Your Own Dataset

### CSV File Format

Your CSV file should contain these columns:
- **product_name** (String): Product name
- **category** (String): Product category (e.g., Smartphones, Laptops, Audio)
- **rating** (Double): Rating score (1.0 to 5.0)
- **reviews_count** (Integer): Number of reviews
- **price** (Double): Product price
- **review_summary** (String): Review text or summary

**Example CSV:**
```csv
product_name,category,rating,reviews_count,price,review_summary
iPhone 15 Pro,Smartphones,4.5,1250,129900,Excellent camera and performance
Samsung Galaxy S24,Smartphones,4.3,890,79999,Great display and battery life
MacBook Pro M3,Laptops,4.8,980,199900,Powerful performance for professionals
```

### Three Ways to Input Your Data

**Method 1: Command Line Argument (Best for automation)**
```bash
sbt "runMain DatasetAnalysisPrototype d:/datasets/products.csv"
# Or with spark-shell
spark-shell
:load prototype-DatasetAnalysis.scala
DatasetAnalysisPrototype.main(Array("d:/datasets/products.csv"))
```

**Method 2: Interactive Prompt (Best for exploration)**
```bash
sbt "runMain DatasetAnalysisPrototype"
# You'll see:
# 📂 Dataset Input Options:
#    1. Enter CSV file path
#    2. Use sample data (default)
# 
# Your choice (1 or 2): 1
# Enter CSV file path: d:/datasets/products.csv
```

**Method 3: Sample Data (Best for testing)**
```bash
sbt "runMain DatasetAnalysisPrototype"
# Choose option 2 or just press Enter
```

## Sample Output

```
======================================================================
🚀 Dataset Analysis Prototype
   Standalone Spark Application
======================================================================

✅ Spark Session Created
   Spark Version: 3.5.0
   Web UI: http://localhost:4040

📊 Dataset Loaded
   Total Products: 10

======================================================================
📈 ANALYSIS 1: Sentiment Classification
======================================================================

Sentiment Distribution:
+---------+-----+----------+
|sentiment|count|avg_rating|
+---------+-----+----------+
|POSITIVE |    4|      4.65|
|GOOD     |    5|      4.24|
|NEUTRAL  |    1|      4.00|
+---------+-----+----------+

======================================================================
📊 ANALYSIS 2: Category Performance
======================================================================

Category Performance:
+------------+-------------+----------+-------------+---------+----------+
|    category|product_count|avg_rating|total_reviews|avg_price|max_rating|
+------------+-------------+----------+-------------+---------+----------+
|     Laptops|            3|      4.40|         1880|   141900|       4.8|
|       Audio|            3|      4.53|         4180|    22296|       4.7|
| Smartphones|            4|      4.35|         3210|    85224|       4.5|
+------------+-------------+----------+-------------+---------+----------+
```

## Customization

### Using Your Own Dataset

Replace the `sampleData` section in the code with:

```scala
// Load from CSV
val productsDF = spark.read
  .option("header", "true")
  .option("inferSchema", "true")
  .csv("path/to/your/dataset.csv")
```

### Required CSV Format

```csv
product_name,category,rating,reviews_count,price,review_summary
iPhone 15,Smartphones,4.5,1250,129900,"Great phone"
MacBook Pro,Laptops,4.8,980,199900,"Excellent laptop"
```

### Modify Analysis Logic

Edit the analysis sections in `prototype-DatasetAnalysis.scala`:

```scala
// Add custom analysis
val customAnalysis = productsDF
  .filter($"price" < 50000)
  .groupBy("category")
  .agg(count("*").as("affordable_count"))

customAnalysis.show()
```

## Spark Web UI

Once running, access the Spark Web UI at:
- **Local**: http://localhost:4040/jobs/
- **Custom**: Configure in code or use ngrok for public access

## Integration Guide (When Ready)

To integrate into your main project:

1. Copy analysis functions to your service layer
2. Modify data source to use your database/API
3. Add error handling and logging
4. Create REST endpoints for each analysis
5. Connect frontend to new endpoints

## Troubleshooting

### Issue: Spark Session Not Starting
```bash
# Check Java version
java -version

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
```

### Issue: Dependencies Not Found
```bash
# Clean and rebuild
sbt clean compile
```

### Issue: Port 4040 Already in Use
```scala
// Change port in code
.config("spark.ui.port", "4041")
```

## Performance Tips

1. **Increase Memory**: Modify `.config("spark.driver.memory", "4g")`
2. **Partition Data**: Use `.repartition(4)` for large datasets
3. **Cache DataFrames**: Add `.cache()` after transformations
4. **Use Column Pruning**: Select only needed columns

## Next Steps

1. ✅ Test with sample data
2. ✅ Verify Spark UI works
3. ✅ Review analysis output
4. Load your actual dataset
5. Customize analysis logic
6. Export results to CSV/JSON
7. Create visualizations
8. Plan integration strategy

## License

MIT - Free to use and modify

## Support

For issues or questions:
- Check Spark logs in console
- Review Spark UI at localhost:4040
- Verify dataset format matches requirements
