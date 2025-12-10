# ============================================
# PROTOTYPE: Dataset Analysis for Google Colab
# Simple Python Script Version
# ============================================

"""
Dataset Analysis Prototype - Colab Version

This script analyzes product datasets with:
- CSV file upload support
- Automatic data cleaning
- Statistical analysis
- Sentiment analysis
- Interactive visualizations

Usage in Colab:
1. Upload this file to Colab
2. Run all cells
3. Upload your CSV when prompted
4. View analysis results

CSV Format (flexible column names):
- ProductName / product_name
- ProductPrice / price
- Rate / Rating / rating
- Review / review_text
- NumberofReviews / review_count
- Discount / discount (optional)
- Summary / summary (optional)
"""

# Import required libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import re
from textblob import TextBlob
import warnings
warnings.filterwarnings('ignore')

# Set visualization style
sns.set_style('whitegrid')
plt.rcParams['figure.figsize'] = (12, 6)

# ============================================
# Helper Functions
# ============================================

def detect_columns(df):
    """Automatically detect column names from dataframe"""
    column_mapping = {}

    for col in df.columns:
        col_lower = col.lower()
        if 'product' in col_lower and 'name' in col_lower:
            column_mapping['product_name'] = col
        elif 'price' in col_lower:
            column_mapping['price'] = col
        elif 'rate' in col_lower or 'rating' in col_lower:
            column_mapping['rating'] = col
        elif 'review' in col_lower and 'number' not in col_lower and 'count' not in col_lower:
            column_mapping['review_text'] = col
        elif 'review' in col_lower and ('number' in col_lower or 'count' in col_lower):
            column_mapping['review_count'] = col
        elif 'discount' in col_lower:
            column_mapping['discount'] = col
        elif 'summary' in col_lower:
            column_mapping['summary'] = col

    return column_mapping

def clean_price(price_str):
    """Extract numeric price from string"""
    if pd.isna(price_str):
        return np.nan
    price_str = str(price_str)
    price_str = re.sub(r'[^0-9.]', '', price_str)
    try:
        return float(price_str)
    except:
        return np.nan

def clean_rating(rating_str):
    """Extract numeric rating from string"""
    if pd.isna(rating_str):
        return np.nan
    rating_str = str(rating_str)
    match = re.search(r'(\d+\.?\d*)', rating_str)
    if match:
        rating = float(match.group(1))
        if rating > 5:
            rating = rating / 10 * 5
        return rating
    return np.nan

def clean_review_count(count_str):
    """Extract numeric review count from string"""
    if pd.isna(count_str):
        return 0
    count_str = str(count_str)
    numbers = re.findall(r'\d+', count_str)
    if numbers:
        return int(numbers[0])
    return 0

def clean_discount(discount_str):
    """Extract numeric discount percentage from string"""
    if pd.isna(discount_str):
        return 0
    discount_str = str(discount_str)
    numbers = re.findall(r'\d+', discount_str)
    if numbers:
        return int(numbers[0])
    return 0

def get_sentiment(text):
    """Analyze sentiment of review text"""
    if pd.isna(text) or str(text).strip() == '':
        return 'Neutral', 0.0
    try:
        analysis = TextBlob(str(text))
        polarity = analysis.sentiment.polarity
        if polarity > 0.1:
            return 'Positive', polarity
        elif polarity < -0.1:
            return 'Negative', polarity
        else:
            return 'Neutral', polarity
    except:
        return 'Neutral', 0.0

def categorize_price(price):
    """Categorize price into ranges"""
    if pd.isna(price):
        return 'Unknown'
    if price < 1000:
        return 'Budget (< ₹1K)'
    elif price < 5000:
        return 'Economy (₹1K-5K)'
    elif price < 15000:
        return 'Mid-Range (₹5K-15K)'
    elif price < 50000:
        return 'Premium (₹15K-50K)'
    else:
        return 'Luxury (> ₹50K)'

# ============================================
# Main Analysis Function
# ============================================

