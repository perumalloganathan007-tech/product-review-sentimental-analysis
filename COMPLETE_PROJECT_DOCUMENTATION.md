# 📚 Complete Project Documentation
## Product Review Sentiment Analysis System

**Version:** 2.0  
**Last Updated:** December 9, 2025  
**Project Type:** Full-Stack Scala Web Application + Python Data Analysis Prototype

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Components](#project-components)
5. [Installation & Setup](#installation--setup)
6. [Usage Guide](#usage-guide)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### Purpose
A comprehensive sentiment analysis system that analyzes product reviews from e-commerce platforms using Natural Language Processing (NLP) techniques. The system provides:
- Automated sentiment classification (Positive/Neutral/Negative)
- Multi-product comparison capabilities
- Web scraping for live review extraction
- Dataset analysis with visualizations
- Interactive Spark-based data processing
- Report generation (PDF/CSV)

### Key Features

#### Scala Backend (Production System)
- ✅ **Sentiment Analysis**: Stanford CoreNLP integration for advanced text analysis
- ✅ **Multi-Input Support**: CSV, JSON, Excel files, and live URLs
- ✅ **Web Scraping**: Automated review extraction from Amazon, Flipkart, etc.
- ✅ **Database Integration**: PostgreSQL with full-text search
- ✅ **Product Comparison**: Compare sentiment across multiple products
- ✅ **Report Generation**: PDF and CSV exports
- ✅ **RESTful API**: Complete API for all operations

#### Python Prototype (Data Analysis)
- ✅ **Jupyter Notebook**: Interactive dataset analysis
- ✅ **Apache Spark Integration**: RDD operations with Web UI monitoring
- ✅ **Data Visualization**: Plotly, Matplotlib, Seaborn charts
- ✅ **Sentiment Analysis**: TextBlob-based sentiment scoring
- ✅ **Statistical Analysis**: Comprehensive data insights
- ✅ **CSV Processing**: Intelligent column detection and cleaning

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  HTML5   │  │   CSS3   │  │Bootstrap │  │Chart.js  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/AJAX
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Layer (Scala)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Play Framework 2.8                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │  │
│  │  │Controllers│→ │ Services │→ │Repository│→ │Database │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            NLP Engine (Stanford CoreNLP)                 │  │
│  │  • Tokenization  • POS Tagging  • Sentiment Analysis    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Apache Spark 2.4.8 (Data Processing)            │  │
│  │  • Distributed Processing  • ML Pipeline                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ JDBC
┌─────────────────────────────────────────────────────────────────┐
│                    Database Layer (PostgreSQL)                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐     │
│  │Products │  │Analyses │  │ Reviews │  │ Comparisons  │     │
│  └─────────┘  └─────────┘  └─────────┘  └──────────────┘     │
│  • Full-Text Search  • JSONB Support  • Optimized Indexes    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              Python Prototype (Jupyter + Spark)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Python 3.11 + PySpark 3.5.0 + Jupyter Notebook         │  │
│  │  • Interactive Analysis  • Spark Web UI  • Visualizations│  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Phase**
   ```
   User → Upload CSV/JSON/Excel OR Enter URLs
        → Validation & Preprocessing
        → Storage in Database
   ```

2. **Processing Phase**
   ```
   Raw Data → NLP Pipeline (Stanford CoreNLP)
            → Sentiment Classification
            → Score Calculation
            → Result Storage
   ```

3. **Analysis Phase**
   ```
   Stored Data → Statistical Analysis
               → Visualization Generation
               → Comparison Logic (if applicable)
               → Report Generation
   ```

4. **Output Phase**
   ```
   Results → Web Interface Display
           → PDF/CSV Export
           → API Response
   ```

---

## 🛠 Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Scala** | 2.13.8 | Primary programming language |
| **Play Framework** | 2.8.x | Web application framework |
| **SBT** | 1.9+ | Build tool |
| **Stanford CoreNLP** | 4.5.4 | NLP and sentiment analysis |
| **Apache Spark** | 2.4.8 | Distributed data processing |
| **Slick** | 3.4.x | Database ORM |
| **PostgreSQL** | 5.7+ | Primary database |

### Frontend Technologies

| Technology | Purpose |
|-----------|---------|
| **HTML5/CSS3** | Structure and styling |
| **JavaScript ES6+** | Client-side logic |
| **Bootstrap 5** | Responsive design framework |
| **Chart.js** | Data visualization |
| **jQuery** | DOM manipulation |
| **Font Awesome** | Icons |

### Python Prototype Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.11.0 | Programming language |
| **PySpark** | 3.5.0 | Spark integration |
| **Jupyter** | Latest | Interactive notebook |
| **Pandas** | Latest | Data manipulation |
| **NumPy** | Latest | Numerical computing |
| **Matplotlib** | Latest | Static visualizations |
| **Seaborn** | Latest | Statistical visualizations |
| **Plotly** | Latest | Interactive visualizations |
| **TextBlob** | Latest | Sentiment analysis |

### Libraries & Dependencies

#### Scala Dependencies (build.sbt)
```scala
// Play Framework Core
guice

// Database
"org.postgresql" % "postgresql" % "42.6.0"
"com.typesafe.play" %% "play-slick" % "5.0.0"
"com.typesafe.play" %% "play-slick-evolutions" % "5.0.0"

// Apache Spark
"org.apache.spark" %% "spark-core" % "2.4.8"
"org.apache.spark" %% "spark-sql" % "2.4.8"
"org.apache.spark" %% "spark-mllib" % "2.4.8"

// NLP
"edu.stanford.nlp" % "stanford-corenlp" % "4.5.4"
"edu.stanford.nlp" % "stanford-corenlp" % "4.5.4" classifier "models"

// HTTP Client
"com.softwaremill.sttp.client3" %% "core" % "3.8.13"

// File Processing
"com.github.tototoshi" %% "scala-csv" % "1.3.10"
"org.apache.poi" % "poi" % "5.2.3"
"org.apache.poi" % "poi-ooxml" % "5.2.3"

// PDF Generation
"com.itextpdf" % "itextpdf" % "5.5.13.3"

// Web Scraping
"org.jsoup" % "jsoup" % "1.15.4"

// Testing
"org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
```

---

## 📁 Project Components

### Directory Structure

```
scala project/
├── app/                              # Application source code
│   ├── controllers/                  # HTTP request handlers
│   │   ├── AnalysisController.scala  # Analysis endpoints
│   │   ├── ComparisonController.scala # Comparison endpoints
│   │   ├── DatabaseTestController.scala # DB test endpoints
│   │   ├── HomeController.scala      # Home page
│   │   ├── SimpleController.scala    # Health checks
│   │   ├── SparkController.scala     # Spark operations
│   │   └── TestController.scala      # Testing utilities
│   │
│   ├── models/                       # Data models
│   │   ├── Models.scala              # Case classes
│   │   └── Tables.scala              # Slick table definitions
│   │
│   ├── repositories/                 # Data access layer
│   │   └── Repositories.scala        # CRUD operations
│   │
│   ├── services/                     # Business logic
│   │   ├── AnalysisService.scala     # Analysis logic
│   │   ├── ComparisonService.scala   # Comparison logic
│   │   ├── DataInputService.scala    # Data ingestion
│   │   ├── DatabaseTestService.scala # DB testing
│   │   ├── NLPService.scala          # NLP processing
│   │   ├── ReportService.scala       # Report generation
│   │   └── WebScraperService.scala   # Web scraping
│   │
│   ├── utils/                        # Utility classes
│   │   ├── ColumnDetector.scala      # Column detection
│   │   ├── DataCleaner.scala         # Data cleaning
│   │   ├── JsonUtils.scala           # JSON utilities
│   │   └── SparkSessionManager.scala # Spark management
│   │
│   └── views/                        # HTML templates
│       ├── index.scala.html          # Home page
│       └── test.scala.html           # Test page
│
├── conf/                             # Configuration files
│   ├── application.conf              # App configuration
│   ├── logback.xml                   # Logging config
│   ├── routes                        # URL routing
│   └── evolutions/                   # Database migrations
│       └── default/
│           └── 1.sql                 # Initial schema
│
├── public/                           # Static assets
│   ├── javascripts/
│   │   ├── main.js                   # Main JS logic
│   │   └── chart-utils.js            # Chart utilities
│   ├── stylesheets/
│   │   └── main.css                  # Main styles
│   └── images/
│
├── test/                             # Test files
│   ├── controllers/
│   │   └── AnalysisControllerSpec.scala
│   └── services/
│       ├── NLPServiceSpec.scala
│       └── DataInputServiceSpec.scala
│
├── project/                          # SBT build files
│   ├── build.properties              # SBT version
│   └── plugins.sbt                   # SBT plugins
│
├── assets/                           # Frontend assets
│   ├── dataset-analysis.js           # Dataset analysis UI
│   ├── main-app.js                   # Main application
│   ├── multi-compare.js              # Comparison UI
│   └── styles.css                    # Custom styles
│
├── scripts/                          # Utility scripts
│   ├── setup_database.sql            # DB setup script
│   └── start-server.bat              # Server start script
│
├── docs/                             # Documentation
│   ├── Current_Status_and_Options.md
│   ├── PostgreSQL_Setup_Summary.md
│   └── SBT_and_Testing_Guide.md
│
├── prototype-colab-dataset-analysis.ipynb  # Python prototype
│
├── build.sbt                         # SBT build definition
├── schema.sql                        # Database schema
├── README.md                         # Project README
└── COMPLETE_PROJECT_DOCUMENTATION.md # This file
```

### Key Components Explained

#### 1. Controllers Layer
**Purpose:** Handle HTTP requests and responses

- **AnalysisController**: Manages dataset and URL analysis
- **ComparisonController**: Handles product comparisons
- **SparkController**: Spark job management and monitoring
- **DatabaseTestController**: Database connection testing
- **HomeController**: Serves main application pages

#### 2. Services Layer
**Purpose:** Business logic and processing

- **NLPService**: Stanford CoreNLP integration, sentiment classification
- **DataInputService**: File parsing (CSV, JSON, Excel), data validation
- **WebScraperService**: URL scraping with Jsoup, review extraction
- **AnalysisService**: Sentiment scoring, statistical analysis
- **ComparisonService**: Multi-product comparison logic
- **ReportService**: PDF and CSV report generation

#### 3. Repository Layer
**Purpose:** Database access with Slick ORM

- **ProductRepository**: CRUD for products
- **AnalysisRepository**: Analysis records management
- **ReviewRepository**: Review storage and full-text search
- **ComparisonRepository**: Comparison data management

#### 4. Models Layer
**Purpose:** Data structures

- **Case Classes**: Type-safe data models
- **Enumerations**: InputType, SentimentType, DatasetType
- **Slick Tables**: Database table definitions with PostgreSQL optimizations

---

## 🚀 Installation & Setup

### Prerequisites

#### For Scala Backend

```bash
# Required
- Java 8 or 11 (OpenJDK or Oracle)
- Scala 2.13.8
- SBT 1.9+
- PostgreSQL 5.7+

# Optional
- Git (for version control)
- Node.js (for frontend dependencies)
```

#### For Python Prototype

```bash
# Required
- Python 3.11.0 (NOT 3.12 or 3.13)
- Java 11 (for Spark)

# Virtual Environment
- venv or conda
```

### Step-by-Step Setup

#### A. Scala Backend Setup

**1. Install Java**
```powershell
# Check Java installation
java -version

# Should show Java 8 or 11
# If not installed, download from:
# https://adoptium.net/ (Recommended)
```

**2. Install SBT**
```powershell
# Windows: Download installer
# https://www.scala-sbt.org/download.html

# Or use Chocolatey
choco install sbt

# Verify
sbt --version
```

**3. Setup PostgreSQL**
```powershell
# Start PostgreSQL service
Get-Service postgresql*

# Connect as postgres user
psql -U postgres -h localhost

# Run setup script
\i d:/project zip flies/scala project/scala project/setup_database.sql

# Or manually:
CREATE DATABASE sentiment_analysis;
CREATE USER sentiment_user WITH PASSWORD 'sentiment_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE sentiment_analysis TO sentiment_user;
```

**4. Configure Application**
```bash
# Edit conf/application.conf
db.default.url="jdbc:postgresql://localhost:5432/sentiment_analysis"
db.default.username="sentiment_user"
db.default.password="sentiment_pass_2024"
```

**5. Build and Run**
```powershell
# Navigate to project
cd "d:\project zip flies\scala project\scala project"

# Clean build
sbt clean compile

# Run application
sbt run

# Application will be available at:
# http://localhost:9000
```

#### B. Python Prototype Setup

**1. Create Python 3.11 Environment**
```powershell
# Navigate to project
cd "d:\project zip flies\scala project\scala project"

# Create virtual environment
py -3.11 -m venv spark-python311-env

# Activate environment
.\spark-python311-env\Scripts\Activate.ps1
```

**2. Install Dependencies**
```powershell
# Set temp directory to avoid space issues
$env:TEMP="D:\temp"
$env:TMP="D:\temp"

# Install packages without cache
pip install --no-cache-dir pyspark==3.5.0 findspark pandas numpy matplotlib seaborn plotly textblob jupyter
```

**3. Start Jupyter Notebook**
```powershell
# Option 1: Use batch file
.\start-jupyter-python311.bat

# Option 2: Manual start
.\spark-python311-env\Scripts\Activate.ps1
jupyter notebook

# Jupyter will open at:
# http://localhost:8888 or http://localhost:8889
```

**4. Open Prototype Notebook**
```
1. In Jupyter, navigate to:
   prototype-colab-dataset-analysis.ipynb

2. Run cells in order:
   - Cell 7: Setup Spark
   - Cell 12: Load CSV
   - Cell 20: Spark RDD operations
   - Cell 21+: Complete analysis

3. Check Spark Web UI:
   http://localhost:4040
```

### Database Schema Setup

The database schema is automatically created via Play Evolution on first run. Alternatively, run manually:

```sql
-- Run schema.sql
\i d:/project zip flies/scala project/scala project/schema.sql
```

**Schema includes:**
- `products` - Product information
- `analyses` - Analysis records
- `reviews` - Individual reviews
- `comparisons` - Comparison metadata
- `comparison_analyses` - Links analyses to comparisons

---

## 📖 Usage Guide

### Scala Backend Usage

#### 1. Start the Application

```powershell
cd "d:\project zip flies\scala project\scala project"
sbt run
```

Wait for "Server started" message, then open: **http://localhost:9000**

#### 2. Analyze Dataset

**Via Web Interface:**
```
1. Navigate to home page
2. Click "Dataset Analysis"
3. Upload CSV/JSON/Excel file
4. Select dataset type and preprocessing options
5. Click "Analyze"
6. View results with sentiment distribution
```

**Via API:**
```bash
curl -X POST http://localhost:9000/api/analyze/dataset \
  -F "dataset=@products.csv" \
  -F "productName=Sample Product" \
  -F "isPreprocessed=false" \
  -F "datasetType=csv"
```

#### 3. Analyze URLs

**Via Web Interface:**
```
1. Navigate to "URL Analysis"
2. Enter product URLs (one per line)
3. Optionally provide product names
4. Click "Analyze URLs"
5. System scrapes and analyzes reviews
```

**Via API:**
```bash
curl -X POST http://localhost:9000/api/analyze/urls \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://www.amazon.com/dp/B08N5WRWNW"],
    "productNames": ["iPhone 12"]
  }'
```

#### 4. Compare Products

**Via Web Interface:**
```
1. Navigate to "Product Comparison"
2. Select comparison method (datasets or URLs)
3. Upload multiple datasets OR enter multiple URLs
4. Click "Compare"
5. View side-by-side comparison with recommendations
```

**Via API:**
```bash
curl -X POST http://localhost:9000/api/compare/urls \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone Comparison",
    "description": "Compare top smartphones",
    "products": [
      {
        "name": "iPhone 12",
        "urls": ["https://www.amazon.com/dp/B08N5WRWNW"]
      },
      {
        "name": "Samsung Galaxy S21",
        "urls": ["https://www.amazon.com/dp/B08N5YDD7X"]
      }
    ]
  }'
```

#### 5. Generate Reports

**PDF Report:**
```bash
# Via browser
http://localhost:9000/api/report/pdf/1

# Via curl
curl -O http://localhost:9000/api/report/pdf/1
```

**CSV Export:**
```bash
# Via browser
http://localhost:9000/api/report/csv/1

# Via curl
curl -O http://localhost:9000/api/report/csv/1
```

### Python Prototype Usage

#### 1. Start Jupyter with Python 3.11

```powershell
cd "d:\project zip flies\scala project\scala project"
.\start-jupyter-python311.bat
```

#### 2. Open Prototype Notebook

In Jupyter:
1. Click on `prototype-colab-dataset-analysis.ipynb`
2. Wait for kernel to start

#### 3. Run Analysis Workflow

**Step 1: Setup Spark (Cell 7)**
```python
# Creates Spark session
# Sets up Web UI on port 4040
# Displays clickable link to Spark UI
```

**Step 2: Load Dataset (Cell 12 or 13)**
```python
# Option A: Quick load with path
csv_path = "BoatProduct.csv"

# Option B: Interactive upload
# Enter path when prompted
```

**Step 3: Generate Spark Jobs (Cell 20)**
```python
# Runs RDD operations:
# - Count, map, filter, reduce
# - GroupBy, distinct, cache
# - Join, sort operations

# Check Spark Web UI to see jobs
# http://localhost:4040
```

**Step 4: Data Cleaning (Cell 21)**
```python
# Automatic column detection
# Price, rating, review cleaning
# Sentiment analysis with TextBlob
# Duplicate removal
```

**Step 5: Visualizations (Cells 23-29)**
```python
# Interactive charts:
# - Price distribution
# - Rating analysis
# - Sentiment pie charts
# - Product comparisons
# - Statistical insights
```

**Step 6: Export Results (Cell 31)**
```python
# Saves processed data to CSV
# Location: same directory as notebook
```

#### 4. Monitor Spark Jobs

Open **http://localhost:4040** in browser to see:
- Active jobs and stages
- RDD operations and transformations
- DAG visualizations
- Task execution timeline
- Executor metrics

### Sample Datasets

Project includes sample datasets:

| File | Products | Use Case |
|------|----------|----------|
| `BoatProduct.csv` | Boat audio products | Electronics analysis |
| `sample-products.csv` | Various products | General testing |
| `flipkart-phones-fresh.csv` | Mobile phones | Phone comparison |

---

## 🔌 API Documentation

### Base URL
```
http://localhost:9000/api
```

### Endpoints

#### Health Check

```http
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

#### System Info

```http
GET /api/info
```
**Response:**
```json
{
  "application": "Sentiment Analysis NLP",
  "version": "1.0.0",
  "scala": "2.13.8",
  "spark": "2.4.8"
}
```

#### Analysis Endpoints

##### 1. Analyze Dataset

```http
POST /api/analyze/dataset
Content-Type: multipart/form-data

Parameters:
- dataset: File (required)
- productName: string (required)
- isPreprocessed: boolean (default: false)
- datasetType: string (csv|json|excel, default: csv)
```

**Response:**
```json
{
  "id": 1,
  "productId": 1,
  "inputType": "dataset",
  "overallSentiment": "positive",
  "positivePercentage": 75.5,
  "neutralPercentage": 15.2,
  "negativePercentage": 9.3,
  "totalReviews": 1500,
  "averageRating": 4.3,
  "createdAt": "2025-12-09T10:30:00Z"
}
```

##### 2. Analyze URLs

```http
POST /api/analyze/urls
Content-Type: application/json

Body:
{
  "urls": ["https://example.com/product"],
  "productNames": ["Product Name"] // optional
}
```

**Response:**
```json
[
  {
    "id": 2,
    "productId": 2,
    "inputType": "url",
    "overallSentiment": "positive",
    "scrapedReviewCount": 250,
    "positivePercentage": 68.0,
    "neutralPercentage": 20.0,
    "negativePercentage": 12.0,
    "totalReviews": 250,
    "averageRating": 4.1,
    "createdAt": "2025-12-09T10:35:00Z"
  }
]
```

##### 3. Get Analysis by ID

```http
GET /api/analysis/{id}
```

**Response:**
```json
{
  "analysis": {
    "id": 1,
    "productId": 1,
    "inputType": "dataset",
    "overallSentiment": "positive",
    "positivePercentage": 75.5,
    "neutralPercentage": 15.2,
    "negativePercentage": 9.3,
    "totalReviews": 1500,
    "averageRating": 4.3,
    "createdAt": "2025-12-09T10:30:00Z"
  },
  "product": {
    "id": 1,
    "name": "Product Name",
    "url": "https://example.com/product"
  },
  "reviews": [
    {
      "id": 1,
      "analysisId": 1,
      "reviewText": "Great product!",
      "sentiment": "positive",
      "sentimentScore": 0.85,
      "rating": 5.0
    }
  ]
}
```

##### 4. Get All Analyses

```http
GET /api/analyses
```

**Response:**
```json
{
  "analyses": [
    {
      "id": 1,
      "productName": "Product 1",
      "overallSentiment": "positive",
      "totalReviews": 1500,
      "createdAt": "2025-12-09T10:30:00Z"
    },
    {
      "id": 2,
      "productName": "Product 2",
      "overallSentiment": "neutral",
      "totalReviews": 500,
      "createdAt": "2025-12-09T10:35:00Z"
    }
  ],
  "total": 2
}
```

#### Comparison Endpoints

##### 1. Compare Datasets

```http
POST /api/compare/datasets
Content-Type: multipart/form-data

Parameters:
- name: string (required)
- description: string (optional)
- dataset1: File (required)
- dataset2: File (required)
- dataset3: File (optional)
- productName1: string (required)
- productName2: string (required)
- productName3: string (optional)
```

**Response:**
```json
{
  "id": 1,
  "name": "Smartphone Comparison",
  "description": "Compare top smartphones",
  "totalProducts": 2,
  "recommendation": "Product 1",
  "analyses": [
    {
      "productName": "Product 1",
      "overallSentiment": "positive",
      "positivePercentage": 80.0,
      "averageRating": 4.5
    },
    {
      "productName": "Product 2",
      "overallSentiment": "neutral",
      "positivePercentage": 60.0,
      "averageRating": 3.8
    }
  ],
  "createdAt": "2025-12-09T11:00:00Z"
}
```

##### 2. Compare URLs

```http
POST /api/compare/urls
Content-Type: application/json

Body:
{
  "name": "Comparison Name",
  "description": "Optional description",
  "products": [
    {
      "name": "Product 1",
      "urls": ["https://example.com/product1"]
    },
    {
      "name": "Product 2",
      "urls": ["https://example.com/product2"]
    }
  ]
}
```

**Response:** Same as Compare Datasets

##### 3. Get Comparison

```http
GET /api/comparison/{id}
```

**Response:**
```json
{
  "comparison": {
    "id": 1,
    "name": "Smartphone Comparison",
    "description": "Compare top smartphones",
    "totalProducts": 2,
    "recommendation": "Product 1",
    "createdAt": "2025-12-09T11:00:00Z"
  },
  "analyses": [
    {
      "analysis": { /* analysis object */ },
      "product": { /* product object */ },
      "reviewCount": 1500
    }
  ]
}
```

#### Report Endpoints

##### 1. Generate PDF

```http
GET /api/report/pdf/{analysisId}
```

**Response:** PDF file download

##### 2. Generate CSV

```http
GET /api/report/csv/{analysisId}
```

**Response:** CSV file download

#### Spark Endpoints

##### 1. Get Spark Info

```http
GET /api/spark/info
```

**Response:**
```json
{
  "sparkVersion": "2.4.8",
  "scalaVersion": "2.13.8",
  "webUIUrl": "http://localhost:4040",
  "isActive": true
}
```

##### 2. Redirect to Spark Web UI

```http
GET /api/spark/webui
```

**Response:** HTTP 302 redirect to Spark Web UI

##### 3. Test Spark

```http
GET /api/spark/test
```

**Response:**
```json
{
  "status": "success",
  "message": "Spark session active",
  "testResult": {
    "operation": "count",
    "value": 1000,
    "duration": "125ms"
  }
}
```

### Error Responses

All endpoints return standard error format:

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 💾 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│    products     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ url             │
│ metadata (JSON) │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         ↓
┌─────────────────┐        ┌──────────────────────┐
│    analyses     │───N:N──│comparison_analyses  │
├─────────────────┤        ├──────────────────────┤
│ id (PK)         │        │ comparison_id (FK)   │
│ product_id (FK) │        │ analysis_id (FK)     │
│ input_type      │        │ created_at           │
│ overall_sentiment│        └──────────────────────┘
│ positive_%      │                 │
│ neutral_%       │                 │
│ negative_%      │                N:1
│ total_reviews   │                 ↓
│ avg_rating      │        ┌──────────────────┐
│ created_at      │        │   comparisons    │
│ updated_at      │        ├──────────────────┤
└────────┬────────┘        │ id (PK)          │
         │                 │ name             │
         │ 1:N             │ description      │
         ↓                 │ total_products   │
┌─────────────────┐        │ recommendation   │
│     reviews     │        │ created_at       │
├─────────────────┤        │ updated_at       │
│ id (PK)         │        └──────────────────┘
│ analysis_id (FK)│
│ review_text     │
│ sentiment       │
│ sentiment_score │
│ rating          │
│ reviewer_name   │
│ review_date     │
│ created_at      │
└─────────────────┘
```

### Table Definitions

#### 1. products
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  url VARCHAR(2000),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT products_name_check CHECK (length(name) > 0)
);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_metadata ON products USING gin(metadata);
```

**Fields:**
- `id`: Auto-increment primary key
- `name`: Product name (required, max 500 chars)
- `url`: Product URL (optional, max 2000 chars)
- `metadata`: JSONB for additional data (category, brand, etc.)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

#### 2. analyses
```sql
CREATE TABLE analyses (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  input_type VARCHAR(50) NOT NULL,
  preprocessing_status BOOLEAN DEFAULT false,
  overall_sentiment VARCHAR(50) NOT NULL,
  positive_percentage DECIMAL(5,2) DEFAULT 0.0,
  neutral_percentage DECIMAL(5,2) DEFAULT 0.0,
  negative_percentage DECIMAL(5,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  scraped_review_count INTEGER,
  dataset_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT analyses_product_id_fk FOREIGN KEY (product_id) 
    REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT analyses_percentages_check 
    CHECK (positive_percentage + neutral_percentage + negative_percentage <= 100.0),
  CONSTRAINT analyses_rating_check 
    CHECK (average_rating IS NULL OR (average_rating >= 0 AND average_rating <= 5))
);

CREATE INDEX idx_analyses_product_id ON analyses(product_id);
CREATE INDEX idx_analyses_sentiment ON analyses(overall_sentiment);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
```

**Fields:**
- `id`: Auto-increment primary key
- `product_id`: Foreign key to products table
- `input_type`: 'dataset' or 'url'
- `preprocessing_status`: Data preprocessing flag
- `overall_sentiment`: 'positive', 'neutral', or 'negative'
- `positive_percentage`: % of positive reviews (0-100)
- `neutral_percentage`: % of neutral reviews (0-100)
- `negative_percentage`: % of negative reviews (0-100)
- `total_reviews`: Total number of reviews analyzed
- `average_rating`: Average rating (0.0-5.0)
- `scraped_review_count`: Number of reviews scraped (for URLs)
- `dataset_type`: 'csv', 'json', or 'excel'
- `created_at`: Analysis timestamp
- `updated_at`: Last update timestamp

#### 3. reviews
```sql
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  analysis_id BIGINT REFERENCES analyses(id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  sentiment VARCHAR(50) NOT NULL,
  sentiment_score DECIMAL(5,4),
  rating DECIMAL(3,2),
  reviewer_name VARCHAR(255),
  review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT reviews_analysis_id_fk FOREIGN KEY (analysis_id)
    REFERENCES analyses(id) ON DELETE CASCADE,
  CONSTRAINT reviews_text_check CHECK (length(review_text) > 0),
  CONSTRAINT reviews_sentiment_score_check 
    CHECK (sentiment_score IS NULL OR 
           (sentiment_score >= -1.0 AND sentiment_score <= 1.0)),
  CONSTRAINT reviews_rating_check 
    CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5))
);

CREATE INDEX idx_reviews_analysis_id ON reviews(analysis_id);
CREATE INDEX idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Full-text search index
CREATE INDEX idx_reviews_text_search ON reviews 
  USING gin(to_tsvector('english', review_text));
```

**Fields:**
- `id`: Auto-increment primary key
- `analysis_id`: Foreign key to analyses table
- `review_text`: Full review text (required)
- `sentiment`: 'positive', 'neutral', or 'negative'
- `sentiment_score`: Numeric score (-1.0 to 1.0)
- `rating`: Star rating (0.0-5.0)
- `reviewer_name`: Name of reviewer (optional)
- `review_date`: Date of review (optional)
- `created_at`: Record creation timestamp

**Full-Text Search:**
```sql
-- Search reviews
SELECT * FROM reviews 
WHERE to_tsvector('english', review_text) @@ to_tsquery('english', 'great & product');
```

#### 4. comparisons
```sql
CREATE TABLE comparisons (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_products INTEGER DEFAULT 0,
  recommendation VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT comparisons_name_check CHECK (length(name) > 0),
  CONSTRAINT comparisons_total_products_check CHECK (total_products >= 0)
);

CREATE INDEX idx_comparisons_created_at ON comparisons(created_at DESC);
```

**Fields:**
- `id`: Auto-increment primary key
- `name`: Comparison name (required)
- `description`: Optional description
- `total_products`: Number of products compared
- `recommendation`: Recommended product name
- `created_at`: Comparison timestamp
- `updated_at`: Last update timestamp

#### 5. comparison_analyses
```sql
CREATE TABLE comparison_analyses (
  comparison_id BIGINT REFERENCES comparisons(id) ON DELETE CASCADE,
  analysis_id BIGINT REFERENCES analyses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (comparison_id, analysis_id),
  CONSTRAINT ca_comparison_id_fk FOREIGN KEY (comparison_id)
    REFERENCES comparisons(id) ON DELETE CASCADE,
  CONSTRAINT ca_analysis_id_fk FOREIGN KEY (analysis_id)
    REFERENCES analyses(id) ON DELETE CASCADE
);

CREATE INDEX idx_ca_comparison_id ON comparison_analyses(comparison_id);
CREATE INDEX idx_ca_analysis_id ON comparison_analyses(analysis_id);
```

**Fields:**
- `comparison_id`: Foreign key to comparisons table
- `analysis_id`: Foreign key to analyses table
- `created_at`: Link creation timestamp

**Composite Primary Key:** (`comparison_id`, `analysis_id`)

### Database Triggers

#### Auto-Update Timestamp
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analyses_updated_at 
  BEFORE UPDATE ON analyses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comparisons_updated_at 
  BEFORE UPDATE ON comparisons 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Sample Queries

#### Get Analysis with Reviews
```sql
SELECT 
  a.*,
  p.name AS product_name,
  p.url AS product_url,
  COUNT(r.id) AS review_count
FROM analyses a
JOIN products p ON a.product_id = p.id
LEFT JOIN reviews r ON r.analysis_id = a.id
WHERE a.id = 1
GROUP BY a.id, p.id;
```

#### Get Top Rated Products
```sql
SELECT 
  p.name,
  AVG(a.average_rating) AS avg_rating,
  SUM(a.total_reviews) AS total_reviews,
  MAX(a.positive_percentage) AS max_positive
FROM products p
JOIN analyses a ON a.product_id = p.id
GROUP BY p.id, p.name
ORDER BY avg_rating DESC
LIMIT 10;
```

#### Search Reviews by Text
```sql
SELECT 
  p.name AS product_name,
  r.review_text,
  r.sentiment,
  r.rating
FROM reviews r
JOIN analyses a ON r.analysis_id = a.id
JOIN products p ON a.product_id = p.id
WHERE to_tsvector('english', r.review_text) @@ to_tsquery('english', 'amazing | excellent')
ORDER BY r.rating DESC
LIMIT 20;
```

#### Get Comparison Results
```sql
SELECT 
  c.name AS comparison_name,
  p.name AS product_name,
  a.overall_sentiment,
  a.positive_percentage,
  a.average_rating,
  a.total_reviews
FROM comparisons c
JOIN comparison_analyses ca ON ca.comparison_id = c.id
JOIN analyses a ON a.id = ca.analysis_id
JOIN products p ON p.id = a.product_id
WHERE c.id = 1
ORDER BY a.positive_percentage DESC;
```

---

## 🧪 Testing

### Test Structure

```
test/
├── controllers/
│   └── AnalysisControllerSpec.scala
├── services/
│   ├── NLPServiceSpec.scala
│   └── DataInputServiceSpec.scala
└── integration/
    └── DatabaseIntegrationSpec.scala
```

### Running Tests

```powershell
# Run all tests
sbt test

# Run specific test class
sbt "testOnly controllers.AnalysisControllerSpec"

# Run tests with coverage
sbt coverage test coverageReport

# Run continuous testing
sbt ~test
```

### Test Examples

#### Controller Test
```scala
class AnalysisControllerSpec extends PlaySpec with GuiceOneAppPerTest {
  
  "AnalysisController" should {
    "handle dataset upload" in {
      val controller = app.injector.instanceOf[AnalysisController]
      val tempFile = new File("test-data.csv")
      
      val request = FakeRequest(POST, "/api/analyze/dataset")
        .withMultipartFormDataBody(
          MultipartFormData(
            dataParts = Map(
              "productName" -> Seq("Test Product"),
              "isPreprocessed" -> Seq("false")
            ),
            files = Seq(
              FilePart("dataset", "test.csv", Some("text/csv"), 
                FileIO.fromPath(tempFile.toPath))
            ),
            badParts = Seq.empty
          )
        )
      
      val result = controller.analyzeDataset()(request)
      status(result) mustEqual OK
    }
  }
}
```

#### Service Test
```scala
class NLPServiceSpec extends PlaySpec {
  
  "NLPService" should {
    "classify positive sentiment correctly" in {
      val nlpService = new NLPService()
      val text = "This product is amazing! Highly recommend."
      
      val sentiment = nlpService.analyzeSentiment(text)
      sentiment mustEqual SentimentType.Positive
    }
    
    "handle empty text gracefully" in {
      val nlpService = new NLPService()
      val sentiment = nlpService.analyzeSentiment("")
      
      sentiment mustEqual SentimentType.Neutral
    }
  }
}
```

### Database Testing

```powershell
# Setup test database
createdb sentiment_analysis_test
psql -d sentiment_analysis_test -f schema.sql

# Run integration tests
sbt "testOnly *IntegrationSpec"
```

### Python Prototype Testing

```powershell
# Activate environment
.\spark-python311-env\Scripts\Activate.ps1

# Run all cells in notebook
jupyter nbconvert --to notebook --execute prototype-colab-dataset-analysis.ipynb

# Or test individual components
python -c "
import pandas as pd
df = pd.read_csv('BoatProduct.csv')
print(f'Loaded {len(df)} rows')
"
```

---

## 🚀 Deployment

### Production Deployment

#### 1. Build Production Package

```powershell
# Clean and build
sbt clean compile

# Create distribution
sbt dist

# Output: target/universal/sentiment-analysis-nlp-1.0.0.zip
```

#### 2. Server Setup

```bash
# On production server
unzip sentiment-analysis-nlp-1.0.0.zip
cd sentiment-analysis-nlp-1.0.0

# Set environment variables
export DB_URL="jdbc:postgresql://prod-db:5432/sentiment_analysis"
export DB_USER="sentiment_user"
export DB_PASSWORD="secure_password"
export APPLICATION_SECRET="generate_secure_secret"

# Start application
bin/sentiment-analysis-nlp \
  -Dhttp.port=9000 \
  -Dplay.http.secret.key="$APPLICATION_SECRET" \
  -Ddb.default.url="$DB_URL" \
  -Ddb.default.username="$DB_USER" \
  -Ddb.default.password="$DB_PASSWORD"
```

#### 3. Production Configuration

**conf/application.prod.conf:**
```hocon
include "application.conf"

play.http.secret.key=${APPLICATION_SECRET}

db.default {
  url=${DB_URL}
  username=${DB_USER}
  password=${DB_PASSWORD}
  
  # Connection pool settings
  hikaricp {
    maximumPoolSize = 10
    minimumIdle = 5
    connectionTimeout = 30000
    idleTimeout = 600000
    maxLifetime = 1800000
  }
}

# Logging
play.logger.level=INFO
```

#### 4. Systemd Service

**/etc/systemd/system/sentiment-analysis.service:**
```ini
[Unit]
Description=Sentiment Analysis NLP Application
After=postgresql.service

[Service]
Type=simple
User=sentiment
WorkingDirectory=/opt/sentiment-analysis
ExecStart=/opt/sentiment-analysis/bin/sentiment-analysis-nlp \
  -Dconfig.file=/opt/sentiment-analysis/conf/application.prod.conf
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable sentiment-analysis
sudo systemctl start sentiment-analysis
sudo systemctl status sentiment-analysis
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM openjdk:11-jre-slim

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy application
COPY target/universal/sentiment-analysis-nlp-*.zip /app/
WORKDIR /app

# Extract and setup
RUN unzip sentiment-analysis-nlp-*.zip && \
    rm sentiment-analysis-nlp-*.zip && \
    mv sentiment-analysis-nlp-* sentiment-analysis

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:9000/api/health || exit 1

# Start application
CMD ["./sentiment-analysis/bin/sentiment-analysis-nlp", \
     "-Dhttp.port=9000", \
     "-Dplay.http.secret.key=${APPLICATION_SECRET}"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: sentiment_analysis
      POSTGRES_USER: sentiment_user
      POSTGRES_PASSWORD: sentiment_pass_2024
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sentiment_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
    environment:
      APPLICATION_SECRET: ${APPLICATION_SECRET}
      DB_URL: jdbc:postgresql://db:5432/sentiment_analysis
      DB_USER: sentiment_user
      DB_PASSWORD: sentiment_pass_2024
    ports:
      - "9000:9000"
    volumes:
      - ./uploads:/app/sentiment-analysis/uploads
      - ./downloads:/app/sentiment-analysis/downloads
    restart: unless-stopped

volumes:
  postgres_data:
```

**Deploy with Docker:**
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Nginx Reverse Proxy

**/etc/nginx/sites-available/sentiment-analysis:**
```nginx
server {
    listen 80;
    server_name sentiment.example.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sentiment.example.com;

    ssl_certificate /etc/letsencrypt/live/sentiment.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sentiment.example.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy to Play application
    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # File upload size
    client_max_body_size 50M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sentiment-analysis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Symptoms:**
```
Error: Database connection failed
Unable to connect to jdbc:postgresql://localhost:5432/sentiment_analysis
```

**Solutions:**
```powershell
# Check PostgreSQL service
Get-Service postgresql*

# Start service if stopped
Start-Service postgresql-x64-14

# Test connection
psql -U sentiment_user -d sentiment_analysis -h localhost

# Verify credentials in application.conf
db.default.username="sentiment_user"
db.default.password="sentiment_pass_2024"
```

#### 2. SBT Compilation Errors

**Symptoms:**
```
[error] (compile: compileIncremental) compilation failed
```

**Solutions:**
```powershell
# Clean build
sbt clean

# Remove target directory
Remove-Item -Recurse -Force target

# Update dependencies
sbt update

# Reload SBT
sbt reload
```

#### 3. Stanford CoreNLP Models Not Found

**Symptoms:**
```
Error: Could not find or load models
```

**Solutions:**
```powershell
# Verify dependency in build.sbt
"edu.stanford.nlp" % "stanford-corenlp" % "4.5.4" classifier "models"

# Clean and rebuild
sbt clean update compile

# Manual download (if needed)
# Download from: https://nlp.stanford.edu/software/stanford-corenlp-models-current.jar
```

#### 4. Python Worker Crashes (Spark)

**Symptoms:**
```
org.apache.spark.SparkException: Python worker exited unexpectedly (crashed)
```

**Solutions:**
```powershell
# Check Python version (MUST be 3.11, not 3.12 or 3.13)
python --version

# Use Python 3.11 environment
.\spark-python311-env\Scripts\Activate.ps1

# Verify PySpark version
pip show pyspark
# Should show: Version: 3.5.0

# Restart Spark session in notebook
spark.stop()
# Re-run Cell 7
```

#### 5. Port Already in Use

**Symptoms:**
```
Error: Address already in use: bind
Port 9000 is already in use
```

**Solutions:**
```powershell
# Find process using port
netstat -ano | findstr :9000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port
sbt "run -Dhttp.port=9001"
```

#### 6. Jupyter Notebook Kernel Issues

**Symptoms:**
```
Kernel error
No such kernel named python311
```

**Solutions:**
```powershell
# Activate environment
.\spark-python311-env\Scripts\Activate.ps1

# Install ipykernel
pip install ipykernel

# Add kernel
python -m ipykernel install --user --name python311 --display-name "Python 3.11 (Spark)"

# Restart Jupyter
jupyter notebook
```

#### 7. Web Scraping Blocked

**Symptoms:**
```
Error: HTTP 403 Forbidden
Access denied by robots.txt
```

**Solutions:**
```scala
// Update user agent in WebScraperService.scala
val userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/91.0.4472.124 Safari/537.36"

// Add delays between requests
Thread.sleep(2000) // 2 second delay

// Respect robots.txt
// Check site's robots.txt before scraping
```

#### 8. Out of Memory Errors

**Symptoms:**
```
java.lang.OutOfMemoryError: Java heap space
```

**Solutions:**
```powershell
# Increase JVM heap size
sbt -J-Xmx4G -J-Xms2G run

# Or set in .sbtopts file
-J-Xmx4G
-J-Xms2G
-J-XX:MaxMetaspaceSize=512M

# For Spark in Python
# Edit Cell 7 in notebook:
.config("spark.driver.memory", "4g") \
.config("spark.executor.memory", "4g")
```

### Debug Mode

```powershell
# Run SBT in debug mode
sbt -jvm-debug 5005 run

# In IntelliJ IDEA:
# Run → Edit Configurations → + → Remote
# Host: localhost, Port: 5005

# Enable detailed logging
# In conf/logback.xml:
<logger name="play" level="DEBUG" />
<logger name="application" level="DEBUG" />
```

### Logs Location

```
# Application logs
logs/application.log

# SBT logs
target/streams/

# PostgreSQL logs (Windows)
C:\Program Files\PostgreSQL\14\data\log\

# Jupyter logs
~/.jupyter/jupyter.log
```

---

## 📚 Additional Resources

### Official Documentation

- **Play Framework:** https://www.playframework.com/documentation
- **Stanford CoreNLP:** https://stanfordnlp.github.io/CoreNLP/
- **Apache Spark:** https://spark.apache.org/docs/latest/
- **Slick:** https://scala-slick.org/doc/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **PySpark:** https://spark.apache.org/docs/latest/api/python/

### Tutorials & Guides

- **Scala Play Tutorial:** https://www.playframework.com/getting-started
- **NLP with Stanford CoreNLP:** https://nlp.stanford.edu/software/corenlp.html
- **Spark RDD Programming:** https://spark.apache.org/docs/latest/rdd-programming-guide.html
- **Slick Database Queries:** https://scala-slick.org/doc/3.4.0/queries.html

### Community & Support

- **Play Framework Google Group:** https://groups.google.com/g/play-framework
- **Scala Users Forum:** https://users.scala-lang.org/
- **Stack Overflow:** Tag with `playframework`, `scala`, `stanford-nlp`
- **GitHub Issues:** Create issues for bugs or feature requests

---

## 📝 Version History

### Version 2.0 (December 9, 2025)
- ✅ Added Python 3.11 prototype with Spark integration
- ✅ Jupyter notebook for interactive data analysis
- ✅ RDD-based Spark jobs with Web UI monitoring
- ✅ Enhanced visualizations with Plotly
- ✅ Complete project documentation
- ✅ Docker deployment support
- ✅ Improved error handling

### Version 1.0 (September 2025)
- ✅ Initial Scala backend implementation
- ✅ Stanford CoreNLP integration
- ✅ PostgreSQL database setup
- ✅ Web scraping functionality
- ✅ Product comparison feature
- ✅ PDF/CSV report generation
- ✅ RESTful API endpoints

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Sentiment Analysis NLP

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Stanford NLP Group** - For the excellent CoreNLP library
- **Play Framework Team** - For the robust web framework
- **Apache Spark Team** - For distributed computing capabilities
- **PostgreSQL Community** - For the powerful database system
- **Scala Community** - For language support and libraries
- **All Contributors** - For testing and feedback

---

## 📞 Contact & Support

For questions, issues, or contributions:

- **GitHub Issues:** Create an issue on the repository
- **Email:** support@sentiment-analysis.example.com
- **Documentation:** This file and project README
- **Community Forum:** (Link to forum if available)

---

**Built with ❤️ using Scala, Play Framework, Apache Spark, and Python**

*Last Updated: December 9, 2025*
