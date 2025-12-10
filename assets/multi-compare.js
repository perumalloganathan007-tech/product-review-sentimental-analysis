// ============================================
// MULTI-COMPARE FUNCTIONS
// ============================================

let urlInputCounter = 1;

// Add new URL input dynamically
function addUrlInput() {
    const container = document.getElementById('urlInputsList');
    const newIndex = urlInputCounter++;

    const newInputGroup = document.createElement('div');
    newInputGroup.className = 'url-input-group mb-3';
    newInputGroup.setAttribute('data-index', newIndex);
    newInputGroup.innerHTML = `
        <div class="input-group input-group-lg">
            <span class="input-group-text bg-primary text-white">
                <i class="fas fa-link"></i> <strong class="ms-2">${newIndex + 1}</strong>
            </span>
            <input type="url" class="form-control url-input"
                   placeholder="https://www.flipkart.com/product-url or https://www.amazon.in/product-url"
                   onchange="validateUrlInput(this)"
                   required>
            <button type="button" class="btn btn-outline-danger" onclick="removeUrlInput(${newIndex})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-1">
            <small class="form-text text-muted">
                <i class="fas fa-info-circle me-1"></i>Enter Flipkart or Amazon product URL
            </small>
            <small class="url-status text-muted hidden">
                <i class="fas fa-check-circle text-success"></i> Valid URL
            </small>
        </div>
    `;

    container.appendChild(newInputGroup);

    // Add paste event listener to clean URLs automatically
    const input = newInputGroup.querySelector('.url-input');
    input.addEventListener('paste', handleUrlPaste);

    // Prevent Enter key from submitting any form
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log('⚠️ Enter key pressed - prevented form submission');
        }
    });

    // Enable delete buttons if more than one input
    updateDeleteButtons();
    updateUrlCount();
}// Handle paste event to clean URLs
function handleUrlPaste(event) {
    event.preventDefault();

    // Get pasted text
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');

    // Clean the URL - remove line breaks but preserve URL structure
    let cleanedUrl = pastedText
        .replace(/[\r\n]+/g, '')  // Remove line breaks
        .replace(/\s+(?!\/\/)/g, '') // Remove spaces except before //
        .trim();

    // Add https:// if missing
    if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
        if (cleanedUrl.includes('amazon.') || cleanedUrl.includes('flipkart.')) {
            cleanedUrl = 'https://' + cleanedUrl;
        }
    }

    // Add www. if missing for common domains
    try {
        const urlObj = new URL(cleanedUrl);
        if ((urlObj.hostname === 'amazon.in' || urlObj.hostname === 'flipkart.com') &&
            !urlObj.hostname.startsWith('www.')) {
            urlObj.hostname = 'www.' + urlObj.hostname;
            cleanedUrl = urlObj.toString();
        }
    } catch (e) {
        // If URL parsing fails, just continue with what we have
    }

    // Set the cleaned URL
    event.target.value = cleanedUrl;

    // Trigger validation
    validateUrlInput(event.target);
}

// Remove URL input
function removeUrlInput(index) {
    const inputGroup = document.querySelector(`[data-index="${index}"]`);
    if (inputGroup) {
        inputGroup.remove();
        updateDeleteButtons();
        renumberInputs();
        updateUrlCount();
    }
}

// Update delete button states
function updateDeleteButtons() {
    const inputs = document.querySelectorAll('.url-input-group');
    const deleteButtons = document.querySelectorAll('.url-input-group .btn-outline-danger');

    if (inputs.length === 1) {
        deleteButtons.forEach(btn => btn.disabled = true);
    } else {
        deleteButtons.forEach(btn => btn.disabled = false);
    }
}

// Renumber input labels
function renumberInputs() {
    const inputs = document.querySelectorAll('.url-input-group');
    inputs.forEach((input, index) => {
        const label = input.querySelector('.input-group-text strong');
        if (label) {
            label.textContent = index + 1;
        }
    });
    updateUrlCount();
}

