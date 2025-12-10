// ============================================
// DATASET PRODUCT ANALYSIS FUNCTIONS
// ============================================

let currentDatasetData = null;

// Analyze dataset products
async function analyzeDatasetProducts() {
    const fileInput = document.getElementById('datasetProductFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a CSV file to analyze');
        return;
    }

    if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file');
        return;
    }

    console.log('📊 Starting dataset analysis:', file.name);
    showLoading('Analyzing Dataset...', 'Processing product data and generating insights');

    try {
        // Read and parse CSV file
        const csvText = await file.text();
        const parsedData = parseCSV(csvText);

        if (!parsedData || parsedData.length === 0) {
            throw new Error('No data found in CSV file');
        }

        console.log(`✅ Parsed ${parsedData.length} products from CSV`);

        // 🔍 Intelligent column detection - find equivalent columns
        const normalizedData = normalizeDataColumns(parsedData);

        if (!normalizedData) {
            throw new Error('Could not identify required columns. Please ensure your CSV has columns for: product name, category, rating, and review count');
        }

        console.log('✅ Successfully identified and normalized columns');

        // Process and analyze data
        currentDatasetData = processDatasetData(normalizedData);

        hideLoading();

        // 🚀 Open results in a new page
        openDatasetResultsInNewPage(currentDatasetData, file.name);

    } catch (error) {
        hideLoading();
        console.error('❌ Dataset analysis error:', error);
        alert(`Error analyzing dataset:\n\n${error.message}\n\nPlease check your CSV file format.`);
    }
}

// 🚀 Open dataset results in a new page
function openDatasetResultsInNewPage(data, fileName) {
    // Store data in sessionStorage to pass to new page
    sessionStorage.setItem('datasetAnalysisResults', JSON.stringify(data));
    sessionStorage.setItem('datasetFileName', fileName);

    // Open new page
    window.open('dataset-results.html', '_blank');
}

// Parse CSV text to array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Get headers from first line
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine).map(h => h.trim().replace(/['"]/g, ''));

    console.log('📋 CSV Headers detected:', headers);

    // Parse data rows
    const data = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }

        // End of line
        if (!inQuotes) {
            currentRow.push(currentField.trim());

            // If we have a complete row, add it
            if (currentRow.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = currentRow[index].replace(/^["']|["']$/g, '');
                });
                data.push(row);
            }

            // Reset for next row
            currentRow = [];
            currentField = '';
        } else {
            // Multi-line field continues
            currentField += ' ';
        }
    }

    console.log(`✅ Parsed ${data.length} rows from CSV`);
    return data;
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);

    return values;
}

// 🔍 Intelligent Column Detection - Automatically find equivalent column names
function normalizeDataColumns(data) {
    if (!data || data.length === 0) return null;

    const firstRow = data[0];
    const headers = Object.keys(firstRow);

    console.log('🔍 Detecting columns from headers:', headers);

    // Define possible column name variations
    const columnMappings = {
        product_name: [
            'product_name', 'product name', 'productname', 'name', 'product',
            'title', 'product_title', 'item_name', 'item', 'prod_name'
        ],
        category: [
            'category', 'categories', 'product_category', 'category_name',
            'type', 'product_type', 'class', 'classification', 'group'
        ],
        rating: [
            'rating', 'ratings', 'rate', 'score', 'avg_rating', 'average_rating',
            'product_rating', 'user_rating', 'stars', 'star_rating'
        ],
        reviews_count: [
            'reviews_count', 'review_count', 'reviews', 'review', 'num_reviews',
            'number_of_reviews', 'total_reviews', 'review_cnt', 'count', 'numberofreviews'
        ],
        price: [
            'price', 'cost', 'amount', 'product_price', 'selling_price',
            'final_price', 'mrp', 'retail_price', 'productprice'
        ],
        brand: [
            'brand', 'brand_name', 'manufacturer', 'make', 'company', 'vendor'
        ],
        sentiment_score: [
            'sentiment_score', 'sentiment', 'sentiment_analysis', 'overall_sentiment',
            'sentiment_rating', 'positive_score'
        ],
        positive_reviews: [
            'positive_reviews', 'positive', 'pos_reviews', 'positive_count',
            'thumbs_up', 'likes'
        ],
        negative_reviews: [
            'negative_reviews', 'negative', 'neg_reviews', 'negative_count',
            'thumbs_down', 'dislikes'
        ]
    };

    // Detect which columns exist in the data
    const detectedColumns = {};

    for (const [standardName, variations] of Object.entries(columnMappings)) {
        let found = false;

        for (const header of headers) {
            const normalizedHeader = header.toLowerCase().trim().replace(/[_\s-]/g, '');

            for (const variation of variations) {
                const normalizedVariation = variation.toLowerCase().replace(/[_\s-]/g, '');

                if (normalizedHeader === normalizedVariation) {
                    detectedColumns[standardName] = header;
                    console.log(`✅ Mapped "${header}" → ${standardName}`);
                    found = true;
                    break;
                }
            }

            if (found) break;
        }

        if (!found && ['product_name', 'category', 'rating', 'reviews_count'].includes(standardName)) {
            console.warn(`⚠️ Could not find column for: ${standardName}`);
        }
    }

    // Validate that we found all required columns
    const requiredColumns = ['product_name', 'rating', 'reviews_count'];
    const missingRequired = requiredColumns.filter(col => !detectedColumns[col]);

    if (missingRequired.length > 0) {
        console.error('❌ Missing required columns:', missingRequired);
        console.log('Available headers:', headers);

        // Provide helpful suggestions
        const suggestions = missingRequired.map(col => {
            return `  • ${col}: Try one of these names - ${columnMappings[col].slice(0, 5).join(', ')}`;
        }).join('\n');

        throw new Error(
            `Could not identify the following required columns:\n${missingRequired.join(', ')}\n\n` +
            `Suggestions:\n${suggestions}\n\n` +
            `Your CSV headers: ${headers.join(', ')}`
        );
    }

    // Normalize all data rows to use standard column names
    const normalizedData = data.map(row => {
        const normalizedRow = {};

        for (const [standardName, originalHeader] of Object.entries(detectedColumns)) {
            let value = row[originalHeader];

            // Clean and normalize specific fields
            if (standardName === 'rating') {
                value = cleanRatingValue(value);
            } else if (standardName === 'reviews_count') {
                value = cleanReviewCountValue(value);
            } else if (standardName === 'price') {
                value = cleanPriceValue(value);
            }

            normalizedRow[standardName] = value;
        }

        // If category is missing, infer from product name
        if (!normalizedRow.category && normalizedRow.product_name) {
            normalizedRow.category = inferCategory(normalizedRow.product_name);
        }

        return normalizedRow;
    });

    console.log('✅ Column detection complete:', detectedColumns);
    return normalizedData;
}

