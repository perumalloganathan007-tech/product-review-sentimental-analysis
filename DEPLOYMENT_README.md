# Product Review Sentiment Analysis - Deployment Guide

## 🎉 Successfully Deployed to GitHub!

Your complete Product Review Sentiment Analysis application has been successfully uploaded to:
**https://github.com/perumalloganathan007-tech/product-review-sentimental-analysis**

## 📋 What Was Deployed

### Complete Application Stack
- ✅ **Node.js Server** (`mock-server.js`) - Main application server with web scraping capabilities
- ✅ **Scala/Play Framework** - Full MVC architecture with controllers, services, and models
- ✅ **Database Scripts** - PostgreSQL setup and prescription data cleanup scripts
- ✅ **Web Scraping Components** - Amazon and Flipkart product scrapers
- ✅ **Sentiment Analysis Tools** - NLP processing and analysis capabilities
- ✅ **CSV Dataset Management** - Upload, process, and analyze product datasets
- ✅ **Visualization Components** - Charts and graphs for data analysis
- ✅ **Testing Tools** - Comprehensive testing suite for all functionalities

### Key Features Included
1. **Multi-Platform Support**: Amazon, Flipkart web scraping
2. **Sentiment Analysis**: Real-time review sentiment processing
3. **Database Integration**: Complete PostgreSQL database setup
4. **Data Visualization**: Interactive charts and reports
5. **CSV Processing**: Dataset upload and analysis capabilities
6. **Product Comparison**: Multi-product sentiment comparison
7. **Prescription Data Management**: Database cleanup and maintenance tools

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/perumalloganathan007-tech/product-review-sentimental-analysis.git
cd product-review-sentimental-analysis
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Scala dependencies (if using Scala components)
sbt update
```

### 3. Database Setup
```sql
-- Use the provided SQL scripts
psql -f setup_database.sql
psql -f schema.sql
```

### 4. Run the Application
```bash
# Start the Node.js server
node mock-server.js
# Server will be available at http://localhost:9000

# Or use the batch file
start-server.bat
```

## 📁 Project Structure

```
├── mock-server.js                 # Main Node.js server
├── app/                          # Scala Play Framework components
│   ├── controllers/              # MVC controllers
│   ├── services/                 # Business logic services
│   ├── models/                   # Data models
│   └── views/                    # HTML templates
├── conf/                         # Configuration files
├── public/                       # Static assets
├── assets/                       # JavaScript and CSS
├── docs/                         # Documentation
├── *.sql                         # Database scripts
├── *.csv                         # Sample datasets
├── *.html                        # Test and demo pages
└── README.md                     # Project documentation
```

## 🔧 Configuration

### Database Configuration
Update your database settings in:
- `conf/application.conf` (for Scala components)
- Environment variables or config files for Node.js components

### Server Configuration
- Default port: `9000`
- Web scraping enabled for Amazon and Flipkart
- File upload support for CSV datasets

## 🎯 Usage Examples

### 1. Analyze Product Reviews
```javascript
// POST to /analyze-reviews
{
  "product_url": "https://amazon.com/product-link",
  "analysis_type": "sentiment"
}
```

### 2. Upload CSV Dataset
```javascript
// POST to /upload-csv
// Upload CSV file with review data
```

### 3. Compare Products
```javascript
// POST to /compare-products
{
  "products": [
    {"name": "Product A", "url": "..."},
    {"name": "Product B", "url": "..."}
  ]
}
```

## 🛠 Development Tools Included

- **Testing Pages**: Various HTML test files for different functionalities
- **Database Scripts**: Complete setup and maintenance SQL scripts
- **Batch Files**: Windows batch scripts for easy startup
- **Documentation**: Comprehensive markdown documentation files

## 📊 Database Management

### Prescription Data Cleanup
The project includes scripts to remove prescription/medical data:
```sql
-- Use these scripts to clean up prescription data
source remove_prescription_data.sql
source direct_prescription_removal.sql
```

### Database Reset
```sql
-- Complete database reset if needed
source reset_database_complete.sql
```

## 🔍 Monitoring and Logs

The application includes comprehensive logging for:
- Web scraping activities
- Sentiment analysis processing
- Database operations
- API requests and responses

## 🚨 Important Notes

1. **Environment Setup**: Ensure all dependencies are installed
2. **Database Connection**: Configure your PostgreSQL connection properly
3. **Web Scraping**: Respect robots.txt and rate limiting
4. **Data Privacy**: Handle user data according to privacy regulations
5. **Performance**: Monitor resource usage during large dataset processing

## 📞 Support

For issues or questions:
1. Check the comprehensive documentation in the `docs/` folder
2. Review the error logs in the application
3. Use the provided test files to verify functionality
4. Check the GitHub Issues section

## 🎊 Conclusion

Your complete sentiment analysis application is now deployed and ready for use! The repository contains everything needed to run a comprehensive product review analysis system with web scraping, sentiment analysis, and data visualization capabilities.

Happy analyzing! 🚀