// Clear all URLs
function clearAllUrls() {
    if (!confirm('Are you sure you want to clear all URLs?')) {
        return;
    }

    const container = document.getElementById('urlInputsList');
    container.innerHTML = `
        <div class="url-input-group mb-3" data-index="0">
            <div class="input-group input-group-lg">
                <span class="input-group-text bg-primary text-white">
                    <i class="fas fa-link"></i> <strong class="ms-2">1</strong>
                </span>
                <input type="url" class="form-control url-input"
                       placeholder="https://www.flipkart.com/product-url or https://www.amazon.in/product-url"
                       onchange="validateUrlInput(this)"
                       required>
                <button type="button" class="btn btn-outline-danger" onclick="removeUrlInput(0)" disabled>
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <small class="form-text text-muted">
                    <i class="fas fa-info-circle me-1"></i>Enter Flipkart or Amazon product URL
                </small>
                <small class="url-status text-muted hidden">
                    <i class="fas fa-check-circle text-success"></i> Valid URL
                </small>
            </div>
        </div>
    `;


    // Attach paste handler to the new input
    const newInput = container.querySelector('.url-input');
    newInput.addEventListener('paste', handleUrlPaste);

    // Prevent Enter key from submitting any form
    newInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log('⚠️ Enter key pressed - prevented form submission');
        }
    });

    urlInputCounter = 1;
    updateUrlCount();
}// Scrape multiple URLs
async function scrapeMultipleUrls() {
    console.log('🚀 scrapeMultipleUrls() called - Multi-compare button clicked!');

    const urlInputs = document.querySelectorAll('.url-input');
    const urls = Array.from(urlInputs)
        .map(input => {
            // Clean up URL - remove line breaks, extra spaces, and normalize
            let url = input.value.trim();

            // Remove any line breaks or carriage returns
            url = url.replace(/[\r\n]+/g, '');

            // Remove spaces BUT preserve the structure
            // Only remove spaces that are clearly accidental (not in protocol)
            url = url.replace(/\s+(?!\/\/)/g, ''); // Remove spaces except before //

            // Add https:// if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                // Check if it's a domain without protocol
                if (url.includes('amazon.') || url.includes('flipkart.')) {
                    url = 'https://' + url;
                    console.log(`🔧 Added https:// prefix to: ${url}`);
                }
            }

            // Add www. if missing for common domains
            try {
                const urlObj = new URL(url);
                if ((urlObj.hostname === 'amazon.in' || urlObj.hostname === 'flipkart.com') &&
                    !urlObj.hostname.startsWith('www.')) {
                    urlObj.hostname = 'www.' + urlObj.hostname;
                    url = urlObj.toString();
                    console.log(`🔧 Added www. prefix to: ${url}`);
                }
            } catch (e) {
                // If URL parsing fails, just continue
            }

            return url;
        })
        .filter(url => url !== '');

    console.log(`📋 Found ${urls.length} URLs:`, urls);

    if (urls.length === 0) {
        alert('Please enter at least one URL');
        return;
    }

    // Validate URLs
    const invalidUrls = urls.filter(url => !isValidProductUrl(url));
    if (invalidUrls.length > 0) {
        console.log('❌ Invalid URLs detected:', invalidUrls);
        console.log('Validation details:', invalidUrls.map(url => {
            try {
                const urlObj = new URL(url);
                return `${url} -> hostname: ${urlObj.hostname}`;
            } catch (e) {
                return `${url} -> Error: ${e.message}`;
            }
        }));
        alert(`Invalid URL(s) detected:\n\n${invalidUrls.join('\n')}\n\nPlease enter valid Flipkart or Amazon product URLs.`);
        return;
    }

    console.log('✅ All URLs are valid!');

    // Store URLs in localStorage
    localStorage.setItem('multiCompareUrls', JSON.stringify(urls));
    console.log('💾 URLs saved to localStorage');

    // Redirect to analysis page
    console.log('🔄 Redirecting to multi-compare-analysis.html...');
    window.location.href = 'multi-compare-analysis.html';
}

