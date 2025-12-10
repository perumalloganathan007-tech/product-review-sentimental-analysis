# Flipkart Web Scraping Training Guide

## Quick Start

### 1. Open Training Interface
```bash
# Navigate to the project directory
cd "d:\project zip flies\scala project\scala project"

# Start the server if not running
.\start-server.bat

# Open the training interface in your browser
# File location: train-flipkart-scraper.html
```

### 2. Access the Training Page
Open `train-flipkart-scraper.html` in your browser or navigate to:
```
http://localhost:9000/train-flipkart-scraper.html
```

## Training Features

### 🎯 Main Training Interface

#### 1. **Single URL Training**
- Enter any Flipkart product URL
- Click "Train & Test Scraping"
- View detailed results and logs
- See which selectors worked

#### 2. **Selector Testing**
- Click "Test All Selectors"
- See which CSS selectors are working
- Identify failing selectors
- Get recommendations for updates

#### 3. **Quick Test**
- Click "Quick Test (Mock Data)"
- Verify interface without actual scraping
- Test display components
- Check data quality calculation

### 📊 What Gets Tested

#### Product Information
- ✅ Product Name
- ✅ Current Price
- ✅ Original/MRP Price
- ✅ Discount Percentage
- ✅ Product Rating (0-5)
- ✅ Review Count

#### Data Quality Metrics
- **Excellent**: 80-100% (All fields extracted)
- **Good**: 60-79% (Most fields extracted)
- **Moderate**: 40-59% (Some fields missing)
- **Poor**: 0-39% (Critical fields missing)

### 🔧 Current Selectors (2024)

#### Product Name Selectors
```javascript
'span.VU-ZEz',        // Latest 2024 format ⭐
'span.B_NuCI',        // Common format
'h1.yhB1nd',          // H1 variant
'h1 span',            // Generic H1 span
'h1._6EBuvT span'     // Alternative layout
```

#### Price Selectors
```javascript
'div.Nx9bqj.CxhGGd',    // Latest with both classes ⭐
'div.Nx9bqj',           // Direct class (most common) ⭐
'div.hl05eU div.Nx9bqj', // Price in container
'span.Nx9bqj',          // Span variant
'div._30jeq3._16Jk6d'   // Older format
```

#### Rating Selectors
```javascript
'div.XQDdHH',            // Latest 2024 format ⭐
'span.XQDdHH',           // Span variant ⭐
'div.XQDdHH.Ga3i8K',     // With combo class
'div._3LWZlK',           // Old format
'span._1lRcqv'           // Alternative
```

#### Review Count Selectors
```javascript
'span.Wphh3N',           // Latest format ⭐
'span._2_R_DZ span',     // Nested span
'span._13vcmD'           // Alternative
```

⭐ = Most reliable selectors (as of Dec 2024)

## Training Workflow

### Step-by-Step Training Process

#### 1. **Prepare Test URLs**
Collect Flipkart product URLs from different categories:
- 📱 **Mobiles**: `/mobile/samsung-galaxy/p/itm...`
- 👕 **Fashion**: `/t-shirt/product-name/p/itm...`
- 💻 **Electronics**: `/laptop/product-name/p/itm...`
- 🏠 **Home**: `/furniture/product-name/p/itm...`
- 📚 **Books**: `/book/product-name/p/itm...`

#### 2. **Run Training Sessions**
```
For each URL:
1. Paste URL into training interface
2. Click "Train & Test Scraping"
3. Review extracted data
4. Check data quality score
5. Note any missing fields
6. Review console logs for selector status
```

#### 3. **Analyze Results**
- **Green logs** ✅ = Successful extraction
- **Red logs** ❌ = Failed extraction
- **Yellow logs** ⚠️ = Partial success

#### 4. **Update Selectors (If Needed)**
If data extraction fails:
1. Open browser DevTools (F12)
2. Navigate to the Flipkart product page
3. Right-click on price/rating element
4. Select "Inspect"
5. Note the class names
6. Update selectors in `webscraper.js`

### Example Training Session

```
[10:30:15] ℹ Starting Flipkart Scraper Training
[10:30:15] ℹ URL: https://www.flipkart.com/samsung-galaxy-m34/p/...
[10:30:16] ℹ Sending request to scraping service...
[10:30:18] ✓ Scraping completed successfully!
[10:30:18] ─────────────────────────────────────
[10:30:18] ✓ Product: Samsung Galaxy M34 5G
[10:30:18] ✓ Price: ₹16,999
[10:30:18] ℹ Original Price: ₹24,999
[10:30:18] ℹ Discount: 32% off
[10:30:18] ✓ Rating: 4.3
[10:30:18] ✓ Reviews: 12,567
[10:30:18] ✓ Excellent data quality: 100%
```

## API Endpoints

### 1. Scrape Single Product
```http
POST /api/scrape-flipkart
Content-Type: application/json

{
  "url": "https://www.flipkart.com/product-name/p/itmXXXXXXXXX"
}
```