// Clean rating values (handle formats like "★ 5.0", "5.0★", multi-line ratings)
function cleanRatingValue(value) {
    if (!value) return '0';

    // Convert to string and remove whitespace/newlines
    let cleaned = String(value).replace(/[\n\r\t]/g, ' ').trim();

    // Remove star symbols and extra spaces
    cleaned = cleaned.replace(/[★⭐✰]/g, '').trim();

    // Extract numeric value (handle formats like "5.0" or "5")
    const match = cleaned.match(/\d+\.?\d*/);
    if (match) {
        return match[0];
    }

    return '0';
}

// Clean review count values (handle formats like "7 reviews", "92 reviews")
function cleanReviewCountValue(value) {
    if (!value) return '0';

    // Convert to string and remove whitespace
    let cleaned = String(value).replace(/[\n\r\t]/g, ' ').trim();

    // Extract numeric value (handle formats like "7 reviews", "1,234 reviews")
    const match = cleaned.match(/[\d,]+/);
    if (match) {
        return match[0].replace(/,/g, '');
    }

    return '0';
}

// Clean price values (handle formats like "₹ 3,999", "Sale price₹ 3,999")
function cleanPriceValue(value) {
    if (!value) return 'N/A';

    // Convert to string and remove whitespace/newlines
    let cleaned = String(value).replace(/[\n\r\t]/g, ' ').trim();

    // Remove currency symbols and text
    cleaned = cleaned.replace(/[₹$€£¥]/g, '')
                    .replace(/sale price/gi, '')
                    .replace(/price/gi, '')
                    .trim();

    // Extract numeric value
    const match = cleaned.match(/[\d,]+/);
    if (match) {
        return match[0].replace(/,/g, '');
    }

    return 'N/A';
}

// Infer category from product name (for datasets without explicit category)
function inferCategory(productName) {
    if (!productName) return 'Uncategorized';

    const nameLower = productName.toLowerCase();

    // Audio products
    if (nameLower.match(/earbuds?|headphone|headset|speaker|airpods?|earpods?/)) {
        return 'Audio Devices';
    }
    if (nameLower.match(/stone|grenade|bomb|blast|rocker/)) {
        return 'Bluetooth Speakers';
    }

    // Wearables
    if (nameLower.match(/watch|smartwatch|band|fitness/)) {
        return 'Wearables';
    }

    // Cables & Accessories
    if (nameLower.match(/cable|charger|adapter|cord/)) {
        return 'Cables & Chargers';
    }

    // Power banks
    if (nameLower.match(/power\s*bank|powerbank|battery/)) {
        return 'Power Banks';
    }

    // Cases & Covers
    if (nameLower.match(/case|cover|pouch/)) {
        return 'Cases & Accessories';
    }

    // Default category
    return 'Electronics';
}

// Process dataset data and calculate statistics with ML analysis
function processDatasetData(data) {
    const processed = {
        totalProducts: data.length,
        categories: {},
        topRated: [],
        mostReviewed: [],
        allProducts: [],
        mlInsights: {}  // Add ML insights
    };

    // Process each product
    data.forEach(product => {
        const productData = {
            name: product.product_name || product.name || 'Unknown',
            category: product.category || 'Uncategorized',
            rating: parseFloat(product.rating) || 0,
            reviewsCount: parseInt(product.reviews_count || product.reviews || 0),
            price: product.price || 'N/A',
            brand: product.brand || 'N/A',
            sentimentScore: parseFloat(product.sentiment_score || product.sentiment || 0),
            positiveReviews: parseInt(product.positive_reviews || 0),
            negativeReviews: parseInt(product.negative_reviews || 0)
        };

        // Calculate review ratio if not provided
        if (!productData.sentimentScore && productData.positiveReviews && productData.negativeReviews) {
            const total = productData.positiveReviews + productData.negativeReviews;
            productData.sentimentScore = total > 0 ? (productData.positiveReviews / total) * 100 : 0;
        }

        processed.allProducts.push(productData);

        // Group by category
        if (!processed.categories[productData.category]) {
            processed.categories[productData.category] = {
                name: productData.category,
                products: [],
                avgRating: 0,
                totalReviews: 0,
                productCount: 0
            };
        }
        processed.categories[productData.category].products.push(productData);
        processed.categories[productData.category].productCount++;
        processed.categories[productData.category].totalReviews += productData.reviewsCount;
    });

    // Calculate category averages
    Object.values(processed.categories).forEach(category => {
        const avgRating = category.products.reduce((sum, p) => sum + p.rating, 0) / category.products.length;
        category.avgRating = avgRating.toFixed(2);

        // Sort products by rating within category
        category.products.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.reviewsCount - a.reviewsCount;
        });

        category.bestProduct = category.products[0];
    });

    // Get top rated products (overall)
    processed.topRated = [...processed.allProducts]
        .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.reviewsCount - a.reviewsCount;
        })
        .slice(0, 10);

    // Get most reviewed products
    processed.mostReviewed = [...processed.allProducts]
        .sort((a, b) => b.reviewsCount - a.reviewsCount)
        .slice(0, 10);

    // ============================================
    // 🤖 ML-BASED ANALYSIS
    // ============================================
    processed.mlInsights = performMLAnalysis(processed);

    return processed;
}

// 🤖 ML-Based Analysis Function
function performMLAnalysis(data) {
    console.log('🤖 Starting ML-based analysis...');

    const insights = {
        clustering: performKMeansClustering(data.allProducts),
        anomalies: detectAnomalies(data.allProducts),
        trends: analyzeTrends(data.allProducts),
        predictions: generatePredictions(data.allProducts),
        correlations: calculateCorrelations(data.allProducts),
        recommendations: generateSmartRecommendations(data)
    };

    console.log('✅ ML analysis complete:', insights);
    return insights;
}