// Validate product URL
function isValidProductUrl(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        // Check for Flipkart
        if (hostname.includes('flipkart.com')) {
            return true;
        }

        // Check for Amazon (amazon.in, amazon.com, www.amazon.in, www.amazon.com, etc.)
        if (hostname.includes('amazon.')) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

// Display multi-compare results
function displayMultiCompareResults(products) {
    const resultsContent = document.getElementById('scrapedResultsContent');

    // Generate intelligent analysis
    const intelligentAnalysis = generateIntelligentAnalysis(products.filter(p => !p.error));

    let html = `
        <div class="row mb-4">
            <div class="col-12">
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Successfully scraped ${products.filter(p => !p.error).length} out of ${products.length} product(s)</strong>
                </div>
            </div>
        </div>

        ${intelligentAnalysis}
    `;

    products.forEach(product => {
        if (product.error) {
            html += `
                <div class="card mb-3 border-danger">
                    <div class="card-header bg-danger text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-exclamation-triangle me-2"></i>Product ${product.index} - Error
                        </h5>
                    </div>
                    <div class="card-body">
                        <p class="text-danger"><strong>Error:</strong> ${product.error}</p>
                        <small class="text-muted"><strong>URL:</strong> ${product.url}</small>
                    </div>
                </div>
            `;
        } else {
            const sentiment = product.overallSentiment || 'NEUTRAL';
            const sentimentColor = sentiment === 'POSITIVE' ? 'success' : sentiment === 'NEGATIVE' ? 'danger' : 'warning';
            const dist = product.sentimentDistribution || {};

            html += `
                <div class="card mb-3 shadow-sm">
                    <div class="card-header bg-${sentimentColor} text-white">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-box me-2"></i>Product ${product.index}
                            </h5>
                            <span class="badge bg-light text-dark">${sentiment}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h4 class="text-primary mb-3">${getProductDisplayName(product)}</h4>

                        <div class="row mb-3">
                            <div class="col-md-3">
                                <div class="text-center p-3 bg-light rounded">
                                    <i class="fas fa-star text-warning fs-3"></i>
                                    <h5 class="mt-2 mb-0">${product.rating || 'N/A'}</h5>
                                    <small class="text-muted">Rating</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center p-3 bg-light rounded">
                                    <i class="fas fa-comments text-primary fs-3"></i>
                                    <h5 class="mt-2 mb-0">${product.totalReviews || 0}</h5>
                                    <small class="text-muted">Reviews</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center p-3 bg-light rounded">
                                    <i class="fas fa-tag text-success fs-3"></i>
                                    <h5 class="mt-2 mb-0">${product.price || product.additionalData?.price || 'N/A'}</h5>
                                    <small class="text-muted">Price</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center p-3 bg-light rounded">
                                    <i class="fas fa-smile text-${sentimentColor} fs-3"></i>
                                    <h5 class="mt-2 mb-0">${dist.positive || 0}%</h5>
                                    <small class="text-muted">Positive</small>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <h6><i class="fas fa-chart-pie me-2"></i>Sentiment Distribution</h6>
                            <div class="d-flex gap-2">
                                <span class="badge bg-success">Positive: ${dist.positive || 0}%</span>
                                <span class="badge bg-warning">Neutral: ${dist.neutral || 0}%</span>
                                <span class="badge bg-danger">Negative: ${dist.negative || 0}%</span>
                            </div>
                        </div>

                        <a href="${product.url}" target="_blank" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-external-link-alt me-1"></i>View Product
                        </a>
                    </div>
                </div>
            `;
        }
    });


    resultsContent.innerHTML = html;

    // Add to multi-compare history
    const validProducts = products.filter(p => !p.error);
    if (validProducts.length > 0) {
        // Find top product by rating
        const topProduct = validProducts.reduce((best, current) => {
            const bestRating = parseFloat(best.rating) || 0;
            const currentRating = parseFloat(current.rating) || 0;
            return currentRating > bestRating ? current : best;
        }, validProducts[0]);

        // Calculate total reviews
        const totalReviews = validProducts.reduce((sum, p) => sum + (parseInt(p.totalReviews) || 0), 0);

        addHistoryEntry('multi-compare', {
            productsCount: validProducts.length,
            topProduct: getProductDisplayName(topProduct),
            highestRating: topProduct.rating || 'N/A',
            totalReviews: totalReviews
        });
    }
}

// ============================================
// INTELLIGENT ANALYSIS FUNCTIONS
// ============================================

// Helper function to get product display name from various possible fields
function getProductDisplayName(product) {
    if (!product) return 'Unknown Product';

    // Try different possible name fields
    return product.productName ||
           product.title ||
           product.name ||
           product.product_title ||
           product.product_name ||
           product.Product_Name ||
           product.Title ||
           'Unknown Product';
}

function generateIntelligentAnalysis(validProducts) {
    if (validProducts.length === 0) {
        return '';
    }

    // Calculate analysis categories
    const analysis = {
        bestOverall: findBestOverallQuality(validProducts),
        bestValue: findBestValueForMoney(validProducts),
        highestSatisfaction: findHighestUserSatisfaction(validProducts),
        premiumChoice: findPremiumChoice(validProducts)
    };

    return `
        <div class="row mb-5">
            <div class="col-12">
                <div class="card border-0 shadow-lg">
                    <div class="card-header bg-gradient text-white text-center py-4"
                         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;">
                        <h4 class="mb-2">
                            <i class="fas fa-star me-2"></i>Intelligent Product Analysis
                        </h4>
                        <p class="mb-0">Products automatically classified based on their key strengths and customer feedback. Find the perfect product that matches your specific needs.</p>
                    </div>
                    <div class="card-body p-0">
                        <div class="row g-0">
                            ${generateAnalysisCard(analysis.bestOverall, 'Best Overall Quality', 'primary', 'trophy', 'Winner')}
                            ${generateAnalysisCard(analysis.bestValue, 'Best Value for Money', 'warning', 'coins', 'Winner')}
                            ${generateAnalysisCard(analysis.highestSatisfaction, 'Highest User Satisfaction', 'danger', 'heart', 'Winner')}
                            ${generateAnalysisCard(analysis.premiumChoice, 'Premium Choice', 'dark', 'crown', 'Winner')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateAnalysisCard(product, category, colorClass, icon, badge) {
    if (!product) {
        return `
            <div class="col-lg-6 col-xl-3">
                <div class="card border-0 h-100">
                    <div class="card-header bg-${colorClass} text-white text-center">
                        <h6 class="mb-0">
                            <i class="fas fa-${icon} me-1"></i>${category}
                        </h6>
                    </div>
                    <div class="card-body text-center">
                        <p class="text-muted">No suitable product found</p>
                    </div>
                </div>
            </div>
        `;
    }

    const sentiment = product.overallSentiment || 'NEUTRAL';
    const sentimentColor = sentiment === 'POSITIVE' ? 'success' : sentiment === 'NEGATIVE' ? 'danger' : 'warning';
    const dist = product.sentimentDistribution || {};

    return `
        <div class="col-lg-6 col-xl-3">
            <div class="card border-0 h-100 shadow-sm">
                <div class="card-header bg-${colorClass} text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                            <i class="fas fa-${icon} me-1"></i>${category}
                        </h6>
                        <span class="badge bg-light text-${colorClass}">${badge}</span>
                    </div>
                </div>
                <div class="card-body">
                    <h6 class="text-${colorClass} mb-3" style="font-size: 0.95rem; line-height: 1.3;">
                        ${getProductDisplayName(product).substring(0, 80)}${getProductDisplayName(product).length > 80 ? '...' : ''}
                    </h6>

                    <div class="row text-center mb-3" style="font-size: 0.85rem;">
                        <div class="col-6">
                            <div class="text-center">
                                <strong>${product.totalReviews || 0}</strong>
                                <div class="text-muted">Reviews</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="text-center">
                                <strong>${product.rating || 'N/A'}</strong>
                                <div class="text-muted">Rating</div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <small class="text-muted">Sentiment</small>
                            <small class="badge bg-${sentimentColor}">${sentiment}</small>
                        </div>
                    </div>

                    <ul class="list-unstyled mb-3" style="font-size: 0.8rem;">
                        ${generateTopFeatures(product).map(feature =>
                            `<li><i class="fas fa-check text-${colorClass} me-1"></i> ${feature}</li>`
                        ).join('')}
                    </ul>

                    <div class="row mb-3">
                        <div class="col-12">
                            <h6 class="mb-2" style="font-size: 0.9rem;">Top 2 Products</h6>
                            ${generateTopProductsList([product], colorClass)}
                        </div>
                    </div>

                    <a href="${product.url}" target="_blank" class="btn btn-outline-${colorClass} btn-sm w-100">
                        <i class="fas fa-external-link-alt me-1"></i>View Product
                    </a>
                </div>
            </div>
        </div>
    `;
}

function generateTopFeatures(product) {
    const features = [];

    if (product.rating && parseFloat(product.rating) >= 4.0) {
        features.push(`High rating (${product.rating})`);
    }

    const dist = product.sentimentDistribution || {};
    if (dist.positive && parseInt(dist.positive) >= 70) {
        features.push(`${dist.positive}% positive reviews`);
    }

    if (product.totalReviews && parseInt(product.totalReviews) >= 100) {
        features.push(`${product.totalReviews}+ reviews`);
    }

    if (product.price) {
        features.push(`Priced at ${product.price}`);
    }

    // Default features if none found
    if (features.length === 0) {
        features.push('Quality product');
        features.push('Customer verified');
    }

    return features.slice(0, 3); // Max 3 features
}

function generateTopProductsList(products, colorClass) {
    return products.slice(0, 2).map((product, index) => {
        const rating = product.rating || 'N/A';
        const productName = getProductDisplayName(product);
        return `
            <div class="d-flex align-items-center mb-2" style="font-size: 0.8rem;">
                <span class="badge bg-${colorClass} me-2">${index + 1}</span>
                <div class="flex-grow-1">
                    <div class="text-truncate">${productName.substring(0, 40)}${productName.length > 40 ? '...' : ''}</div>
                    <small class="text-muted">Rating: ${rating}</small>
                </div>
            </div>
        `;
    }).join('');
}

function findBestOverallQuality(products) {
    return products.reduce((best, current) => {
        const currentScore = calculateQualityScore(current);
        const bestScore = calculateQualityScore(best);
        return currentScore > bestScore ? current : best;
    }, products[0]);
}

function findBestValueForMoney(products) {
    return products.reduce((best, current) => {
        const currentValue = calculateValueScore(current);
        const bestValue = calculateValueScore(best);
        return currentValue > bestValue ? current : best;
    }, products[0]);
}

function findHighestUserSatisfaction(products) {
    return products.reduce((best, current) => {
        const currentSatisfaction = calculateSatisfactionScore(current);
        const bestSatisfaction = calculateSatisfactionScore(best);
        return currentSatisfaction > bestSatisfaction ? current : best;
    }, products[0]);
}

function findPremiumChoice(products) {
    return products.reduce((best, current) => {
        const currentPremium = calculatePremiumScore(current);
        const bestPremium = calculatePremiumScore(best);
        return currentPremium > bestPremium ? current : best;
    }, products[0]);
}

function calculateQualityScore(product) {
    const rating = parseFloat(product.rating) || 0;
    const reviews = parseInt(product.totalReviews) || 0;
    const positive = parseInt(product.sentimentDistribution?.positive) || 0;

    return (rating / 5) * 40 + Math.min(reviews / 100, 1) * 30 + (positive / 100) * 30;
}

function calculateValueScore(product) {
    const rating = parseFloat(product.rating) || 0;
    const priceText = product.price || product.additionalData?.price || '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

    // Lower price + higher rating = better value
    const priceScore = price > 0 ? Math.max(0, 100 - (price / 1000)) : 50;
    return (rating / 5) * 50 + (priceScore / 100) * 50;
}

function calculateSatisfactionScore(product) {
    const positive = parseInt(product.sentimentDistribution?.positive) || 0;
    const negative = parseInt(product.sentimentDistribution?.negative) || 0;
    const reviews = parseInt(product.totalReviews) || 0;

    const sentimentScore = positive - negative;
    const reviewBonus = Math.min(reviews / 50, 1) * 20;

    return sentimentScore + reviewBonus;
}

function calculatePremiumScore(product) {
    const rating = parseFloat(product.rating) || 0;
    const reviews = parseInt(product.totalReviews) || 0;
    const priceText = product.price || product.additionalData?.price || '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

    // Higher price + high quality = premium
    const priceScore = price > 0 ? Math.min(price / 1000, 1) * 40 : 0;
    return (rating / 5) * 40 + Math.min(reviews / 200, 1) * 20 + priceScore;
}

// ============================================
// HISTORY FILTERING FUNCTIONS
// ============================================

// Filter history by type
function filterHistory(type) {
    // Check if history elements exist (they may have been removed)
    const datasetHistory = document.getElementById('datasetHistory');
    const compareHistory = document.getElementById('compareHistory');
    const multiCompareHistory = document.getElementById('multiCompareHistory');
    const historyTypeLabel = document.getElementById('historyTypeLabel');

    // Return early if history elements don't exist
    if (!datasetHistory || !compareHistory || !multiCompareHistory || !historyTypeLabel) {
        console.log('History elements not found, skipping filterHistory');
        return;
    }

    // Hide all sections first
    datasetHistory.classList.add('hidden');
    compareHistory.classList.add('hidden');
    multiCompareHistory.classList.add('hidden');

    // Show selected section(s) and update label
    switch(type) {
        case 'all':
            datasetHistory.classList.remove('hidden');
            compareHistory.classList.remove('hidden');
            multiCompareHistory.classList.remove('hidden');
            historyTypeLabel.textContent = 'All History';
            break;
        case 'dataset':
            datasetHistory.classList.remove('hidden');
            historyTypeLabel.textContent = 'Dataset Analysis';
            break;
        case 'compare':
            compareHistory.classList.remove('hidden');
            historyTypeLabel.textContent = 'Compare (2 Products)';
            break;
        case 'multi-compare':
            multiCompareHistory.classList.remove('hidden');
            historyTypeLabel.textContent = 'Multi-Compare';
            break;
    }

    console.log(`📊 History filtered to: ${type}`);
}

// Add history entry
function addHistoryEntry(type, data) {
    const timestamp = new Date().toLocaleString();

    switch(type) {
        case 'dataset':
            addDatasetHistoryEntry(data, timestamp);
            break;
        case 'compare':
            addCompareHistoryEntry(data, timestamp);
            break;
        case 'multi-compare':
            addMultiCompareHistoryEntry(data, timestamp);
            break;
    }
}

// Add dataset analysis to history
function addDatasetHistoryEntry(data, timestamp) {
    const tbody = document.getElementById('datasetHistoryBody');

    // Remove "no history" message if exists
    if (tbody.querySelector('td[colspan]')) {
        tbody.innerHTML = '';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.category || 'N/A'}</td>
        <td>${data.totalProducts || 0}</td>
        <td>${data.totalReviews || 0}</td>
        <td>${data.avgRating || 'N/A'}</td>
        <td>${data.bestProduct || 'N/A'}</td>
        <td>${timestamp}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="viewHistoryDetails('dataset', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteHistoryEntry('dataset', this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
}

// Add compare to history
function addCompareHistoryEntry(data, timestamp) {
    const tbody = document.getElementById('compareHistoryBody');

    // Remove "no history" message if exists
    if (tbody.querySelector('td[colspan]')) {
        tbody.innerHTML = '';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.product1 || 'Product 1'}</td>
        <td>${data.product2 || 'Product 2'}</td>
        <td><span class="badge bg-success">${data.winner || 'N/A'}</span></td>
        <td>${data.rating1 || 'N/A'}</td>
        <td>${data.rating2 || 'N/A'}</td>
        <td>${timestamp}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="viewHistoryDetails('compare', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteHistoryEntry('compare', this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
}

// Add multi-compare to history
function addMultiCompareHistoryEntry(data, timestamp) {
    const tbody = document.getElementById('multiCompareHistoryBody');

    // Remove "no history" message if exists
    if (tbody.querySelector('td[colspan]')) {
        tbody.innerHTML = '';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.productsCount || 0} products</td>
        <td>${data.topProduct || 'N/A'}</td>
        <td>${data.highestRating || 'N/A'}</td>
        <td>${data.totalReviews || 0}</td>
        <td>${timestamp}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="viewHistoryDetails('multi-compare', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteHistoryEntry('multi-compare', this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
}

// View history details (placeholder)
function viewHistoryDetails(type, data) {
    alert(`View details for ${type}:\n${JSON.stringify(data, null, 2)}`);
    // TODO: Implement detailed view modal
}

// Delete history entry
function deleteHistoryEntry(type, button) {
    if (confirm('Are you sure you want to delete this history entry?')) {
        const row = button.closest('tr');
        row.remove();

        // Check if table is empty and add "no history" message
        const tbody = row.parentElement;
        if (tbody.children.length === 0) {
            const colspan = tbody.parentElement.querySelector('thead tr').children.length;
            tbody.innerHTML = `<tr><td colspan="${colspan}" class="text-center text-muted">No ${type} history yet</td></tr>`;
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize URL count
    updateUrlCount();
});

// ============================================
// ENHANCED MULTI-COMPARE FEATURES
// ============================================

// Update URL count display
function updateUrlCount() {
    const inputs = document.querySelectorAll('.url-input-group');
    const countElement = document.getElementById('urlCount');
    if (countElement) {
        countElement.textContent = inputs.length;
    }
}

// Validate URL input in real-time
function validateUrlInput(inputElement) {
    const url = inputElement.value.trim();
    const statusElement = inputElement.closest('.url-input-group').querySelector('.url-status');

    if (url && isValidProductUrl(url)) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        if (statusElement) {
            statusElement.classList.remove('hidden');
        }
    } else if (url) {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        if (statusElement) {
            statusElement.classList.add('hidden');
        }
    } else {
        inputElement.classList.remove('is-valid', 'is-invalid');
        if (statusElement) {
            statusElement.classList.add('hidden');
        }
    }
}

// Paste multiple URLs from clipboard
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        const urls = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('http'));

        if (urls.length === 0) {
            alert('No valid URLs found in clipboard. URLs must start with http:// or https://');
            return;
        }

        // Clear existing inputs
        const container = document.getElementById('urlInputsList');
        container.innerHTML = '';
        urlInputCounter = 0;

        // Add each URL
        urls.forEach((url, index) => {
            const newInputGroup = document.createElement('div');
            newInputGroup.className = 'url-input-group mb-3';
            newInputGroup.setAttribute('data-index', index);
            newInputGroup.innerHTML = `
                <div class="input-group input-group-lg">
                    <span class="input-group-text bg-primary text-white">
                        <i class="fas fa-link"></i> <strong class="ms-2">${index + 1}</strong>
                    </span>
                    <input type="url" class="form-control url-input"
                           value="${url}"
                           onchange="validateUrlInput(this)"
                           required>
                    <button type="button" class="btn btn-outline-danger" onclick="removeUrlInput(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-1">
                    <small class="form-text text-muted">
                        <i class="fas fa-info-circle me-1"></i>Enter Flipkart or Amazon product URL
                    </small>
                    <small class="url-status text-muted hidden">
                        <i class="fas fa-check-circle text-success"></i> Valid URL
                    </small>
                </div>
            `;
            container.appendChild(newInputGroup);

            // Attach paste handler and validate
            const input = newInputGroup.querySelector('.url-input');
            input.addEventListener('paste', handleUrlPaste);

            // Prevent Enter key from submitting any form
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    console.log('⚠️ Enter key pressed - prevented form submission');
                }
            });

            validateUrlInput(input);
        });        urlInputCounter = urls.length;
        updateDeleteButtons();
        updateUrlCount();

        alert(`Successfully pasted ${urls.length} URL(s)`);
    } catch (error) {
        alert('Failed to read from clipboard. Please paste manually or grant clipboard permission.');
        console.error('Clipboard error:', error);
    }
}

// Show URL help modal
function showUrlHelp() {
    const helpText = `📌 HOW TO GET PRODUCT URLs:

AMAZON:
1. Go to Amazon.in
2. Search for a product
3. Click on the product
4. Copy the URL from browser address bar
   Example: https://www.amazon.in/dp/B0CX59H5XS

FLIPKART:
1. Go to Flipkart.com
2. Search for a product
3. Click on the product
4. Copy the URL from browser address bar
   Example: https://www.flipkart.com/product/p/itmXXXXXXXXXX

✅ SUPPORTED FORMATS:
• https://www.amazon.in/dp/ASIN
• https://amazon.in/product/ASIN
• https://www.flipkart.com/product/p/id
• https://flipkart.com/product-name/p/id

❌ NOT SUPPORTED:
• Search result pages
• Category pages
• Shopping cart URLs`;

    alert(helpText);
}

// Load sample URLs for testing
function loadSampleUrls() {
    const sampleUrls = [
        'https://www.amazon.in/dp/B0CX59H5XS',
        'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485686b79',
        'https://www.amazon.in/dp/B0CHX3TW6X'
    ];

    if (!confirm('Load sample product URLs? This will replace current URLs.')) {
        return;
    }

    // Clear existing
    const container = document.getElementById('urlInputsList');
    container.innerHTML = '';
    urlInputCounter = 0;

    // Add samples
    sampleUrls.forEach((url, index) => {
        const newInputGroup = document.createElement('div');
        newInputGroup.className = 'url-input-group mb-3';
        newInputGroup.setAttribute('data-index', index);
        newInputGroup.innerHTML = `
            <div class="input-group input-group-lg">
                <span class="input-group-text bg-primary text-white">
                    <i class="fas fa-link"></i> <strong class="ms-2">${index + 1}</strong>
                </span>
                <input type="url" class="form-control url-input is-valid"
                       value="${url}"
                       onchange="validateUrlInput(this)"
                       required>
                <button type="button" class="btn btn-outline-danger" onclick="removeUrlInput(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <small class="form-text text-muted">
                    <i class="fas fa-info-circle me-1"></i>Enter Flipkart or Amazon product URL
                </small>
                <small class="url-status text-muted">
                    <i class="fas fa-check-circle text-success"></i> Valid URL
                </small>
            </div>
        `;
        container.appendChild(newInputGroup);

        // Attach paste handler to sample input
        const input = newInputGroup.querySelector('.url-input');
        input.addEventListener('paste', handleUrlPaste);

        // Prevent Enter key from submitting any form
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log('⚠️ Enter key pressed - prevented form submission');
            }
        });
    });    urlInputCounter = sampleUrls.length;
    updateDeleteButtons();
    updateUrlCount();
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize paste handlers on page load
document.addEventListener('DOMContentLoaded', function() {
    // Attach paste handlers to all existing URL inputs
    const existingInputs = document.querySelectorAll('.url-input');
    existingInputs.forEach(input => {
        input.addEventListener('paste', handleUrlPaste);

        // Prevent Enter key from submitting any form
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log('⚠️ Enter key pressed in multi-compare input - prevented form submission');
            }
        });
    });

    console.log('✅ Multi-compare initialized with URL paste handlers and Enter key prevention');
});
