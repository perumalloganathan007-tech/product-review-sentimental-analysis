# Product Review Sentiment Analysis using NLP (Scala)

A comprehensive web application for analyzing product reviews using Natural Language Processing techniques, built with Scala, Play Framework, and Stanford CoreNLP.

## 🚀 Features

### Core Functionality

- **Sentiment Analysis**: Analyze customer reviews to determine positive, neutral, and negative sentiment
- **Multi-Input Support**:
  - Dataset files (CSV, JSON, Excel)
  - Direct product URLs (Amazon, Flipkart, etc.)
  - Preprocessed and unprocessed data handling
- **Product Comparison**: Compare sentiment across multiple products
- **Intelligent Recommendations**: AI-powered product suggestions based on sentiment scores

### Technical Features

- **NLP Processing**: Stanford CoreNLP integration for advanced text analysis
- **Web Scraping**: Automated review extraction from e-commerce platforms
- **Database Storage**: Persistent storage of all analyses and results
- **Report Generation**: Export results to PDF and CSV formats
- **Real-time Visualization**: Interactive charts and graphs using Chart.js

## 🛠 Technology Stack

### Backend

- **Scala 2.13** - Primary programming language
- **Play Framework 2.8** - Web application framework
- **Stanford CoreNLP 4.5.4** - Natural language processing
- **Slick 3.4** - Database access and ORM
- **MySQL** - Primary database

### Frontend

- **HTML5/CSS3/JavaScript** - User interface
- **Bootstrap 5** - Responsive design framework
- **Chart.js** - Data visualization
- **Font Awesome** - Icons

### Libraries & Tools

- **Jsoup** - HTML parsing and web scraping
- **Apache POI** - Excel file processing
- **OpenCSV** - CSV file handling
- **iText PDF** - PDF report generation
- **STTP** - HTTP client for web scraping

## 📋 Prerequisites

- **Java 8 or higher**
- **Scala 2.13**
- **SBT 1.9+**
- **MySQL 5.7+**
- **Node.js** (for frontend dependencies, optional)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sentiment-analysis-nlp
```

### 2. Database Setup

```sql
-- Create MySQL database
CREATE DATABASE sentiment_analysis;

-- Create user (optional)
CREATE USER 'sentiment_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON sentiment_analysis.* TO 'sentiment_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuration


Update `conf/application.conf` with your database settings:

```hocon
db.default.url="jdbc:mysql://localhost:3306/sentiment_analysis"
db.default.username="your_username"
db.default.password="your_password"
```

### 4. Run the Application

```bash
# Install dependencies and run
sbt run

# Or compile and run
sbt compile
sbt run
```

The application will be available at `http://localhost:9000`

### 5. Database Migrations

Database tables will be automatically created on first run via Play Evolution.

## 📖 Usage Guide

### Dataset Analysis

1. **Prepare your dataset** in CSV, JSON, or Excel format
2. **Required columns**: Review text (required), rating, reviewer name, date
3. **Upload via web interface** and specify if data is preprocessed
4. **View results** with sentiment distribution and recommendations

#### Supported Dataset Formats

**CSV Example:**

```csv
review,rating,reviewer,date
"Great product! Highly recommend",5,John,2024-01-15
"Poor quality, waste of money",1,Jane,2024-01-16
```

**JSON Example:**

```json
[
  {
    "review": "Amazing quality and fast delivery",
    "rating": 5,
    "reviewer": "Alice",
    "date": "2024-01-15"
  }
]
```

### URL Analysis

1. **Enter product URLs** (Amazon, Flipkart, or other e-commerce sites)
2. **Specify product names** (optional)
3. **System automatically scrapes** reviews and analyzes sentiment
4. **View comprehensive results** with scraped review data

### Product Comparison

1. **Select comparison method**: Multiple datasets or URLs
2. **Upload/Enter multiple products** for analysis
3. **System analyzes and compares** all products
4. **Get recommendation** for best product based on sentiment scores

### Reports

- **PDF Reports**: Comprehensive analysis with charts and recommendations
- **CSV Export**: Raw data export for further analysis
- **Download via web interface** or API endpoints

## 🔧 API Documentation

### Analysis Endpoints