// K-Means Clustering Algorithm
function performKMeansClustering(products, k = 3) {
    // Extract features: rating and reviews_count
    const features = products.map(p => [p.rating, Math.log10(p.reviewsCount + 1)]);

    // Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * features.length);
        centroids.push([...features[randomIndex]]);
    }

    let clusters = [];
    let iterations = 0;
    const maxIterations = 50;

    // K-means iterations
    while (iterations < maxIterations) {
        // Assign products to nearest centroid
        clusters = Array(k).fill(null).map(() => []);

        features.forEach((feature, idx) => {
            let minDist = Infinity;
            let clusterIdx = 0;

            centroids.forEach((centroid, cIdx) => {
                const dist = euclideanDistance(feature, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    clusterIdx = cIdx;
                }
            });

            clusters[clusterIdx].push(idx);
        });

        // Update centroids
        let changed = false;
        centroids = centroids.map((centroid, cIdx) => {
            if (clusters[cIdx].length === 0) return centroid;

            const newCentroid = [
                clusters[cIdx].reduce((sum, idx) => sum + features[idx][0], 0) / clusters[cIdx].length,
                clusters[cIdx].reduce((sum, idx) => sum + features[idx][1], 0) / clusters[cIdx].length
            ];

            if (euclideanDistance(centroid, newCentroid) > 0.01) {
                changed = true;
            }

            return newCentroid;
        });

        if (!changed) break;
        iterations++;
    }

    // Label clusters
    const clusterLabels = ['Premium Products', 'Mid-Range Products', 'Budget Products'];
    const clusterResults = clusters.map((cluster, idx) => ({
        label: clusterLabels[idx] || `Cluster ${idx + 1}`,
        productCount: cluster.length,
        products: cluster.map(i => products[i]),
        avgRating: cluster.reduce((sum, i) => sum + products[i].rating, 0) / cluster.length,
        avgReviews: cluster.reduce((sum, i) => sum + products[i].reviewsCount, 0) / cluster.length
    })).sort((a, b) => b.avgRating - a.avgRating);

    return clusterResults;
}

// Anomaly Detection using Statistical Methods
function detectAnomalies(products) {
    // Filter out products with missing/zero data
    const validProducts = products.filter(p => p.rating > 0 && p.reviewsCount > 0);

    if (validProducts.length === 0) {
        return {
            count: 0,
            products: [],
            description: 'No valid products to analyze for anomalies'
        };
    }

    const ratings = validProducts.map(p => p.rating);
    const reviews = validProducts.map(p => p.reviewsCount);

    const ratingMean = mean(ratings);
    const ratingStd = standardDeviation(ratings);
    const reviewMean = mean(reviews);
    const reviewStd = standardDeviation(reviews);

    const anomalies = validProducts.filter(p => {
        const ratingZScore = Math.abs((p.rating - ratingMean) / ratingStd);
        const reviewZScore = Math.abs((p.reviewsCount - reviewMean) / reviewStd);
        return ratingZScore > 2.5 || reviewZScore > 2.5;
    }).map(p => {
        const ratingZScore = Math.abs((p.rating - ratingMean) / ratingStd);
        const reviewZScore = Math.abs((p.reviewsCount - reviewMean) / reviewStd);
        return {
            ...p,
            anomalyType: ratingZScore > 2.5 && reviewZScore > 2.5 ? 'Rating & Reviews' :
                        ratingZScore > 2.5 ? 'Unusual Rating' : 'Unusual Review Count'
        };
    });

    return {
        count: anomalies.length,
        products: anomalies.slice(0, 5),
        description: anomalies.length > 0
            ? `Found ${anomalies.length} outlier products with unusual rating or review patterns`
            : 'No significant anomalies detected'
    };
}

// Trend Analysis
function analyzeTrends(products) {
    const categoryTrends = {};

    products.forEach(p => {
        if (!categoryTrends[p.category]) {
            categoryTrends[p.category] = {
                avgRating: 0,
                avgReviews: 0,
                count: 0,
                totalSentiment: 0
            };
        }
        categoryTrends[p.category].avgRating += p.rating;
        categoryTrends[p.category].avgReviews += p.reviewsCount;
        categoryTrends[p.category].totalSentiment += p.sentimentScore || 0;
        categoryTrends[p.category].count++;
    });

    const trends = Object.entries(categoryTrends).map(([category, data]) => ({
        category,
        avgRating: (data.avgRating / data.count).toFixed(2),
        avgReviews: Math.round(data.avgReviews / data.count),
        avgSentiment: (data.totalSentiment / data.count).toFixed(1),
        productCount: data.count,
        trend: data.avgRating / data.count > 4.0 ? 'Rising' : data.avgRating / data.count > 3.5 ? 'Stable' : 'Declining'
    })).sort((a, b) => b.avgRating - a.avgRating);

    return trends;
}

// Predictive Analysis
function generatePredictions(products) {
    // Linear regression for rating prediction based on reviews
    const x = products.map(p => Math.log10(p.reviewsCount + 1));
    const y = products.map(p => p.rating);

    const { slope, intercept } = linearRegression(x, y);

    return {
        model: 'Linear Regression',
        equation: `Rating = ${slope.toFixed(4)} * log10(Reviews) + ${intercept.toFixed(4)}`,
        rSquared: calculateRSquared(x, y, slope, intercept),
        insight: slope > 0
            ? 'More reviews correlate with higher ratings'
            : 'Review count has minimal impact on ratings'
    };
}

// Correlation Analysis
function calculateCorrelations(products) {
    const ratingReviewCorr = pearsonCorrelation(
        products.map(p => p.rating),
        products.map(p => p.reviewsCount)
    );

    const ratingSentimentCorr = pearsonCorrelation(
        products.map(p => p.rating),
        products.map(p => p.sentimentScore || 0)
    );

    return {
        ratingVsReviews: ratingReviewCorr.toFixed(3),
        ratingVsSentiment: ratingSentimentCorr.toFixed(3),
        interpretation: {
            ratingReviews: interpretCorrelation(ratingReviewCorr),
            ratingSentiment: interpretCorrelation(ratingSentimentCorr)
        }
    };
}

