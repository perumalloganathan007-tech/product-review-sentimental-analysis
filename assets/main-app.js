// Check Chart.js availability at script load time
console.log('🚀 main-app.js loading...');
console.log('📊 Chart.js available?', typeof Chart !== 'undefined');
if (typeof Chart !== 'undefined') {
    console.log('✅ Chart.js version:', Chart.version);
} else {
    console.error('❌ CRITICAL: Chart.js is NOT loaded! Charts will not work.');
}

const API_BASE_URL = 'http://localhost:9000';

// Function definitions first to ensure they're available when called
function renderAdvancedComparison(comparison) {
    if (!comparison || !comparison.products || comparison.products.length < 2) {
        return '<div class="alert alert-info">No comparison data available</div>';
    }

    const [product1, product2] = comparison.products;

    // Detect product categories
    const detectCategory = (productName) => {
        const name = (productName || '').toLowerCase();

        if (name.includes('phone') || name.includes('mobile') || name.includes('smartphone') || name.includes('oneplus') || name.includes('iphone') || name.includes('samsung galaxy')) return 'phones';
        if (name.includes('laptop') || name.includes('computer') || name.includes('macbook') || name.includes('thinkpad')) return 'laptops';
        if (name.includes('headphone') || name.includes('earphone') || name.includes('airpods') || name.includes('earbuds')) return 'audio';
        if (name.includes('car') && (name.includes('cover') || name.includes('body cover') || name.includes('waterproof'))) return 'car_accessories';
        if (name.includes('shampoo') || name.includes('conditioner') || name.includes('hair care')) return 'hair_care';
        if (name.includes('soap') || name.includes('body wash') || name.includes('shower gel')) return 'body_care';
        if (name.includes('watch') || name.includes('smartwatch')) return 'watches';
        if (name.includes('tv') || name.includes('television')) return 'tvs';
        if (name.includes('tablet') || name.includes('ipad')) return 'tablets';
        if (name.includes('camera') && !name.includes('phone')) return 'cameras';
        if (name.includes('speaker')) return 'speakers';
        if (name.includes('refrigerator') || name.includes('fridge')) return 'appliances';
        if (name.includes('washing machine')) return 'appliances';
        if (name.includes('ac') || name.includes('air conditioner')) return 'appliances';

        return 'general';
    };

    const category1 = detectCategory(product1.productName || product1.title);
    const category2 = detectCategory(product2.productName || product2.title);

    // Debug logging
    console.log('🔍 Category Detection:');
    console.log('Product 1:', product1.productName || product1.title);
    console.log('Category 1:', category1);
    console.log('Product 2:', product2.productName || product2.title);
    console.log('Category 2:', category2);
    console.log('Are they different?', category1 !== category2);

    // Check if products are from different categories
    if (category1 !== category2 && category1 !== 'general' && category2 !== 'general') {
        const categoryNames = {
            'phones': 'Smartphones',
            'laptops': 'Laptops',
            'audio': 'Audio Devices',
            'car_accessories': 'Car Accessories',
            'hair_care': 'Hair Care Products',
            'body_care': 'Body Care Products',
            'watches': 'Watches',
            'tvs': 'Televisions',
            'tablets': 'Tablets',
            'cameras': 'Cameras',
            'speakers': 'Speakers',
            'appliances': 'Home Appliances'
        };

        return `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="alert alert-warning text-center" style="padding: 40px; margin: 20px 0;">
                            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                            <h3>⚠️ Cannot Compare Different Product Categories</h3>
                            <p class="lead mb-4">
                                You are trying to compare products from <strong>different categories</strong>:
                            </p>
                            <div class="row justify-content-center mb-4">
                                <div class="col-md-5">
                                    <div class="card border-primary">
                                        <div class="card-body">
                                            <h5 class="text-primary">${product1.productName || product1.title}</h5>
                                            <p class="mb-0"><span class="badge bg-primary">${categoryNames[category1] || 'Unknown'}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-times fa-2x text-danger"></i>
                                </div>
                                <div class="col-md-5">
                                    <div class="card border-info">
                                        <div class="card-body">
                                            <h5 class="text-info">${product2.productName || product2.title}</h5>
                                            <p class="mb-0"><span class="badge bg-info">${categoryNames[category2] || 'Unknown'}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="text-muted mb-4">
                                <i class="fas fa-info-circle"></i> For accurate comparison, please select products from the <strong>same category</strong>.
                            </p>
                            <div class="alert alert-light">
                                <h6><i class="fas fa-lightbulb"></i> Examples of Valid Comparisons:</h6>
                                <ul class="list-unstyled mb-0">
                                    <li>📱 iPhone 13 vs Samsung Galaxy S21 (Both Smartphones)</li>
                                    <li>💻 MacBook Pro vs Dell XPS (Both Laptops)</li>
                                    <li>🚗 Car Cover A vs Car Cover B (Both Car Accessories)</li>
                                    <li>🎧 Sony Headphones vs Bose Headphones (Both Audio)</li>
                                </ul>
                            </div>
                            <button class="btn btn-primary btn-lg mt-3" onclick="window.location.reload()">
                                <i class="fas fa-redo"></i> Try Again with Same Category Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Store comparison data globally for export functionality
    window.comparisonData = comparison.products;
    window.winnerData = comparison.winner || null;

    // Enhanced data source indicator
    let dataSourceBadge = '';
    let detailedStatus = '';

    if (comparison.allScraped) {
        dataSourceBadge = '<span class="badge bg-success fs-6"><i class="fas fa-globe"></i> 100% REAL WEB DATA</span>';
        detailedStatus = '<small class="text-success">✅ All product data scraped from live websites</small>';
    } else if (comparison.scrapingUsed) {
        dataSourceBadge = '<span class="badge bg-warning fs-6"><i class="fas fa-globe"></i> PARTIAL WEB DATA</span>';
        detailedStatus = '<small class="text-warning">⚠️ Mixed: Some data scraped, some mock data used</small>';
    } else {
        dataSourceBadge = '<span class="badge bg-secondary fs-6"><i class="fas fa-database"></i> MOCK DATA</span>';
        detailedStatus = '<small class="text-muted">📊 Using sample data (web scraping failed)</small>';
    }

    // Add failure details if available
    if (comparison.scrapingDetails && comparison.scrapingDetails.failures && comparison.scrapingDetails.failures.length > 0) {
        detailedStatus += `<br><small class="text-danger">Failures: ${comparison.scrapingDetails.failures.join(', ')}</small>`;
    }    let html = `
        <div class="container-fluid">
            <!-- Data Source Indicator -->
            <div class="row mb-3">
                <div class="col-12 text-center">
                    ${dataSourceBadge}
                    <div class="mt-2">
                        ${detailedStatus}
                    </div>
                    ${comparison.dataSource ? `
                        <div class="mt-2">
                            <small class="text-muted">
                                Product 1: ${comparison.dataSource.product1 === 'scraped' ? '🔍 Web Scraped' : '📊 Mock Data'} |
                                Product 2: ${comparison.dataSource.product2 === 'scraped' ? '🔍 Web Scraped' : '📊 Mock Data'}
                            </small>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Winner Announcement -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="alert alert-success text-center">
                        <h4><i class="fas fa-trophy text-warning"></i> Comparison Winner</h4>
                        <h5>${comparison.winner?.productName || 'Analysis Complete'}</h5>
                        <p class="mb-0">${comparison.winner?.reason || 'Based on comprehensive analysis'}</p>
                        ${comparison.recommendation ? `<small class="text-muted d-block mt-2">${comparison.recommendation}</small>` : ''}
                    </div>
                </div>
            </div>

            <!-- Side-by-Side Product Comparison -->
            <div class="row">
                <!-- Product 1 -->
                <div class="col-md-6">
                    <div class="card h-100 ${comparison.winner?.productName === product1.productName ? 'border-success' : ''}">
                        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5><i class="fas fa-mobile-alt"></i> ${product1.productName || product1.title || 'Product 1'}</h5>
                            <div>
                                ${comparison.winner?.productName === (product1.productName || product1.title) ? '<span class="badge bg-warning"><i class="fas fa-crown"></i> Winner</span>' : ''}
                                ${product1.dataSource === 'scraped' ? '<span class="badge bg-light text-dark ms-1"><i class="fas fa-globe"></i> Live</span>' : '<span class="badge bg-secondary ms-1"><i class="fas fa-database"></i> Mock</span>'}
                            </div>
                        </div>
                        <div class="card-body">
                            ${renderProductDetails(product1, 'chart1')}
                        </div>
                    </div>
                </div>

                <!-- Product 2 -->
                <div class="col-md-6">
                    <div class="card h-100 ${comparison.winner?.productName === product2.productName ? 'border-success' : ''}">
                        <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h5><i class="fas fa-mobile-alt"></i> ${product2.productName || product2.title || 'Product 2'}</h5>
                            <div>
                                ${comparison.winner?.productName === (product2.productName || product2.title) ? '<span class="badge bg-warning"><i class="fas fa-crown"></i> Winner</span>' : ''}
                                ${product2.dataSource === 'scraped' ? '<span class="badge bg-light text-dark ms-1"><i class="fas fa-globe"></i> Live</span>' : '<span class="badge bg-secondary ms-1"><i class="fas fa-database"></i> Mock</span>'}
                            </div>
                        </div>
                        <div class="card-body">
                            ${renderProductDetails(product2, 'chart2')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detailed Comparison Metrics -->
            ${renderDetailedMetrics(product1, product2)}

            <!-- Specifications Comparison -->
            ${product1.specifications ? renderSpecificationsComparison(product1, product2) : ''}

            <!-- Pricing Comparison -->
            ${product1.pricing ? renderPricingComparison(product1, product2) : ''}

            <!-- Review Analysis Section -->
            ${renderReviewAnalysisComparison(product1, product2, comparison)}

            <!-- Intelligent Product Analysis -->
            <div class="row mt-4 mb-4">
                <div class="col-12">
                    <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <div class="card-body text-center py-4">
                            <h3><i class="fas fa-star"></i> Intelligent Product Analysis</h3>
                            <p class="mb-0">Products automatically classified based on their key strengths and customer feedback. Find the perfect product that matches your specific needs.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Category Winners Grid -->
            ${renderCategoryWinners(product1, product2)}

            <!-- AI Recommendation Section -->
            ${renderAIRecommendationComparison(product1, product2, comparison)}

            <!-- Category Analysis -->
            ${comparison.categoryAnalysis ? renderCategoryAnalysis(comparison.categoryAnalysis) : ''}
        </div>
    `;

    // Create charts after DOM update - increased timeout to ensure full render
    setTimeout(() => {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js is not loaded!');
            alert('Chart library failed to load. Please refresh the page.');
            return;
        }

        console.log('📊 Creating sentiment charts...');
        console.log('📋 Result container visible:', document.getElementById('resultsContent').offsetParent !== null);

        // Verify canvas elements exist
        const canvas1 = document.getElementById('chart1');
        const canvas2 = document.getElementById('chart2');

        if (!canvas1) {
            console.error('❌ Canvas chart1 not found in DOM');
        } else {
            console.log('✅ Canvas chart1 found:', {
                width: canvas1.width,
                height: canvas1.height,
                offsetWidth: canvas1.offsetWidth,
                offsetHeight: canvas1.offsetHeight,
                visible: canvas1.offsetParent !== null,
                display: window.getComputedStyle(canvas1).display
            });
            console.log('🎯 About to call createSentimentChart for product1:', product1);
            try {
                createSentimentChart(product1, 'chart1');
                console.log('✅ createSentimentChart(product1) completed');
            } catch (error) {
                console.error('❌ ERROR in createSentimentChart(product1):', error);
                console.error('Stack:', error.stack);
            }
        }

        if (!canvas2) {
            console.error('❌ Canvas chart2 not found in DOM');
        } else {
            console.log('✅ Canvas chart2 found:', {
                width: canvas2.width,
                height: canvas2.height,
                offsetWidth: canvas2.offsetWidth,
                offsetHeight: canvas2.offsetHeight,
                visible: canvas2.offsetParent !== null,
                display: window.getComputedStyle(canvas2).display
            });
            console.log('🎯 About to call createSentimentChart for product2:', product2);
            try {
                createSentimentChart(product2, 'chart2');
                console.log('✅ createSentimentChart(product2) completed');
            } catch (error) {
                console.error('❌ ERROR in createSentimentChart(product2):', error);
                console.error('Stack:', error.stack);
            }
        }

        // Always try to create metrics chart - the function will handle missing data
        console.log('📊 Creating metrics comparison chart...');
        createMetricsChart(product1, product2);
    }, 1000); // Increased from 500ms to 1000ms

    return html;
}

function renderProductDetails(product, chartId) {
    // Handle both scraped and mock data formats - prioritize real scraped data
    console.log('Product data for chart:', chartId, {
        dataSource: product.dataSource,
        confidenceScore: product.confidenceScore,
        sentimentScore: product.sentimentScore,
        totalReviews: product.totalReviews,
        overallSentiment: product.overallSentiment
    });

    // For scraped data, use actual values; for mock data, use fallbacks
    const isScrapedData = product.dataSource === 'scraped';    // Real review count from scraped data or 0 if no reviews found
    let totalReviews = 0;
    if (isScrapedData) {
        totalReviews = product.totalReviews || (product.reviews ? product.reviews.length : 0);
    } else {
        totalReviews = product.totalReviews || 100; // Mock data fallback
    }

    // Real confidence score - use sentiment analysis confidence if available
    let confidenceScore = 0.8; // Default fallback
    if (isScrapedData) {
        if (totalReviews === 0) {
            // No reviews found in scraped data = 0% confidence
            confidenceScore = 0.0;
        } else if (product.confidenceScore !== undefined) {
            confidenceScore = product.confidenceScore;
        } else if (product.sentimentScore !== undefined) {
            confidenceScore = product.sentimentScore;
        } else {
            // Calculate confidence based on review count for real data
            confidenceScore = Math.min(0.95, Math.max(0.6, totalReviews / 100));
        }
    } else {
        confidenceScore = product.confidenceScore || product.sentimentScore || 0.8;
    }

    // Real rating from scraped data
    let rating = 'N/A';
    if (isScrapedData) {
        if (product.rating) {
            rating = product.rating;
        } else if (totalReviews > 0 && product.sentimentScore) {
            rating = (product.sentimentScore * 5).toFixed(1);
        } else {
            rating = 'No reviews'; // Clear indication when no reviews found
        }
    } else {
        rating = product.rating || product.expertRating || (product.sentimentScore ? (product.sentimentScore * 5).toFixed(1) : '4.0');
    }

    // Real sentiment from scraped data
    let sentiment = 'NEUTRAL';
    if (isScrapedData) {
        if (totalReviews === 0) {
            sentiment = 'NO REVIEWS'; // Clear indication when no reviews
        } else if (product.overallSentiment) {
            // Always use the sentiment calculated by backend sentiment analysis - don't override!
            sentiment = product.overallSentiment;
        }
    } else {
        // For non-scraped data, use overallSentiment if available
        sentiment = product.overallSentiment || 'NEUTRAL';
    }

    return `
        <!-- Product Info (for scraped data) -->
        ${product.price ? `
            <div class="text-center mb-3">
                <h6 class="text-primary">${product.price}</h6>
                ${product.originalPrice && product.originalPrice !== product.price ?
                    `<small class="text-muted text-decoration-line-through">${product.originalPrice}</small>` : ''}
                ${product.discount && product.discount !== '0%' ?
                    `<span class="badge bg-success ms-1">${product.discount} OFF</span>` : ''}
            </div>
        ` : ''}

        <!-- Sentiment Analysis Chart -->
        <div class="text-center mb-3" style="min-height: 300px; width: 100%; padding: 20px; overflow: hidden;">
            <canvas id="${chartId}" style="display: block; max-width: 300px; max-height: 300px; margin: 0 auto; position: relative;"></canvas>
        </div>

        <!-- Key Metrics -->
        <div class="row text-center mb-3">
            <div class="col-4">
                <div class="metric-box">
                    <h6>${totalReviews}</h6>
                    <small class="text-muted">Reviews</small>
                </div>
            </div>
            <div class="col-4">
                <div class="metric-box">
                    <h6>${(confidenceScore * 100).toFixed(1)}%</h6>
                    <small class="text-muted">Confidence</small>
                </div>
            </div>
            <div class="col-4">
                <div class="metric-box">
                    <h6>${rating}</h6>
                    <small class="text-muted">${product.dataSource === 'scraped' ? 'User Rating' : 'Expert Rating'}</small>
                </div>
            </div>
        </div>

        <!-- Overall Sentiment -->
        <div class="text-center mb-3">
            <span class="badge bg-${getSentimentColor(sentiment)} fs-6">
                ${sentiment}
            </span>
            ${product.marketPosition ? `<br><small class="text-muted">${product.marketPosition}</small>` : ''}
        </div>

        <!-- Key Features (for scraped data) -->
        ${product.keyFeatures && product.keyFeatures.length > 0 ? `
            <div class="mb-3">
                <h6><i class="fas fa-star text-warning"></i> Key Features</h6>
                <ul class="list-unstyled">
                    ${product.keyFeatures.slice(0, 3).map(feature =>
                        `<li><small><i class="fas fa-check text-success"></i> ${feature}</small></li>`
                    ).join('')}
                </ul>
            </div>
        ` : ''}

        <!-- Pros and Cons -->
        ${product.prosAndCons ? renderProsAndCons(product.prosAndCons) : ''}

        <!-- User Recommendations -->
        ${product.userRecommendations ? renderUserRecommendations(product.userRecommendations) : ''}

        <!-- Platform Insights (for scraped data) -->
        ${product.insights && product.insights.length > 0 ? `
            <div class="mb-3">
                <h6><i class="fas fa-lightbulb text-info"></i> Insights</h6>
                <ul class="list-unstyled">
                    ${product.insights.slice(0, 2).map(insight =>
                        `<li><small><i class="fas fa-info-circle text-info"></i> ${insight}</small></li>`
                    ).join('')}
                </ul>
            </div>
        ` : ''}
    `;
}

function renderProsAndCons(prosAndCons) {
    return `
        <div class="pros-cons mb-3">
            <div class="row">
                <div class="col-6">
                    <h6 class="text-success"><i class="fas fa-thumbs-up"></i> Pros</h6>
                    <ul class="list-unstyled">
                        ${prosAndCons.pros.map(pro => `<li><small><i class="fas fa-check text-success"></i> ${pro}</small></li>`).join('')}
                    </ul>
                </div>
                <div class="col-6">
                    <h6 class="text-danger"><i class="fas fa-thumbs-down"></i> Cons</h6>
                    <ul class="list-unstyled">
                        ${prosAndCons.cons.map(con => `<li><small><i class="fas fa-times text-danger"></i> ${con}</small></li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function renderUserRecommendations(recommendations) {
    return `
        <div class="recommendations mb-3">
            <h6><i class="fas fa-users text-info"></i> Best For</h6>
            <ul class="list-unstyled">
                ${recommendations.map(rec => `<li><small><i class="fas fa-star text-warning"></i> ${rec}</small></li>`).join('')}
            </ul>
        </div>
    `;
}

// Category Winners Section
function renderCategoryWinners(product1, product2) {
    // Calculate metrics
    const product1Rating = parseFloat(product1.rating || (product1.sentimentScore ? (product1.sentimentScore * 5).toFixed(1) : '4.2'));
    const product2Rating = parseFloat(product2.rating || (product2.sentimentScore ? (product2.sentimentScore * 5).toFixed(1) : '4.1'));

    const product1Price = parseInt((product1.price || '₹10000').replace(/[₹,]/g, '')) || 10000;
    const product2Price = parseInt((product2.price || '₹12000').replace(/[₹,]/g, '')) || 12000;

    const product1Satisfaction = ((product1.positiveCount || 0) / (product1.totalReviews || 1) * 100).toFixed(0);
    const product2Satisfaction = ((product2.positiveCount || 0) / (product2.totalReviews || 1) * 100).toFixed(0);

    const product1Performance = (product1Rating * 20).toFixed(0);
    const product2Performance = (product2Rating * 20).toFixed(0);

    // Detect product category from product name
    const productName = (product1.productName || product1.title || '').toLowerCase();

    // Define category templates based on product type
    let categoryTemplates;

    if (productName.includes('phone') || productName.includes('mobile') || productName.includes('smartphone')) {
        // Electronics - Phones
        categoryTemplates = [
            { title: 'Best for Camera Quality', icon: 'fas fa-camera', feature: 'camera' },
            { title: 'Best for Performance', icon: 'fas fa-tachometer-alt', feature: 'performance' },
            { title: 'Best for Battery Life', icon: 'fas fa-battery-full', feature: 'battery' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else if (productName.includes('laptop') || productName.includes('computer') || productName.includes('macbook')) {
        // Electronics - Laptops
        categoryTemplates = [
            { title: 'Best for Performance', icon: 'fas fa-microchip', feature: 'performance' },
            { title: 'Best for Portability', icon: 'fas fa-briefcase', feature: 'portability' },
            { title: 'Best for Display Quality', icon: 'fas fa-desktop', feature: 'display' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else if (productName.includes('headphone') || productName.includes('earphone') || productName.includes('airpods') || productName.includes('earbuds')) {
        // Audio Products
        categoryTemplates = [
            { title: 'Best Sound Quality', icon: 'fas fa-volume-up', feature: 'sound' },
            { title: 'Best for Comfort', icon: 'fas fa-hand-holding-heart', feature: 'comfort' },
            { title: 'Best Noise Cancellation', icon: 'fas fa-volume-mute', feature: 'noise_cancellation' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else if (productName.includes('car cover') || productName.includes('car body cover')) {
        // Car Accessories
        categoryTemplates = [
            { title: 'Best for Weather Protection', icon: 'fas fa-cloud-rain', feature: 'protection' },
            { title: 'Best Material Quality', icon: 'fas fa-certificate', feature: 'material' },
            { title: 'Best for Durability', icon: 'fas fa-shield-alt', feature: 'durability' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else if (productName.includes('shampoo') || productName.includes('conditioner') || productName.includes('hair')) {
        // Hair Care
        categoryTemplates = [
            { title: 'Best for Hair Quality', icon: 'fas fa-spa', feature: 'quality' },
            { title: 'Best for Nourishment', icon: 'fas fa-leaf', feature: 'nourishment' },
            { title: 'Best Fragrance', icon: 'fas fa-wind', feature: 'fragrance' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else if (productName.includes('soap') || productName.includes('body wash') || productName.includes('shower gel')) {
        // Body Care
        categoryTemplates = [
            { title: 'Best for Skin Care', icon: 'fas fa-hand-sparkles', feature: 'skin_care' },
            { title: 'Best Moisturizing', icon: 'fas fa-tint', feature: 'moisturizing' },
            { title: 'Best Fragrance', icon: 'fas fa-wind', feature: 'fragrance' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else if (productName.includes('watch') || productName.includes('smartwatch')) {
        // Watches
        categoryTemplates = [
            { title: 'Best Features', icon: 'fas fa-cog', feature: 'features' },
            { title: 'Best for Fitness Tracking', icon: 'fas fa-heartbeat', feature: 'fitness' },
            { title: 'Best Battery Life', icon: 'fas fa-battery-full', feature: 'battery' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else if (productName.includes('tv') || productName.includes('television')) {
        // TVs
        categoryTemplates = [
            { title: 'Best Picture Quality', icon: 'fas fa-tv', feature: 'picture' },
            { title: 'Best Sound Quality', icon: 'fas fa-volume-up', feature: 'sound' },
            { title: 'Best Smart Features', icon: 'fas fa-wifi', feature: 'smart' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    } else {
        // Generic categories for unknown products
        categoryTemplates = [
            { title: 'Best Overall Quality', icon: 'fas fa-star', feature: 'quality' },
            { title: 'Best Value for Money', icon: 'fas fa-coins', feature: 'value' },
            { title: 'Highest User Satisfaction', icon: 'fas fa-heart', feature: 'satisfaction' },
            { title: 'Premium Choice', icon: 'fas fa-crown', feature: 'premium' }
        ];
    }

    // Build categories with actual data
    const colors = ['primary', 'warning', 'danger', 'dark'];
    const bgColors = ['rgba(13, 110, 253, 0.1)', 'rgba(255, 193, 7, 0.1)', 'rgba(220, 53, 69, 0.1)', 'rgba(33, 37, 41, 0.1)'];

    const categories = categoryTemplates.map((template, index) => {
        let winner, winnerRating, description;

        if (template.feature === 'premium') {
            winner = product1Rating >= product2Rating ? product1 : product2;
            winnerRating = product1Rating >= product2Rating ? product1Rating : product2Rating;
            description = product1Rating >= product2Rating ?
                `${product1.productName || 'Product 1'} is the premium choice with ${product1Rating}★ rating. It combines high-end features, superior build quality, and excellent performance for users seeking the best.` :
                `${product2.productName || 'Product 2'} is the premium choice with ${product2Rating}★ rating. It combines high-end features, superior build quality, and excellent performance for users seeking the best.`;
        } else if (template.feature === 'satisfaction') {
            winner = parseFloat(product1Satisfaction) >= parseFloat(product2Satisfaction) ? product1 : product2;
            winnerRating = parseFloat(product1Satisfaction) >= parseFloat(product2Satisfaction) ? product1Rating : product2Rating;
            description = parseFloat(product1Satisfaction) >= parseFloat(product2Satisfaction) ?
                `${product1.productName || 'Product 1'} has the highest user satisfaction with ${product1Rating}★ rating from ${product1.totalReviews || 0} reviews. Customers consistently report positive experiences across all aspects.` :
                `${product2.productName || 'Product 2'} has the highest user satisfaction with ${product2Rating}★ rating from ${product2.totalReviews || 0} reviews. Customers consistently report positive experiences across all aspects.`;
        } else if (template.feature === 'value') {
            const product1Value = (product1Rating / (product1Price / 1000)).toFixed(2);
            const product2Value = (product2Rating / (product2Price / 1000)).toFixed(2);
            winner = parseFloat(product1Value) >= parseFloat(product2Value) ? product1 : product2;
            winnerRating = parseFloat(product1Value) >= parseFloat(product2Value) ? product1Rating : product2Rating;
            description = parseFloat(product1Value) >= parseFloat(product2Value) ?
                `${product1.productName || 'Product 1'} offers the best value for money with ${product1Rating}★ rating at ${product1.price}. Reviews highlight excellent features at an affordable price point.` :
                `${product2.productName || 'Product 2'} offers the best value for money with ${product2Rating}★ rating at ${product2.price}. Reviews highlight excellent features at an affordable price point.`;
        } else {
            // For specific features, use rating comparison
            winner = product1Rating >= product2Rating ? product1 : product2;
            winnerRating = product1Rating >= product2Rating ? product1Rating : product2Rating;
            description = product1Rating >= product2Rating ?
                `${product1.productName || 'Product 1'} excels in this category with ${product1Rating}★ rating from ${product1.totalReviews || 0} reviews. Customers consistently praise this aspect in their feedback.` :
                `${product2.productName || 'Product 2'} excels in this category with ${product2Rating}★ rating from ${product2.totalReviews || 0} reviews. Customers consistently praise this aspect in their feedback.`;
        }

        return {
            title: template.title,
            icon: template.icon,
            color: colors[index],
            bgColor: bgColors[index],
            winner: winner,
            winnerRating: winnerRating,
            description: description
        };
    });

    return `
        <div class="row mb-4">
            ${categories.map((category, index) => `
                <div class="col-md-6 mb-3">
                    <div class="card h-100 border-${category.color}" style="background: ${category.bgColor};">
                        <div class="card-header bg-${category.color} text-white">
                            <h5><i class="${category.icon}"></i> ${category.title}</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6><i class="fas fa-trophy text-${category.color}"></i> Winner</h6>
                                    <h5 class="text-${category.color} mb-0">${category.winner.productName || category.winner.title || 'Product'}</h5>
                                </div>
                                <div class="text-end">
                                    <span class="badge bg-dark fs-4">${category.winnerRating}★</span>
                                </div>
                            </div>

                            <div class="mb-3">
                                <div class="row text-center">
                                    <div class="col-4">
                                        <small class="text-muted">Reviews</small>
                                        <h6>${category.winner.totalReviews || 0}</h6>
                                    </div>
                                    <div class="col-4">
                                        <small class="text-muted">Score</small>
                                        <h6>${((category.winner.sentimentScore || 0.66) * 1000).toFixed(2)}</h6>
                                    </div>
                                    <div class="col-4">
                                        <small class="text-muted">Price</small>
                                        <h6>${category.winner.price || '₹16,899'}</h6>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <span class="badge bg-success"><i class="fas fa-check-circle"></i> POSITIVE</span>
                            </div>

                            <p class="text-muted small mb-3">
                                <i class="fas fa-info-circle"></i> ${category.description}
                            </p>

                            <button class="btn btn-outline-${category.color} w-100" onclick="window.open('${category.winner.url || '#'}', '_blank')">
                                <i class="fas fa-external-link-alt"></i> View Product
                            </button>

                            <!-- Top 2 Products -->
                            <div class="mt-3">
                                <h6><i class="fas fa-list"></i> Top 2 Products</h6>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 py-1">
                                        <div>
                                            <span class="badge bg-warning text-dark">1st</span>
                                            <small class="ms-2">${product1.productName || 'Product 1'}</small>
                                        </div>
                                        <div>
                                            <span class="badge bg-warning">${product1Rating}★</span>
                                            <small class="text-muted">(${product1.totalReviews || 0})</small>
                                        </div>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 py-1">
                                        <div>
                                            <span class="badge bg-secondary">2nd</span>
                                            <small class="ms-2">${product2.productName || 'Product 2'}</small>
                                        </div>
                                        <div>
                                            <span class="badge bg-warning">${product2Rating}★</span>
                                            <small class="text-muted">(${product2.totalReviews || 0})</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderDetailedMetrics(product1, product2) {
    // Calculate popularity based on review count and rating
    const calculatePopularity = (product) => {
        const reviewCount = product.totalReviews || product.reviewCount || 0;
        const rating = product.rating || 0;
        // Normalize popularity: more reviews + higher rating = higher popularity
        const reviewScore = Math.min(reviewCount / 100, 1) * 50; // Max 50 points from reviews
        const ratingScore = (rating / 5) * 50; // Max 50 points from rating
        return Math.round(reviewScore + ratingScore);
    };

    // Calculate reliability based on rating consistency and product quality indicators
    const calculateReliability = (product) => {
        const rating = product.rating || 0;
        const positivePercent = product.positivePercentage || product.sentimentBreakdown?.positive || 0;
        const negativePercent = product.negativePercentage || product.sentimentBreakdown?.negative || 0;

        // Higher rating and positive sentiment = higher reliability
        const ratingReliability = (rating / 5) * 60; // Max 60 points from rating
        const sentimentReliability = Math.max(0, (positivePercent - negativePercent) / 100) * 40; // Max 40 points from sentiment
        return Math.round(Math.max(20, ratingReliability + sentimentReliability)); // Minimum 20%
    };

    // Always show metrics section, even if detailed metrics aren't available
    const metrics1 = product1.detailedMetrics || {
        sentiment: Math.round((product1.sentimentScore || 0.5) * 100),
        rating: Math.round(((product1.rating || 3) / 5) * 100),
        popularity: calculatePopularity(product1),
        reliability: calculateReliability(product1)
    };

    const metrics2 = product2.detailedMetrics || {
        sentiment: Math.round((product2.sentimentScore || 0.5) * 100),
        rating: Math.round(((product2.rating || 3) / 5) * 100),
        popularity: calculatePopularity(product2),
        reliability: calculateReliability(product2)
    };

    const metrics = Object.keys(metrics1);

    return `
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-bar"></i> Performance Comparison</h5>
                    </div>
                    <div class="card-body">
                        <div style="height: 300px; position: relative;">
                            <canvas id="metricsChart"></canvas>
                        </div>
                        <div class="row mt-3">
                            ${metrics.map(metric => `
                                <div class="col-md-${Math.floor(12/metrics.length)}">
                                    <div class="text-center">
                                        <h6>${metric.charAt(0).toUpperCase() + metric.slice(1)}</h6>
                                        <div class="d-flex justify-content-between">
                                            <span class="text-primary">${metrics1[metric]}%</span>
                                            <span class="text-info">${metrics2[metric]}%</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSpecificationsComparison(product1, product2) {
    const specs1 = product1.specifications;
    const specs2 = product2.specifications;
    const allSpecs = [...new Set([...Object.keys(specs1 || {}), ...Object.keys(specs2 || {})])];

    return `
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-cogs"></i> Specifications Comparison</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Specification</th>
                                        <th>${product1.productName}</th>
                                        <th>${product2.productName}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${allSpecs.map(spec => `
                                        <tr>
                                            <td><strong>${spec.charAt(0).toUpperCase() + spec.slice(1)}</strong></td>
                                            <td>${specs1?.[spec] || 'N/A'}</td>
                                            <td>${specs2?.[spec] || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPricingComparison(product1, product2) {
    // Helper function to format Indian Rupees
    const formatINR = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return `
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-rupee-sign"></i> Pricing Comparison</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="pricing-card text-center">
                                    <h6>${product1.productName || product1.title || 'Product 1'}</h6>
                                    <div class="price-display">
                                        <span class="current-price">${formatINR(product1.pricing.current)}</span>
                                        <span class="original-price">${formatINR(product1.pricing.msrp)}</span>
                                        <span class="discount badge bg-success">${product1.pricing.discount}% OFF</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="pricing-card text-center">
                                    <h6>${product2.productName || product2.title || 'Product 2'}</h6>
                                    <div class="price-display">
                                        <span class="current-price">${formatINR(product2.pricing.current)}</span>
                                        <span class="original-price">${formatINR(product2.pricing.msrp)}</span>
                                        <span class="discount badge bg-success">${product2.pricing.discount}% OFF</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-3">
                            <p class="text-muted">
                                <strong>Price Difference:</strong>
                                ${formatINR(Math.abs(product1.pricing.current - product2.pricing.current))}
                                (${product1.pricing.current < product2.pricing.current ? (product1.productName || product1.title || 'Product 1') : (product2.productName || product2.title || 'Product 2')} is cheaper)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCategoryAnalysis(categoryAnalysis) {
    return `
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-lightbulb"></i> Category Analysis & Buying Advice</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <h6>Category Insights</h6>
                                <p class="text-muted">${categoryAnalysis.categoryInsights}</p>
                            </div>
                            <div class="col-md-4">
                                <h6>Key Differentiators</h6>
                                <ul class="list-unstyled">
                                    ${categoryAnalysis.keyDifferentiators.map(diff => `<li><small><i class="fas fa-arrow-right text-primary"></i> ${diff}</small></li>`).join('')}
                                </ul>
                            </div>
                            <div class="col-md-4">
                                <h6>Buying Advice</h6>
                                <p class="text-muted">${categoryAnalysis.buyingAdvice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createMetricsChart(product1, product2) {
    try {
        const ctx = document.getElementById('metricsChart');
        if (!ctx) {
            console.error('⚠️ Metrics chart canvas not found!');
            return;
        }

        // Validate canvas element
        if (!(ctx instanceof HTMLCanvasElement)) {
            console.error('❌ Metrics chart element is not a canvas');
            return;
        }

        // Check Chart.js availability
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js not available for metrics chart');
            return;
        }

        console.log('📊 Creating metrics chart canvas found');

        // Destroy existing chart instance if it exists
        const existingChart = Chart.getChart('metricsChart');
        if (existingChart) {
            console.log('   🗑️ Destroying existing chart');
            existingChart.destroy();
        }

        // Calculate popularity based on review count and rating
        const calculatePopularity = (product) => {
            const reviewCount = product.totalReviews || product.reviewCount || 0;
            const rating = product.rating || 0;
            // Normalize popularity: more reviews + higher rating = higher popularity
            const reviewScore = Math.min(reviewCount / 100, 1) * 50; // Max 50 points from reviews
            const ratingScore = (rating / 5) * 50; // Max 50 points from rating
            return Math.round(reviewScore + ratingScore);
        };

        // Calculate reliability based on rating consistency and product quality indicators
        const calculateReliability = (product) => {
            const rating = product.rating || 0;
            const positivePercent = product.positivePercentage || product.sentimentBreakdown?.positive || 0;
            const negativePercent = product.negativePercentage || product.sentimentBreakdown?.negative || 0;

            // Higher rating and positive sentiment = higher reliability
            const ratingReliability = (rating / 5) * 60; // Max 60 points from rating
            const sentimentReliability = Math.max(0, (positivePercent - negativePercent) / 100) * 40; // Max 40 points from sentiment
            return Math.round(Math.max(20, ratingReliability + sentimentReliability)); // Minimum 20%
        };

        // Handle case where detailedMetrics might not exist
        const metrics1 = product1.detailedMetrics || {
            sentiment: Math.round((product1.sentimentScore || 0.5) * 100),
            rating: Math.round(((product1.rating || 3) / 5) * 100),
            popularity: calculatePopularity(product1),
            reliability: calculateReliability(product1)
        };

        const metrics2 = product2.detailedMetrics || {
            sentiment: Math.round((product2.sentimentScore || 0.5) * 100),
            rating: Math.round(((product2.rating || 3) / 5) * 100),
            popularity: calculatePopularity(product2),
            reliability: calculateReliability(product2)
        };

        const metricKeys = Object.keys(metrics1);
        const data1 = Object.values(metrics1);
        const data2 = Object.values(metrics2);

        console.log('   📈 Chart data:', { metrics1, metrics2 });

        const chartInstance = new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: metricKeys.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                datasets: [
                    {
                        label: product1.productName || 'Product 1',
                        data: data1,
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        pointBackgroundColor: '#007bff',
                        pointBorderColor: '#007bff',
                        pointRadius: 5
                    },
                    {
                        label: product2.productName || 'Product 2',
                        data: data2,
                        borderColor: '#17a2b8',
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        pointBackgroundColor: '#17a2b8',
                        pointBorderColor: '#17a2b8',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
        console.log('   ✅ Metrics chart created successfully!');
    } catch (error) {
        console.error('❌ Error creating metrics chart:', error);
        // Show error in chart container
        const ctx = document.getElementById('metricsChart');
        const chartContainer = ctx?.parentElement;
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div class="alert alert-warning text-center">
                    <i class="fas fa-chart-line fa-2x text-muted mb-2"></i>
                    <p class="mb-0">Metrics chart unavailable</p>
                    <small class="text-muted">Chart error: ${error.message}</small>
                </div>
            `;
        }
    }
}

// Keep the old function for backward compatibility
function renderComparison(comparison) {
    return renderAdvancedComparison(comparison);
}

window.addEventListener('DOMContentLoaded', () => {
    // Default to Compare
    showSection('compare');
    checkAPIConnection();
});

async function checkAPIConnection() {
    const status = document.getElementById('statusIndicator');
    console.log('🔍 Checking API connection to:', API_BASE_URL + '/api/test/db');

    try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn('⏱️ Request timeout - aborting after 5 seconds');
            controller.abort();
        }, 5000); // 5 second timeout

        const res = await fetch(`${API_BASE_URL}/api/test/db`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        clearTimeout(timeoutId);

        console.log('✅ API Response received:', res.status, res.ok);

        const data = await res.json();
        console.log('📦 API Response data:', data);        if (res.ok) {
            status.innerText = '🟢 Connected to API Server';
            status.style.background = '#28a745';
            showServerButton('connected'); // Show stop/restart button when connected
            console.log('✅ API Connected successfully');
        } else {
            status.innerText = '🟡 API Server Issues';
            status.style.background = '#ffc107';
            showServerButton('issues'); // Show restart button
            console.warn('⚠️ API returned status:', res.status);
        }
    } catch (err) {
        console.error('❌ API Connection Error:', err.name, err.message);

        if (err.name === 'AbortError') {
            status.innerText = '🔴 API Server Timeout';
            status.style.background = '#dc3545';
            console.error('⏱️ Request timed out after 5 seconds');
        } else {
            status.innerText = '🔴 API Server Offline';
            status.style.background = '#dc3545';
        }
        showServerButton('offline'); // Show start button
        console.error('API Connection Error:', err);
    }
}

function showServerButton(state) {
    const btn = document.getElementById('serverControlBtn');
    const btnText = document.getElementById('serverBtnText');
    if (btn) {
        btn.style.display = 'block';

        if (state === 'offline') {
            btnText.textContent = 'Start Server';
            btn.className = 'btn btn-sm btn-success';
        } else if (state === 'issues') {
            btnText.textContent = 'Restart Server';
            btn.className = 'btn btn-sm btn-warning';
        } else if (state === 'connected') {
            btnText.textContent = 'Restart Server';
            btn.className = 'btn btn-sm btn-outline-secondary';
        }
    }
}

// Make toggleServer available globally for onclick handler
window.toggleServer = async function() {
    const btn = document.getElementById('serverControlBtn');
    const btnText = document.getElementById('serverBtnText');
    const originalText = btnText.textContent;

    try {
        btnText.textContent = 'Starting Server...';
        btn.disabled = true;

        // Try to call server restart endpoint first
        try {
            const response = await fetch(`${API_BASE_URL}/api/server/restart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert('✅ Server restart initiated!\n\nWait a few seconds and the page will reload automatically.');
                setTimeout(() => {
                    location.reload();
                }, 3000);
                return;
            }
        } catch (restartErr) {
            console.log('Server restart endpoint not available, using PowerShell method');
        }

        // If server is offline, automatically open PowerShell with the command
        const startCommand = `Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting Sentiment Analysis Server...' -ForegroundColor Green; cd 'd:\\scala project'; node mock-server.js"`;

        // Create a downloadable .ps1 script file
        const scriptContent = `# Sentiment Analysis API Server Starter
Write-Host "Starting Sentiment Analysis API Server..." -ForegroundColor Green
Set-Location -Path "d:\\scala project"
node mock-server.js`;

        // Try to open PowerShell directly using a data URL trick
        const blob = new Blob([scriptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Show instructions with download option
        const result = confirm(
            '🚀 Starting Server in PowerShell\n\n' +
            'Click OK to download the start script, then:\n' +
            '1. Right-click the downloaded file\n' +
            '2. Select "Run with PowerShell"\n\n' +
            'Or manually run:\n' +
            'cd "d:\\scala project"\n' +
            'node mock-server.js'
        );

        if (result) {
            // Download the PowerShell script
            const a = document.createElement('a');
            a.href = url;
            a.download = 'start-server.ps1';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('✅ Script downloaded!\n\nRight-click "start-server.ps1" and select "Run with PowerShell".\n\nThe page will check connection in 5 seconds...');

            // Check connection after 5 seconds
            setTimeout(() => {
                checkAPIConnection();
            }, 5000);
        }
    } catch (err) {
        console.error('Error starting server:', err);
        alert('⚠️ Unable to start server automatically.\n\nPlease run manually:\ncd "d:\\scala project"\nnode mock-server.js');
    } finally {
        btnText.textContent = originalText;
        btn.disabled = false;
    }
}

function showSection(name) {
    // Hide all sections (handle both hidden class and inline styles)
    document.querySelectorAll('.section').forEach(s => {
        s.classList.add('hidden');
        s.style.display = 'none';
    });

    // Show the selected section
    const el = document.getElementById(name);
    if (el) {
        el.classList.remove('hidden');
        el.style.display = 'block';


    }

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const nav = document.querySelector(`[href='#${name}']`);
    if (nav) nav.classList.add('active');
}

function showLoading(text='Processing', sub='Please wait...'){
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingSubtext').textContent = sub;
    document.getElementById('loadingOverlay').classList.remove('hidden');
}
function hideLoading(){ document.getElementById('loadingOverlay').classList.add('hidden'); }

const compareForm = document.getElementById('compareForm');
if (compareForm) {
    // Add event listeners for comparison type radio buttons
    const urlRadio = document.getElementById('urlComparison');
    const categoryRadio = document.getElementById('categoryComparison');
    const urlSection = document.getElementById('urlComparisonSection');
    const categorySection = document.getElementById('categoryComparisonSection');
    const categorySelect = document.getElementById('compareCategory');

    if (urlRadio && categoryRadio) {
        urlRadio.addEventListener('change', () => {
            if (urlRadio.checked) {
                urlSection.classList.remove('hidden');
                categorySection.classList.add('hidden');
            }
        });

        categoryRadio.addEventListener('change', () => {
            if (categoryRadio.checked) {
                urlSection.classList.add('hidden');
                categorySection.classList.remove('hidden');
                populateProductSelectors();
            }
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', populateProductSelectors);
    }

    compareForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('📝 Compare form submitted');

        // Check if this is an accidental submission with empty fields
        const product1UrlsEl = document.getElementById('product1Urls');
        const product2UrlsEl = document.getElementById('product2Urls');

        if (product1UrlsEl && product2UrlsEl) {
            const urls1 = product1UrlsEl.value.split('\n').map(s=>s.trim()).filter(Boolean);
            const urls2 = product2UrlsEl.value.split('\n').map(s=>s.trim()).filter(Boolean);

            if (urls1.length === 0 && urls2.length === 0) {
                console.log('❌ Form submitted with no URLs - blocking submission');
                alert('⚠️ No URLs provided!\n\n💡 For multi-product comparison, use the "Multi-Product Comparison" section below.\n\nFor 2-product comparison, enter URLs in both Product 1 and Product 2 fields.');
                return;
            }
        }

        // Check which comparison type is selected (with null safety)
        const comparisonTypeRadio = document.querySelector('input[name="comparisonType"]:checked');

        // If no radio button exists or is checked, default to URL comparison
        const comparisonType = comparisonTypeRadio ? comparisonTypeRadio.value : 'urls';

        if (comparisonType === 'urls') {
            await handleUrlComparison();
        } else {
            await handleCategoryComparison();
        }
    });
}

async function handleUrlComparison() {
    console.log('⚠️ Old comparison form submitted');

    // Get elements with null safety
    const product1UrlsEl = document.getElementById('product1Urls');
    const product2UrlsEl = document.getElementById('product2Urls');

    if (!product1UrlsEl || !product2UrlsEl) {
        console.error('URL input elements not found');
        alert('Error: URL input fields are missing. Please refresh the page.');
        return;
    }

    const urls1 = product1UrlsEl.value.split('\n').map(s=>s.trim()).filter(Boolean);
    const urls2 = product2UrlsEl.value.split('\n').map(s=>s.trim()).filter(Boolean);

    // Validate that we have URLs for both products
    if (urls1.length === 0 || urls2.length === 0) {
        console.log('❌ Old comparison form: Missing URLs for one or both products');
        alert('Please enter URLs for both products to compare.\n\n💡 Tip: For multi-product comparison, use the "Multi-Product Comparison" section below!');
        return;
    }

    showLoading('Comparing products...', 'Analyzing sentiment differences from URLs');

    // Format the request to match backend expectations
    const requestBody = {
        name: `Product Comparison ${new Date().toLocaleString()}`,
        description: "URL-based product comparison",
        products: [
            {
                name: "Product 1",
                urls: urls1
            },
            {
                name: "Product 2",
                urls: urls2
            }
        ]
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/compare/urls`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(requestBody)
        });

        // Handle error responses with detailed message
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Server responded with error:', {
                status: res.status,
                statusText: res.statusText,
                body: errorText
            });

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText || 'Compare request failed' };
            }

            const errorMessage = errorData.message || errorData.error || `Server error: ${res.status} ${res.statusText}`;
            throw new Error(errorMessage);
        }

        const result = await res.json();
        hideLoading();

        console.log('🔍 URL Comparison - Full API Response:', result);
        console.log('🔍 URL Comparison - Product 1 full data:', result.comparison?.products?.[0]);
        console.log('🔍 URL Comparison - Product 1 sentiment counts:', {
            positiveCount: result.comparison?.products?.[0]?.positiveCount,
            negativeCount: result.comparison?.products?.[0]?.negativeCount,
            neutralCount: result.comparison?.products?.[0]?.neutralCount,
            sentimentBreakdown: result.comparison?.products?.[0]?.sentimentBreakdown
        });

        document.getElementById('resultsContent').innerHTML = renderAdvancedComparison(result.comparison);
        showSection('results');
    } catch(err) {
        hideLoading();
        console.error('Comparison error:', err);

        // Show detailed error message
        const errorMsg = err.message || 'Unknown error occurred';
        const isScrapingError = errorMsg.includes('scrape') || errorMsg.includes('Failed to');

        let alertMessage = `❌ Error comparing products:\n\n${errorMsg}`;

        if (isScrapingError) {
            alertMessage += '\n\n💡 Tips:\n';
            alertMessage += '• Ensure URLs are from Amazon.in or Flipkart.com\n';
            alertMessage += '• URLs should be product pages (not search results)\n';
            alertMessage += '• Check your internet connection\n';
            alertMessage += '• Try different product URLs';
        }

        alert(alertMessage);
    }
}

async function handleCategoryComparison() {
    // Get elements with null safety
    const categoryEl = document.getElementById('compareCategory');
    const product1El = document.getElementById('product1Select');
    const product2El = document.getElementById('product2Select');

    if (!categoryEl || !product1El || !product2El) {
        console.error('Category comparison elements not found');
        alert('Error: Category comparison fields are missing. Please refresh the page.');
        return;
    }

    const category = categoryEl.value;
    const product1 = product1El.value;
    const product2 = product2El.value;

    if (!product1 || !product2) {
        alert('Please select both products to compare');
        return;
    }

    if (product1 === product2) {
        alert('Please select different products to compare');
        return;
    }

    showLoading('Comparing category products...', 'Analyzing detailed product specifications and reviews');

    const options = getComparisonOptions();

    try {
        const res = await fetch(`${API_BASE_URL}/api/compare/category`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({category, products: [product1, product2], options})
        });
        if (!res.ok) throw new Error('Category comparison request failed');
        const result = await res.json();
        hideLoading();
        document.getElementById('resultsContent').innerHTML = renderAdvancedComparison(result.comparison);
        showSection('results');
    } catch(err) {
        hideLoading();
        alert('Error comparing category products: '+err.message);
    }
}

function getComparisonOptions() {
    return {
        includeSpecs: document.getElementById('includeSpecs')?.checked || false,
        includePricing: document.getElementById('includePricing')?.checked || false,
        includeReviews: document.getElementById('includeReviews')?.checked || false,
        includeRecommendation: document.getElementById('includeRecommendation')?.checked || false
    };
}

function populateProductSelectors() {
    const categoryEl = document.getElementById('compareCategory');
    const product1Select = document.getElementById('product1Select');
    const product2Select = document.getElementById('product2Select');

    if (!categoryEl || !product1Select || !product2Select) {
        console.error('Product selector elements not found');
        return;
    }

    const category = categoryEl.value;

    const products = {
        smartphones: [
            {value: 'iphone-15-pro', text: 'iPhone 15 Pro'},
            {value: 'samsung-galaxy-s24', text: 'Samsung Galaxy S24'},
            {value: 'google-pixel-8', text: 'Google Pixel 8'},
            {value: 'oneplus-12', text: 'OnePlus 12'},
            {value: 'xiaomi-14', text: 'Xiaomi 14'}
        ],
        laptops: [
            {value: 'macbook-pro-m3', text: 'MacBook Pro M3'},
            {value: 'dell-xps-13', text: 'Dell XPS 13'},
            {value: 'thinkpad-x1-carbon', text: 'ThinkPad X1 Carbon'},
            {value: 'surface-laptop-5', text: 'Surface Laptop 5'},
            {value: 'hp-spectre-x360', text: 'HP Spectre x360'}
        ],
        headphones: [
            {value: 'sony-wh1000xm5', text: 'Sony WH-1000XM5'},
            {value: 'bose-qc45', text: 'Bose QuietComfort 45'},
            {value: 'airpods-pro-2', text: 'AirPods Pro 2'},
            {value: 'sennheiser-momentum-4', text: 'Sennheiser Momentum 4'},
            {value: 'audio-technica-m50x', text: 'Audio-Technica ATH-M50x'}
        ]
    };

    // Clear existing options except the first one
    product1Select.innerHTML = '<option value="">Select first product...</option>';
    product2Select.innerHTML = '<option value="">Select second product...</option>';

    // Add products for selected category
    if (products[category]) {
        products[category].forEach(product => {
            product1Select.innerHTML += `<option value="${product.value}">${product.text}</option>`;
            product2Select.innerHTML += `<option value="${product.value}">${product.text}</option>`;
        });
    }
}

function createSentimentChart(product, canvasId='sentimentChart'){
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js library not loaded! Cannot create charts.');
        console.log('Please ensure Chart.js CDN is accessible and loaded before main-app.js');
        return;
    }

    console.log(`🔍 createSentimentChart called for ${canvasId}`, {
        productName: product.productName || product.title,
        dataSource: product.dataSource,
        positiveCount: product.positiveCount,
        negativeCount: product.negativeCount,
        neutralCount: product.neutralCount,
        sentimentBreakdown: product.sentimentBreakdown
    });

    const ctx = document.getElementById(canvasId);
    if(!ctx) {
        console.error(`❌ Canvas element ${canvasId} not found in DOM!`);
        console.log('Available canvas elements:', Array.from(document.querySelectorAll('canvas')).map(c => c.id));
        return;
    }

    // Validate canvas element type
    if (!(ctx instanceof HTMLCanvasElement)) {
        console.error(`❌ Element ${canvasId} is not a canvas element`);
        return;
    }

    // Check if canvas is visible and has dimensions
    if (ctx.offsetParent === null) {
        console.warn(`⚠️ Canvas ${canvasId} is not visible, waiting...`);
        setTimeout(() => createSentimentChart(product, canvasId), 500);
        return;
    }

    // Ensure canvas has proper dimensions
    if (ctx.offsetWidth === 0 || ctx.offsetHeight === 0) {
        console.warn(`⚠️ Canvas ${canvasId} has zero dimensions, setting default size`);
        ctx.style.width = '300px';
        ctx.style.height = '300px';
    }

    console.log(`✅ Canvas ${canvasId} found and validated, proceeding with chart creation`);

    // Destroy existing chart instance if it exists
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
        console.log(`   🗑️ Destroying existing chart ${canvasId}`);
        existingChart.destroy();
    }

    // Handle different data structures from scraped vs mock data
    let positiveCount, negativeCount, neutralCount;
    const isScrapedData = product.dataSource === 'scraped';
    const totalReviews = product.totalReviews || (product.reviews ? product.reviews.length : 0);

    console.log(`Chart data source for ${canvasId}:`, {
        dataSource: product.dataSource,
        totalReviews: totalReviews,
        sentimentBreakdown: product.sentimentBreakdown,
        sentimentScore: product.sentimentScore,
        positiveCount: product.positiveCount,
        negativeCount: product.negativeCount,
        neutralCount: product.neutralCount,
        overallSentiment: product.overallSentiment,
        confidenceScore: product.confidenceScore
    });

    // Try multiple data sources in order of preference
    if (product.positiveCount !== undefined && product.positiveCount !== null) {
        // Direct properties (best option)
        console.log(`   ✅ Using direct count properties`);
        positiveCount = product.positiveCount;
        negativeCount = product.negativeCount;
        neutralCount = product.neutralCount;
    } else if (product.sentimentBreakdown) {
        // Breakdown object (second best)
        console.log(`   ✅ Using sentimentBreakdown object`);
        const breakdown = product.sentimentBreakdown;
        if (breakdown.positiveCount !== undefined) {
            positiveCount = breakdown.positiveCount;
            negativeCount = breakdown.negativeCount;
            neutralCount = breakdown.neutralCount;
        } else if (breakdown.positive !== undefined) {
            // Percentage-based breakdown - calculate counts
            positiveCount = Math.round((breakdown.positive / 100) * totalReviews);
            negativeCount = Math.round((breakdown.negative / 100) * totalReviews);
            neutralCount = Math.round((breakdown.neutral / 100) * totalReviews);
        }
    } else if (totalReviews > 0) {
        // FALLBACK: Calculate from sentiment score and total reviews
        console.log(`   ⚠️ Using FALLBACK calculation from sentiment score`);
        const score = product.sentimentScore || product.confidenceScore || 0.5;

        // Use sentiment score to estimate distribution
        if (score >= 0.7) {
            // Highly positive
            positiveCount = Math.round(totalReviews * 0.85);
            negativeCount = Math.round(totalReviews * 0.05);
            neutralCount = totalReviews - positiveCount - negativeCount;
        } else if (score >= 0.5) {
            // Moderately positive
            positiveCount = Math.round(totalReviews * 0.65);
            negativeCount = Math.round(totalReviews * 0.15);
            neutralCount = totalReviews - positiveCount - negativeCount;
        } else if (score >= 0.3) {
            // Mixed/Neutral
            positiveCount = Math.round(totalReviews * 0.35);
            negativeCount = Math.round(totalReviews * 0.35);
            neutralCount = totalReviews - positiveCount - negativeCount;
        } else {
            // Negative
            positiveCount = Math.round(totalReviews * 0.10);
            negativeCount = Math.round(totalReviews * 0.75);
            neutralCount = totalReviews - positiveCount - negativeCount;
        }
    } else {
        // No reviews at all
        console.log(`   ⚠️ No review data available`);
        positiveCount = 0;
        negativeCount = 0;
        neutralCount = 0;
    }

    console.log(`📊 Creating chart ${canvasId} with data: P:${positiveCount}, N:${negativeCount}, Neu:${neutralCount}, Total:${totalReviews}`);

    // Handle no reviews case - but still show a chart
    if (positiveCount === 0 && negativeCount === 0 && neutralCount === 0 && totalReviews === 0) {
        console.log(`   📊 No review data available - showing "No Reviews" message`);
        const chartContainer = ctx.parentElement;
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center" style="height: 200px;">
                    <i class="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                    <h6 class="text-muted">No Reviews Available</h6>
                    <small class="text-muted">No customer reviews found for this product</small>
                </div>
            `;
        }
        return;
    }

    // Ensure we have at least some data to show
    if (positiveCount === 0 && negativeCount === 0 && neutralCount === 0 && totalReviews > 0) {
        console.log(`   ⚠️ Warning: Have reviews but no sentiment data - creating estimated chart`);
        // Create a neutral distribution
        positiveCount = Math.round(totalReviews * 0.5);
        neutralCount = Math.round(totalReviews * 0.3);
        negativeCount = totalReviews - positiveCount - neutralCount;
    }

    try {
        console.log(`   🎨 Rendering chart with Chart.js...`);
        console.log(`   📊 Chart data:`, {
            canvasId: canvasId,
            positiveCount: positiveCount,
            negativeCount: negativeCount,
            neutralCount: neutralCount,
            totalReviews: totalReviews,
            ChartAvailable: typeof Chart !== 'undefined',
            canvasElement: ctx,
            canvasWidth: ctx.width,
            canvasHeight: ctx.height,
            canvasVisible: ctx.offsetParent !== null
        });

        // Validate Chart.js is available
        if (typeof Chart === 'undefined') {
            throw new Error('Chart.js library is not loaded');
        }

        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(canvasId);
        if (existingChart) {
            console.log(`   🗑️ Destroying existing chart ${canvasId}`);
            existingChart.destroy();
        }

        console.log(`   🎯 Creating Chart instance NOW...`);
        console.log(`   🎯 Chart.js type check:`, typeof Chart);
        console.log(`   🎯 Canvas context:`, ctx.getContext('2d'));

        const chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [positiveCount, negativeCount, neutralCount],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',   // green
                        'rgba(220, 53, 69, 0.8)',   // red
                        'rgba(108, 117, 125, 0.8)'  // gray
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });

        console.log(`   ✅ Chart ${canvasId} created successfully!`);
        console.log(`   📐 Chart instance:`, {
            id: chartInstance.id,
            canvas: chartInstance.canvas,
            width: chartInstance.width,
            height: chartInstance.height,
            data: chartInstance.data
        });
        console.log(`   🎨 Chart should now be visible in the canvas!`);

        // Force chart update/render
        chartInstance.update();

    } catch (error) {
        console.error(`❌ Error creating sentiment chart ${canvasId}:`, error);
        console.error(`   Error stack:`, error.stack);
        // Show error message in the chart container
        const chartContainer = ctx ? ctx.parentElement : document.getElementById(canvasId + '_container');
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> Chart Error: ${error.message}
                </div>
            `;
        }
    }
}

function getSentimentColor(sentiment){
    switch(sentiment){
        case 'POSITIVE': return 'success';
        case 'NEGATIVE': return 'danger';
        default: return 'secondary';
    }
}

// Export to PDF functionality
const exportPDF = document.getElementById('exportPDF');
if (exportPDF) {
    exportPDF.addEventListener('click', () => {
        // Check if we have dataset analysis results
        if (window.currentAnalysisResult && window.currentAnalysisResult.analysis) {
            exportDatasetAnalysisPDF(window.currentAnalysisResult);
            return;
        }

        // Otherwise, try comparison data
        if (!window.comparisonData || window.comparisonData.length === 0) {
            alert('⚠️ No data available to export. Please run an analysis or comparison first.');
            return;
        }

        try {
            // Create PDF content
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Helper function to clean text for PDF (remove problematic characters)
            const cleanText = (text) => {
                if (!text) return '';
                let cleaned = String(text);

                // Replace currency symbols first
                cleaned = cleaned.replace(/₹/g, 'Rs.');
                cleaned = cleaned.replace(/\$/g, 'USD');
                cleaned = cleaned.replace(/€/g, 'EUR');
                cleaned = cleaned.replace(/£/g, 'GBP');

                // Remove all non-printable and special unicode characters
                cleaned = cleaned.replace(/[^\x20-\x7E]/g, '');

                // Clean up any remaining problematic patterns
                cleaned = cleaned.replace(/&[a-zA-Z0-9#]+;?/g, ''); // Remove HTML entities
                cleaned = cleaned.replace(/&+/g, 'and'); // Replace remaining ampersands

                return cleaned.trim();
            };

            // Add title
            doc.setFontSize(20);
            doc.setTextColor(40, 116, 240);
            doc.text('Sentiment Analysis Comparison Report', 105, 20, { align: 'center' });

            // Add date
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });

            let yPos = 45;

            // Add winner section with detailed comparison analysis
            if (window.winnerData) {
                doc.setFontSize(14);
                doc.setTextColor(0, 150, 0);
                doc.text('WINNER', 20, yPos);
                yPos += 8;

                doc.setFontSize(12);
                doc.setTextColor(0);
                doc.text(cleanText(window.winnerData.productName), 20, yPos, { maxWidth: 170 });
                yPos += 8;

                // Detailed Comparison Analysis
                doc.setFontSize(10);
                doc.setTextColor(60, 60, 60);
                doc.text('Reason: ' + cleanText(window.winnerData.reason), 20, yPos, { maxWidth: 170 });
                yPos += 10;

                // Add comparative analysis if we have multiple products
                if (window.comparisonData && window.comparisonData.length >= 2) {
                    doc.setFontSize(9);
                    doc.setTextColor(80, 80, 80);

                    const products = window.comparisonData;
                    const product1 = products[0];
                    const product2 = products[1];

                    // Comparison Analysis Section
                    doc.setFontSize(11);
                    doc.setTextColor(40, 116, 240);
                    doc.text('Detailed Comparison Analysis:', 20, yPos);
                    yPos += 7;

                    doc.setFontSize(9);
                    doc.setTextColor(0);

                    // Sentiment Comparison
                    const analysis = [];
                    analysis.push('Sentiment: ' + cleanText(product1.productName.substring(0, 30)) + '... = ' +
                                  (product1.overallSentiment || 'N/A') + ' vs ' +
                                  cleanText(product2.productName.substring(0, 30)) + '... = ' +
                                  (product2.overallSentiment || 'N/A'));

                    // Review Count Comparison
                    analysis.push('Total Reviews: ' + (product1.totalReviews || 0) + ' vs ' + (product2.totalReviews || 0) +
                                  ' (Difference: ' + Math.abs((product1.totalReviews || 0) - (product2.totalReviews || 0)) + ')');

                    // Confidence Comparison
                    const conf1 = ((product1.confidenceScore || 0) * 100).toFixed(1);
                    const conf2 = ((product2.confidenceScore || 0) * 100).toFixed(1);
                    analysis.push('Confidence Score: ' + conf1 + '% vs ' + conf2 + '%');

                    // Rating Comparison
                    analysis.push('User Rating: ' + (product1.rating || 'N/A') + ' vs ' + (product2.rating || 'N/A'));

                    // Price Comparison
                    if (product1.price && product2.price) {
                        analysis.push('Price: ' + cleanText(product1.price) + ' vs ' + cleanText(product2.price));

                        // Calculate price difference percentage
                        const price1Num = parseFloat(String(product1.price).replace(/[^\d.]/g, ''));
                        const price2Num = parseFloat(String(product2.price).replace(/[^\d.]/g, ''));
                        if (price1Num && price2Num) {
                            const priceDiff = Math.abs(((price1Num - price2Num) / price2Num) * 100).toFixed(1);
                            const cheaper = price1Num < price2Num ? 'Product 1' : 'Product 2';
                            analysis.push('Price Difference: ' + priceDiff + '% (' + cheaper + ' is cheaper)');
                        }
                    }

                    // Positive Sentiment Comparison
                    const pos1 = product1.positiveCount || 0;
                    const pos2 = product2.positiveCount || 0;
                    if (pos1 > 0 || pos2 > 0) {
                        analysis.push('Positive Reviews: ' + pos1 + ' vs ' + pos2 +
                                      ' (' + (pos1 > pos2 ? 'Product 1 leads by ' + (pos1 - pos2) :
                                              pos2 > pos1 ? 'Product 2 leads by ' + (pos2 - pos1) : 'Equal') + ')');
                    }

                    // Value for Money Analysis
                    if (product1.discountPercent && product2.discountPercent) {
                        analysis.push('Discount: ' + cleanText(product1.discount || 'N/A') + ' vs ' +
                                      cleanText(product2.discount || 'N/A'));
                    }

                    // Print each analysis point
                    analysis.forEach(line => {
                        if (yPos > 270) {
                            doc.addPage();
                            yPos = 20;
                        }
                        doc.text('- ' + line, 25, yPos, { maxWidth: 165 });
                        yPos += 5;
                    });

                    yPos += 5;
                }
            }

            // Separator line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPos, 190, yPos);
            yPos += 10;

            // Add comparison data for each product
            window.comparisonData.forEach((product, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }

                // Product name
                doc.setFontSize(14);
                doc.setTextColor(40, 116, 240);
                doc.text('Product ' + (index + 1) + ': ' + cleanText(product.productName), 20, yPos, { maxWidth: 170 });
                yPos += 8;

                // Price
                doc.setFontSize(11);
                doc.setTextColor(0);
                if (product.price) {
                    doc.text('Price: ' + cleanText(product.price), 25, yPos);
                    yPos += 6;
                }

                // Original Price and Discount
                if (product.originalPrice && product.originalPrice !== product.price) {
                    doc.text('Original Price: ' + cleanText(product.originalPrice), 25, yPos);
                    yPos += 6;
                }
                if (product.discount) {
                    doc.setTextColor(0, 150, 0);
                    doc.text('Discount: ' + cleanText(product.discount), 25, yPos);
                    doc.setTextColor(0);
                    yPos += 6;
                }

                // Reviews and Rating
                const reviewText = 'Reviews: ' + (product.totalReviews || 0) + ' | Rating: ' + (product.rating || 'N/A') + ' | Confidence: ' + ((product.confidenceScore || 0) * 100).toFixed(1) + '%';
                doc.text(cleanText(reviewText), 25, yPos, { maxWidth: 170 });
                yPos += 6;

                // Sentiment
                const sentimentColor = product.overallSentiment === 'POSITIVE' ? [0, 150, 0] :
                                     product.overallSentiment === 'NEGATIVE' ? [200, 0, 0] : [100, 100, 100];
                doc.setTextColor(...sentimentColor);
                doc.text('Sentiment: ' + cleanText(product.overallSentiment || 'N/A'), 25, yPos);
                doc.setTextColor(0);
                yPos += 6;

                // Sentiment Distribution
                const distText = 'Positive: ' + (product.positiveCount || 0) + ' | Negative: ' + (product.negativeCount || 0) + ' | Neutral: ' + (product.neutralCount || 0);
                doc.text(cleanText(distText), 25, yPos, { maxWidth: 170 });
                yPos += 10;
            });

            // Save PDF
            const filename = `sentiment-analysis-${Date.now()}.pdf`;
            doc.save(filename);

            console.log('PDF exported successfully:', filename);

            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'alert alert-success position-fixed';
            notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px;';
            notification.innerHTML = '<strong>Success!</strong> PDF exported successfully.';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);

        } catch (error) {
            console.error('PDF export error:', error);
            alert('PDF export failed: ' + error.message + '\nPlease try again or check console for details.');
        }
    });
}

// Export to CSV functionality
const exportCSV = document.getElementById('exportCSV');
if (exportCSV) {
    exportCSV.addEventListener('click', () => {
        // Check if we have dataset analysis results
        if (window.currentAnalysisResult && window.currentAnalysisResult.analysis) {
            exportDatasetAnalysisCSV(window.currentAnalysisResult);
            return;
        }

        // Otherwise, try comparison data
        if (!window.comparisonData || window.comparisonData.length === 0) {
            alert('⚠️ No data available to export. Please run an analysis or comparison first.');
            return;
        }

        try {
            // Helper function to properly format CSV field (wrap in quotes if needed)
            const formatCSVField = (text) => {
                if (!text && text !== 0) return 'N/A';
                const cleaned = String(text)
                    .replace(/[\r\n]+/g, ' ') // Remove line breaks
                    .replace(/"/g, '""') // Escape quotes
                    .trim();

                // Wrap in quotes if contains comma, quote, or newline
                if (cleaned.includes(',') || cleaned.includes('"') || cleaned.includes('\n')) {
                    return `"${cleaned}"`;
                }
                return cleaned;
            };

            // Create CSV header with BOM for proper Excel encoding
            const BOM = '\uFEFF';
            const headers = [
                'Product Name',
                'Price',
                'Original Price',
                'Discount',
                'Rating',
                'Total Reviews',
                'Positive Reviews',
                'Negative Reviews',
                'Neutral Reviews',
                'Overall Sentiment',
                'Confidence Score',
                'URL'
            ];

            // Create CSV rows with proper field formatting
            const rows = window.comparisonData.map(product => [
                formatCSVField(product.productName),
                formatCSVField(product.price),
                formatCSVField(product.originalPrice),
                formatCSVField(product.discount),
                formatCSVField(product.rating),
                product.totalReviews || 0,
                product.positiveCount || 0,
                product.negativeCount || 0,
                product.neutralCount || 0,
                formatCSVField(product.overallSentiment),
                formatCSVField(product.confidenceScore ? (product.confidenceScore * 100).toFixed(1) + '%' : 'N/A'),
                formatCSVField(product.url)
            ]);

            // Combine headers and rows with BOM for proper Excel UTF-8 encoding
            const csvContent = BOM + [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `sentiment-analysis-${Date.now()}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('CSV exported successfully');

            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'alert alert-success position-fixed';
            notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px;';
            notification.innerHTML = '<strong>Success!</strong> CSV exported successfully.';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);

        } catch (error) {
            console.error('CSV export error:', error);
            alert('CSV export failed: ' + error.message + '\nPlease try again or check console for details.');
        }
    });
}

// Export Dataset Analysis Results to PDF
function exportDatasetAnalysisPDF(result) {
    try {
        const analysis = result.analysis;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Clean text helper
        const cleanText = (text) => {
            if (!text) return '';
            return String(text).replace(/[^\x20-\x7E]/g, '').trim();
        };

        // Draw header with gradient-like effect
        const drawHeader = (pageNum) => {
            // Blue header background
            doc.setFillColor(41, 128, 185);
            doc.rect(0, 0, pageWidth, 40, 'F');

            // Title
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text('SENTIMENT ANALYSIS REPORT', pageWidth / 2, 18, { align: 'center' });

            // Subtitle
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('Dataset Category Analysis - Comprehensive Product Evaluation', pageWidth / 2, 28, { align: 'center' });

            // Page number
            if (pageNum > 1) {
                doc.setFontSize(9);
                doc.setTextColor(200, 200, 200);
                doc.text(`Page ${pageNum}`, pageWidth - 20, 35, { align: 'right' });
            }
        };

        // Draw footer
        const drawFooter = () => {
            doc.setDrawColor(41, 128, 185);
            doc.setLineWidth(0.5);
            doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 15, pageHeight - 10);
            doc.text('Powered by Sentiment Analysis NLP', pageWidth - 15, pageHeight - 10, { align: 'right' });
        };

        let pageNum = 1;
        let yPos = 50;

        // First page header
        drawHeader(pageNum);

        // Executive Summary Box
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F');

        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.3);
        doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'S');

        yPos += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(52, 73, 94);
        doc.text('EXECUTIVE SUMMARY', 20, yPos);

        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80, 80, 80);

        if (analysis.categoryStats && analysis.categoryStats.length > 0) {
            const stats = analysis.categoryStats[0];
            doc.text(`Products Analyzed: ${stats.products?.length || 0}  |  Total Reviews: ${stats.totalReviews || 0}  |  Avg Rating: ${stats.avgRating}/5.0`, 20, yPos);
            yPos += 6;
            doc.text(`Sentiment: ${stats.positiveRate}% Positive  |  ${stats.neutralRate || 0}% Neutral  |  ${stats.negativeRate || 0}% Negative`, 20, yPos);
        }

        yPos += 15;

        // Winner Section with Trophy Icon
        const winnerRecommendation = analysis.categoryRecommendations && analysis.categoryRecommendations[0];
        const winnerHeight = winnerRecommendation ? 55 : 30;

        doc.setFillColor(39, 174, 96);
        doc.roundedRect(15, yPos, pageWidth - 30, winnerHeight, 3, 3, 'F');

        yPos += 10;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('BEST PRODUCT', 25, yPos);

        yPos += 8;
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const winnerText = cleanText(analysis.bestProduct || 'N/A');
        const splitWinner = doc.splitTextToSize(winnerText, pageWidth - 50);
        doc.text(splitWinner, 25, yPos);

        yPos += (splitWinner.length * 6) + 3;

        // Add reasoning why this product is the winner
        if (winnerRecommendation && winnerRecommendation.whyBest) {
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(245, 245, 245);
            const reasoningText = cleanText(winnerRecommendation.whyBest);
            const splitReasoning = doc.splitTextToSize(reasoningText, pageWidth - 50);
            doc.text(splitReasoning, 25, yPos);
            yPos += (splitReasoning.length * 5) + 2;
        }

        yPos += 9;

        // Performance Metrics Section
        if (analysis.categoryStats && analysis.categoryStats.length > 0) {
            const stats = analysis.categoryStats[0];

            doc.setFillColor(52, 152, 219);
            doc.rect(15, yPos, 4, 8, 'F');

            doc.setFontSize(13);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(41, 128, 185);
            doc.text('PERFORMANCE METRICS', 22, yPos + 6);

            yPos += 15;

            // Metrics in a grid
            const metrics = [
                { label: 'Average Rating', value: `${stats.avgRating}/5.0`, icon: '' },
                { label: 'Total Products', value: `${stats.products?.length || 0}`, icon: '' },
                { label: 'Total Reviews', value: `${stats.totalReviews || 0}`, icon: '' },
                { label: 'Positive Sentiment', value: `${stats.positiveRate}%`, color: [39, 174, 96] },
                { label: 'Neutral Sentiment', value: `${stats.neutralRate || 0}%`, color: [241, 196, 15] },
                { label: 'Negative Sentiment', value: `${stats.negativeRate || 0}%`, color: [231, 76, 60] }
            ];

            let col = 0;
            metrics.forEach((metric, index) => {
                const xPos = 20 + (col * 90);

                // Metric box
                doc.setFillColor(248, 249, 250);
                doc.roundedRect(xPos, yPos, 85, 18, 2, 2, 'F');

                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(120, 120, 120);
                doc.text(metric.label, xPos + 5, yPos + 7);

                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                if (metric.color) {
                    doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
                } else {
                    doc.setTextColor(52, 73, 94);
                }
                doc.text(metric.value, xPos + 5, yPos + 15);

                col++;
                if (col >= 2) {
                    col = 0;
                    yPos += 22;
                }
            });

            if (col !== 0) yPos += 22;
        }

        yPos += 10;

        // Why This Product Section - Detailed Reasoning
        if (winnerRecommendation) {
            // Calculate dynamic height based on content
            let boxHeight = 38;
            let featureCount = 0;
            if (winnerRecommendation.features && winnerRecommendation.features.length > 0) {
                featureCount = Math.min(3, winnerRecommendation.features.length);
                boxHeight += (featureCount * 6);
            }
            if (winnerRecommendation.considerations) {
                boxHeight += 12;
            }

            // Check if box will fit on current page, if not create new page
            // Need extra margin (40px) to prevent overlap with next section
            if (yPos + boxHeight > pageHeight - 40) {
                drawFooter();
                doc.addPage();
                pageNum++;
                drawHeader(pageNum);
                yPos = 50;
            }

            // Save the starting position of the box
            const boxStartY = yPos;

            // Draw the box
            doc.setFillColor(255, 248, 225);
            doc.roundedRect(15, yPos, pageWidth - 30, boxHeight, 3, 3, 'F');

            doc.setDrawColor(243, 156, 18);
            doc.setLineWidth(0.5);
            doc.roundedRect(15, yPos, pageWidth - 30, boxHeight, 3, 3, 'S');

            // Title
            yPos += 8;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(230, 126, 34);
            doc.text('WHY THIS PRODUCT WINS', 20, yPos);

            yPos += 8;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(80, 80, 80);

            // Add key features if available with proper bullets
            if (winnerRecommendation.features && winnerRecommendation.features.length > 0) {
                winnerRecommendation.features.forEach((feature, idx) => {
                    if (idx < 3) { // Limit to 3 features
                        const featureText = cleanText(feature);

                        // Draw bullet point (circle)
                        doc.setFillColor(39, 174, 96);
                        doc.circle(23, yPos - 1.5, 1.5, 'F');

                        // Feature text
                        doc.setTextColor(60, 60, 60);
                        doc.text(featureText, 28, yPos, { maxWidth: pageWidth - 60 });
                        yPos += 5.5;
                    }
                });
            }

            // Add considerations if available
            if (winnerRecommendation.considerations) {
                yPos += 2;
                doc.setFontSize(8);
                doc.setFont(undefined, 'italic');
                doc.setTextColor(120, 120, 120);
                const considerations = cleanText(winnerRecommendation.considerations);
                const splitConsiderations = doc.splitTextToSize(considerations, pageWidth - 50);
                doc.text(splitConsiderations, 23, yPos);
                yPos += (splitConsiderations.length * 3.5);
            }

            // Set yPos to be after the box ends, ensuring we don't overlap
            yPos = boxStartY + boxHeight + 5; // 5px padding after box
        }

        yPos += 15; // Increased spacing after winner section

        // Products Section
        if (analysis.categoryStats && analysis.categoryStats[0]?.products) {
            // Check if header will fit, if not start new page - need at least 50px for header + first card
            if (yPos > pageHeight - 80) {
                drawFooter();
                doc.addPage();
                pageNum++;
                drawHeader(pageNum);
                yPos = 50;
            }

            doc.setFillColor(52, 152, 219);
            doc.rect(15, yPos, 4, 8, 'F');

            doc.setFontSize(13);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(41, 128, 185);
            doc.text('DETAILED PRODUCT ANALYSIS', 22, yPos + 6);

            yPos += 15;

            analysis.categoryStats[0].products.forEach((product, index) => {
                // Check if product card will fit (needs ~35px), if not create new page
                if (yPos > pageHeight - 40) {
                    drawFooter();
                    doc.addPage();
                    pageNum++;
                    drawHeader(pageNum);
                    yPos = 50;
                }

                // Product card
                doc.setFillColor(252, 253, 254);
                doc.roundedRect(15, yPos, pageWidth - 30, 28, 2, 2, 'F');

                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.3);
                doc.roundedRect(15, yPos, pageWidth - 30, 28, 2, 2, 'S');

                // Product number badge
                doc.setFillColor(41, 128, 185);
                doc.circle(23, yPos + 7, 5, 'F');
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(`${index + 1}`, 23, yPos + 9, { align: 'center' });

                // Product name
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(52, 73, 94);
                const productName = cleanText(product.productName || 'Unknown Product');
                const splitName = doc.splitTextToSize(productName, pageWidth - 60);
                doc.text(splitName, 32, yPos + 8);

                // Rating and reviews
                const starY = yPos + 8 + (splitName.length * 5) + 4;
                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(241, 196, 15);
                doc.text('', 32, starY);

                doc.setTextColor(100, 100, 100);
                doc.text(`Rating: ${product.rating}/5.0`, 40, starY);
                doc.text(`|`, 70, starY);
                doc.text(`${product.totalReviews || 0} Reviews`, 75, starY);
                doc.text(`|`, 110, starY);

                // Sentiment badge
                const sentiment = product.overallSentiment || 'NEUTRAL';
                let sentimentColor = [241, 196, 15]; // Yellow for neutral
                if (sentiment === 'POSITIVE') sentimentColor = [39, 174, 96];
                if (sentiment === 'NEGATIVE') sentimentColor = [231, 76, 60];

                doc.setFillColor(sentimentColor[0], sentimentColor[1], sentimentColor[2]);
                doc.roundedRect(115, starY - 4, 25, 6, 1, 1, 'F');
                doc.setFontSize(8);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(sentiment, 127.5, starY, { align: 'center' });

                yPos += 32;
            });
        }

        // Draw footer on last page
        drawFooter();

        // Save PDF
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        doc.save(`Sentiment-Analysis-Report-${timestamp}.pdf`);

        // Success notification with animation
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed shadow-lg';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; animation: slideInRight 0.3s ease-out;';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> <strong>Success!</strong> Professional PDF report exported.';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

    } catch (error) {
        console.error('PDF export error:', error);
        alert('PDF export failed: ' + error.message);
    }
}

// Export Dataset Analysis Results to CSV
function exportDatasetAnalysisCSV(result) {
    try {
        const analysis = result.analysis;
        const BOM = '\uFEFF';

        const formatField = (val) => {
            if (val === null || val === undefined) return '""';
            const str = String(val).replace(/"/g, '""');
            // Always wrap in quotes for proper Excel formatting
            return `"${str}"`;
        };

        let csv = BOM;

        // Standard Excel table header
        csv += 'Rank,Product Name,Rating,Total Reviews,Positive %,Neutral %,Negative %,Overall Sentiment,Price,Product URL\n';

        // Add product data rows
        if (analysis.categoryStats && analysis.categoryStats[0]?.products) {
            analysis.categoryStats[0].products.forEach((product, index) => {
                const dist = product.sentimentDistribution || {};
                const url = product.url || '';
                csv += [
                    index + 1,
                    formatField(product.productName),
                    formatField(product.rating),
                    formatField(product.totalReviews || 0),
                    formatField(dist.positive || '0'),
                    formatField(dist.neutral || '0'),
                    formatField(dist.negative || '0'),
                    formatField(product.overallSentiment),
                    formatField(product.price || product.additionalData?.price || ''),
                    url ? `"${url}"` : '""'  // Always quote URLs
                ].join(',') + '\n';
            });
        }

        // Create download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `sentiment-analysis-${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Success notification
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; animation: slideInRight 0.5s ease-out;';
        notification.innerHTML = '<strong>✅ Success!</strong> Excel file exported successfully.';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 3000);

    } catch (error) {
        console.error('CSV export error:', error);
        alert('CSV export failed: ' + error.message);
    }
}

// Dataset Analysis Form Handler
const datasetAnalysisForm = document.getElementById('datasetAnalysisForm');
if (datasetAnalysisForm) {
    datasetAnalysisForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        showLoading('Analyzing dataset with web scraping...', 'Extracting URLs from file and scraping product data. This may take a few minutes.');

        const fileInput = document.getElementById('datasetFile');
        if (!fileInput || !fileInput.files[0]) {
            hideLoading();
            alert('Please select a dataset file to upload.');
            return;
        }

        const file = fileInput.files[0];
        console.log('📁 File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Validate file extension
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
            hideLoading();
            alert('Invalid file format. Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
            return;
        }

        const formData = new FormData();
        formData.append('analysisType', 'comprehensive');
        formData.append('dataSource', 'upload');
        formData.append('dataset', file);

        console.log('📤 Sending request to:', `${API_BASE_URL}/api/analyze/dataset-categories`);
        console.log('📦 FormData entries:');
        for (let pair of formData.entries()) {
            console.log('   -', pair[0], ':', pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/analyze/dataset-categories`, {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            console.log('📥 Response status:', response.status, response.statusText);

            if (!response.ok) {
                // Try to get error details from response
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || errorData.hint || `HTTP error! status: ${response.status}`;
                console.error('❌ Server error:', errorData);
                throw new Error(errorMessage);
            }

            const result = await response.json();
            hideLoading();

            console.log('📊 Dataset Analysis Response:', result);
            console.log('📊 Status:', result.status);
            console.log('📊 Has Analysis:', !!result.analysis);

            if (result.status === 'error') {
                alert('Error: ' + result.message);
                return;
            }

            console.log('✅ Calling displayCategoryAnalysisResults...');

            // Store the result globally for PDF/CSV export
            window.currentAnalysisResult = result;

            displayCategoryAnalysisResults(result);
            showSection('results');
        } catch (error) {
            console.error('❌ Error in dataset analysis:', error);
            hideLoading();
            alert('Error analyzing dataset: ' + error.message);
        }
    });
}

// URL Analysis Form Handler
const urlAnalysisForm = document.getElementById('urlAnalysisForm');
if (urlAnalysisForm) {
    urlAnalysisForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const urls = document.getElementById('productUrls').value
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);

        if (urls.length === 0) {
            alert('Please enter at least one product URL');
            return;
        }

        // Validate URLs
        const invalidUrls = urls.filter(url => {
            try {
                new URL(url);
                return false;
            } catch {
                return true;
            }
        });

        if (invalidUrls.length > 0) {
            alert(`Invalid URLs found:\n${invalidUrls.join('\n')}\n\nPlease check and fix these URLs.`);
            return;
        }

        const options = {
            extractFeatures: document.getElementById('extractFeatures')?.checked || false,
            sentimentBreakdown: document.getElementById('sentimentBreakdown')?.checked || false,
            generateRecommendation: document.getElementById('generateRecommendation')?.checked || false
        };

        showLoading('Analyzing product reviews...', `Processing ${urls.length} product URL${urls.length > 1 ? 's' : ''} for sentiment analysis`);

        try {
            const response = await fetch(`${API_BASE_URL}/api/analyze/urls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    urls: urls,
                    options: options
                }),
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            hideLoading();
            displayUrlAnalysisResults(result);
            showSection('results');
        } catch (error) {
            hideLoading();
            alert('Error analyzing URLs: ' + error.message);
        }
    });
}

// Display URL Analysis Results
function displayUrlAnalysisResults(result) {
    const analysis = result.analysis;
    const metadata = result.metadata || {};
    const content = document.getElementById('resultsContent');
    const isRealData = metadata.isRealData !== false;

    let html = `
        <div class="container-fluid">
            <!-- Data Source Indicator -->
            <div class="row mb-3">
                <div class="col-12">
                    <div class="alert ${isRealData ? 'alert-success' : 'alert-warning'} text-center">
                        <i class="fas ${isRealData ? 'fa-globe' : 'fa-flask'}"></i>
                        <strong>${isRealData ? '🔍 Real Web Scraped Data' : '🧪 Demo Mode (Mock Data)'}</strong>
                        ${isRealData ?
                            `- Analyzed ${metadata.reviewsFound || analysis.totalReviews} real customer reviews` :
                            '- Using simulated data for demonstration purposes'
                        }
                    </div>
                </div>
            </div>

            <!-- Overall Summary -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h4><i class="fas fa-chart-line"></i> Product Review Analysis Results</h4>
                            <p class="mb-0">
                                ${isRealData ? 'Real sentiment analysis' : 'Demo analysis'} completed for ${analysis.productName || 'your product'}
                                ${analysis.sourceUrl ? `<br><small>Source: ${new URL(analysis.sourceUrl).hostname}</small>` : ''}
                            </p>
                        </div>
                        <div class="card-body">
                            <div class="row text-center">
                                <div class="col-md-3">
                                    <div class="stat-box">
                                        <h3 class="text-primary">${analysis.totalReviews}</h3>
                                        <p class="mb-0">Total Reviews</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="stat-box">
                                        <h3 class="text-success">${(analysis.confidenceScore * 100).toFixed(1)}%</h3>
                                        <p class="mb-0">Confidence Score</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="stat-box">
                                        <h3 class="text-info">${analysis.sentimentDistribution?.positive || 'N/A'}%</h3>
                                        <p class="mb-0">Positive Reviews</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="stat-box">
                                        <span class="badge bg-${getSentimentColor(analysis.overallSentiment)} fs-4">
                                            ${analysis.overallSentiment}
                                        </span>
                                        <p class="mb-0 mt-2">Overall Sentiment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sentiment Chart and Key Features -->
            <div class="row mb-4">
                <!-- Sentiment Breakdown Chart -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-chart-pie"></i> Sentiment Distribution</h5>
                        </div>
                        <div class="card-body text-center">
                            <canvas id="urlSentimentChart" width="300" height="300"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Key Features Extracted -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-star"></i> Key Features Mentioned</h5>
                        </div>
                        <div class="card-body">
                            ${analysis.keyFeatures ? renderKeyFeatures(analysis.keyFeatures) : '<p class="text-muted">Feature extraction not available</p>'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Positive and Negative Insights -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card border-success">
                        <div class="card-header bg-success text-white">
                            <h5><i class="fas fa-thumbs-up"></i> What Customers Love</h5>
                        </div>
                        <div class="card-body">
                            ${analysis.positiveInsights ? renderInsights(analysis.positiveInsights, 'positive') : renderDefaultInsights('positive')}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-danger">
                        <div class="card-header bg-danger text-white">
                            <h5><i class="fas fa-thumbs-down"></i> Common Complaints</h5>
                        </div>
                        <div class="card-body">
                            ${analysis.negativeInsights ? renderInsights(analysis.negativeInsights, 'negative') : renderDefaultInsights('negative')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI Recommendation -->
            ${analysis.recommendation ? `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card border-warning">
                        <div class="card-header bg-warning text-dark">
                            <h5><i class="fas fa-robot"></i> AI Recommendation</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-light">
                                <h6><strong>Should you buy this product?</strong></h6>
                                <p class="mb-2">${analysis.recommendation.summary}</p>
                                <p class="mb-2"><strong>Confidence Level:</strong>
                                    <span class="badge bg-${analysis.recommendation.confidence > 80 ? 'success' : analysis.recommendation.confidence > 60 ? 'warning' : 'danger'}">
                                        ${analysis.recommendation.confidence}%
                                    </span>
                                </p>
                                <p class="mb-0"><strong>Best For:</strong> ${analysis.recommendation.bestFor || 'General users'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    content.innerHTML = html;

    // Create sentiment chart
    setTimeout(() => {
        createSentimentChart(analysis, 'urlSentimentChart');
    }, 100);
}

function renderKeyFeatures(features) {
    if (!features || features.length === 0) return '<p class="text-muted">No key features extracted</p>';

    return features.map(feature => `
        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-check-circle text-success me-2"></i>
            <span>${feature}</span>
        </div>
    `).join('');
}

function renderInsights(insights, type) {
    if (!insights || insights.length === 0) return renderDefaultInsights(type);

    return insights.map(insight => `
        <div class="d-flex align-items-start mb-2">
            <i class="fas fa-quote-left ${type === 'positive' ? 'text-success' : 'text-danger'} me-2 mt-1"></i>
            <span>${insight}</span>
        </div>
    `).join('');
}

function renderDefaultInsights(type) {
    const defaultInsights = {
        positive: [
            'Excellent build quality and premium materials',
            'Outstanding performance in daily usage',
            'Great value for money compared to competitors',
            'Reliable and durable product construction'
        ],
        negative: [
            'Price point may be high for some users',
            'Learning curve for advanced features',
            'Limited availability in certain regions',
            'Some users experienced minor setup issues'
        ]
    };

    return renderInsights(defaultInsights[type], type);
}

// Display Category Analysis Results
function displayCategoryAnalysisResults(result) {
    console.log('📊 Received result:', result);
    const analysis = result.analysis;
    console.log('📊 Analysis object:', analysis);
    const content = document.getElementById('resultsContent');

    // Safety checks for required properties
    if (!analysis || !analysis.categoryStats || !analysis.categoryRecommendations || !analysis.recommendations) {
        console.error('❌ Missing required properties:', {
            hasAnalysis: !!analysis,
            hasCategoryStats: !!analysis?.categoryStats,
            hasCategoryRecommendations: !!analysis?.categoryRecommendations,
            hasRecommendations: !!analysis?.recommendations
        });
        content.innerHTML = `
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle"></i> Error Displaying Results</h5>
                <p>The analysis data structure is incomplete. Please try again.</p>
                <pre>${JSON.stringify(analysis, null, 2)}</pre>
            </div>
        `;
        return;
    }

    console.log('✅ All required properties exist. Rendering...');

    // Get all products for detailed display
    const allProducts = [];
    (analysis.categoryStats || []).forEach(category => {
        if (category.products && Array.isArray(category.products)) {
            allProducts.push(...category.products);
        }
    });

    // Calculate aggregate statistics for statistics dashboard
    const totalReviews = allProducts.reduce((sum, p) => sum + (p.totalReviews || 0), 0);
    const avgRating = allProducts.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / (allProducts.length || 1);

    // Calculate aggregate positive rate
    let totalPositive = 0, totalSentiments = 0;
    allProducts.forEach(product => {
        const dist = product.sentimentDistribution;
        if (dist) {
            const reviewCount = product.totalReviews || 0;
            totalPositive += (parseFloat(dist.positive) / 100) * reviewCount || 0;
            totalSentiments += reviewCount;
        }
    });
    const positiveRate = totalSentiments > 0 ? (totalPositive / totalSentiments) * 100 : 0;

    // Create enhanced product cards
    const productCardsHtml = allProducts.map((product, index) => {
        const rating = product.rating || 'N/A';
        const reviewCount = product.totalReviews || 0;
        const price = product.additionalData?.price || product.price || 'Not available';
        const sentiment = product.overallSentiment || 'NEUTRAL';
        const productName = product.productName || product.title || 'Unknown Product';
        const sentimentColor = sentiment === 'POSITIVE' ? 'success' : sentiment === 'NEGATIVE' ? 'danger' : 'warning';

        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm hover-card">
                <div class="card-header bg-gradient-${sentimentColor} text-white">
                    <h6 class="mb-0"><i class="fas fa-mobile-alt"></i> Product ${index + 1}</h6>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-primary">${productName}</h5>

                    <div class="row text-center mb-3">
                        <div class="col-4">
                            <div class="stat-box bg-light p-2 rounded">
                                <h4 class="text-warning mb-0">${rating}</h4>
                                <small class="text-muted">★ Rating</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-box bg-light p-2 rounded">
                                <h4 class="text-info mb-0">${reviewCount}</h4>
                                <small class="text-muted">Reviews</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-box bg-light p-2 rounded">
                                <h4 class="text-${sentimentColor} mb-0"><i class="fas fa-${sentiment === 'POSITIVE' ? 'smile' : sentiment === 'NEGATIVE' ? 'frown' : 'meh'}"></i></h4>
                                <small class="text-muted">${sentiment}</small>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <h6 class="text-success"><i class="fas fa-tag"></i> ${price}</h6>
                    </div>

                    ${product.additionalData?.discount ? `
                        <div class="mb-2">
                            <span class="badge bg-danger"><i class="fas fa-percent"></i> ${product.additionalData.discount} OFF</span>
                        </div>
                    ` : ''}

                    ${product.url ? `
                        <a href="${product.url}" target="_blank" class="btn btn-sm btn-outline-primary w-100 mt-2">
                            <i class="fas fa-external-link-alt"></i> View Product
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Enhanced category stats with charts
    const categoryCardsHtml = (analysis.categoryStats || []).map(category => {
        const products = category.products || [];
        const avgRating = parseFloat(category.avgRating) || 0;
        const positiveRate = parseFloat(category.positiveRate) || 0;
        const neutralRate = parseFloat(category.neutralRate) || 0;
        const negativeRate = parseFloat(category.negativeRate) || 0;
        const totalReviews = category.totalReviews || 0;
        const marketShare = category.marketShare || 0;

        // Debug sentiment rates
        console.log('🎨 FRONTEND RENDERING - Sentiment Rates:');
        console.log('   Category Name:', category.name);
        console.log('   Raw category.positiveRate:', category.positiveRate, typeof category.positiveRate);
        console.log('   Raw category.neutralRate:', category.neutralRate, typeof category.neutralRate);
        console.log('   Raw category.negativeRate:', category.negativeRate, typeof category.negativeRate);
        console.log('   Parsed positiveRate:', positiveRate);
        console.log('   Parsed neutralRate:', neutralRate);
        console.log('   Parsed negativeRate:', negativeRate);
        console.log('   Sum:', (positiveRate + neutralRate + negativeRate).toFixed(1) + '%');

        // Rating progress bar
        const ratingPercentage = (avgRating / 5) * 100;

        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 border-primary shadow">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="fas fa-layer-group"></i> ${category.name || 'Unknown Category'}</h5>
                </div>
                <div class="card-body">
                    <div class="mb-4">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="text-muted">Average Rating</span>
                            <span class="fw-bold text-primary">${avgRating.toFixed(1)}/5.0</span>
                        </div>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar bg-warning" role="progressbar" style="width: ${ratingPercentage}%" aria-valuenow="${avgRating}" aria-valuemin="0" aria-valuemax="5">
                                ${avgRating.toFixed(1)}★
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="text-muted">Positive Sentiment</span>
                            <span class="fw-bold text-success">${positiveRate.toFixed(1)}%</span>
                        </div>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${positiveRate}%" aria-valuenow="${positiveRate}" aria-valuemin="0" aria-valuemax="100">
                                ${positiveRate.toFixed(0)}%
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="text-muted">Neutral Sentiment</span>
                            <span class="fw-bold text-secondary">${neutralRate.toFixed(1)}%</span>
                        </div>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar bg-secondary" role="progressbar" style="width: ${neutralRate}%" aria-valuenow="${neutralRate}" aria-valuemin="0" aria-valuemax="100">
                                ${neutralRate.toFixed(0)}%
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="text-muted">Negative Sentiment</span>
                            <span class="fw-bold text-danger">${negativeRate.toFixed(1)}%</span>
                        </div>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: ${negativeRate}%" aria-valuenow="${negativeRate}" aria-valuemin="0" aria-valuemax="100">
                                ${negativeRate.toFixed(0)}%
                            </div>
                        </div>
                    </div>

                    <div class="row g-2">
                        <div class="col-6">
                            <div class="bg-light p-2 rounded text-center">
                                <h4 class="text-primary mb-0">${products.length}</h4>
                                <small class="text-muted">Products</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="bg-light p-2 rounded text-center">
                                <h4 class="text-info mb-0">${totalReviews}</h4>
                                <small class="text-muted">Reviews</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');    // Individual Product Recommendations for each category
    const categoryRecommendationsHtml = (analysis.categoryRecommendations || []).map(rec => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 border-success">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h6 class="mb-0"><i class="fas fa-trophy"></i> Best in ${rec.category}</h6>
                    <span class="badge bg-light text-success">${rec.confidence}%</span>
                </div>
                <div class="card-body">
                    <h5 class="text-primary">${rec.winner}</h5>
                    <div class="row text-center mb-3">
                        <div class="col-6">
                            <div class="stat-box bg-light">
                                <h6 class="text-warning">${rec.rating}/5.0</h6>
                                <small>Rating</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="stat-box bg-light">
                                <h6 class="text-info">${rec.price}</h6>
                                <small>Price</small>
                            </div>
                        </div>
                    </div>
                    <p><strong>Why it's the best:</strong></p>
                    <p class="text-success small">${rec.whyBest || 'N/A'}</p>
                    <p><strong>Key Features:</strong></p>
                    <div class="mb-2">
                        ${(rec.features || []).map(feature => `<span class="badge bg-secondary me-1">${feature}</span>`).join('')}
                    </div>
                    <p><strong>Consider:</strong></p>
                    <p class="text-warning small">${rec.considerations || 'N/A'}</p>
                    <div class="text-center mt-3">
                        <small class="text-muted">${rec.reviews} reviews analyzed</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    const overallRecommendationsHtml = (analysis.recommendations || []).map((rec, index) => `
        <div class="col-md-4 mb-3">
            <div class="card recommendation-card border-warning">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="text-warning">${rec.type || 'Recommendation'}</h6>
                        <span class="badge bg-success">${rec.confidence || 0}%</span>
                    </div>
                    <h6 class="text-primary">${rec.product || 'N/A'}</h6>
                    <p class="small text-muted">${rec.reason || ''}</p>
                </div>
            </div>
        </div>
    `).join('');

    content.innerHTML = `
        <div class="dataset-analysis-results">
            <div class="row mb-4">
                <div class="col-12">
                    <div class="alert alert-success">
                        <h5><i class="fas fa-trophy"></i> Analysis Complete!</h5>
                        <p class="mb-0">Best Category: <strong>${analysis.bestCategory}</strong> | Overall Winner: <strong>${analysis.bestProduct}</strong></p>
                    </div>
                </div>
            </div>

            <!-- CHARTS SECTION -->
            <div class="row mb-4">
                <!-- Sentiment Distribution Chart -->
                <div class="col-lg-6 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-gradient-success text-white">
                            <h5 class="mb-0"><i class="fas fa-chart-pie"></i> Sentiment Distribution</h5>
                            <small>Overall sentiment across all products</small>
                        </div>
                        <div class="card-body" style="min-height: 350px; position: relative;">
                            <canvas id="sentimentChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Product Comparison Chart -->
                <div class="col-lg-6 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-gradient-primary text-white">
                            <h5 class="mb-0"><i class="fas fa-chart-bar"></i> Product Performance Comparison</h5>
                            <small>Rating and review count comparison</small>
                        </div>
                        <div class="card-body" style="min-height: 350px; position: relative;">
                            <canvas id="productComparisonChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Classifications by Strengths (NEW) -->
            ${analysis.productClassifications ? renderProductClassifications(analysis.productClassifications) : ''}

            <div class="row mb-4">
                <div class="col-12 mb-3">
                    <h4><i class="fas fa-chart-bar"></i> Category Performance Overview</h4>
                </div>
            </div>
            <div class="row mb-4">
                ${categoryCardsHtml}
            </div>

            <div class="row mb-4">
                <div class="col-12 mb-3">
                    <h4><i class="fas fa-medal"></i> Best Product in Each Category</h4>
                    <p class="text-muted">Our top recommendation for each product category based on ratings, reviews, and user satisfaction</p>
                </div>
            </div>
            <div class="row mb-4">
                ${categoryRecommendationsHtml}
            </div>

            <div class="row mb-4">
                <div class="col-12">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div class="card">
                        <div class="card-body">
                            <ul class="list-unstyled">
                                ${(analysis.insights || []).map(insight => `<li><i class="fas fa-check-circle text-success me-2"></i>${insight}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-12">
                    <h4><i class="fas fa-star"></i> Cross-Category Recommendations</h4>
                </div>
                ${overallRecommendationsHtml}
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="fas fa-bullseye"></i> Final Recommendation Summary</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                ${analysis.categoryRecommendations.map(rec => `
                                    <div class="col-md-4 mb-3">
                                        <div class="text-center p-3 bg-light rounded position-relative">
                                            <div class="position-absolute top-0 start-50 translate-middle">
                                                <span class="badge bg-warning text-dark" style="font-size: 1.2rem; padding: 8px 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                                                    <i class="fas fa-trophy"></i> WINNER
                                                </span>
                                            </div>
                                            <div style="margin-top: 25px;">
                                                <h6 class="text-primary">${rec.category}</h6>
                                                <h5 class="text-success fw-bold">${rec.winner}</h5>
                                                <p class="small text-muted mb-2">${rec.price} • ${rec.rating}/5.0 ★</p>
                                                <span class="badge bg-success">${rec.confidence}% confident</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="alert alert-warning mt-3 border border-warning" style="background: linear-gradient(135deg, #fff9e6 0%, #fffef5 100%); border-width: 2px !important;">
                                <div class="d-flex align-items-center">
                                    <div class="me-3" style="font-size: 3rem;">
                                        <i class="fas fa-crown text-warning"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="mb-1">
                                            <span class="badge bg-warning text-dark me-2" style="font-size: 1rem;">
                                                <i class="fas fa-trophy me-1"></i>OVERALL CHAMPION
                                            </span>
                                        </h5>
                                        <h4 class="text-dark fw-bold mb-2">${analysis.bestProduct}</h4>
                                        <p class="mb-0 text-dark">Based on comprehensive analysis of ${analysis.categoryStats.reduce((sum, cat) => sum + cat.totalReviews, 0)} reviews across all categories, this product offers the best combination of quality, user satisfaction, and market validation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Create Charts after DOM is updated
    setTimeout(() => {
        createAggregateSentimentChart(allProducts);
        createProductComparisonChart(allProducts);
    }, 100);

    // Populate product URL select dropdowns for compare section
    populateProductUrlSelects(allProducts);
}

// Function to populate product URL select dropdowns
function populateProductUrlSelects(products) {
    const product1Select = document.getElementById('product1UrlSelect');
    const product2Select = document.getElementById('product2UrlSelect');

    if (!product1Select || !product2Select) return;

    // Clear existing options (keep the first default option)
    product1Select.innerHTML = '<option value="">-- Select from previous analysis --</option>';
    product2Select.innerHTML = '<option value="">-- Select from previous analysis --</option>';

    // Add products to both dropdowns
    products.forEach((product, index) => {
        const productName = product.productName || product.title || `Product ${index + 1}`;
        const productUrl = product.url || '';

        if (productUrl) {
            const option1 = document.createElement('option');
            option1.value = productUrl;
            option1.textContent = `${index + 1}. ${productName.substring(0, 60)}${productName.length > 60 ? '...' : ''}`;

            const option2 = document.createElement('option');
            option2.value = productUrl;
            option2.textContent = `${index + 1}. ${productName.substring(0, 60)}${productName.length > 60 ? '...' : ''}`;

            product1Select.appendChild(option1);
            product2Select.appendChild(option2);
        }
    });

    console.log(`✅ Populated URL dropdowns with ${products.length} products`);
}

// Handle product URL select changes
document.addEventListener('DOMContentLoaded', function() {
    const product1Select = document.getElementById('product1UrlSelect');
    const product2Select = document.getElementById('product2UrlSelect');
    const product1Textarea = document.getElementById('product1Urls');
    const product2Textarea = document.getElementById('product2Urls');

    if (product1Select && product1Textarea) {
        product1Select.addEventListener('change', function() {
            if (this.value) {
                product1Textarea.value = this.value;
            }
        });
    }

    if (product2Select && product2Textarea) {
        product2Select.addEventListener('change', function() {
            if (this.value) {
                product2Textarea.value = this.value;
            }
        });
    }
});

// Render Product Classifications by Strengths
function renderProductClassifications(classifications) {
    if (!classifications) return '';

    // Dynamic classification rendering - supports all product categories
    const classificationMeta = {
        // Phone categories
        cameraQuality: { icon: 'camera', color: 'primary' },
        performance: { icon: 'bolt', color: 'warning' },
        batteryLife: { icon: 'battery-full', color: 'success' },

        // Perfume categories
        longevity: { icon: 'clock', color: 'primary' },
        scentQuality: { icon: 'spray-can', color: 'warning' },
        versatility: { icon: 'star', color: 'success' },

        // Laptop categories
        portability: { icon: 'laptop', color: 'primary' },

        // Watch categories
        features: { icon: 'list-check', color: 'primary' },
        design: { icon: 'gem', color: 'warning' },

        // Headphone categories
        soundQuality: { icon: 'music', color: 'primary' },
        noiseCancellation: { icon: 'volume-mute', color: 'warning' },

        // Generic categories
        quality: { icon: 'check-circle', color: 'primary' },
        durability: { icon: 'shield', color: 'success' },

        // Universal categories
        valueForMoney: { icon: 'tag', color: 'info' },
        userSatisfaction: { icon: 'heart', color: 'danger' },
        premium: { icon: 'crown', color: 'dark' }
    };

    const classificationsHtml = Object.keys(classifications).map(key => {
        const classification = classifications[key];
        if (!classification || !classification.winner) return '';

        const meta = classificationMeta[key] || { icon: 'star', color: 'primary' };
        const winner = classification.winner;
        const topProducts = classification.topProducts || [];

        return `
            <div class="col-lg-6 mb-4">
                <div class="card shadow-sm h-100 hover-card">
                    <div class="card-header bg-${meta.color} text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-${meta.icon} me-2"></i>${classification.name}
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- Winner Card -->
                        <div class="winner-card p-3 mb-3 bg-light rounded border border-${meta.color}">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div class="flex-grow-1">
                                    <h6 class="text-${meta.color} mb-1">
                                        <i class="fas fa-trophy me-1"></i>Winner
                                    </h6>
                                    <h5 class="mb-2">${winner.name}</h5>
                                </div>
                                <div class="text-end">
                                    <span class="badge bg-${meta.color} fs-6">${winner.rating}★</span>
                                </div>
                            </div>

                            <div class="row text-center mb-3">
                                <div class="col-4">
                                    <small class="text-muted d-block">Reviews</small>
                                    <strong class="text-${meta.color}">${winner.reviews}</strong>
                                </div>
                                <div class="col-4">
                                    <small class="text-muted d-block">Score</small>
                                    <strong class="text-${meta.color}">${winner.score}</strong>
                                </div>
                                <div class="col-4">
                                    <small class="text-muted d-block">Price</small>
                                    <strong class="text-${meta.color}">${winner.price}</strong>
                                </div>
                            </div>

                            <div class="mb-2">
                                <span class="badge bg-success-soft text-success">
                                    <i class="fas fa-smile me-1"></i>${winner.sentiment}
                                </span>
                            </div>

                            <p class="small text-muted mb-2">
                                <i class="fas fa-info-circle me-1"></i>${winner.whyBest}
                            </p>

                            ${winner.url ? `
                                <a href="${winner.url}" target="_blank" class="btn btn-sm btn-outline-${meta.color} w-100">
                                    <i class="fas fa-external-link-alt me-1"></i>View Product
                                </a>
                            ` : ''}
                        </div>

                        <!-- Top 3 Products Ranking -->
                        ${topProducts.length > 1 ? `
                            <div class="top-products mt-3">
                                <h6 class="text-muted mb-2">
                                    <i class="fas fa-list-ol me-1"></i>Top ${topProducts.length} Products
                                </h6>
                                <div class="list-group list-group-flush">
                                    ${topProducts.map((product, index) => `
                                        <div class="list-group-item px-0 py-2">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span class="badge bg-${index === 0 ? 'warning' : index === 1 ? 'secondary' : 'bronze'} me-2">
                                                        ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'}
                                                    </span>
                                                    <small class="text-truncate d-inline-block" style="max-width: 200px;">
                                                        ${product.name}
                                                    </small>
                                                </div>
                                                <div class="text-end">
                                                    <small class="text-warning fw-bold">${product.rating}★</small>
                                                    <small class="text-muted ms-2">(${product.reviews})</small>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).filter(html => html !== '').join('');

    return `
        <div class="row mb-4">
            <div class="col-12">
                <div class="card bg-gradient-info text-white mb-3">
                    <div class="card-body">
                        <h3 class="mb-2">
                            <i class="fas fa-star me-2"></i>Intelligent Product Analysis
                        </h3>
                        <p class="mb-0">
                            Products automatically classified based on their key strengths and customer feedback.
                            Find the perfect product that matches your specific needs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-4">
            ${classificationsHtml}
        </div>
    `;
}

// Create Sentiment Distribution Pie Chart
function createAggregateSentimentChart(products) {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) {
        console.error('❌ Sentiment chart canvas not found');
        return;
    }

    console.log('📊 Creating aggregate sentiment chart for', products.length, 'products');

    // Calculate aggregate sentiment
    let totalPositive = 0, totalNeutral = 0, totalNegative = 0;

    products.forEach(product => {
        const dist = product.sentimentDistribution;
        if (dist) {
            const reviewCount = product.totalReviews || product.reviews?.length || 1; // At least 1 for percentage calculation
            totalPositive += (parseFloat(dist.positive) / 100) * reviewCount || 0;
            totalNeutral += (parseFloat(dist.neutral) / 100) * reviewCount || 0;
            totalNegative += (parseFloat(dist.negative) / 100) * reviewCount || 0;
        }
    });

    const total = totalPositive + totalNeutral + totalNegative;

    // If no sentiment data, use dummy data to show chart structure
    let positivePercent = total > 0 ? ((totalPositive / total) * 100).toFixed(1) : 33.3;
    let neutralPercent = total > 0 ? ((totalNeutral / total) * 100).toFixed(1) : 33.3;
    let negativePercent = total > 0 ? ((totalNegative / total) * 100).toFixed(1) : 33.4;

    console.log('📊 Chart data:', { positivePercent, neutralPercent, negativePercent, total });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [positivePercent, neutralPercent, negativePercent],
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
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: `Total Reviews: ${Math.round(total)}`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create Product Comparison Bar Chart
function createProductComparisonChart(products) {
    const ctx = document.getElementById('productComparisonChart');
    if (!ctx) {
        console.error('❌ Product comparison chart canvas not found');
        return;
    }

    console.log('📊 Creating product comparison chart for', products.length, 'products');

    // Get product names (truncated for readability)
    const productNames = products.map(p => {
        const name = p.productName || p.title || 'Unknown';
        return name.length > 30 ? name.substring(0, 30) + '...' : name;
    });

    // Get ratings and review counts
    const ratings = products.map(p => parseFloat(p.rating) || 3.5);
    const reviewCounts = products.map(p => p.totalReviews || 50);

    console.log('📊 Chart data:', { productNames, ratings, reviewCounts });

    // Calculate a "performance score" (rating * log(reviews + 1))
    const performanceScores = products.map((p, i) => {
        const rating = parseFloat(p.rating) || 0;
        const reviews = p.totalReviews || 0;
        return (rating * Math.log10(reviews + 1)).toFixed(2);
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [
                {
                    label: 'Rating (out of 5)',
                    data: ratings,
                    backgroundColor: 'rgba(255, 193, 7, 0.8)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Review Count',
                    data: reviewCounts,
                    backgroundColor: 'rgba(13, 110, 253, 0.8)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 2,
                    yAxisID: 'y1'
                },
                {
                    label: 'Performance Score',
                    data: performanceScores,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 2,
                    yAxisID: 'y2',
                    type: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                },
                title: {
                    display: true,
                    text: 'Product Performance Metrics',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.dataset.label === 'Rating (out of 5)') {
                                    label += context.parsed.y + '/5.0 ★';
                                } else if (context.dataset.label === 'Review Count') {
                                    label += context.parsed.y + ' reviews';
                                } else {
                                    label += context.parsed.y;
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Rating (★)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    max: 5,
                    ticks: {
                        callback: function(value) {
                            return value + '★';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Review Count',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                y2: {
                    type: 'linear',
                    display: false,
                    position: 'right'
                }
            }
        }
    });
}

// Review Analysis Comparison Section
function renderReviewAnalysisComparison(product1, product2, comparison) {
    // Calculate review metrics for both products
    const product1Reviews = product1.reviews || [];
    const product2Reviews = product2.reviews || [];
    const product1TotalReviews = product1.totalReviews || product1Reviews.length || 0;
    const product2TotalReviews = product2.totalReviews || product2Reviews.length || 0;

    // Get sentiment data
    const product1Sentiment = product1.overallSentiment || (product1.sentimentScore > 0.6 ? 'POSITIVE' : product1.sentimentScore < 0.4 ? 'NEGATIVE' : 'NEUTRAL');
    const product2Sentiment = product2.overallSentiment || (product2.sentimentScore > 0.6 ? 'POSITIVE' : product2.sentimentScore < 0.4 ? 'NEGATIVE' : 'NEUTRAL');

    // Get confidence scores - use real scraped data
    const product1Confidence = product1.dataSource === 'scraped' ?
        (product1.confidenceScore * 100).toFixed(1) :
        ((product1.confidenceScore || product1.sentimentScore || 0.8) * 100).toFixed(1);
    const product2Confidence = product2.dataSource === 'scraped' ?
        (product2.confidenceScore * 100).toFixed(1) :
        ((product2.confidenceScore || product2.sentimentScore || 0.8) * 100).toFixed(1);

    // Get ratings
    const product1Rating = product1.rating || (product1.sentimentScore ? (product1.sentimentScore * 5).toFixed(1) : '4.2');
    const product2Rating = product2.rating || (product2.sentimentScore ? (product2.sentimentScore * 5).toFixed(1) : '4.1');

    // Get key insights
    const product1Insights = product1.positiveInsights || product1.insights || ['Great build quality', 'Excellent performance', 'Good value for money'];
    const product2Insights = product2.positiveInsights || product2.insights || ['Solid performance', 'User-friendly interface', 'Reliable durability'];

    const product1Concerns = product1.negativeInsights || product1.concerns || ['Battery life could be better', 'Camera quality in low light'];
    const product2Concerns = product2.negativeInsights || product2.concerns || ['Heating issues during gaming', 'Limited storage options'];

    return `
        <!-- Review Analysis Section -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h4><i class="fas fa-chart-line"></i> Review Analysis Comparison</h4>
                        <p class="mb-0">Comprehensive sentiment analysis based on customer reviews</p>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- Product 1 Review Analysis -->
                            <div class="col-md-6">
                                <div class="card h-100 border-primary">
                                    <div class="card-header bg-primary text-white">
                                        <h5><i class="fas fa-comments"></i> ${product1.productName || product1.title || 'Product 1'}</h5>
                                    </div>
                                    <div class="card-body">
                                        <!-- Review Stats -->
                                        <div class="row text-center mb-3">
                                            <div class="col-4">
                                                <h4 class="text-primary">${product1TotalReviews}</h4>
                                                <small class="text-muted">Total Reviews</small>
                                            </div>
                                            <div class="col-4">
                                                <h4 class="text-warning">${product1Rating} ⭐</h4>
                                                <small class="text-muted">Average Rating</small>
                                            </div>
                                            <div class="col-4">
                                                <h4 class="text-success">${product1Confidence}%</h4>
                                                <small class="text-muted">Confidence</small>
                                            </div>
                                        </div>

                                        <!-- Sentiment Badge -->
                                        <div class="text-center mb-3">
                                            <span class="badge bg-${getSentimentColor(product1Sentiment)} fs-6">
                                                ${product1Sentiment} SENTIMENT
                                            </span>
                                        </div>

                                        <!-- Positive Insights -->
                                        <div class="mb-3">
                                            <h6 class="text-success"><i class="fas fa-thumbs-up"></i> Top Positive Points</h6>
                                            <ul class="list-unstyled">
                                                ${product1Insights.slice(0, 3).map(insight =>
                                                    `<li class="mb-1"><small><i class="fas fa-check text-success"></i> ${insight}</small></li>`
                                                ).join('')}
                                            </ul>
                                        </div>

                                        <!-- Areas of Concern -->
                                        <div class="mb-3">
                                            <h6 class="text-warning"><i class="fas fa-exclamation-triangle"></i> Areas of Concern</h6>
                                            <ul class="list-unstyled">
                                                ${product1Concerns.slice(0, 2).map(concern =>
                                                    `<li class="mb-1"><small><i class="fas fa-minus text-warning"></i> ${concern}</small></li>`
                                                ).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Product 2 Review Analysis -->
                            <div class="col-md-6">
                                <div class="card h-100 border-info">
                                    <div class="card-header bg-info text-white">
                                        <h5><i class="fas fa-comments"></i> ${product2.productName || product2.title || 'Product 2'}</h5>
                                    </div>
                                    <div class="card-body">
                                        <!-- Review Stats -->
                                        <div class="row text-center mb-3">
                                            <div class="col-4">
                                                <h4 class="text-primary">${product2TotalReviews}</h4>
                                                <small class="text-muted">Total Reviews</small>
                                            </div>
                                            <div class="col-4">
                                                <h4 class="text-warning">${product2Rating} ⭐</h4>
                                                <small class="text-muted">Average Rating</small>
                                            </div>
                                            <div class="col-4">
                                                <h4 class="text-success">${product2Confidence}%</h4>
                                                <small class="text-muted">Confidence</small>
                                            </div>
                                        </div>

                                        <!-- Sentiment Badge -->
                                        <div class="text-center mb-3">
                                            <span class="badge bg-${getSentimentColor(product2Sentiment)} fs-6">
                                                ${product2Sentiment} SENTIMENT
                                            </span>
                                        </div>

                                        <!-- Positive Insights -->
                                        <div class="mb-3">
                                            <h6 class="text-success"><i class="fas fa-thumbs-up"></i> Top Positive Points</h6>
                                            <ul class="list-unstyled">
                                                ${product2Insights.slice(0, 3).map(insight =>
                                                    `<li class="mb-1"><small><i class="fas fa-check text-success"></i> ${insight}</small></li>`
                                                ).join('')}
                                            </ul>
                                        </div>

                                        <!-- Areas of Concern -->
                                        <div class="mb-3">
                                            <h6 class="text-warning"><i class="fas fa-exclamation-triangle"></i> Areas of Concern</h6>
                                            <ul class="list-unstyled">
                                                ${product2Concerns.slice(0, 2).map(concern =>
                                                    `<li class="mb-1"><small><i class="fas fa-minus text-warning"></i> ${concern}</small></li>`
                                                ).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Review Comparison Summary -->
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="alert alert-light">
                                    <h6><i class="fas fa-analytics"></i> Review Analysis Summary</h6>
                                    <p class="mb-2">
                                        <strong>Total Reviews Analyzed:</strong> ${product1TotalReviews + product2TotalReviews} customer reviews
                                    </p>
                                    <p class="mb-2">
                                        <strong>Winner by Reviews:</strong>
                                        ${product1TotalReviews > product2TotalReviews ?
                                            `${product1.productName || 'Product 1'} (${product1TotalReviews} vs ${product2TotalReviews} reviews)` :
                                            product2TotalReviews > product1TotalReviews ?
                                            `${product2.productName || 'Product 2'} (${product2TotalReviews} vs ${product1TotalReviews} reviews)` :
                                            'Tie - Equal number of reviews'
                                        }
                                    </p>
                                    <p class="mb-0">
                                        <strong>Winner by Sentiment:</strong>
                                        ${parseFloat(product1Rating) > parseFloat(product2Rating) ?
                                            `${product1.productName || 'Product 1'} (${product1Rating}⭐ vs ${product2Rating}⭐)` :
                                            parseFloat(product2Rating) > parseFloat(product1Rating) ?
                                            `${product2.productName || 'Product 2'} (${product2Rating}⭐ vs ${product1Rating}⭐)` :
                                            'Tie - Equal ratings'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// AI Recommendation Comparison Section
function renderAIRecommendationComparison(product1, product2, comparison) {
    // Determine the overall winner
    const winner = comparison.winner || {};
    const winnerName = winner.productName || 'Analysis Complete';
    const winnerReason = winner.reason || 'Based on comprehensive analysis';

    // Calculate value scores
    const product1Price = parseInt((product1.price || '₹10000').replace(/[₹,]/g, '')) || 10000;
    const product2Price = parseInt((product2.price || '₹12000').replace(/[₹,]/g, '')) || 12000;
    const product1Rating = parseFloat(product1.rating || (product1.sentimentScore ? (product1.sentimentScore * 5).toFixed(1) : '4.2'));
    const product2Rating = parseFloat(product2.rating || (product2.sentimentScore ? (product2.sentimentScore * 5).toFixed(1) : '4.1'));

    // Calculate value for money (rating per 1000 rupees)
    const product1Value = (product1Rating / (product1Price / 1000)).toFixed(2);
    const product2Value = (product2Rating / (product2Price / 1000)).toFixed(2);

    // Generate use case recommendations
    const useCases = [
        {
            title: "Budget Conscious Buyers",
            icon: "fas fa-wallet",
            winner: product1Price < product2Price ? (product1.productName || 'Product 1') : (product2.productName || 'Product 2'),
            reason: product1Price < product2Price ?
                `₹${(product2Price - product1Price).toLocaleString()} cheaper than the alternative` :
                `₹${(product1Price - product2Price).toLocaleString()} cheaper than the alternative`
        },
        {
            title: "Performance Seekers",
            icon: "fas fa-rocket",
            winner: product1Rating > product2Rating ? (product1.productName || 'Product 1') : (product2.productName || 'Product 2'),
            reason: product1Rating > product2Rating ?
                `${product1Rating}⭐ rating vs ${product2Rating}⭐ rating` :
                `${product2Rating}⭐ rating vs ${product1Rating}⭐ rating`
        },
        {
            title: "Value for Money",
            icon: "fas fa-balance-scale",
            winner: parseFloat(product1Value) > parseFloat(product2Value) ? (product1.productName || 'Product 1') : (product2.productName || 'Product 2'),
            reason: parseFloat(product1Value) > parseFloat(product2Value) ?
                `${product1Value} rating per ₹1000 vs ${product2Value}` :
                `${product2Value} rating per ₹1000 vs ${product1Value}`
        }
    ];

    return `
        <!-- AI Recommendation Section -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-gradient text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <h4><i class="fas fa-brain"></i> AI-Powered Recommendation</h4>
                        <p class="mb-0">Intelligent analysis based on pricing, reviews, and user preferences</p>
                    </div>
                    <div class="card-body">
                        <!-- Overall AI Recommendation -->
                        <div class="row mb-4">
                            <div class="col-12">
                                <div class="alert alert-success text-center">
                                    <h4><i class="fas fa-award text-warning"></i> AI Recommendation Winner</h4>
                                    <h5 class="text-success">${winnerName}</h5>
                                    <p class="mb-2">${winnerReason}</p>
                                    ${comparison.recommendation ? `<small class="text-muted">${comparison.recommendation}</small>` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Use Case Recommendations -->
                        <div class="row mb-4">
                            <div class="col-12">
                                <h5><i class="fas fa-users"></i> Recommendations by User Profile</h5>
                            </div>
                            ${useCases.map(useCase => `
                                <div class="col-md-4 mb-3">
                                    <div class="card h-100 border-light">
                                        <div class="card-body text-center">
                                            <i class="${useCase.icon} fa-2x text-primary mb-3"></i>
                                            <h6 class="text-primary">${useCase.title}</h6>
                                            <h5 class="text-success">${useCase.winner}</h5>
                                            <p class="small text-muted">${useCase.reason}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Decision Matrix -->
                        <div class="row">
                            <div class="col-12">
                                <h5><i class="fas fa-chart-bar"></i> Decision Matrix</h5>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead class="table-dark">
                                            <tr>
                                                <th>Criteria</th>
                                                <th class="text-center">${product1.productName || 'Product 1'}</th>
                                                <th class="text-center">${product2.productName || 'Product 2'}</th>
                                                <th class="text-center">Winner</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><i class="fas fa-rupee-sign text-success"></i> Price</td>
                                                <td class="text-center">${product1.price || '₹10,999'}</td>
                                                <td class="text-center">${product2.price || '₹14,699'}</td>
                                                <td class="text-center">
                                                    <span class="badge bg-${product1Price < product2Price ? 'success' : 'secondary'}">
                                                        ${product1Price < product2Price ? (product1.productName || 'Product 1') : (product2.productName || 'Product 2')}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i class="fas fa-star text-warning"></i> User Rating</td>
                                                <td class="text-center">${product1Rating}⭐</td>
                                                <td class="text-center">${product2Rating}⭐</td>
                                                <td class="text-center">
                                                    <span class="badge bg-${product1Rating > product2Rating ? 'success' : 'secondary'}">
                                                        ${product1Rating > product2Rating ? (product1.productName || 'Product 1') : (product2.productName || 'Product 2')}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i class="fas fa-balance-scale text-info"></i> Value Score</td>
                                                <td class="text-center">${product1Value}</td>
                                                <td class="text-center">${product2Value}</td>
                                                <td class="text-center">
                                                    <span class="badge bg-${parseFloat(product1Value) > parseFloat(product2Value) ? 'success' : 'secondary'}">
                                                        ${parseFloat(product1Value) > parseFloat(product2Value) ? (product1.productName || 'Product 1') : (product2.productName || 'Product 2')}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i class="fas fa-comments text-primary"></i> Total Reviews</td>
                                                <td class="text-center">${product1.totalReviews || (product1.reviews ? product1.reviews.length : 0) || 0}</td>
                                                <td class="text-center">${product2.totalReviews || (product2.reviews ? product2.reviews.length : 0) || 0}</td>
                                                <td class="text-center">
                                                    <span class="badge bg-${(product1.totalReviews || 0) > (product2.totalReviews || 0) ? 'success' : 'secondary'}">
                                                        ${(product1.totalReviews || 0) > (product2.totalReviews || 0) ? (product1.productName || 'Product 1') : (product2.productName || 'Product 2')}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Final Recommendation -->
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="alert alert-info">
                                    <h6><i class="fas fa-lightbulb"></i> Final AI Recommendation</h6>
                                    <p class="mb-2">
                                        Based on comprehensive analysis of pricing, user reviews, ratings, and value propositions,
                                        <strong>${winnerName}</strong> emerges as the recommended choice.
                                    </p>
                                    <p class="mb-0">
                                        <small class="text-muted">
                                            This recommendation considers multiple factors including cost-effectiveness,
                                            user satisfaction, and overall market reception to provide the most balanced choice.
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