#### Analyze Dataset
```http
POST /api/analyze/dataset
Content-Type: multipart/form-data

Parameters:
- dataset: File (CSV/JSON/Excel)
- productName: string
- isPreprocessed: boolean
- datasetType: string (csv|json|excel)
```

#### Analyze URLs
```http
POST /api/analyze/urls
Content-Type: application/json

{
  "urls": ["https://example.com/product1"],
  "productNames": ["Product Name"] // optional
}
```

#### Get Analysis
```http
GET /api/analysis/{id}
```

#### Get All Analyses
```http
GET /api/analyses
```

### Comparison Endpoints

#### Compare Datasets
```http
POST /api/compare/datasets
Content-Type: multipart/form-data
```

#### Compare URLs
```http
POST /api/compare/urls
Content-Type: application/json

{
  "name": "Comparison Name",
  "description": "Optional description",
  "products": [
    {
      "name": "Product 1",
      "urls": ["https://example.com/product1"]
    }
  ]
}
```

### Report Endpoints

#### Generate PDF Report
```http
GET /api/report/pdf/{analysisId}
```

#### Generate CSV Report
```http
GET /api/report/csv/{analysisId}
```

## 🧪 Testing

```bash
# Run all tests
sbt test

# Run specific test class
sbt "testOnly services.NLPServiceSpec"

# Run with coverage
sbt coverage test coverageReport
```

## 📊 Architecture Overview

### System Components

1. **Web Layer**: Play Framework controllers handling HTTP requests
2. **Service Layer**: Business logic and NLP processing
3. **Data Layer**: Slick-based database access
4. **NLP Engine**: Stanford CoreNLP integration
5. **Web Scraping**: Jsoup and STTP for data extraction
6. **Report Generator**: PDF and CSV export functionality

### Data Flow

1. **Input Processing**: Files/URLs → Data extraction → Validation
2. **NLP Pipeline**: Text preprocessing → Sentiment analysis → Scoring
3. **Storage**: Results → Database → Analysis records
4. **Visualization**: Database → Web interface → Charts/Reports

## 🔧 Configuration Options

### NLP Settings
```hocon
# Stanford CoreNLP configuration
nlp.models.path="models/"
nlp.stanford.annotators="tokenize,ssplit,pos,lemma,sentiment"
```

### Web Scraping Settings
```hocon
# Web scraping configuration
scraping.timeout=30000
scraping.retries=3
scraping.user.agent="Mozilla/5.0 ..."
```

### File Upload Settings
```hocon
# File upload limits
play.http.parser.maxDiskBuffer=10MB
play.http.parser.maxMemoryBuffer=2MB
```

## 🚀 Deployment

### Production Setup

1. **Build for production**:
```bash
sbt dist
```

2. **Configure production database**:
```hocon
db.default.url=${DATABASE_URL}
db.default.username=${DB_USERNAME}
db.default.password=${DB_PASSWORD}
```

3. **Set JVM options**:
```bash
-Xmx2G -Xms1G -server
```

### Docker Deployment

```dockerfile
FROM openjdk:11-jre-slim

COPY target/universal/sentiment-analysis-nlp-*.zip /app/
WORKDIR /app
RUN unzip sentiment-analysis-nlp-*.zip
EXPOSE 9000

CMD ["./sentiment-analysis-nlp-1.0.0/bin/sentiment-analysis-nlp"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Stanford CoreNLP Models Not Found**
```bash
# Download models manually
wget https://nlp.stanford.edu/software/stanford-corenlp-models-current.jar
```

**Database Connection Issues**
- Verify MySQL is running
- Check connection string in `application.conf`
- Ensure database exists and user has permissions

**Memory Issues with Large Datasets**
- Increase JVM heap size: `-Xmx4G`
- Process datasets in smaller batches
- Use streaming for large files

**Web Scraping Blocked**
- Implement delays between requests
- Use different user agents
- Respect robots.txt files

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review existing issues for solutions

## 🙏 Acknowledgments

- **Stanford CoreNLP** team for the excellent NLP library
- **Play Framework** community
- **Scala** community
- All contributors and testers

---

**Built with ❤️ using Scala and Play Framework**
 
 