// Smart Recommendations using ML
function generateSmartRecommendations(data) {
    const recommendations = [];

    // Best value products (high rating + many reviews)
    const valueScore = data.allProducts.map(p => ({
        ...p,
        score: (p.rating * 20) * Math.log10(p.reviewsCount + 1)
    })).sort((a, b) => b.score - a.score).slice(0, 3);

    recommendations.push({
        type: 'Best Value',
        products: valueScore,
        reason: 'High rating with substantial review volume'
    });

    // Hidden gems (high rating, fewer reviews)
    const hiddenGems = data.allProducts
        .filter(p => p.rating >= 4.5 && p.reviewsCount < mean(data.allProducts.map(x => x.reviewsCount)))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    if (hiddenGems.length > 0) {
        recommendations.push({
            type: 'Hidden Gems',
            products: hiddenGems,
            reason: 'Excellent ratings with potential for growth'
        });
    }

    return recommendations;
}

// ============================================
// HELPER FUNCTIONS FOR ML ALGORITHMS
// ============================================

function euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, idx) => sum + Math.pow(val - b[idx], 2), 0));
}

function mean(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function standardDeviation(arr) {
    const avg = mean(arr);
    const squareDiffs = arr.map(val => Math.pow(val - avg, 2));
    return Math.sqrt(mean(squareDiffs));
}

function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

function calculateRSquared(x, y, slope, intercept) {
    const yMean = mean(y);
    const predictions = x.map(xi => slope * xi + intercept);

    const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - predictions[i], 2), 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);

    return 1 - (ssRes / ssTot);
}

function pearsonCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
}

function interpretCorrelation(corr) {
    const absCorr = Math.abs(corr);
    if (absCorr > 0.7) return 'Strong correlation';
    if (absCorr > 0.4) return 'Moderate correlation';
    if (absCorr > 0.2) return 'Weak correlation';
    return 'No significant correlation';
}

// Display dataset results
function displayDatasetResults(data) {
    // Display summary cards
    displayDatasetSummaryCards(data);

    // Display charts
    displayDatasetCharts(data);

    // Display new charts (Sentiment & Rating Distribution)
    displaySentimentChart(data);
    displayRatingChart(data);

    // Display category analysis
    displayCategoryAnalysis(data);

    // 🤖 Display ML insights
    displayMLInsights(data);

    // Display data table
    displayDatasetTable(data);
}

// Display summary cards
function displayDatasetSummaryCards(data) {
    const container = document.getElementById('datasetSummaryCards');

    const totalCategories = Object.keys(data.categories).length;
    const avgRating = (data.allProducts.reduce((sum, p) => sum + p.rating, 0) / data.allProducts.length).toFixed(2);
    const totalReviews = data.allProducts.reduce((sum, p) => sum + p.reviewsCount, 0);

    container.innerHTML = `
        <div class="col-md-3 mb-3">
            <div class="card text-center border-primary">
                <div class="card-body">
                    <h2 class="text-primary mb-0">${data.totalProducts}</h2>
                    <p class="text-muted mb-0"><i class="fas fa-box me-1"></i>Total Products</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-center border-info">
                <div class="card-body">
                    <h2 class="text-info mb-0">${totalCategories}</h2>
                    <p class="text-muted mb-0"><i class="fas fa-layer-group me-1"></i>Categories</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-center border-warning">
                <div class="card-body">
                    <h2 class="text-warning mb-0">${avgRating} ⭐</h2>
                    <p class="text-muted mb-0"><i class="fas fa-star me-1"></i>Avg Rating</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-center border-success">
                <div class="card-body">
                    <h2 class="text-success mb-0">${totalReviews.toLocaleString()}</h2>
                    <p class="text-muted mb-0"><i class="fas fa-comments me-1"></i>Total Reviews</p>
                </div>
            </div>
        </div>
    `;
}

// Display charts
function displayDatasetCharts(data) {
    // Top Rated Products Chart - Doughnut
    const topRatedCtx = document.getElementById('topRatedChart');
    if (window.topRatedChartInstance) {
        window.topRatedChartInstance.destroy();
    }

    const topProducts = data.topRated.slice(0, 5);
    const colors = [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 99, 132, 0.8)'
    ];

    window.topRatedChartInstance = new Chart(topRatedCtx, {
        type: 'doughnut',
        data: {
            labels: topProducts.map(p => p.name.substring(0, 25) + (p.name.length > 25 ? '...' : '')),
            datasets: [{
                label: 'Rating',
                data: topProducts.map(p => p.rating),
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '★';
                        }
                    }
                }
            }
        }
    });

    // Most Reviewed Products Chart - Doughnut
    const mostReviewedCtx = document.getElementById('mostReviewedChart');
    if (window.mostReviewedChartInstance) {
        window.mostReviewedChartInstance.destroy();
    }

    const mostReviewed = data.mostReviewed.slice(0, 5);
    const reviewColors = [
        'rgba(75, 192, 192, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 99, 132, 0.8)'
    ];

    window.mostReviewedChartInstance = new Chart(mostReviewedCtx, {
        type: 'doughnut',
        data: {
            labels: mostReviewed.map(p => p.name.substring(0, 25) + (p.name.length > 25 ? '...' : '')),
            datasets: [{
                label: 'Reviews Count',
                data: mostReviewed.map(p => p.reviewsCount),
                backgroundColor: reviewColors,
                borderColor: reviewColors.map(c => c.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toLocaleString() + ' reviews';
                        }
                    }
                }
            }
        }
    });
}

