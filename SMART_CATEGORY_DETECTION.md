# Smart Product Category Detection System

## Overview

The intelligent classification system now **automatically detects the product category** and applies appropriate classification criteria. No more seeing "Best for Camera Quality" when analyzing perfumes!

## How It Works

### 1. Category Detection

The system analyzes all product names and descriptions to identify the product type:

```javascript
Product Categories Detected:
├── Electronics
│   ├── Phone (smartphone, mobile, iPhone, Android)
│   ├── Laptop (notebook, MacBook, Chromebook)
│   ├── Tablet (iPad, Galaxy Tab)
│   ├── Watch (smartwatch, Apple Watch, fitness band)
│   ├── Headphones (earbuds, AirPods, TWS)
│   ├── Camera (DSLR, mirrorless, GoPro)
│   └── TV (smart TV, LED, OLED)
├── Beauty & Personal Care
│   ├── Perfume (fragrance, cologne, eau de parfum)
│   └── Beauty (cream, lotion, serum, makeup)
├── Fashion (clothing, shoes, jeans, dress)
├── Appliances (refrigerator, washing machine, AC)
└── Generic (fallback for unknown categories)
```

### 2. Category-Specific Classifications

Each product category gets **relevant** classification categories:

#### 📱 Phone Products
- **Best for Camera Quality** - Analyzes camera mentions, MP, photo quality
- **Best for Performance** - Evaluates processor, RAM, speed
- **Best for Battery Life** - Reviews battery capacity, charging, backup
- **Best Value for Money** - Price-to-performance ratio
- **Highest User Satisfaction** - Combined rating + sentiment
- **Premium Choice** - High-end features and price

#### 🌺 Perfume Products
- **Best for Long-Lasting Fragrance** - Analyzes longevity, lasting hours
- **Best for Scent Quality** - Evaluates fragrance notes, pleasantness
- **Most Versatile (Day/Night)** - Suitable for various occasions
- **Best Value for Money** - Price-to-quality ratio
- **Highest User Satisfaction** - Combined rating + sentiment
- **Premium Choice** - Luxury fragrances

#### 💻 Laptop Products
- **Best for Performance** - Processor, RAM, SSD, graphics
- **Most Portable** - Weight, thinness, compact design
- **Best for Battery Life** - Battery hours, backup
- **Best Value for Money** - Price-to-performance ratio
- **Highest User Satisfaction** - Combined rating + sentiment
- **Premium Choice** - High-end specifications

#### ⌚ Watch Products
- **Best for Features** - Smart functions, fitness tracking
- **Best for Battery Life** - Days of usage, charging
- **Best Design** - Appearance, elegance, style
- **Best Value for Money** - Price-to-features ratio
- **Highest User Satisfaction** - Combined rating + sentiment
- **Premium Choice** - Premium materials and features

#### 🎧 Headphone Products
- **Best for Sound Quality** - Audio clarity, bass, treble
- **Best Noise Cancellation** - ANC effectiveness
- **Best for Battery Life** - Playtime hours
- **Best Value for Money** - Price-to-quality ratio
- **Highest User Satisfaction** - Combined rating + sentiment
- **Premium Choice** - Audiophile-grade quality

#### 🏷️ Generic Products
- **Best Overall Quality** - General quality mentions
- **Most Durable** - Durability, reliability
- **Best Features** - Functionality and capabilities
- **Best Value for Money** - Price-to-quality ratio
- **Highest User Satisfaction** - Combined rating + sentiment
- **Premium Choice** - Top-tier products

## Scoring Algorithms

### Feature-Based Scoring

For specific features (camera, performance, sound, scent, etc.):

```
Score = Rating × (1 + Keyword_Count × 0.5) × log₁₀(Reviews + 1)
```

**Example - Perfume Longevity:**
- Product A: 4.5★, 100 reviews, 15 mentions of "long lasting"
- Score = 4.5 × (1 + 15 × 0.5) × log₁₀(101)
- Score = 4.5 × 8.5 × 2.004 = **76.65**

### Universal Scoring

**Value for Money:**
```
Score = Rating / log₁₀(Price) × log₁₀(Reviews + 1)
```

**User Satisfaction:**
```
Score = Rating × Positive_Sentiment% × log₁₀(Reviews + 1) / 100
```