def analyze_dataset(df):
    """Perform comprehensive dataset analysis"""

    print("="*70)
    print("🚀 DATASET ANALYSIS STARTED")
    print("="*70)

    # Step 1: Detect columns
    print("\n📋 Step 1: Detecting columns...")
    column_mapping = detect_columns(df)
    print("✅ Columns detected:")
    for key, val in column_mapping.items():
        print(f"   {key}: {val}")

    # Step 2: Data cleaning
    print("\n🧹 Step 2: Cleaning data...")
    df_clean = df.copy()

    if 'price' in column_mapping:
        df_clean['price_cleaned'] = df_clean[column_mapping['price']].apply(clean_price)
        print("   ✅ Price column cleaned")

    if 'rating' in column_mapping:
        df_clean['rating_cleaned'] = df_clean[column_mapping['rating']].apply(clean_rating)
        print("   ✅ Rating column cleaned")

    if 'review_count' in column_mapping:
        df_clean['review_count_cleaned'] = df_clean[column_mapping['review_count']].apply(clean_review_count)
        print("   ✅ Review count cleaned")

    if 'discount' in column_mapping:
        df_clean['discount_cleaned'] = df_clean[column_mapping['discount']].apply(clean_discount)
        print("   ✅ Discount cleaned")

    # Sentiment analysis
    if 'review_text' in column_mapping or 'summary' in column_mapping:
        review_col = column_mapping.get('review_text') or column_mapping.get('summary')
        print("   🤖 Performing sentiment analysis...")
        df_clean[['sentiment', 'sentiment_score']] = df_clean[review_col].apply(
            lambda x: pd.Series(get_sentiment(x))
        )
        print("   ✅ Sentiment analysis completed")

    # Remove duplicates
    before = len(df_clean)
    df_clean = df_clean.drop_duplicates()
    after = len(df_clean)
    print(f"   🗑️  Removed {before - after} duplicates")

    # Step 3: Statistical analysis
    print("\n📊 Step 3: Statistical Analysis")
    print("="*70)

    if 'price_cleaned' in df_clean.columns:
        print("\n💰 PRICE STATISTICS:")
        price_stats = df_clean['price_cleaned'].describe()
        print(f"   Mean: ₹{price_stats['mean']:,.2f}")
        print(f"   Median: ₹{price_stats['50%']:,.2f}")
        print(f"   Min: ₹{price_stats['min']:,.2f}")
        print(f"   Max: ₹{price_stats['max']:,.2f}")
        print(f"   Std Dev: ₹{price_stats['std']:,.2f}")

    if 'rating_cleaned' in df_clean.columns:
        print("\n⭐ RATING STATISTICS:")
        rating_stats = df_clean['rating_cleaned'].describe()
        print(f"   Mean: {rating_stats['mean']:.2f}/5.0")
        print(f"   Median: {rating_stats['50%']:.2f}/5.0")
        print(f"   Min: {rating_stats['min']:.2f}")
        print(f"   Max: {rating_stats['max']:.2f}")

        high_rated = (df_clean['rating_cleaned'] >= 4.0).sum()
        high_rated_pct = (high_rated / len(df_clean)) * 100
        print(f"   High Rated (≥4.0): {high_rated:,} ({high_rated_pct:.1f}%)")

    if 'sentiment' in df_clean.columns:
        print("\n😊 SENTIMENT DISTRIBUTION:")
        sentiment_counts = df_clean['sentiment'].value_counts()
        for sentiment, count in sentiment_counts.items():
            percentage = (count / len(df_clean)) * 100
            emoji = '😊' if sentiment == 'Positive' else '😐' if sentiment == 'Neutral' else '😞'
            print(f"   {emoji} {sentiment}: {count:,} ({percentage:.1f}%)")

    if 'review_count_cleaned' in df_clean.columns:
        print("\n💬 REVIEW STATISTICS:")
        total_reviews = df_clean['review_count_cleaned'].sum()
        avg_reviews = df_clean['review_count_cleaned'].mean()
        print(f"   Total Reviews: {total_reviews:,}")
        print(f"   Avg per Product: {avg_reviews:.2f}")

    # Step 4: Key insights
    print("\n🎯 Step 4: Key Insights")
    print("="*70)

    insights = []

    if 'price_cleaned' in df_clean.columns and 'rating_cleaned' in df_clean.columns:
        correlation = df_clean[['price_cleaned', 'rating_cleaned']].corr().iloc[0, 1]
        if abs(correlation) > 0.3:
            direction = "positive" if correlation > 0 else "negative"
            insights.append(f"📈 {direction.capitalize()} correlation ({correlation:.2f}) between price and rating")

    if 'rating_cleaned' in df_clean.columns:
        avg_rating = df_clean['rating_cleaned'].mean()
        if avg_rating >= 4.5:
            insights.append(f"✨ Excellent average rating: {avg_rating:.2f}/5.0")
        elif avg_rating < 3.5:
            insights.append(f"⚠️ Low average rating: {avg_rating:.2f}/5.0 - consider quality improvements")

    if 'sentiment' in df_clean.columns:
        pos_pct = (df_clean['sentiment'] == 'Positive').sum() / len(df_clean) * 100
        if pos_pct > 70:
            insights.append(f"😊 Strong positive sentiment: {pos_pct:.1f}%")
        elif pos_pct < 40:
            insights.append(f"😟 Low positive sentiment: {pos_pct:.1f}% - investigate customer concerns")

    for i, insight in enumerate(insights, 1):
        print(f"\n{i}. {insight}")

    print("\n" + "="*70)
    print("✅ ANALYSIS COMPLETE!")
    print("="*70)

    return df_clean, column_mapping