// 🎭 Display Sentiment Chart with Category Filter
function displaySentimentChart(data) {
    const sentimentCtx = document.getElementById('sentimentChart');
    if (!sentimentCtx) return;

    // Populate category filter dropdown
    const categoryFilter = document.getElementById('sentimentCategoryFilter');
    if (categoryFilter) {
        const categories = Object.keys(data.categories);
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    // Store data globally for filter updates
    window.sentimentData = data;

    // Initial chart display (all categories)
    updateSentimentChart();
}

// Update product filter when category changes (Sentiment Chart)
function updateSentimentProductFilter() {
    const data = window.sentimentData || currentDatasetData;
    if (!data) return;

    const categoryFilter = document.getElementById('sentimentCategoryFilter');
    const productFilter = document.getElementById('sentimentProductFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';

    // Clear existing product options
    productFilter.innerHTML = '<option value="all">All Products</option>';

    if (selectedCategory !== 'all') {
        // Get products in selected category
        const products = data.allProducts.filter(p => p.category === selectedCategory);

        // Remove duplicates by product name
        const uniqueProducts = [];
        const seenNames = new Set();
        products.forEach(product => {
            if (!seenNames.has(product.name)) {
                seenNames.add(product.name);
                uniqueProducts.push(product);
            }
        });

        // Sort products by name
        uniqueProducts.sort((a, b) => a.name.localeCompare(b.name));

        // Add product options
        uniqueProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name;
            option.title = product.name; // Full name in tooltip
            productFilter.appendChild(option);
        });
    }

    // Update chart
    updateSentimentChart();
}

// Update Sentiment Chart based on selected category and product
function updateSentimentChart() {
    const data = window.sentimentData || currentDatasetData;
    if (!data) return;

    const categoryFilter = document.getElementById('sentimentCategoryFilter');
    const productFilter = document.getElementById('sentimentProductFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedProduct = productFilter ? productFilter.value : 'all';

    // Filter products by category and product
    let products = data.allProducts;
    if (selectedCategory !== 'all') {
        products = products.filter(p => p.category === selectedCategory);
    }
    if (selectedProduct !== 'all') {
        products = products.filter(p => p.name === selectedProduct);
    }

    // Calculate sentiment distribution
    let positive = 0, negative = 0, neutral = 0;

    products.forEach(p => {
        // Calculate sentiment based on rating
        if (p.rating >= 4.0) {
            positive++;
        } else if (p.rating >= 2.5) {
            neutral++;
        } else {
            negative++;
        }

        // If sentiment score is available, use it
        if (p.positiveReviews && p.negativeReviews) {
            const total = p.positiveReviews + p.negativeReviews;
            if (total > 0) {
                const posPercentage = (p.positiveReviews / total) * 100;
                if (posPercentage >= 70) {
                    positive++;
                } else if (posPercentage >= 40) {
                    neutral++;
                } else {
                    negative++;
                }
            }
        }
    });

    // If we counted twice (rating + sentiment), divide by 2
    if (products.some(p => p.positiveReviews && p.negativeReviews)) {
        positive = Math.round(positive / 2);
        neutral = Math.round(neutral / 2);
        negative = Math.round(negative / 2);
    }

    const sentimentCtx = document.getElementById('sentimentChart');
    if (window.sentimentChartInstance) {
        window.sentimentChartInstance.destroy();
    }

    // Generate title based on selection
    let chartTitle = 'All Categories';
    if (selectedProduct !== 'all') {
        chartTitle = selectedProduct.length > 40 ? selectedProduct.substring(0, 40) + '...' : selectedProduct;
    } else if (selectedCategory !== 'all') {
        chartTitle = selectedCategory;
    }

    window.sentimentChartInstance = new Chart(sentimentCtx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                label: 'Sentiment Distribution',
                data: [positive, neutral, negative],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.8)',   // Green for positive
                    'rgba(255, 193, 7, 0.8)',   // Yellow for neutral
                    'rgba(220, 53, 69, 0.8)'    // Red for negative
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 20,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = positive + neutral + negative;
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                },
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}// 📊 Display Rating Distribution Chart
function displayRatingChart(data) {
    const ratingCtx = document.getElementById('ratingChart');
    if (!ratingCtx) return;

    // Populate category filter dropdown
    const categoryFilter = document.getElementById('ratingCategoryFilter');
    if (categoryFilter) {
        const categories = Object.keys(data.categories);
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    // Store data globally for filter updates
    window.ratingData = data;

    // Initial chart display (all categories)
    updateRatingChart();
}

// Update product filter when category changes (Rating Chart)
function updateRatingProductFilter() {
    const data = window.ratingData || currentDatasetData;
    if (!data) return;

    const categoryFilter = document.getElementById('ratingCategoryFilter');
    const productFilter = document.getElementById('ratingProductFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';

    // Clear existing product options
    productFilter.innerHTML = '<option value="all">All Products</option>';

    if (selectedCategory !== 'all') {
        // Get products in selected category
        const products = data.allProducts.filter(p => p.category === selectedCategory);

        // Remove duplicates by product name
        const uniqueProducts = [];
        const seenNames = new Set();
        products.forEach(product => {
            if (!seenNames.has(product.name)) {
                seenNames.add(product.name);
                uniqueProducts.push(product);
            }
        });

        // Sort products by name
        uniqueProducts.sort((a, b) => a.name.localeCompare(b.name));

        // Add product options
        uniqueProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name;
            option.title = product.name; // Full name in tooltip
            productFilter.appendChild(option);
        });
    }

    // Update chart
    updateRatingChart();
}

