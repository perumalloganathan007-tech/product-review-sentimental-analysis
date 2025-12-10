# Quick Fix Guide - Rating & Price Scraping Issues

## 🔧 Common Issues & Quick Fixes

### Issue 1: Price Shows "Not Found"

**Quick Fix:**
1. Open browser DevTools (F12) on the product page
2. Find the price element and check its class name
3. Add the new selector to `webscraper.js`:

```javascript
// In scrapeFlipkart or scrapeAmazon function
const priceSelectors = [
    'div.YourNewClassName',  // Add this line
    // ... existing selectors
];
```

### Issue 2: Rating Shows "Not Found"

**Quick Fix:**
1. Inspect the rating element on the product page
2. Add new selector to rating array:

```javascript
const ratingSelectors = [
    'span.YourNewRatingClass',  // Add this line
    // ... existing selectors
];
```

### Issue 3: Database Error - Column Not Found

**Quick Fix:**
Run the migration script:
```bash
cd "d:\project zip flies\scala project\scala project"
psql -U postgres -d sentiment_analysis -f add_product_price_rating_columns.sql
```

Or manually add columns:
```sql
ALTER TABLE products ADD COLUMN price VARCHAR(100);
ALTER TABLE products ADD COLUMN rating DOUBLE PRECISION;
ALTER TABLE products ADD COLUMN review_count INTEGER;
```

### Issue 4: Data Not Displaying in UI

**Check:**
1. Verify data in database:
```sql
SELECT name, price, rating FROM products ORDER BY id DESC LIMIT 5;
```

2. If NULL, scraping failed - check console logs
3. If populated, check frontend display code

## 🎯 Testing Checklist

- [ ] Run database migration
- [ ] Restart sbt server: `sbt clean compile run`
- [ ] Test Amazon URL
- [ ] Test Flipkart URL
- [ ] Verify price displays
- [ ] Verify rating displays
- [ ] Check database has data

## 📊 Selector Patterns to Look For

### Flipkart:
- **Price**: Usually in `<div>` with class containing "Nx9bqj" or "price"
- **Rating**: Usually in `<div>` with class containing "XQDdHH" or "rating"
- **Pattern**: `div.ClassName` or `span.ClassName`

### Amazon:
- **Price**: Look for `<span class="a-price-whole">` or `.a-offscreen`
- **Rating**: Look for `<i class="a-icon-star">` or `[data-hook="rating"]`
- **Pattern**: Often nested: `.a-price .a-offscreen`

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd "d:\project zip flies\scala project\scala project"

# Apply database changes
psql -U postgres -d sentiment_analysis -f add_product_price_rating_columns.sql

# Clean and run
sbt clean compile run

# Open test page
# http://localhost:9000/test-price-rating-scraping.html
```

## 💡 Pro Tips

1. **Always test with REAL product URLs** - Mock data won't show issues
2. **Check BOTH Amazon.in and Flipkart.com** - Different HTML structures
3. **Use browser console** to test selectors: `document.querySelector('selector')`
4. **Add multiple selectors** - Sites change frequently, fallbacks are essential
5. **Log everything** - Console logs help debug selector failures

## 🐛 Debug Commands

```javascript
// Test in browser console on product page
console.log(document.querySelector('div.XQDdHH')?.textContent); // Flipkart rating
console.log(document.querySelector('div.Nx9bqj')?.textContent); // Flipkart price
console.log(document.querySelector('.a-icon-alt')?.textContent); // Amazon rating
console.log(document.querySelector('.a-price-whole')?.textContent); // Amazon price
```

## ✅ Validation

Successful scraping should show in logs:
```
✓ Found price with selector: div.Nx9bqj = ₹12,999
✓ Found rating with selector: div.XQDdHH = 4.3
✓ Found Amazon rating: 4.5 using selector: .a-icon-star .a-icon-alt
```

If you see "NOT FOUND", selector needs updating!

---
**Need Help?** Check `PRICE_RATING_FIX.md` for detailed documentation.