**Premium Choice:**
```
Score = Price × Rating × log₁₀(Reviews + 1)
```

## UI Adaptations

The frontend dynamically adjusts icons and colors based on category:

### Perfume Category Icons
- 🕐 **Longevity** - Clock icon (primary blue)
- 🎨 **Scent Quality** - Spray-can icon (warning orange)
- ⭐ **Versatility** - Star icon (success green)
- 🏷️ **Value for Money** - Tag icon (info cyan)
- ❤️ **User Satisfaction** - Heart icon (danger red)
- 👑 **Premium Choice** - Crown icon (dark)

### Phone Category Icons
- 📷 **Camera Quality** - Camera icon (primary blue)
- ⚡ **Performance** - Bolt icon (warning orange)
- 🔋 **Battery Life** - Battery icon (success green)

## Benefits

### ✅ Contextually Relevant
- Phone users see camera, battery, performance
- Perfume users see longevity, scent quality, versatility
- No irrelevant categories displayed

### ✅ Smart Keyword Detection
Each category has specific keywords:
- **Perfume Longevity**: "long lasting", "hours", "all day", "stays"
- **Phone Camera**: "camera", "MP", "photo", "picture", "lens"
- **Laptop Performance**: "processor", "RAM", "SSD", "graphics"

### ✅ Accurate Explanations
Winner explanations are customized per category:

**Perfume Longevity Example:**
> "BEARDO Godfather Perfume offers exceptional long-lasting fragrance with 4.1★ rating. Users praise how the scent stays strong throughout the day, making it perfect for all-day wear."

**Phone Camera Example:**
> "Samsung Galaxy S23 excels in camera capabilities with 4.5★ rating. Customer reviews consistently praise its photo and video quality, making it ideal for photography enthusiasts."

## Example Detection

### Input: Perfume Products
```
- BEARDO Godfather Perfume
- DENVER Hamilton EDP
- MUUCHSTAC Long Lasting Perfume
```

**Detected Category:** `perfume`

**Applied Classifications:**
1. Best for Long-Lasting Fragrance
2. Best for Scent Quality
3. Most Versatile (Day/Night)
4. Best Value for Money
5. Highest User Satisfaction
6. Premium Choice

### Input: Phone Products
```
- Samsung Galaxy S23
- iPhone 15 Pro
- OnePlus 12
```

**Detected Category:** `phone`

**Applied Classifications:**
1. Best for Camera Quality
2. Best for Performance
3. Best for Battery Life
4. Best Value for Money
5. Highest User Satisfaction
6. Premium Choice

## Technical Implementation

### Detection Function
```javascript
function detectProductCategory(products) {
  // Analyze all product names and descriptions
  const allText = products.map(p => {
    const name = (p.productName || p.title || '').toLowerCase();
    const desc = (p.additionalData?.description || '').toLowerCase();
    return name + ' ' + desc;
  }).join(' ');

  // Count keyword matches for each category
  // Return category with most matches
}
```

### Classification Function
```javascript
function getClassificationsForCategory(category) {
  // Return appropriate classification template
  // Each category has 6 relevant classifications
}
```

### Scoring Function
```javascript
function calculateCategoryScores(text, rating, reviews, price, positiveRate, category) {
  // Get category-specific keywords
  // Calculate scores using keyword detection
  // Return scores for all classifications
}
```

## Testing

1. **Test with Perfumes:**
   - Upload CSV with perfume URLs
   - Should see: Longevity, Scent Quality, Versatility

2. **Test with Phones:**
   - Upload CSV with phone URLs
   - Should see: Camera, Performance, Battery

3. **Test with Mixed Products:**
   - System detects dominant category
   - Applies most relevant classifications

## Supported Categories (v9.0)

✅ Phone  
✅ Laptop  
✅ Tablet  
✅ **Perfume** (NEW)  
✅ Watch  
✅ Headphones  
✅ Camera  
✅ TV  
✅ Appliances  
✅ Fashion  
✅ Beauty Products  
✅ Generic (fallback)  

## Future Enhancements

- Multi-category detection (e.g., "phone with good camera" + "phone for gaming")
- User preference for classification types
- Custom classification creation
- Category confidence scoring

---

**Version:** 9.0  
**Last Updated:** October 17, 2025  
**Feature:** Smart Product Category Detection with Dynamic Classifications