// Update Rating Chart based on selected category and product
function updateRatingChart() {
    const data = window.ratingData || currentDatasetData;
    if (!data) return;

    const categoryFilter = document.getElementById('ratingCategoryFilter');
    const productFilter = document.getElementById('ratingProductFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedProduct = productFilter ? productFilter.value : 'all';

    // Filter products by category and product
    let products = data.allProducts;
    if (selectedCategory !== 'all') {
        products = products.filter(p => p.category === selectedCategory);
    }
    if (selectedProduct !== 'all') {
        products = products.filter(p => p.name === selectedProduct);
    }

    // Count products by rating range
    const ratingDistribution = {
        '5★': 0,
        '4-4.9★': 0,
        '3-3.9★': 0,
        '2-2.9★': 0,
        '1-1.9★': 0,
        'Below 1★': 0
    };

    products.forEach(p => {
        if (p.rating >= 5) {
            ratingDistribution['5★']++;
        } else if (p.rating >= 4) {
            ratingDistribution['4-4.9★']++;
        } else if (p.rating >= 3) {
            ratingDistribution['3-3.9★']++;
        } else if (p.rating >= 2) {
            ratingDistribution['2-2.9★']++;
        } else if (p.rating >= 1) {
            ratingDistribution['1-1.9★']++;
        } else {
            ratingDistribution['Below 1★']++;
        }
    });

    const ratingCtx = document.getElementById('ratingChart');
    if (window.ratingChartInstance) {
        window.ratingChartInstance.destroy();
    }

    // Generate title based on selection
    let chartTitle = 'All Categories';
    if (selectedProduct !== 'all') {
        chartTitle = selectedProduct.length > 40 ? selectedProduct.substring(0, 40) + '...' : selectedProduct;
    } else if (selectedCategory !== 'all') {
        chartTitle = selectedCategory;
    }

    window.ratingChartInstance = new Chart(ratingCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(ratingDistribution),
            datasets: [{
                label: 'Product Count',
                data: Object.values(ratingDistribution),
                backgroundColor: [
                    'rgba(40, 167, 69, 0.8)',    // Green for 5★
                    'rgba(92, 184, 92, 0.8)',    // Light green for 4-4.9★
                    'rgba(255, 193, 7, 0.8)',    // Yellow for 3-3.9★
                    'rgba(255, 152, 0, 0.8)',    // Orange for 2-2.9★
                    'rgba(244, 67, 54, 0.8)',    // Red for 1-1.9★
                    'rgba(158, 158, 158, 0.8)'   // Gray for below 1★
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(92, 184, 92, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(158, 158, 158, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = products.length;
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return context.label + ': ' + context.parsed + ' products (' + percentage + '%)';
                        }
                    }
                },
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 10
                    }
                }
            }
        }
    });
}

