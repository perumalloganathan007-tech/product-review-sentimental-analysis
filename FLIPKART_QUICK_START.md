# 🚀 Flipkart Scraper Training - Quick Start

## ⚡ 3-Minute Setup

### Step 1: Start the Server
```bash
cd "d:\project zip flies\scala project\scala project"
.\start-server.bat
```

Wait for: `Server started` message

### Step 2: Open Training Interface
Open in browser: **`train-flipkart-scraper.html`**

Or navigate to: `http://localhost:9000/train-flipkart-scraper.html`

### Step 3: Test Scraping
1. Enter a Flipkart product URL
2. Click **"Train & Test Scraping"**
3. View results!

## 📱 Sample Test URLs

### Mobiles (High Success Rate)
```
https://www.flipkart.com/samsung-galaxy-m34-5g/p/...
https://www.flipkart.com/apple-iphone-13/p/...
```

### Electronics
```
https://www.flipkart.com/hp-laptop/p/...
https://www.flipkart.com/sony-tv/p/...
```

### Fashion
```
https://www.flipkart.com/puma-tshirt/p/...
https://www.flipkart.com/levis-jeans/p/...
```

## 📊 What You'll See

### ✅ Success (90-100% Quality)
```
✓ Product: Samsung Galaxy M34 5G
✓ Price: ₹16,999
✓ Rating: 4.3/5
✓ Reviews: 12,567
✓ Excellent data quality: 100%
```

### ⚠️ Partial Success (50-89% Quality)
```
✓ Product: Product Name
✓ Price: ₹9,999
✗ Rating: Not found
✗ Reviews: Not found
⚠ Moderate data quality: 60%
```

### ❌ Failure
```
✗ Training failed: Connection error
Suggestion: Check if backend server is running on port 9000
```

## 🔧 Quick Fixes

### Problem: "Connection Error"
**Fix:** Start the server first
```bash
cd "d:\project zip flies\scala project\scala project"
.\start-server.bat
```

### Problem: "Rating/Price Not Found"
**Fix:** Update selectors in `webscraper.js`
1. Open Flipkart product page
2. Right-click on price/rating → Inspect
3. Copy the class name
4. Add to selector array in webscraper.js

### Problem: "Low Success Rate"
**Fix:** 
1. Test with different products
2. Check training logs for patterns
3. Update selectors for failing categories

## 🎯 Training Modes

### 1. Single URL Test
- Quick validation
- Test specific products
- Debug selector issues

### 2. Batch Training
- Test multiple URLs
- Measure success rate
- Category-specific testing

### 3. Selector Testing
- Test all selectors
- Identify working ones
- Find broken patterns

## 📈 Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Success Rate | >95% | ✅ |
| Data Quality | >90% | ✅ |
| Response Time | <3s | ✅ |

## 🔍 Training Checklist

- [ ] Server running on port 9000
- [ ] Training interface loaded
- [ ] Test with 3-5 different URLs
- [ ] Success rate >90%
- [ ] All critical data extracted
- [ ] Logs show no errors

## 💡 Pro Tips

1. **Test diverse products** - Different categories, prices, brands
2. **Monitor console logs** - Shows which selectors work
3. **Update regularly** - Flipkart changes HTML frequently
4. **Track metrics** - Keep success rate >90%

## 📚 Learn More

- Full Guide: `FLIPKART_TRAINING_GUIDE.md`
- API Docs: See routes in `conf/routes`
- Batch Script: `flipkart-batch-trainer.js`

## 🆘 Need Help?

1. Check training logs first
2. Test with different URLs
3. Verify selectors in DevTools
4. Restart server if issues persist

---

**Ready to train?** Open `train-flipkart-scraper.html` and start! 🚀

**Status:** ✅ Ready  
**Updated:** December 9, 2024