**Response:**
```json
{
  "productName": "Samsung Galaxy M34 5G",
  "price": "₹16,999",
  "originalPrice": "₹24,999",
  "discount": "32% off",
  "rating": 4.3,
  "reviewCount": 12567,
  "reviewsFound": 25,
  "selectors": {
    "productName": "span.VU-ZEz",
    "price": "div.Nx9bqj",
    "rating": "div.XQDdHH"
  },
  "dataQuality": 100
}
```

### 2. Test Selectors
```http
POST /api/test-selectors
Content-Type: application/json

{
  "url": "https://www.flipkart.com/product-name/p/itmXXXXXXXXX",
  "type": "all"
}
```

### 3. Batch Training
```http
POST /api/batch-train
Content-Type: application/json

{
  "urls": [
    "https://www.flipkart.com/product1/p/itm1",
    "https://www.flipkart.com/product2/p/itm2",
    "https://www.flipkart.com/product3/p/itm3"
  ]
}
```

### 4. Get Statistics
```http
GET /api/scraper/stats
```

**Response:**
```json
{
  "version": "1.0.0",
  "supportedPlatforms": ["flipkart", "amazon", "myntra"],
  "selectors": {
    "flipkart": {
      "productName": 6,
      "price": 5,
      "rating": 5,
      "reviewCount": 3
    }
  },
  "lastUpdated": "2024-12-09",
  "status": "operational"
}
```

## Troubleshooting

### Problem: Price Not Found
**Solutions:**
1. Check if product page loaded properly
2. Verify price element class in DevTools
3. Update price selectors in `webscraper.js`
4. Check for dynamic loading (wait longer)

### Problem: Rating Not Found
**Solutions:**
1. Verify rating is visible on page
2. Check rating element class names
3. Update rating selectors
4. Some products may not have ratings yet

### Problem: Low Success Rate
**Solutions:**
1. Test with different product categories
2. Update selectors for each category
3. Increase page load wait time
4. Check internet connection

### Problem: CORS Errors
**Solutions:**
1. Use backend scraping (not browser-based)
2. Ensure server is running on port 9000
3. Check browser console for errors

## Maintenance

### Weekly Tasks
- ✅ Test 5-10 random Flipkart URLs
- ✅ Check success rate (should be >90%)
- ✅ Review failed extractions
- ✅ Update documentation

### Monthly Tasks
- 🔍 Inspect Flipkart HTML changes
- 🔧 Update selectors if needed
- 📊 Analyze extraction patterns
- 📝 Document new selector formats

### When Selectors Break
1. **Detect**: Success rate drops below 80%
2. **Investigate**: Check recent Flipkart updates
3. **Find**: New class names in HTML
4. **Update**: Add new selectors to arrays
5. **Test**: Verify with multiple URLs
6. **Deploy**: Push updates
7. **Monitor**: Track success rate

## Performance Metrics

### Target Metrics
- ✅ **Success Rate**: >95%
- ✅ **Response Time**: <3 seconds
- ✅ **Data Quality**: >90%
- ✅ **Uptime**: 99%+

### Tracking
Monitor these in training interface:
- Total tests run
- Successful extractions
- Failed extractions
- Average data quality
- Most reliable selectors

## Advanced Training

### Batch Training Script
```javascript
// Test multiple URLs automatically
const urls = [
  'https://www.flipkart.com/product1/p/itm1',
  'https://www.flipkart.com/product2/p/itm2',
  'https://www.flipkart.com/product3/p/itm3'
];

async function batchTrain() {
  for (const url of urls) {
    document.getElementById('flipkartUrl').value = url;
    await trainScraper();
    await new Promise(r => setTimeout(r, 5000)); // Wait 5s between tests
  }
}
```

### Selector Performance Tracking
Keep a log of selector success rates:
```
Selector: div.Nx9bqj
  - Success: 95%
  - Last worked: 2024-12-09
  - Category: Price
  - Priority: High
```

## Tips for Success

### 1. Test Diverse Products
- Different price ranges
- Various categories
- New vs popular products
- Products with/without discounts

### 2. Monitor Logs Carefully
- Green = Good
- Yellow = Warning
- Red = Fix needed

### 3. Keep Selectors Updated
- Add new selectors, don't remove old ones
- Maintain priority order (newest first)
- Document changes with dates

### 4. Validate Data
- Price format: ₹XX,XXX
- Rating range: 0-5
- Review counts: positive integers
- Product names: non-empty strings

## Support & Resources

### Files to Know
- `train-flipkart-scraper.html` - Training interface
- `webscraper.js` - Scraping logic
- `FlipkartScraperController.scala` - Backend API
- `conf/routes` - API routes

### Getting Help
1. Check training logs first
2. Test with different URLs
3. Verify selectors in DevTools
4. Update selectors if needed
5. Restart server if issues persist

---

**Status**: ✅ Ready for Training  
**Last Updated**: December 9, 2024  
**Next Review**: January 9, 2025

Happy Training! 🚀