# ============================================
# Visualization Functions
# ============================================

def create_visualizations(df_clean):
    """Generate comprehensive visualizations"""

    print("\n📊 Generating visualizations...")

    # Create dashboard
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Price Distribution', 'Rating Distribution',
                        'Sentiment Analysis', 'Price Categories'),
        specs=[[{'type': 'histogram'}, {'type': 'histogram'}],
               [{'type': 'pie'}, {'type': 'bar'}]]
    )

    # Price distribution
    if 'price_cleaned' in df_clean.columns:
        fig.add_trace(
            go.Histogram(x=df_clean['price_cleaned'], name='Price',
                         marker_color='#3498db', nbinsx=50),
            row=1, col=1
        )

    # Rating distribution
    if 'rating_cleaned' in df_clean.columns:
        fig.add_trace(
            go.Histogram(x=df_clean['rating_cleaned'], name='Rating',
                         marker_color='#f39c12', nbinsx=20),
            row=1, col=2
        )

    # Sentiment pie chart
    if 'sentiment' in df_clean.columns:
        sentiment_counts = df_clean['sentiment'].value_counts()
        colors = {'Positive': '#2ecc71', 'Neutral': '#95a5a6', 'Negative': '#e74c3c'}
        pie_colors = [colors.get(s, '#3498db') for s in sentiment_counts.index]

        fig.add_trace(
            go.Pie(labels=sentiment_counts.index, values=sentiment_counts.values,
                   marker=dict(colors=pie_colors)),
            row=2, col=1
        )

    # Price categories
    if 'price_cleaned' in df_clean.columns:
        df_clean['price_category'] = df_clean['price_cleaned'].apply(categorize_price)
        price_cat_counts = df_clean['price_category'].value_counts()

        fig.add_trace(
            go.Bar(x=price_cat_counts.index, y=price_cat_counts.values,
                   marker_color='#9b59b6'),
            row=2, col=2
        )

    fig.update_layout(
        height=800,
        showlegend=False,
        title_text="📊 Dataset Analysis Dashboard",
        title_font_size=20
    )

    fig.show()
    print("✅ Visualizations generated!")

# ============================================
# Main Execution for Colab
# ============================================

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════════╗
    ║                                                                  ║
    ║          📊 DATASET ANALYSIS PROTOTYPE - COLAB VERSION           ║
    ║                                                                  ║
    ║  Features:                                                       ║
    ║  ✓ CSV Upload Support                                           ║
    ║  ✓ Automatic Data Cleaning                                      ║
    ║  ✓ Statistical Analysis                                         ║
    ║  ✓ Sentiment Analysis                                           ║
    ║  ✓ Interactive Visualizations                                   ║
    ║                                                                  ║
    ╚══════════════════════════════════════════════════════════════════╝
    """)

    # Upload file
    from google.colab import files
    print("\n📁 Please upload your CSV file...\n")
    uploaded = files.upload()

    if uploaded:
        filename = list(uploaded.keys())[0]
        print(f"\n✅ File '{filename}' uploaded successfully!\n")

        # Load dataset
        df = pd.read_csv(filename, encoding='utf-8', on_bad_lines='skip')

        print(f"📊 Loaded {len(df):,} records with {len(df.columns)} columns\n")

        # Analyze
        df_clean, column_mapping = analyze_dataset(df)

        # Visualize
        create_visualizations(df_clean)

        # Export
        print("\n💾 Exporting processed data...")
        output_file = 'processed_dataset.csv'
        df_clean.to_csv(output_file, index=False)
        files.download(output_file)
        print(f"✅ Download initiated for '{output_file}'")

    else:
        print("❌ No file uploaded. Please run again and upload a CSV file.")