// Display category analysis
function displayCategoryAnalysis(data) {
    const container = document.getElementById('categoryAnalysis');

    // Render categories as card-style panels in a responsive 2-column grid
    const colors = [
        { header: 'linear-gradient(90deg,#2f6fe4,#3fb1ff)', accent: '#2f6fe4' }, // blue
        { header: 'linear-gradient(90deg,#ffc107,#ffb454)', accent: '#ffb454' }, // yellow
        { header: 'linear-gradient(90deg,#2ecc71,#1abc9c)', accent: '#2ecc71' }, // green
        { header: 'linear-gradient(90deg,#00c0ff,#00a3ff)', accent: '#00a3ff' }, // cyan
        { header: 'linear-gradient(90deg,#e74c3c,#ff6b6b)', accent: '#e74c3c' }, // red
        { header: 'linear-gradient(90deg,#343a40,#495057)', accent: '#343a40' }  // dark
    ];

    let html = '<div class="row gx-3">';

    Object.values(data.categories).forEach((category, index) => {
        const color = colors[index % colors.length];
        const best = category.bestProduct || { name: 'N/A', rating: 0, reviewsCount: 0, price: 'N/A' };
        const description = `${best.name} excels in ${category.name.toLowerCase()} with ${best.rating}★ rating from ${best.reviewsCount.toLocaleString()} reviews.`;

        html += `
            <div class="col-md-6 mb-4">
                <div class="card classification-card winner-card h-100">
                    <div class="category-header d-flex justify-content-between align-items-start" style="background:${color.header}; padding:14px; border-top-left-radius:6px; border-top-right-radius:6px; color:#fff;">
                        <div>
                            <h5 class="mb-1"><i class="fas fa-star me-2"></i>${escapeHtml(category.name)}</h5>
                            <small class="text-white-50">Products: ${category.productCount} &nbsp; • &nbsp; Avg: ${category.avgRating}★</small>
                        </div>
                        <div>
                            <div class="rating-badge" style="background:rgba(255,255,255,0.12); padding:8px 12px; border-radius:8px; color:#fff; font-weight:700;">${best.rating}★</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div style="flex:1;">
                                <h6 class="mb-1"><i class="fas fa-trophy text-muted me-1"></i> Winner</h6>
                                <h4 class="mb-2">${escapeHtml(best.name)}</h4>
                            </div>
                            <div class="text-end ms-3" style="min-width:120px;">
                                <div class="mb-2"><strong>Reviews</strong><br><span class="text-primary">${best.reviewsCount.toLocaleString()}</span></div>
                                <div class="mb-2"><strong>Score</strong><br><span class="text-success">${(best.rating * 1).toFixed(2)}</span></div>
                                <div><strong>Price</strong><br><span class="text-muted">${best.price !== 'N/A' ? '₹' + best.price : 'N/A'}</span></div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <span class="badge bg-success me-2">POSITIVE</span>
                            <p class="text-muted small mb-0">${escapeHtml(description)}</p>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <a href="#" class="btn btn-outline-primary btn-sm">View Product</a>
                            <small class="text-muted">Top 2 Products</small>
                        </div>

                        <hr>
                        <ul class="list-group list-group-flush">
                            ${category.products.slice(0,2).map((p, i) => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <div><span class="badge me-2 ${i === 0 ? 'bg-warning text-dark' : 'bg-secondary'}">${i === 0 ? '1st' : '2nd'}</span> ${escapeHtml(p.name.substring(0,70))}</div>
                                    <div class="text-end"><strong class="text-warning">${p.rating}★</strong> <br><small class="text-muted">(${p.reviewsCount.toLocaleString()})</small></div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// 🤖 Display ML Insights Section
function displayMLInsights(data) {
    const container = document.getElementById('mlInsightsSection');
    if (!container) {
        // Create the container if it doesn't exist (add before data table)
        const tableSection = document.getElementById('datasetDataTable');
        if (tableSection && tableSection.parentElement) {
            const mlSection = document.createElement('div');
            mlSection.id = 'mlInsightsSection';
            mlSection.className = 'mt-4';
            tableSection.parentElement.insertBefore(mlSection, tableSection.parentElement);
        } else {
            console.warn('Could not find data table section');
            return;
        }
    }

    const ml = data.mlInsights;

    let html = `
        <div class="card shadow-sm mb-4" style="border-left: 5px solid #9c27b0;">
            <div class="card-header" style="background: linear-gradient(90deg, #9c27b0, #e91e63); color: white;">
                <h4 class="mb-0"><i class="fas fa-robot me-2"></i>🤖 ML-Powered Insights</h4>
                <small class="text-white-50">Advanced machine learning analysis</small>
            </div>
            <div class="card-body">

                <!-- Product Clustering -->
                <div class="mb-4">
                    <h5 class="text-primary"><i class="fas fa-project-diagram me-2"></i>Product Clustering (K-Means)</h5>
                    <p class="text-muted">Products grouped by rating and review patterns:</p>
                    <div class="row">
                        ${ml.clustering.map((cluster, idx) => `
                            <div class="col-md-4 mb-3">
                                <div class="card border-${idx === 0 ? 'success' : idx === 1 ? 'info' : 'warning'}">
                                    <div class="card-body">
                                        <h6 class="text-${idx === 0 ? 'success' : idx === 1 ? 'info' : 'warning'}">
                                            ${cluster.label}
                                        </h6>
                                        <p class="mb-1"><strong>${cluster.productCount}</strong> products</p>
                                        <p class="mb-1">Avg Rating: <strong>${cluster.avgRating.toFixed(2)}★</strong></p>
                                        <p class="mb-0">Avg Reviews: <strong>${Math.round(cluster.avgReviews).toLocaleString()}</strong></p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <hr>

                <!-- Anomaly Detection -->
                <div class="mb-4">
                    <h5 class="text-warning"><i class="fas fa-exclamation-triangle me-2"></i>Anomaly Detection</h5>
                    <p class="text-muted">${ml.anomalies.description}</p>
                    ${ml.anomalies.products.length > 0 ? `
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <thead class="table-warning">
                                    <tr>
                                        <th style="width: 45%;">Product</th>
                                        <th>Rating</th>
                                        <th>Reviews</th>
                                        <th>Anomaly Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${ml.anomalies.products.map(p => {
                                        const productName = p.name || 'Unknown Product';
                                        const displayName = productName.length > 50 ? productName.substring(0, 50) + '...' : productName;
                                        return `
                                        <tr>
                                            <td title="${escapeHtml(productName)}">${escapeHtml(displayName)}</td>
                                            <td><strong>${p.rating}★</strong></td>
                                            <td>${p.reviewsCount.toLocaleString()}</td>
                                            <td><span class="badge bg-warning text-dark">${p.anomalyType || 'Outlier'}</span></td>
                                        </tr>
                                    `}).join('')}
                                </tbody>
                            </table>
                        </div>
                        <small class="text-muted"><i class="fas fa-info-circle me-1"></i>Anomalies are products that significantly deviate from average patterns (Z-score > 2.5)</small>
                    ` : '<p class="text-success">✓ No significant anomalies detected</p>'}
                </div>

                <hr>

                <!-- Trend Analysis -->
                <div class="mb-4">
                    <h5 class="text-info"><i class="fas fa-chart-line me-2"></i>Category Trends</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-striped">
                            <thead class="table-info">
                                <tr>
                                    <th>Category</th>
                                    <th>Products</th>
                                    <th>Avg Rating</th>
                                    <th>Avg Reviews</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ml.trends.map(t => `
                                    <tr>
                                        <td><strong>${escapeHtml(t.category)}</strong></td>
                                        <td>${t.productCount}</td>
                                        <td>${t.avgRating}★</td>
                                        <td>${t.avgReviews.toLocaleString()}</td>
                                        <td>
                                            <span class="badge bg-${t.trend === 'Rising' ? 'success' : t.trend === 'Stable' ? 'info' : 'danger'}">
                                                ${t.trend === 'Rising' ? '📈' : t.trend === 'Stable' ? '➡️' : '📉'} ${t.trend}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <hr>

                <!-- Predictive Analysis -->
                <div class="mb-4">
                    <h5 class="text-success"><i class="fas fa-brain me-2"></i>Predictive Model</h5>
                    <div class="alert alert-success">
                        <p class="mb-2"><strong>Model:</strong> ${ml.predictions.model}</p>
                        <p class="mb-2"><strong>Equation:</strong> <code>${ml.predictions.equation}</code></p>
                        <p class="mb-2"><strong>R² Score:</strong> ${ml.predictions.rSquared.toFixed(4)}
                            ${ml.predictions.rSquared > 0.5 ? '<span class="badge bg-success">Good Fit</span>' : '<span class="badge bg-warning">Weak Fit</span>'}
                        </p>
                        <p class="mb-0"><strong>Insight:</strong> ${ml.predictions.insight}</p>
                    </div>
                </div>

                <hr>

                <!-- Correlation Analysis -->
                <div class="mb-4">
                    <h5 class="text-danger"><i class="fas fa-link me-2"></i>Correlation Analysis</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card border-primary">
                                <div class="card-body">
                                    <h6>Rating vs Review Count</h6>
                                    <p class="mb-1"><strong>Correlation:</strong> ${ml.correlations.ratingVsReviews}</p>
                                    <p class="mb-0"><span class="badge bg-primary">${ml.correlations.interpretation.ratingReviews}</span></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card border-success">
                                <div class="card-body">
                                    <h6>Rating vs Sentiment</h6>
                                    <p class="mb-1"><strong>Correlation:</strong> ${ml.correlations.ratingVsSentiment}</p>
                                    <p class="mb-0"><span class="badge bg-success">${ml.correlations.interpretation.ratingSentiment}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr>

                <!-- Smart Recommendations -->
                <div class="mb-2">
                    <h5 class="text-purple"><i class="fas fa-magic me-2"></i>Smart Recommendations</h5>
                    ${ml.recommendations.map(rec => `
                        <div class="card mb-3 border-primary">
                            <div class="card-header bg-primary text-white">
                                <strong>${rec.type}</strong>
                                <small class="float-end">${rec.reason}</small>
                            </div>
                            <div class="card-body">
                                <ul class="list-unstyled mb-0">
                                    ${rec.products.map(p => `
                                        <li class="mb-2">
                                            <i class="fas fa-check-circle text-success me-2"></i>
                                            <strong>${escapeHtml(p.name.substring(0, 50))}</strong>
                                            <span class="ms-2 badge bg-warning text-dark">${p.rating}★</span>
                                            <span class="badge bg-secondary">${p.reviewsCount.toLocaleString()} reviews</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>

            </div>
        </div>
    `;

    document.getElementById('mlInsightsSection').innerHTML = html;
}

// Small helper to escape HTML in product names to avoid rendering issues
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Display data table with filters
function displayDatasetTable(data) {
    const container = document.getElementById('datasetDataTable');

    // Get unique categories for filter
    const categories = [...new Set(data.allProducts.map(p => p.category))].sort();

    let html = `
        <!-- Filter Controls -->
        <div class="row mb-3">
            <div class="col-md-4 mb-2">
                <label class="form-label"><i class="fas fa-search me-1"></i>Search Product Name</label>
                <input type="text" id="filterProductName" class="form-control" placeholder="Type to search products..." onkeyup="filterDatasetTable()">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label"><i class="fas fa-layer-group me-1"></i>Filter by Category</label>
                <select id="filterCategory" class="form-select" onchange="filterDatasetTable()">
                    <option value="">All Categories</option>
                    ${categories.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label"><i class="fas fa-star me-1"></i>Filter by Rating</label>
                <select id="filterRating" class="form-select" onchange="filterDatasetTable()">
                    <option value="">All Ratings</option>
                    <option value="5">5★ Only</option>
                    <option value="4">4★ and above</option>
                    <option value="3">3★ and above</option>
                    <option value="2">2★ and above</option>
                    <option value="1">1★ and above</option>
                </select>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <span id="tableResultCount" class="badge bg-primary">${data.allProducts.length} products</span>
            </div>
            <button class="btn btn-sm btn-outline-secondary" onclick="resetDatasetFilters()">
                <i class="fas fa-redo me-1"></i>Reset Filters
            </button>
        </div>

        <table class="table table-striped table-hover" id="datasetProductTable">
            <thead class="table-dark">
                <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Reviews</th>
                    <th>Price</th>
                    ${data.allProducts[0].brand !== 'N/A' ? '<th>Brand</th>' : ''}
                </tr>
            </thead>
            <tbody id="datasetTableBody">
                ${data.allProducts.map((product, index) => `
                    <tr data-name="${escapeHtml(product.name.toLowerCase())}"
                        data-category="${escapeHtml(product.category)}"
                        data-rating="${product.rating}">
                        <td>${index + 1}</td>
                        <td>${escapeHtml(product.name)}</td>
                        <td><span class="badge bg-info">${escapeHtml(product.category)}</span></td>
                        <td>${product.rating} ⭐</td>
                        <td>${product.reviewsCount.toLocaleString()}</td>
                        <td>${product.price !== 'N/A' ? '₹' + product.price : 'N/A'}</td>
                        ${product.brand !== 'N/A' ? `<td>${escapeHtml(product.brand)}</td>` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

// Filter dataset table based on selected filters
function filterDatasetTable() {
    const nameFilter = document.getElementById('filterProductName')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('filterCategory')?.value || '';
    const ratingFilter = parseFloat(document.getElementById('filterRating')?.value) || 0;

    const tableBody = document.getElementById('datasetTableBody');
    const rows = tableBody?.getElementsByTagName('tr') || [];

    let visibleCount = 0;

    for (let row of rows) {
        const name = row.getAttribute('data-name') || '';
        const category = row.getAttribute('data-category') || '';
        const rating = parseFloat(row.getAttribute('data-rating')) || 0;

        let show = true;

        // Filter by name
        if (nameFilter && !name.includes(nameFilter)) {
            show = false;
        }

        // Filter by category
        if (categoryFilter && category !== categoryFilter) {
            show = false;
        }

        // Filter by rating
        if (ratingFilter > 0) {
            if (ratingFilter === 5) {
                if (rating < 5) show = false;
            } else {
                if (rating < ratingFilter) show = false;
            }
        }

        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    }

    // Update result count
    const countBadge = document.getElementById('tableResultCount');
    if (countBadge) {
        countBadge.textContent = `${visibleCount} products`;
    }
}

// Reset all filters
function resetDatasetFilters() {
    const nameInput = document.getElementById('filterProductName');
    const categorySelect = document.getElementById('filterCategory');
    const ratingSelect = document.getElementById('filterRating');

    if (nameInput) nameInput.value = '';
    if (categorySelect) categorySelect.value = '';
    if (ratingSelect) ratingSelect.value = '';

    filterDatasetTable();
}

// Display data table

// Export dataset results to CSV
function exportDatasetResults() {
    if (!currentDatasetData) {
        alert('No data to export');
        return;
    }

    let csv = 'Product Name,Category,Rating,Reviews Count,Price,Brand\n';

    currentDatasetData.allProducts.forEach(product => {
        csv += `"${product.name}","${product.category}",${product.rating},${product.reviewsCount},"${product.price}","${product.brand}"\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset-analysis-results-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('✅ CSV exported successfully');
}

// Download sample dataset CSV
function downloadSampleDataset() {
    const sampleCSV = `product_name,category,rating,reviews_count,price,brand
iPhone 15 Pro,Smartphones,4.5,1250,"1,29,900",Apple
Samsung Galaxy S24,Smartphones,4.3,890,"79,999",Samsung
OnePlus 12,Smartphones,4.4,675,"64,999",OnePlus
Google Pixel 8,Smartphones,4.2,445,"75,999",Google
Xiaomi 14,Smartphones,4.1,823,"54,999",Xiaomi
MacBook Pro M3,Laptops,4.7,532,"1,99,900",Apple
Dell XPS 15,Laptops,4.4,398,"1,45,990",Dell
HP Pavilion,Laptops,4.0,612,"65,990",HP
Lenovo ThinkPad,Laptops,4.3,445,"89,990",Lenovo
Sony WH-1000XM5,Headphones,4.6,1523,"29,990",Sony
Bose QuietComfort,Headphones,4.5,1098,"26,900",Bose
JBL Tune 760NC,Headphones,4.2,2341,"7,999",JBL
Samsung Galaxy Buds,Headphones,4.3,876,"12,999",Samsung
Apple AirPods Pro,Headphones,4.7,1876,"24,900",Apple
LG OLED TV 55",Television,4.6,234,"1,29,990",LG
Samsung QLED 65",Television,4.5,187,"1,89,990",Samsung
Sony Bravia 55",Television,4.4,298,"98,990",Sony
Mi TV 5X,Television,4.1,1234,"39,999",Xiaomi
Canon EOS R6,Cameras,4.8,123,"2,49,990",Canon
Nikon Z6 II,Cameras,4.7,98,"1,89,990",Nikon`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-product-dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('✅ Sample CSV downloaded');
}

console.log('✅ Dataset Analysis module loaded');
