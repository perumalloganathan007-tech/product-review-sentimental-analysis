# 📊 Dataset Analysis Prototype - Google Colab Version

## Overview

A simple, interactive prototype for analyzing product datasets in Google Colab. Designed to work with CSV files similar to BoatProduct.csv format.

## Features

✅ **User-Friendly Upload** - Upload CSV files directly in Colab
✅ **Automatic Column Detection** - Intelligently detects product, price, rating, review columns
✅ **Data Cleaning** - Cleans price, rating, review count, discount fields
✅ **Sentiment Analysis** - AI-powered sentiment analysis on reviews using TextBlob
✅ **Statistical Summaries** - Comprehensive statistics for all metrics
✅ **Interactive Visualizations** - Beautiful charts with Plotly
✅ **Key Insights** - Actionable insights and recommendations
✅ **Data Export** - Download processed dataset
✅ **Apache Spark Integration** - Distributed processing with Spark
✅ **Public Spark Web UI** - Access Spark UI from anywhere via ngrok

## Quick Start

### Option 1: Jupyter Notebook (Recommended)

1. **Upload to Google Colab:**
   - Go to [Google Colab](https://colab.research.google.com/)
   - Click `File` → `Upload notebook`
   - Upload `prototype-colab-dataset-analysis.ipynb`

2. **Run the notebook:**
   - Click `Runtime` → `Run all`
   - Upload your CSV when prompted
   - View results and visualizations

3. **Access Spark Web UI:**
   - **Option A: Local Access (No Setup)** - Use `http://localhost:4040` (see LOCAL-SPARK-UI-GUIDE.md)
   - **Option B: Public Access (Ngrok)** - Share with team using ngrok tunnel
   - **Both show all jobs and DAG visualizations!**

### Option 2: Python Script

1. **Open Google Colab:**
   - Create new notebook
   - Upload `prototype-colab-analysis.py`

2. **Run in cell:**
   ```python
   !pip install pandas numpy matplotlib seaborn plotly textblob wordcloud scikit-learn -q
   
   # Upload and run the script
   exec(open('prototype-colab-analysis.py').read())
   ```

## CSV Format

Your CSV should contain these columns (column names are flexible):

| Column | Expected Names | Type | Required |
|--------|---------------|------|----------|
| Product Name | `ProductName`, `product_name`, `Product` | String | ✅ Yes |
| Price | `ProductPrice`, `price`, `Price` | String/Number | ✅ Yes |
| Rating | `Rate`, `Rating`, `rating` | String/Number | ✅ Yes |
| Review Text | `Review`, `review`, `Summary` | String | ✅ Yes |
| Review Count | `NumberofReviews`, `review_count` | String/Number | ⚠️ Optional |
| Discount | `Discount`, `discount` | String/Number | ⚠️ Optional |

### Example CSV Format (BoatProduct.csv style):

```csv
ProductName,ProductPrice,Discount,NumberofReviews,Rate,Review,Summary
Stone 1000v2,"Sale price₹ 3,999",43% off,7 reviews,"★ 5.0",Fantastic product,Very good product in this price range
Samsung Galaxy S24,"₹79,999",20% off,890 reviews,"★ 4.3",Outstanding,Great display and battery life
```

The script automatically handles:
- ✅ Currency symbols (₹, $, etc.)
- ✅ Comma separators in numbers
- ✅ Text mixed with numbers
- ✅ Star ratings (★ 5.0 → 5.0)
- ✅ Review counts with text ("7 reviews" → 7)
- ✅ Discount percentages ("43% off" → 43)

## Analysis Outputs

### 1. Dataset Overview
- Total records count
- Column information
- Data types
- Missing values analysis
- Memory usage

### 2. Statistical Analysis
- **Price Statistics**: Mean, median, min, max, std dev
- **Rating Statistics**: Average rating, distribution
- **Sentiment Analysis**: Positive/Neutral/Negative breakdown
- **Review Statistics**: Total reviews, average per product

### 3. Visualizations
- **Price Distribution** - Histogram showing price ranges
- **Rating Distribution** - Rating frequency chart
- **Sentiment Pie Chart** - Visual sentiment breakdown
- **Price Categories** - Budget, Economy, Mid-Range, Premium, Luxury
- **Price vs Rating Scatter** - Correlation analysis
- **Top Products** - Most reviewed products

### 4. Key Insights
- Price-rating correlation
- Quality indicators
- Sentiment trends
- Customer satisfaction metrics
- Actionable recommendations

## Sample Output

```
======================================================================
🚀 DATASET ANALYSIS STARTED
======================================================================

📋 Step 1: Detecting columns...
✅ Columns detected:
   product_name: ProductName
   price: ProductPrice
   rating: Rate
   review_text: Review
   review_count: NumberofReviews
   discount: Discount
   summary: Summary

🧹 Step 2: Cleaning data...
   ✅ Price column cleaned
   ✅ Rating column cleaned
   ✅ Review count cleaned
   ✅ Discount cleaned
   🤖 Performing sentiment analysis...
   ✅ Sentiment analysis completed
   🗑️  Removed 145 duplicates

📊 Step 3: Statistical Analysis
======================================================================

💰 PRICE STATISTICS:
   Mean: ₹4,250.50
   Median: ₹3,999.00
   Min: ₹999.00
   Max: ₹19,999.00
   Std Dev: ₹2,845.30

⭐ RATING STATISTICS:
   Mean: 4.35/5.0
   Median: 4.50/5.0
   High Rated (≥4.0): 4,523 (78.5%)

😊 SENTIMENT DISTRIBUTION:
   😊 Positive: 3,845 (66.8%)
   😐 Neutral: 1,234 (21.4%)
   😞 Negative: 678 (11.8%)

🎯 KEY INSIGHTS
======================================================================

1. 📈 Positive correlation (0.45) between price and rating
2. ✨ Excellent average rating: 4.35/5.0
3. 😊 Strong positive sentiment: 66.8%

✅ ANALYSIS COMPLETE!
```

## Customization

### Change Sentiment Threshold
```python
def get_sentiment(text):
    analysis = TextBlob(str(text))
    polarity = analysis.sentiment.polarity
    if polarity > 0.2:  # Change from 0.1 to 0.2
        return 'Positive', polarity
    # ... rest of the code
```

### Modify Price Categories
```python
def categorize_price(price):
    if price < 2000:  # Change threshold
        return 'Budget (< ₹2K)'
    elif price < 10000:  # Change threshold
        return 'Mid-Range (₹2K-10K)'
    # ... add more categories
```

### Add Custom Analysis
```python
# Add after sentiment analysis
df_clean['value_score'] = (
    df_clean['rating_cleaned'] * 10 / 
    (df_clean['price_cleaned'] / 1000)
)
```

## Troubleshooting

### Issue: Ngrok tunnel "endpoint already online" error
**Error Message:**
```
failed to start tunnel: The endpoint is already online
ERR_NGROK_334
```

**Solution:**
This happens when:
1. You have another Colab notebook with ngrok running
2. Previous tunnel didn't close properly
3. Free tier limit (1 tunnel per account)

**Fix Options:**

**Option 1: Run the Reconnect Cell**
- Scroll to "🔧 Troubleshooting: Reconnect Ngrok" cell
- Run it to properly close and restart tunnel
- Wait 30 seconds between attempts

**Option 2: Manual Cleanup**
```python
from pyngrok import ngrok
import time

# Kill all tunnels
ngrok.kill()
time.sleep(5)

# Reconnect
public_url = ngrok.connect(4040, bind_tls=True)
print(f"New URL: {public_url}")
```

**Option 3: Use Local Access**
- Spark still works locally!
- Access at: `http://localhost:4040`
- Only viewable from your Colab session

**Option 4: Wait and Retry**
- Wait 1-2 minutes for old tunnel to expire
- Run Step 1.5 cell again
- Free tier tunnels auto-expire after inactivity

### Issue: Upload button not appearing
**Solution:** Run this cell first:
```python
from google.colab import files
uploaded = files.upload()
```

### Issue: Encoding errors
**Solution:** Try different encodings:
```python
df = pd.read_csv(filename, encoding='latin-1')
# or
df = pd.read_csv(filename, encoding='cp1252')
```

### Issue: Column not detected
**Solution:** Check column names in your CSV and update detection:
```python
column_mapping = detect_columns(df)
# Manually add if needed:
column_mapping['price'] = 'YourPriceColumnName'
```

### Issue: Sentiment analysis taking too long
**Solution:** Sample the dataset:
```python
df_sample = df.sample(min(1000, len(df)))
# Run sentiment analysis on df_sample
```

### Issue: No jobs showing in Spark Web UI
**Solution:**
1. Make sure you ran Step 3.5 (Process Data with Spark)
2. Refresh the Spark Web UI page
3. Check if Spark session is active:
```python
print(spark.sparkContext.uiWebUrl)
```
4. Run Step 3.6 to generate more jobs

### Issue: Spark UI port conflict (4040 already in use)
**Solution:**
The code automatically finds a free port. Check output for:
```
Spark UI Port: 4041  # or 4042, 4043, etc.
```
Then access: `http://localhost:4041`

## Performance Tips

1. **Large datasets (>10,000 rows):** 
   - Enable GPU: `Runtime` → `Change runtime type` → `GPU`
   - Sample data for visualizations

2. **Memory issues:**
   ```python
   # Load with specific columns only
   df = pd.read_csv(filename, usecols=['ProductName', 'Price', 'Rating'])
   ```

3. **Faster processing:**
   ```python
   # Skip sentiment analysis for very large datasets
   # Comment out the sentiment analysis section
   ```

## Spark Web UI Access (Two Options)

The prototype includes **Apache Spark** integration with **full Web UI access** for monitoring jobs.

### ✅ Option 1: Local Access (Recommended - No Setup)

**All jobs and DAG visualizations work perfectly with local access!**

**Quick Steps:**
1. Run Step 1.5 to setup Spark
2. Run the "🏠 Local Access" cell
3. Access: `http://localhost:4040`
4. Run Step 3.5 to generate jobs

**Advantages:**
- ✅ No ngrok account needed
- ✅ No free tier limits
- ✅ No tunnel failures
- ✅ Faster (no proxy)
- ✅ All 12 jobs visible
- ✅ Complete DAG visualizations
- ✅ All Spark UI features work

**Limitation:**
- ⚠️ Only accessible within Colab session (can't share externally)

**See LOCAL-SPARK-UI-GUIDE.md for complete details**

### Option 2: Public Access via Ngrok (Optional)

Use this if you need to share Spark UI with team members.

**How It Works:**
1. **Step 1.5** installs Spark and ngrok
2. Creates ngrok tunnel to Spark UI port
3. Displays public URL for external access

**Ngrok Token:**
```text
34BJhKldBN9PXl1dG5wWqzYZl5C_5n9fZ52ohTAfHNUiCZFX1
```
Pre-configured in the notebook for automatic authentication.

**Features:**
- 🌍 **Public Access** - Share Spark UI with team members
- 📊 **Job Monitoring** - Track Spark job execution in real-time
- 🔍 **Stage Details** - View DAG, stages, and tasks
- 📈 **Performance Metrics** - CPU, memory, shuffle data stats
- 💾 **Storage Info** - RDD/DataFrame caching details

**Note:** If ngrok fails (free tier limits), the notebook automatically falls back to local access.

### Using Spark in Analysis:

The notebook includes **automatic Spark job generation** to showcase Spark capabilities:

**Step 3.5: Process Data with Spark** (Generates 6 jobs)
- ✅ Job 1: Statistics computation
- ✅ Job 2: Group by aggregations
- ✅ Job 3: SQL query execution
- ✅ Job 4: Complex aggregations with shuffles
- ✅ Job 5: Window functions (complex DAG)
- ✅ Job 6: Repartitioning operations

**Step 3.6: Additional Jobs** (Optional - Generates 6 more jobs)
- ✅ Job 7: Multiple joins
- ✅ Job 8: Sort and filter operations
- ✅ Job 9: Distinct values (shuffle)
- ✅ Job 10: Union operations
- ✅ Job 11: Pivot tables
- ✅ Job 12: User Defined Functions (UDF)

**What You'll See in Spark Web UI:**

1. **Jobs Tab** - List of all 12 jobs with status and duration
2. **DAG Visualization** - Click any job to see:
   - WholeStageCodegen stages
   - Exchange (shuffle) operations
   - HashAggregate nodes
   - Sort operations
   - Filter and Project nodes

3. **Stages Tab** - Detailed stage breakdown:
   - Input/Output records
   - Shuffle read/write
   - Task completion times
   - Executor metrics

4. **SQL Tab** - Query execution plans with:
   - Physical plans
   - Logical plans
   - Code generation details

**Example Spark Operations:**
```python
# All these operations are included in the notebook

# Convert pandas to Spark
spark_df = spark.createDataFrame(df)

# Group by with aggregations (creates shuffle)
spark_df.groupBy("category").agg(count("*"), avg("price")).show()

# SQL queries
spark.sql("SELECT * FROM products WHERE price > 1000").show()

# Window functions (complex DAG)
from pyspark.sql.window import Window
window = Window.partitionBy("category").orderBy(col("price").desc())
spark_df.withColumn("rank", row_number().over(window)).show()
```

### Accessing Spark Web UI:

After running Step 1.5, you'll see:
```
🎉 SPARK WEB UI IS NOW PUBLIC!
======================================================================

🌍 Public URL: https://xxxx-xx-xxx-xxx-xx.ngrok-free.app

📊 Access your Spark Web UI from anywhere using the URL above!
```

Click the URL or the styled button to open the Spark Web UI in a new tab.

## Requirements

All packages are automatically installed in Colab:
- pandas
- numpy
- matplotlib
- seaborn
- plotly
- textblob
- wordcloud
- scikit-learn
- pyspark (Apache Spark)
- pyngrok (ngrok tunnel)
- findspark (Spark initialization)

## Integration with Main Project

To integrate these features into your main project:

1. **Use cleaned data functions:**
   - Copy `clean_price()`, `clean_rating()` functions
   - Integrate into your data processing pipeline

2. **Add sentiment analysis:**
   - Use `get_sentiment()` for review analysis
   - Store results in database

3. **Visualization components:**
   - Export Plotly charts as HTML
   - Embed in your web application

4. **Statistical insights:**
   - Add insight generation to your backend
   - Display in dashboard UI

## Example Usage

```python
# In Google Colab

# 1. Upload notebook
# 2. Run all cells
# 3. Upload BoatProduct.csv
# 4. View analysis automatically

# Manual execution:
from google.colab import files
uploaded = files.upload()
filename = list(uploaded.keys())[0]

df = pd.read_csv(filename)
df_clean, mapping = analyze_dataset(df)
create_visualizations(df_clean)
```

## Differences from Scala Prototype

| Feature | Colab (Python) | Scala/Spark |
|---------|---------------|-------------|
| **Platform** | Google Colab | Spark Shell/SBT |
| **Language** | Python | Scala |
| **Upload** | Browser upload | File path |
| **Visualization** | Plotly (interactive) | Console output |
| **Processing** | Pandas | Spark DataFrames |
| **Best For** | Quick exploration | Large-scale processing |
| **Setup** | None (runs in browser) | Requires Spark installation |

## Next Steps

1. ✅ Test with BoatProduct.csv
2. ✅ Try with your own datasets
3. ✅ Customize visualizations
4. ✅ Add custom metrics
5. ✅ Integrate insights into main project
6. ✅ Scale to larger datasets with Spark

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in Colab
3. Verify CSV format matches expected structure
4. Test with sample data first

---

**Version:** 1.0  
**Platform:** Google Colab  
**Created:** December 2025  
**Reference Dataset:** BoatProduct.csv
