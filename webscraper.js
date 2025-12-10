// @ts-nocheck
// eslint-disable
/* eslint-disable */
/**
 * @fileoverview Web Scraper Module - JavaScript file, no TypeScript checking needed
 * @author System
 * @version 1.0
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const natural = require('natural');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

class WebScraper {
    constructor() {
        this.browser = null;
    }

    async init() {
        if (!this.browser) {
            console.log('🚀 Initializing Puppeteer browser...');
            try {
                // Try to find system browser (Chrome or Edge)
                const fs = require('fs');
                const possiblePaths = [
                    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
                    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
                ];

                let executablePath = null;
                for (const path of possiblePaths) {
                    if (fs.existsSync(path)) {
                        executablePath = path;
                        console.log(`✅ Found system browser: ${path}`);
                        break;
                    }
                }

                const launchOptions = {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu',
                        '--disable-web-security',
                        '--disable-features=IsolateOrigins,site-per-process',
                        '--window-size=1920,1080',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-infobars',
                        '--disable-background-networking',
                        '--disable-default-apps',
                        '--disable-extensions',
                        '--disable-sync',
                        '--disable-translate',
                        '--hide-scrollbars',
                        '--metrics-recording-only',
                        '--mute-audio',
                        '--no-first-run',
                        '--safebrowsing-disable-auto-update'
                    ],
                    defaultViewport: {
                        width: 1920,
                        height: 1080
                    },
                    ignoreHTTPSErrors: true,
                    protocolTimeout: 60000
                };

                // Use system browser if found, otherwise let Puppeteer use bundled Chromium
                if (executablePath) {
                    launchOptions.executablePath = executablePath;
                }

                this.browser = await puppeteer.launch(launchOptions);

                console.log('✅ Puppeteer browser initialized successfully');

                // Handle browser disconnect
                this.browser.on('disconnected', () => {
                    console.log('⚠️ Browser disconnected');
                    this.browser = null;
                });
            } catch (initError) {
                console.error('❌ Failed to initialize Puppeteer browser:', initError.message);
                console.error('   Error details:', initError);
                throw new Error(`Puppeteer initialization failed: ${initError.message}`);
            }
        } else {
            console.log('✓ Browser already initialized');
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async scrapeProductReviews(url) {
        console.log(`\n🕷️ === Starting scrapeProductReviews for: ${url} ===`);
        let page = null;
        try {
            console.log('  Step 1: Initializing browser...');
            await this.init();
            console.log('  Step 2: Creating new page...');
            page = await this.browser.newPage();
            console.log('  Step 3: Setting up anti-blocking...');

            // Enhanced anti-blocking techniques
            await this.setupAntiBlocking(page);

            // Navigate with multiple strategies
            try {
                await this.smartNavigation(page, url);
            } catch (navError) {
                await page.close();

                // Return user-friendly error message
                if (navError.message.includes('Network error') ||
                    navError.message.includes('ERR_NAME_NOT_RESOLVED')) {
                    throw new Error('Unable to connect to the website. Please check your internet connection and verify the URL is correct.');
                } else if (navError.message.includes('timeout')) {
                    throw new Error('Website took too long to respond. The site might be temporarily unavailable.');
                } else if (navError.message.includes('Connection closed') ||
                           navError.message.includes('detached Frame')) {
                    throw new Error('Browser connection lost. The URL might be too complex or the page crashed. Try using a simpler URL (remove query parameters).');
                } else {
                    throw new Error(`Navigation failed: ${navError.message}`);
                }
            }

            const hostname = new URL(url).hostname.toLowerCase();
            let reviews = [];
            let productName = '';
            let additionalData = {};

            console.log(`🌐 Detected hostname: ${hostname}`);

            // Platform-specific scrapers with enhanced support
            if (hostname.includes('amazon')) {
                const result = await this.scrapeAmazon(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('flipkart')) {
                const result = await this.scrapeFlipkart(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('myntra')) {
                const result = await this.scrapeMyntra(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('snapdeal')) {
                const result = await this.scrapeSnapdeal(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('paytmmall') || hostname.includes('paytm')) {
                const result = await this.scrapePaytmMall(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('shopclues')) {
                const result = await this.scrapeShopclues(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('bigbasket')) {
                const result = await this.scrapeBigBasket(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('nykaa')) {
                const result = await this.scrapeNykaa(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('bestbuy')) {
                const result = await this.scrapeBestBuy(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else if (hostname.includes('ebay')) {
                const result = await this.scrapeEbay(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            } else {
                // Enhanced generic scraper for any website
                const result = await this.scrapeGenericAdvanced(page);
                reviews = result.reviews;
                productName = result.productName;
                additionalData = result.additionalData || {};
            }

            if (page) {
                await page.close();
            }

            return {
                productName,
                reviews,
                totalReviews: reviews.length,
                url: url,
                platform: hostname,
                ...additionalData
            };

        } catch (error) {
            console.error('Scraping error for', url, ':', error.message);

            // Close page if still open
            if (page && !page.isClosed()) {
                try {
                    await page.close();
                } catch (e) {
                    console.log('   ⚠️ Could not close page:', e.message);
                }
            }

            // Return user-friendly error messages
            let errorMessage = error.message;
            if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
                errorMessage = 'Network error: Unable to resolve website address. Please check your internet connection.';
            } else if (error.message.includes('ERR_INTERNET_DISCONNECTED')) {
                errorMessage = 'No internet connection detected. Please check your network settings.';
            } else if (error.message.includes('ERR_CONNECTION')) {
                errorMessage = 'Connection failed. The website might be down or blocking automated requests.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Request timed out. The website is taking too long to respond.';
            } else if (error.message.includes('Connection closed') || error.message.includes('detached Frame')) {
                errorMessage = 'Browser connection lost. Try using a simpler product URL without query parameters (just the /dp/{ASIN} part).';
            }

            return {
                productName: 'Unknown Product',
                reviews: [],
                totalReviews: 0,
                url: url,
                platform: new URL(url).hostname,
                error: errorMessage
            };
        }
    }

    // Enhanced anti-blocking setup
    async setupAntiBlocking(page) {
        // Set realistic user agent with latest Chrome version
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        // Set viewport to common resolution
        await page.setViewport({ width: 1920, height: 1080 });

        // Set extra headers to mimic real browser
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Upgrade-Insecure-Requests': '1',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1'
        });

        // Mask automation
        await page.evaluateOnNewDocument(() => {
            // Overwrite the `navigator.webdriver` property
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });

            // Overwrite the `navigator.plugins` property
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });

            // Overwrite the `navigator.languages` property
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en', 'hi'],
            });

            // Pass the Chrome Test
            window.chrome = {
                runtime: {},
            };

            // Pass the Permissions Test
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        });

        // Set default navigation timeout
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);
    }

    async smartNavigation(page, url) {
        // Simplified navigation with better stability
        const maxRetries = 3;
        const baseDelay = 2000;

        // Clean URL - remove problematic query params
        let cleanUrl = url;
        try {
            const urlObj = new URL(url);
            // For Amazon, simplify to just /dp/ASIN
            if (urlObj.hostname.includes('amazon')) {
                const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
                if (asinMatch) {
                    cleanUrl = `${urlObj.protocol}//${urlObj.hostname}/dp/${asinMatch[1]}`;
                    console.log(`   🔧 Simplified Amazon URL to: ${cleanUrl}`);
                }
            }
        } catch (e) {
            console.log(`   ⚠️ Could not parse URL, using original`);
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`📍 Navigation attempt ${attempt}/${maxRetries}`);

                await page.goto(cleanUrl, {
                    waitUntil: 'domcontentloaded',
                    timeout: 60000
                });

                // Wait for page to be interactive
                await page.waitForFunction(() => document.readyState === 'complete', { timeout: 10000 }).catch(() => {
                    console.log('   ⚠️ Page may not be fully loaded, continuing...');
                });

                console.log(`   ✅ Page loaded successfully`);

                // Random delay to mimic human behavior
                const randomDelay = 2000 + Math.random() * 2000;
                await new Promise(resolve => setTimeout(resolve, randomDelay));

                // Scroll to load lazy content
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight / 3);
                });
                await new Promise(resolve => setTimeout(resolve, 1000));

                return true;

            } catch (error) {
                console.log(`   ⚠️ Navigation attempt ${attempt} failed: ${error.message}`);

                if (attempt === maxRetries) {
                    throw error;
                } else {
                    // Exponential backoff with jitter
                    const retryDelay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
                    console.log(`   ⏳ Retrying in ${Math.round(retryDelay/1000)}s...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
        }

        throw new Error(`Failed to navigate to ${url} after ${maxRetries} attempts`);
    }

    async scrapeAmazon(page) {
        try {
            // Check if this is a search results page and navigate to first product
            const currentUrl = await page.url();
            if (currentUrl.includes('/s?') || currentUrl.includes('search')) {
                console.log('🔍 Detected Amazon search results page, finding first product...');

                try {
                    // Click on first product result
                    await page.waitForSelector('[data-component-type="s-search-result"] h2 a', { timeout: 5000 });
                    const firstProductLink = await page.$('[data-component-type="s-search-result"] h2 a');

                    if (firstProductLink) {
                        const productUrl = await page.evaluate(el => el.href, firstProductLink);
                        console.log(`🔗 Navigating to first product: ${productUrl.substring(0, 100)}...`);

                        await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for page load
                    }
                } catch (searchError) {
                    console.log('⚠️ Failed to navigate from search results to product page:', searchError.message);
                }
            }

            // Enhanced product name extraction with multiple selectors
            const productName = await page.evaluate(() => {
                const selectors = [
                    '#productTitle',
                    '.product-title',
                    'h1.a-size-large.a-spacing-none',
                    'h1[data-automation-id="product-title"]',
                    'h1.a-size-large.product-title-word-break',
                    'span#productTitle',
                    '.a-size-large.product-title-word-break',
                    'h1.a-size-large', // More generic H1
                    '.a-offscreen', // Sometimes title is in offscreen element
                    '[data-testid="product-title"]' // Test ID fallback
                ];

                // First try very specific Amazon product title selectors
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        let title = element.textContent.trim();
                        console.log(`Found title with selector ${selector}: "${title}"`);

                        // Strict filtering for Amazon-specific issues
                        const unwantedTexts = [
                            'add to', 'buy now', 'purchase', 'order now', 'add to cart',
                            'add to bag', 'add to wishlist', 'add to basket', 'shop now',
                            'view details', 'see more', 'learn more', 'click here',
                            'sign in', 'register', 'subscribe', 'continue'
                        ];

                        const isUnwanted = unwantedTexts.some(unwanted =>
                            title.toLowerCase().includes(unwanted)
                        );

                        // Additional validation: title should be reasonably long and contain product info
                        if (!isUnwanted && title.length > 15 && title.length < 300) {
                            return title;
                        }
                    }
                }

                // Fallback: Try to extract from search results if still on search page
                const searchResults = document.querySelectorAll('[data-component-type="s-search-result"] h2 a span');
                for (const result of searchResults) {
                    const title = result.textContent.trim();
                    if (title.length > 15 && title.length < 200) {
                        console.log(`Found title from search result: "${title}"`);
                        return title;
                    }
                }

                // Last resort: check meta tags
                const metaTitle = document.querySelector('meta[property="og:title"]');
                if (metaTitle && metaTitle.content && metaTitle.content.trim().length > 10) {
                    return metaTitle.content.trim();
                }

                // Fallback: try to extract from URL path for Amazon
                const url = window.location.href;

                // Amazon URL patterns: /product-name/dp/ASIN
                const amazonMatch = url.match(/\/([^\/]+)\/dp\/[A-Z0-9]+/);
                if (amazonMatch) {
                    const urlName = decodeURIComponent(amazonMatch[1])
                        .replace(/-/g, ' ')
                        .replace(/\d+$/, '')
                        .replace(/[+%]/g, ' ')
                        .trim();

                    if (urlName.length > 10 && urlName.length < 200) {
                        console.log(`Extracted from URL: "${urlName}"`);
                        return urlName;
                    }
                }

                // Final fallback
                console.log('Using fallback product name');
                return 'Amazon Product';
            });

            // Get comprehensive pricing information
            const pricingData = await page.evaluate(() => {
                let currentPrice = null;
                let originalPrice = null;
                let discount = null;
                let discountPercent = 0;

                // Current price selectors for Amazon
                const currentPriceSelectors = [
                    '.a-price.apexPriceToPay .a-offscreen',  // Most common current price
                    '.a-price.a-text-price.a-size-medium.apexPriceToPay .a-offscreen',
                    '.a-price.a-text-price.a-size-medium .a-offscreen',
                    'span.a-price-whole',                    // Whole number price
                    '.a-price .a-offscreen',
                    '.a-price-range .a-offscreen',
                    'span.priceToPay .a-offscreen',          // Alternative price container
                    '[data-automation-id="price"]',
                    '#priceblock_ourprice',                  // Classic price ID
                    '#priceblock_dealprice'                  // Deal price ID
                ];

                for (const selector of currentPriceSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        currentPrice = element.textContent.trim();
                        break;
                    }
                }

                // Original/MRP price selectors (usually crossed out)
                const originalPriceSelectors = [
                    '.a-price.a-text-price[data-a-color="secondary"] .a-offscreen',
                    '.a-price.a-text-price.a-size-small .a-offscreen',
                    '.a-text-strike .a-offscreen',
                    '.a-price[data-a-color="secondary"] .a-offscreen',
                    'span.a-price.a-text-price.a-size-small.a-color-secondary .a-offscreen',
                    '.a-text-strike'
                ];

                for (const selector of originalPriceSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.trim() !== currentPrice) {
                        originalPrice = element.textContent.trim();
                        break;
                    }
                }

                // Discount/savings selectors
                const discountSelectors = [
                    '.savingsPercentage',
                    '.a-color-price',
                    '[data-a-color="price"]',
                    '.a-size-large.a-color-price',
                    'span.a-color-price'
                ];

                for (const selector of discountSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        const discountText = element.textContent.trim();
                        if (discountText.includes('%') || discountText.includes('off')) {
                            discount = discountText;
                            const percentMatch = discountText.match(/(\d+)%/);
                            if (percentMatch) {
                                discountPercent = parseInt(percentMatch[1]);
                            }
                            break;
                        }
                    }
                }

                // If we have both prices but no explicit discount, calculate it
                if (currentPrice && originalPrice && discountPercent === 0) {
                    const currentNum = parseFloat(currentPrice.replace(/[₹,]/g, ''));
                    const originalNum = parseFloat(originalPrice.replace(/[₹,]/g, ''));

                    if (originalNum > currentNum) {
                        discountPercent = Math.round(((originalNum - currentNum) / originalNum) * 100);
                        discount = `${discountPercent}% off`;
                    }
                }

                return {
                    currentPrice: currentPrice || 'Not found',
                    originalPrice: originalPrice || currentPrice,
                    discount: discount,
                    discountPercent: discountPercent
                };
            });

            // Get rating with enhanced selectors
            const rating = await page.evaluate(() => {
                const ratingSelectors = [
                    'span[data-hook="rating-out-of-text"]',  // Modern Amazon rating
                    '.a-icon-star .a-icon-alt',                // Star icon with alt text
                    '[data-hook="average-star-rating"] .a-icon-alt',
                    'i.a-icon-star .a-icon-alt',               // Icon star variant
                    '.a-icon-alt',                             // Generic icon alt
                    '.averageStarRating',                       // Old format
                    '#acrPopover',                             // Rating popover
                    'span.a-size-base.a-color-base'            // Text rating
                ];

                for (const selector of ratingSelectors) {
                    const ratingElement = document.querySelector(selector);
                    if (ratingElement) {
                        const ratingText = ratingElement.textContent || ratingElement.getAttribute('title') || ratingElement.getAttribute('aria-label') || '';
                        const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
                        if (ratingMatch) {
                            const ratingVal = parseFloat(ratingMatch[1]);
                            if (ratingVal >= 0 && ratingVal <= 5) {
                                console.log(`✓ Found Amazon rating: ${ratingVal} using selector: ${selector}`);
                                return ratingVal;
                            }
                        }
                    }
                }
                console.log('⚠️ No Amazon rating found');
                return null;
            });

            // Try to navigate to reviews section
            // Try to find reviews on the current page first with ENHANCED selectors
            let reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll([
                    '[data-hook="review"]',
                    '.review',
                    '.cr-original-review-text',
                    '.a-size-base.review-text',
                    '.review-item .review-text',
                    '.celwidget .review-text',
                    '[data-hook="review-body"] span',
                    '.a-expander-content-expanded .a-size-base',
                    '.a-row.a-spacing-small .a-size-base',
                    '.review-text-content',
                    '[data-hook="review-collapsed"]',
                    '.reviewText',
                    'div[data-hook="review-body"]',
                    'span[data-hook="review-body"]'
                ].join(', '));

                console.log(`   🔍 Found ${reviewElements.length} potential review elements`);

                const extractedReviews = [];

                reviewElements.forEach((review, index) => {
                    let text = '';
                    let rating = null;

                    // Try different selectors for review text
                    if (review.textContent) {
                        text = review.textContent.trim();
                    }

                    // Try to get rating from parent elements
                    const parentElement = review.closest('[data-hook="review"], .review-item, .celwidget, .a-section.review');
                    if (parentElement) {
                        const ratingElement = parentElement.querySelector('.a-icon-alt, .review-rating, .a-star-rating .a-icon-alt, [data-hook="review-star-rating"]');
                        if (ratingElement) {
                            const ratingText = ratingElement.textContent || ratingElement.getAttribute('title') || ratingElement.getAttribute('aria-label') || '';
                            const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
                            if (ratingMatch) {
                                rating = parseFloat(ratingMatch[1]);
                            }
                        }
                    }

                    // Validate review text
                    const unwantedPhrases = ['Read more', 'See all reviews', 'Read less', 'Helpful', 'Report', 'Images in this review'];
                    const isValid = text.length > 15 &&
                                   text.length < 5000 &&
                                   !unwantedPhrases.some(phrase => text === phrase);

                    if (isValid) {
                        console.log(`      ✓ Review ${index + 1}: ${text.substring(0, 50)}... (${text.length} chars)`);
                        extractedReviews.push({ text, rating });
                    }
                });

                return extractedReviews;
            });

            console.log(`   📝 Found ${reviews.length} reviews on product page`);

            // If no reviews found on main page, try to navigate to reviews page
            if (reviews.length === 0) {
                console.log(`   🔍 No reviews on product page, attempting to find reviews page...`);

                const reviewsUrl = await page.evaluate(() => {
                    const reviewsLink = document.querySelector([
                        'a[data-hook="see-all-reviews-link-foot"]',
                        'a[href*="reviews"]',
                        '.reviews-link a',
                        'a[href*="product-reviews"]',
                        'a[href*="#customerReviews"]',
                        '.a-link-normal[href*="reviews"]',
                        'a[href*="/product-reviews/"]',
                        '[data-hook="see-all-reviews-link"]'
                    ].join(', '));

                    if (reviewsLink) {
                        console.log(`      🔗 Found reviews link: ${reviewsLink.href}`);
                    }

                    return reviewsLink ? reviewsLink.href : null;
                });

                if (reviewsUrl) {
                    try {
                        console.log(`   📄 Navigating to reviews page: ${reviewsUrl}`);
                        await page.goto(reviewsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

                        // Wait for reviews to load
                        await page.waitForSelector('[data-hook="review"], .review', { timeout: 5000 }).catch(() => {
                            console.log(`      ⚠️ Reviews selector not found, continuing anyway...`);
                        });

                        // Scroll to load more reviews (lazy loading)
                        await this.autoScrollPage(page, 3);

                        // Try to click "See more reviews" or "Read more" buttons
                        await this.expandAllReviews(page);

                        // Wait a bit for content to load
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Extract reviews from dedicated reviews page with ENHANCED selectors
                        reviews = await page.evaluate(() => {
                            const reviewElements = document.querySelectorAll([
                                '[data-hook="review"]',
                                '.review',
                                '.cr-original-review-text',
                                '.review-item',
                                '.a-section.review',
                                'div[data-hook="review"]',
                                'div.review'
                            ].join(', '));

                            console.log(`      🔍 Found ${reviewElements.length} review containers on reviews page`);

                            const extractedReviews = [];

                            reviewElements.forEach((reviewContainer, index) => {
                                let text = '';
                                let rating = null;

                                // Try different selectors for review text
                                const textElement = reviewContainer.querySelector([
                                    '[data-hook="review-body"] span',
                                    '[data-hook="review-body"]',
                                    '.review-text',
                                    '.cr-original-review-text',
                                    '.a-size-base.review-text-content',
                                    '.reviewText',
                                    'span[data-hook="review-body"]',
                                    'div.a-expander-content span'
                                ].join(', '));

                                if (textElement) {
                                    text = textElement.textContent.trim();
                                } else if (reviewContainer.textContent) {
                                    // Fallback: get all text from container and clean it
                                    text = reviewContainer.textContent.trim();
                                }

                                // Try to get rating with multiple selectors
                                const ratingElement = reviewContainer.querySelector([
                                    '.a-icon-alt',
                                    '.review-rating',
                                    '.a-star-rating .a-icon-alt',
                                    '[data-hook="review-star-rating"] .a-icon-alt',
                                    'i[data-hook="review-star-rating"]'
                                ].join(', '));

                                if (ratingElement) {
                                    const ratingText = ratingElement.textContent ||
                                                      ratingElement.getAttribute('title') ||
                                                      ratingElement.getAttribute('aria-label') || '';
                                    const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
                                    if (ratingMatch) {
                                        rating = parseFloat(ratingMatch[1]);
                                    }
                                }

                                // Validate and clean review text
                                const unwantedPhrases = [
                                    'Read more', 'See all reviews', 'Read less', 'Helpful',
                                    'Report', 'Images in this review', 'Verified Purchase',
                                    'Top reviews', 'Customer reviews', 'out of 5 stars'
                                ];

                                // Remove unwanted phrases
                                unwantedPhrases.forEach(phrase => {
                                    text = text.replace(new RegExp(phrase, 'gi'), '');
                                });

                                text = text.trim();

                                const isValid = text.length > 20 &&
                                               text.length < 5000 &&
                                               !text.match(/^\d+(\.\d+)?\s*(out of|stars)/i);

                                if (isValid) {
                                    console.log(`         ✓ Review ${index + 1}: ${text.substring(0, 60)}... (${text.length} chars, rating: ${rating || 'N/A'})`);
                                    extractedReviews.push({ text, rating });
                                }
                            });

                            return extractedReviews;
                        });

                        console.log(`   ✅ Found ${reviews.length} reviews on reviews page`);
                    } catch (e) {
                        console.log(`   ❌ Could not navigate to reviews page: ${e.message}`);
                    }
                } else {
                    // Try to construct reviews URL from ASIN if no link found
                    console.log(`   🔧 Attempting to construct reviews URL from product URL...`);
                    const currentUrl = page.url();
                    const asinMatch = currentUrl.match(/\/dp\/([A-Z0-9]{10})/);

                    if (asinMatch) {
                        const asin = asinMatch[1];
                        const constructedReviewsUrl = `https://www.amazon.in/product-reviews/${asin}/ref=cm_cr_dp_d_show_all_btm`;
                        console.log(`   🔗 Constructed reviews URL: ${constructedReviewsUrl}`);

                        try {
                            await page.goto(constructedReviewsUrl, { waitUntil: 'networkidle2', timeout: 20000 });
                            await page.waitForSelector('[data-hook="review"], .review', { timeout: 5000 }).catch(() => {});

                            // Use the same extraction logic as above
                            reviews = await page.evaluate(() => {
                                const reviewElements = document.querySelectorAll('[data-hook="review"], .review, div[data-hook="review"]');
                                const extractedReviews = [];

                                reviewElements.forEach((reviewContainer, index) => {
                                    const textElement = reviewContainer.querySelector('[data-hook="review-body"] span, [data-hook="review-body"], .review-text');
                                    let text = textElement ? textElement.textContent.trim() : reviewContainer.textContent.trim();

                                    const ratingElement = reviewContainer.querySelector('.a-icon-alt, [data-hook="review-star-rating"] .a-icon-alt');
                                    let rating = null;
                                    if (ratingElement) {
                                        const ratingMatch = (ratingElement.textContent || ratingElement.getAttribute('title') || '').match(/(\d+(?:\.\d+)?)/);
                                        if (ratingMatch) rating = parseFloat(ratingMatch[1]);
                                    }

                                    // Clean text
                                    const unwantedPhrases = ['Read more', 'See all reviews', 'Read less', 'Helpful', 'Report'];
                                    unwantedPhrases.forEach(phrase => text = text.replace(new RegExp(phrase, 'gi'), ''));
                                    text = text.trim();

                                    if (text.length > 20 && text.length < 5000) {
                                        console.log(`         ✓ Review ${index + 1} from constructed URL`);
                                        extractedReviews.push({ text, rating });
                                    }
                                });

                                return extractedReviews;
                            });

                            console.log(`   ✅ Found ${reviews.length} reviews from constructed URL`);
                        } catch (e) {
                            console.log(`   ❌ Failed to load constructed reviews URL: ${e.message}`);
                        }
                    } else {
                        console.log(`   ⚠️ Could not extract ASIN from product URL`);
                    }
                }
            }

            return {
                productName,
                reviews,
                additionalData: {
                    price: pricingData.currentPrice,
                    originalPrice: pricingData.originalPrice,
                    discount: pricingData.discount,
                    discountPercent: pricingData.discountPercent,
                    rating
                }
            };

        } catch (error) {
            console.error('Amazon scraping error:', error);
            return { productName: 'Amazon Product', reviews: [], additionalData: {} };
        }
    }

    async scrapeFlipkart(page) {
        try {
            console.log('   🔍 Scraping Flipkart product page...');

            // Wait for page to load using standard Promise
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Extract product details with enhanced selectors
            const productData = await page.evaluate(() => {
                // Helper function to find element by text content containing pattern
                const findByPattern = (pattern, tag = '*') => {
                    const elements = document.querySelectorAll(tag);
                    for (const el of elements) {
                        if (pattern.test(el.textContent) && el.children.length === 0) {
                            return el;
                        }
                    }
                    return null;
                };

                // Product title - comprehensive search with 2025 updated selectors
                const titleSelectors = [
                    'span.VU-ZEz',                    // Latest 2024-2025 main selector
                    'span.B_NuCI',                    // Common title class
                    'h1.yhB1nd',                      // H1 variant
                    'h1 span.B_NuCI',                 // Span in H1 with specific class
                    'h1 span',                        // Generic span in H1
                    '.B_NuCI',                        // Direct class
                    'h1._6EBuvT span',                // New layout with span
                    'h1._6EBuvT',                     // New layout direct
                    'span._35KyD6',                   // Updated Flipkart selector
                    'div._4rR01T',                    // Alternative product title container
                    'span.G6XhBx',                    // New 2025 product name class
                    'h1 .B_NuCI',                     // Class within H1
                    '[data-testid="product-title"]', // Test ID selector
                    '[data-testid="product-name"]',  // Alternative test ID
                    'div[class*="title"] span',      // Generic title div with span
                    'div[class*="product"] h1',      // Generic product H1
                    'div[class*="product"] span',    // Generic product span
                    '[class*="product"][class*="title"]', // Combined product title classes
                    '[class*="title"]',              // Generic title fallback
                    'h1',                             // Last resort H1
                    '.product-title',                 // Generic product title class
                    '.title'                          // Generic title class
                ];

                let productName = null; // Start with null instead of default

                // Primary selector search
                for (const selector of titleSelectors) {
                    const title = document.querySelector(selector);
                    if (title && title.textContent && title.textContent.trim().length > 5) {
                        const titleText = title.textContent.trim();
                        // Validate it's not a generic button text or navigation element
                        const invalidTexts = ['add to cart', 'buy now', 'add to wishlist', 'share', 'compare', 'home', 'menu'];
                        const isValid = !invalidTexts.some(invalid => titleText.toLowerCase().includes(invalid));
                        if (isValid) {
                            productName = titleText;
                            console.log(`Found product name with selector: ${selector} = "${productName}"`);
                            break;
                        }
                    }
                }

                // Enhanced fallback search if primary selectors fail
                if (!productName) {
                    console.log('Primary selectors failed, trying enhanced fallback search...');

                    // Search in meta tags
                    const metaTitle = document.querySelector('meta[property="og:title"]');
                    if (metaTitle && metaTitle.content && metaTitle.content.trim().length > 5) {
                        productName = metaTitle.content.trim();
                        console.log(`Found product name in meta tag: "${productName}"`);
                    }

                    // Search in page title
                    if (!productName) {
                        const pageTitle = document.title;
                        if (pageTitle && pageTitle.includes(':') && !pageTitle.toLowerCase().includes('flipkart')) {
                            // Extract product name from title like "Product Name: Buy Product Name online at best price in India"
                            const titlePart = pageTitle.split(':')[0].trim();
                            if (titlePart.length > 5) {
                                productName = titlePart;
                                console.log(`Found product name in page title: "${productName}"`);
                            }
                        }
                    }

                    // Broad text search as last resort
                    if (!productName) {
                        const allHeadings = document.querySelectorAll('h1, h2, .title, [class*="title"], [class*="name"]');
                        for (const heading of allHeadings) {
                            const text = heading.textContent.trim();
                            if (text.length > 10 && text.length < 150) { // Reasonable product name length
                                const invalidWords = ['flipkart', 'cart', 'wishlist', 'compare', 'share', 'buy now', 'add to'];
                                const hasInvalidWords = invalidWords.some(word => text.toLowerCase().includes(word));
                                if (!hasInvalidWords) {
                                    productName = text;
                                    console.log(`Found product name via broad search: "${productName}"`);
                                    break;
                                }
                            }
                        }
                    }
                }

                // Final fallback with URL extraction attempt
                if (!productName || productName.length < 5) {
                    console.log('All name extraction failed, attempting URL-based extraction...');
                    const url = window.location.href;
                    const urlMatch = url.match(/flipkart\.com\/([^/]+)/i);
                    if (urlMatch && urlMatch[1]) {
                        productName = urlMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        console.log(`Extracted from URL: "${productName}"`);
                    } else {
                        productName = 'Flipkart Product'; // Last resort default
                        console.log('Using default product name as fallback');
                    }
                }

                // Price extraction - Latest Flipkart 2025 selectors
                const priceSelectors = [
                    'div.Nx9bqj.CxhGGd',      // Current primary selector
                    'div.hl05eU div.Nx9bqj',  // Price in container
                    'div.Nx9bqj',             // Direct price class
                    'span.Nx9bqj',            // Span variant
                    'div.yRaY8j.A6',         // New 2025 price class
                    'div._1vC4OE._3qQ9m1',   // Updated format
                    'div._30jeq3._16Jk6d',    // Legacy format
                    'div._30jeq3',            // Alternative legacy
                    'div._16Jk6d',            // Fallback legacy
                    'div.CEmiEU div.yRaY8j', // Container with new class
                    'span.yRaY8j',           // Span with new class
                    'div[data-testid="price"]', // Test ID selector
                    'div[class*="price"] span', // Generic price with span
                    '[class*="price"][class*="current"]', // Current price specific
                    '.yRaY8j',               // Direct new class
                    '.Nx9bqj'                // Direct fallback class
                ];

                let currentPrice = null;
                for (const selector of priceSelectors) {
                    const priceElement = document.querySelector(selector);
                    if (priceElement && priceElement.textContent.includes('₹')) {
                        currentPrice = priceElement.textContent.trim();
                        console.log(`Found price with selector: ${selector} = ${currentPrice}`);
                        break;
                    }
                }

                // Enhanced fallback price search with multiple patterns
                if (!currentPrice) {
                    console.log('Using enhanced fallback price search...');
                    const allElements = document.querySelectorAll('div, span, p');
                    for (const el of allElements) {
                        const text = el.textContent.trim();
                        // Multiple price patterns: ₹XX,XXX, ₹XX XXX, ₹XXXXX, etc.
                        const pricePatterns = [
                            /^₹[\d,]+$/,                    // ₹12,999
                            /^₹[\d\s,]+$/,                  // ₹12 999 or ₹12, 999
                            /^₹[\d]+$/,                     // ₹12999
                            /₹[\d,]+(?=\s|$)/,             // ₹12,999 followed by space or end
                        ];

                        for (const pattern of pricePatterns) {
                            if (text.match(pattern) && el.children.length === 0) {
                                const priceNum = parseInt(text.replace(/[₹,\s]/g, ''));
                                // Reasonable price range (₹50 to ₹50,00,000)
                                if (priceNum >= 50 && priceNum <= 5000000) {
                                    currentPrice = text.replace(/\s+/g, ''); // Clean spaces
                                    console.log(`Found price via pattern ${pattern}: ${currentPrice} (${el.className || 'no-class'})`);
                                    break;
                                }
                            }
                        }
                        if (currentPrice) break;
                    }
                }

                // Last resort: find the largest price-like number with ₹ symbol
                if (!currentPrice) {
                    console.log('Using last resort price search...');
                    let maxPrice = 0;
                    let maxPriceText = null;
                    const allElements = document.querySelectorAll('*');
                    allElements.forEach(el => {
                        if (el.children.length === 0) { // Only leaf nodes
                            const text = el.textContent.trim();
                            const match = text.match(/^₹([\d,]+)$/);
                            if (match) {
                                const priceNum = parseInt(match[1].replace(/,/g, ''));
                                if (priceNum > maxPrice && priceNum >= 1000 && priceNum <= 200000) {
                                    maxPrice = priceNum;
                                    maxPriceText = text;
                                }
                            }
                        }
                    });
                    if (maxPriceText) {
                        currentPrice = maxPriceText;
                        console.log(`Found price via max price search: ${currentPrice}`);
                    }
                }

                // Original/MRP price extraction (usually crossed out) - Enhanced 2025
                const originalPriceSelectors = [
                    'div.yRaY8j.A6+E6v',      // Latest MRP with strikethrough
                    'span.yRaY8j.A6+E6v',     // Span variant with strikethrough
                    'div.hl05eU div.yRaY8j',  // MRP in container
                    'div.yRaY8j.ZYYwLA',      // New 2025 MRP class combo
                    'span.yRaY8j.ZYYwLA',     // Span variant
                    'div.yRaY8j',             // Direct MRP container
                    'span.yRaY8j',            // Span MRP
                    'div._3I9_wc._27UcVY',    // Legacy crossed price
                    'div._3auQ3N._1POkHg',    // Legacy MRP selector
                    'div._3I9_wc',            // Generic legacy crossed
                    'span._3I9_wc',           // Span legacy crossed
                    'div[data-testid="mrp"]', // Test ID selector
                    'div[class*="mrp"]',      // Generic MRP class
                    'span[class*="mrp"]',     // Span MRP
                    '[style*="text-decoration: line-through"]', // Inline strikethrough
                    'del',                    // HTML strikethrough
                    's',                      // HTML strikethrough
                    '.yRaY8j.ZYYwLA',        // Direct new class combo
                    '.yRaY8j'                // Direct fallback
                ];

                let originalPrice = null;
                for (const selector of originalPriceSelectors) {
                    const mrpElement = document.querySelector(selector);
                    if (mrpElement) {
                        const mrpText = mrpElement.textContent.trim();
                        // Make sure it's different from current price and contains rupee symbol
                        if (mrpText !== currentPrice && mrpText.includes('₹')) {
                            originalPrice = mrpText;
                            console.log(`Found original price with selector: ${selector} = ${originalPrice}`);
                            break;
                        }
                    }
                }

                // Discount extraction
                const discountSelectors = [
                    'div.UkUFwK span',         // Latest discount badge text
                    'div.UkUFwK',              // Discount container
                    'div.hl05eU .UkUFwK',      // Discount in price container
                    'div._3Ay6Sb._31Dcoz',    // Old discount format
                    'span._3Ay6Sb',            // Discount percentage span
                    'div[class*="discount"]',  // Generic discount class
                    'span[class*="discount"]', // Discount span
                    '.UkUFwK'                  // Direct class search
                ];

                let discount = null;
                let discountPercent = 0;
                for (const selector of discountSelectors) {
                    const discountElement = document.querySelector(selector);
                    if (discountElement) {
                        const discountText = discountElement.textContent.trim();
                        if (discountText.includes('%') || discountText.toLowerCase().includes('off')) {
                            discount = discountText;
                            const percentMatch = discountText.match(/(\d+)%?\s*%?/);
                            if (percentMatch) {
                                discountPercent = parseInt(percentMatch[1]);
                            }
                            console.log(`Found discount with selector: ${selector} = ${discount}`);
                            break;
                        }
                    }
                }

                // If we have both prices but no explicit discount, calculate it
                if (currentPrice && originalPrice && discountPercent === 0) {
                    const currentNum = parseFloat(currentPrice.replace(/[₹,]/g, ''));
                    const originalNum = parseFloat(originalPrice.replace(/[₹,]/g, ''));

                    if (originalNum > currentNum) {
                        discountPercent = Math.round(((originalNum - currentNum) / originalNum) * 100);
                        discount = `${discountPercent}% off`;
                    }
                }

                const price = currentPrice;

                // Rating extraction - Latest Flipkart 2025 selectors
                const ratingSelectors = [
                    'div.XQDdHH',              // Primary rating selector
                    'div.XQDdHH.Ga3i8K',       // Rating with class combo
                    'span.XQDdHH',             // Span variant
                    'div.Yg5_Id',             // New 2025 rating class
                    'div.gUuXy-._16VRIQ',     // Updated rating format
                    'span.Yg5_Id',            // Span with new rating class
                    'div._3LWZlK',            // Legacy rating format
                    'span._1lRcqv',           // Alternative legacy
                    'div.ipqd2A',             // Rating container
                    'div[data-testid="rating"]', // Test ID selector
                    'span[class*="star"] + span', // Star rating adjacent span
                    'div[class*="star"]',     // Star rating containers
                    'span[class*="rating"]',  // Generic rating span
                    'div[class*="rating"]',   // Generic rating div
                    '[data-testid*="rating"]', // Any rating test ID
                    '.Yg5_Id',                // Direct new class
                    '.XQDdHH'                 // Direct fallback class
                ];

                let rating = null;
                for (const selector of ratingSelectors) {
                    const ratingElement = document.querySelector(selector);
                    if (ratingElement) {
                        const ratingText = ratingElement.textContent.trim();
                        console.log(`Trying rating selector: ${selector}, text: "${ratingText}"`);
                        const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);  // Match decimal numbers
                        if (ratingMatch) {
                            const ratingVal = parseFloat(ratingMatch[1]);
                            if (ratingVal >= 0 && ratingVal <= 5) {
                                rating = ratingVal;
                                console.log(`✓ Found rating with selector: ${selector} = ${rating}`);
                                break;
                            }
                        }
                    }
                }

                // Enhanced fallback rating search with multiple patterns
                if (!rating) {
                    console.log('Using enhanced fallback rating search...');
                    const allElements = document.querySelectorAll('div, span, p');
                    for (const el of allElements) {
                        const text = el.textContent.trim();
                        // Multiple rating patterns
                        const ratingPatterns = [
                            /^(\d(\.\d)?)\s*★?$/,              // 4.3 or 4.3★
                            /^(\d(\.\d)?)\s*out\s*of\s*5$/i,   // 4.3 out of 5
                            /^(\d(\.\d)?)\s*\/\s*5$/,          // 4.3 / 5
                            /★\s*(\d(\.\d)?)/,                 // ★ 4.3
                            /(\d(\.\d)?)\s*\([\d,]+\)/,        // 4.3 (1,234)
                            /^(\d(\.\d)?)$/,                   // Just 4.3
                        ];

                        // Only check leaf elements (no children) or very short text
                        if ((el.children.length === 0 || text.length <= 8) && text.length >= 1) {
                            for (const pattern of ratingPatterns) {
                                const match = text.match(pattern);
                                if (match) {
                                    const ratingVal = parseFloat(match[1]);
                                    if (ratingVal >= 0.1 && ratingVal <= 5.0) {
                                        rating = ratingVal;
                                        console.log(`Found rating via pattern ${pattern}: ${rating} from "${text}" (${el.className || 'no-class'})`);
                                        break;
                                    }
                                }
                            }
                            if (rating) break;
                        }
                    }
                }

                // Review count - Latest Flipkart 2025 selectors
                const reviewCountSelectors = [
                    'span.Wphh3N',             // Primary review count
                    'span._2_R_DZ',            // Legacy direct format
                    'span._2_R_DZ span',       // Legacy nested span
                    'div._2_R_DZ span',        // Legacy in div
                    'span.RGSrbe',             // New 2025 review count class
                    'div.RGSrbe',              // Div variant of new class
                    'span._16VRIQ.RGSrbe',     // Combined new classes
                    'div[data-testid="review-count"]', // Test ID selector
                    'span[class*="review"][class*="count"]', // Generic review count
                    'span[class*="rating"] + span', // Adjacent to rating
                    'div[class*="rating"] span', // Span within rating div
                    '[data-testid*="review"]', // Any review test ID
                    '.RGSrbe',                 // Direct new class
                    '.Wphh3N'                  // Direct fallback class
                ];

                let reviewCount = 0;
                for (const selector of reviewCountSelectors) {
                    const countElement = document.querySelector(selector);
                    if (countElement) {
                        const countText = countElement.textContent.trim();
                        // Match patterns like "1,234 Ratings", "1234 Reviews", "1.2k ratings"
                        const match = countText.match(/([\d,]+(?:\.\d+)?[kK]?)/);
                        if (match) {
                            let count = match[1].replace(/,/g, '');
                            // Handle "k" notation (e.g., "1.2k" = 1200)
                            if (count.toLowerCase().includes('k')) {
                                count = parseFloat(count) * 1000;
                            }
                            reviewCount = parseInt(count);
                            console.log(`Found review count with selector: ${selector} = ${reviewCount}`);
                            break;
                        }
                    }
                }

                // If no review count found, try broader search
                if (reviewCount === 0) {
                    const allSpans = document.querySelectorAll('span');
                    for (const span of allSpans) {
                        const text = span.textContent.trim();
                        if (text.match(/^[\d,]+ (Ratings?|Reviews?)$/i)) {
                            const match = text.match(/([\d,]+)/);
                            if (match) {
                                reviewCount = parseInt(match[1].replace(/,/g, ''));
                                console.log(`Found review count via text search: ${reviewCount}`);
                                break;
                            }
                        }
                    }
                }

                return {
                    productName,
                    price,
                    originalPrice,
                    discount,
                    discountPercent,
                    rating,
                    reviewCount
                };
            });

            console.log(`   📦 Product: ${productData.productName}`);
            console.log(`   💰 Price: ${productData.price || 'Not found'}`);
            console.log(`   💸 Original Price: ${productData.originalPrice || 'Not found'}`);
            console.log(`   🏷️ Discount: ${productData.discount || 'Not found'}`);
            console.log(`   ⭐ Rating: ${productData.rating || 'Not found'}`);
            console.log(`   📊 Review count: ${productData.reviewCount || 0}`);

            // If critical data is missing, log diagnostic info
            if (!productData.price || !productData.rating) {
                console.log('   ⚠️ Missing critical data, running diagnostics...');
                await page.evaluate(() => {
                    console.log('=== Page Diagnostics ===');

                    // Find all divs containing rupee symbol
                    const priceElements = Array.from(document.querySelectorAll('div, span')).filter(el =>
                        el.textContent.includes('₹') && el.textContent.trim().match(/₹[\d,]+/)
                    );
                    console.log(`Found ${priceElements.length} elements with ₹ symbol`);
                    priceElements.slice(0, 5).forEach((el, i) => {
                        console.log(`  Price ${i+1}: "${el.textContent.trim()}" [${el.className}]`);
                    });

                    // Find elements that might contain rating
                    const ratingElements = Array.from(document.querySelectorAll('div, span')).filter(el => {
                        const text = el.textContent.trim();
                        return text.match(/^\d(\.\d)?$/) && parseFloat(text) <= 5;
                    });
                    console.log(`Found ${ratingElements.length} potential rating elements`);
                    ratingElements.slice(0, 5).forEach((el, i) => {
                        console.log(`  Rating ${i+1}: "${el.textContent.trim()}" [${el.className}]`);
                    });

                    console.log('======================');
                });
            }

            // Try to find and click on reviews section/link
            let reviews = [];

            try {
                // Look for "All Reviews" or similar link
                const reviewsLinkClicked = await page.evaluate(() => {
                    const reviewLinks = [
                        'div.col._2wzgFH a',  // All Reviews link
                        'a[href*="reviews"]',
                        'div._1YokD2',  // Reviews section
                        'div.col a'
                    ];

                    for (const selector of reviewLinks) {
                        const elements = document.querySelectorAll(selector);
                        for (const link of elements) {
                            if (link && link.textContent.includes('All')) {
                                link.click();
                                return true;
                            }
                        }
                    }
                    return false;
                });

                if (reviewsLinkClicked) {
                    console.log('   🔗 Navigated to reviews section');
                    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait longer for content to load

                    // Scroll to load more reviews
                    await this.autoScrollPage(page, 3);

                    // Try to expand reviews
                    await this.expandAllReviews(page);

                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.log('   ℹ️ No review link found, trying to extract from current page');

                    // Still scroll and expand on current page
                    await this.autoScrollPage(page, 2);
                    await this.expandAllReviews(page);

                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                // Extract reviews from current page - Enhanced with more selectors
                reviews = await page.evaluate(() => {
                    const reviewSelectors = [
                        // Modern Flipkart selectors (2024-2025)
                        'div.ZmyHeo',          // New review text container
                        'div._11pzQk',         // Review body
                        'div.t-ZTKy',          // Old main review text
                        'div._6K-7Co',         // Old review container
                        'div.qwjRop',          // Old review text content
                        'div[class*="reviewText"]',
                        'div[class*="review-text"]',
                        'div[class*="comment"]',
                        'p[class*="review"]',
                        // Try to find any div with substantial text near rating stars
                        'div[class*="_"]'      // Fallback for obfuscated classes
                    ];

                    const extractedReviews = [];
                    const seenTexts = new Set(); // Avoid duplicates

                    console.log('🔍 Starting review extraction...');

                    for (const selector of reviewSelectors) {
                        const reviewElements = document.querySelectorAll(selector);
                        console.log(`Selector "${selector}" found ${reviewElements.length} elements`);

                        reviewElements.forEach(review => {
                            let text = review.textContent.trim();

                            // Clean up the text - remove script tags and JavaScript code
                            text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                            text = text.replace(/var\s+\w+\s*=\s*[^;]+;?/g, '');
                            text = text.replace(/if\s*\([^)]*\)\s*{[^}]*}/g, '');
                            text = text.replace(/function\s*\([^)]*\)\s*{[^}]*}/g, '');
                            text = text.replace(/READ MORE/gi, '').trim();
                            text = text.replace(/Show More/gi, '').trim();
                            text = text.replace(/Read Less/gi, '').trim();

                            // Try to find rating for this review
                            let rating = null;
                            const reviewContainer = review.closest('[class*="col"]') || review.closest('.row') || review.parentElement;
                            if (reviewContainer) {
                                const ratingElement = reviewContainer.querySelector([
                                    'div.XQDdHH',
                                    'div._3LWZlK',
                                    'span._1lRcqv',
                                    'div[class*="rating"]',
                                    'div[class*="star"]'
                                ].join(', '));

                                if (ratingElement) {
                                    const ratingMatch = ratingElement.textContent.match(/(\d+(?:\.\d+)?)/);
                                    if (ratingMatch) {
                                        rating = parseFloat(ratingMatch[1]);
                                    }
                                }
                            }

                            // Only include reviews with substantial content
                            if (text &&
                                text.length > 30 &&
                                text.length < 2000 &&
                                !seenTexts.has(text) &&
                                !text.match(/^[0-9\s\.\★★]+$/) && // Not just ratings
                                !text.includes('Certified Buyer') && // Not just metadata
                                !text.includes('months ago') && // Not just timestamps
                                !text.includes('Helpful') && // Not just action buttons
                                !text.match(/var\s+\w+|function\s*\(|if\s*\(|window\.|document\./) && // Not JavaScript code
                                !text.includes('DesktopCredibleBadges') // Not internal tracking code
                            ) {
                                seenTexts.add(text);
                                extractedReviews.push({
                                    text: text.substring(0, 500), // Limit length
                                    rating: rating
                                });
                                console.log(`✓ Added review (${text.length} chars, rating: ${rating || 'N/A'}): ${text.substring(0, 50)}...`);
                            }
                        });

                        if (extractedReviews.length > 0) {
                            console.log(`✅ Found ${extractedReviews.length} reviews with selector: ${selector}`);
                            break;
                        }
                    }

                    // If still no reviews, try a more aggressive approach
                    if (extractedReviews.length === 0) {
                        console.log('⚠️ No reviews found with specific selectors, trying aggressive extraction...');

                        const allDivs = document.querySelectorAll('div');
                        allDivs.forEach(div => {
                            let text = div.textContent.trim();

                            // Clean JavaScript code from text
                            text = text.replace(/var\s+\w+\s*=\s*[^;]+;?/g, '');
                            text = text.replace(/if\s*\([^)]*\)\s*{[^}]*}/g, '');
                            text = text.replace(/function\s*\([^)]*\)\s*{[^}]*}/g, '');

                            // Look for divs that look like reviews (longer text, proper sentences)
                            if (text.length > 50 &&
                                text.length < 1000 &&
                                !seenTexts.has(text) &&
                                text.split(' ').length > 10 && // At least 10 words
                                text.match(/[.!?]/) && // Has punctuation
                                !text.match(/var\s+\w+|function\s*\(|if\s*\(|window\.|document\./) // Not JavaScript
                            ) {
                                // Check if it's not navigation or metadata
                                const lowerText = text.toLowerCase();
                                if (!lowerText.includes('add to cart') &&
                                    !lowerText.includes('buy now') &&
                                    !lowerText.includes('sign in') &&
                                    !lowerText.includes('search') &&
                                    !lowerText.includes('copyright') &&
                                    !lowerText.includes('desktopcredible')
                                ) {
                                    seenTexts.add(text);
                                    extractedReviews.push({
                                        text: text.substring(0, 500),
                                        rating: null
                                    });
                                    console.log(`✓ Aggressive match: ${text.substring(0, 50)}...`);

                                    if (extractedReviews.length >= 20) return; // Limit aggressive matches
                                }
                            }
                        });
                    }

                    console.log(`📊 Total extracted: ${extractedReviews.length} reviews`);
                    return extractedReviews;
                });

                console.log(`   📝 Extracted ${reviews.length} reviews from page`);

            } catch (reviewError) {
                console.log(`   ⚠️ Could not extract detailed reviews: ${reviewError.message}`);
            }

            // If we have a review count but no review text, create placeholder reviews
            if (reviews.length === 0 && productData.reviewCount > 0) {
                console.log(`   ℹ️ Using review count (${productData.reviewCount}) without detailed text`);
                // Generate some generic placeholder reviews based on rating
                const avgRating = productData.rating || 3.5;
                const positiveCount = Math.round(productData.reviewCount * (avgRating / 5) * 0.7);
                const negativeCount = Math.round(productData.reviewCount * 0.2);
                const neutralCount = productData.reviewCount - positiveCount - negativeCount;

                return {
                    title: productData.productName,
                    productName: productData.productName,
                    reviews: [], // No detailed reviews available
                    totalReviews: productData.reviewCount,
                    additionalData: {
                        price: productData.price,
                        originalPrice: productData.originalPrice,
                        discount: productData.discount,
                        discountPercent: productData.discountPercent,
                        rating: productData.rating
                    },
                    // Use rating to estimate sentiment
                    positiveCount: Math.max(0, positiveCount),
                    negativeCount: Math.max(0, negativeCount),
                    neutralCount: Math.max(0, neutralCount)
                };
            }

            return {
                title: productData.productName,
                productName: productData.productName,
                reviews: reviews,
                totalReviews: reviews.length || productData.reviewCount || 0,
                additionalData: {
                    price: productData.price,
                    originalPrice: productData.originalPrice,
                    discount: productData.discount,
                    discountPercent: productData.discountPercent,
                    rating: productData.rating
                }
            };

        } catch (error) {
            console.error('   ❌ Flipkart scraping error:', error.message);
            return {
                productName: 'Flipkart Product',
                reviews: [],
                totalReviews: 0
            };
        }
    }

    async scrapeGeneric(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('h1, .product-title, .title, #title');
                return title ? title.textContent.trim() : 'Product';
            });

            const reviews = await page.evaluate(() => {
                // Generic selectors for reviews
                const reviewSelectors = [
                    '.review', '.reviews', '.user-review', '.customer-review',
                    '.review-text', '.review-content', '.comment', '.feedback',
                    '[class*="review"]', '[class*="comment"]'
                ];

                const extractedReviews = [];

                for (const selector of reviewSelectors) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        const text = element.textContent.trim();
                        if (text && text.length > 20) {
                            extractedReviews.push({ text, rating: null });
                        }
                    });

                    if (extractedReviews.length > 0) break;
                }

                return extractedReviews;
            });

            return { productName, reviews };

        } catch (error) {
            console.error('Generic scraping error:', error);
            return { productName: 'Product', reviews: [] };
        }
    }

    async analyzeSentiment(reviews) {
        if (!reviews || reviews.length === 0) {
            return {
                overallSentiment: 'NEUTRAL',
                confidenceScore: 0,
                totalReviews: 0,
                positiveCount: 0,
                negativeCount: 0,
                neutralCount: 0,
                sentimentDistribution: { positive: '0', negative: '0', neutral: '0' },
                keyFeatures: [],
                positiveInsights: [],
                negativeInsights: []
            };
        }

        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;
        let totalScore = 0;
        const sentimentDetails = [];

        // Analyze each review
        reviews.forEach(review => {
            const result = sentiment.analyze(review.text);
            const score = result.score;
            totalScore += score;

            if (score > 0) {
                positiveCount++;
            } else if (score < 0) {
                negativeCount++;
            } else {
                neutralCount++;
            }

            sentimentDetails.push({
                text: review.text,
                score: score,
                rating: review.rating,
                positive: result.positive,
                negative: result.negative
            });
        });

        // Calculate overall sentiment
        const averageScore = totalScore / reviews.length;
        let overallSentiment = 'NEUTRAL';
        if (averageScore > 0.5) overallSentiment = 'POSITIVE';
        else if (averageScore < -0.5) overallSentiment = 'NEGATIVE';

        // Calculate confidence (based on review count and score consistency)
        const confidenceScore = Math.min(0.9, Math.max(0.3,
            (reviews.length / 100) * 0.5 + (Math.abs(averageScore) / 10) * 0.5
        ));

        // Extract key features and insights
        const keyFeatures = this.extractKeyFeatures(sentimentDetails);
        const positiveInsights = this.extractInsights(sentimentDetails.filter(s => s.score > 0));
        const negativeInsights = this.extractInsights(sentimentDetails.filter(s => s.score < 0));

        return {
            overallSentiment,
            confidenceScore,
            totalReviews: reviews.length,
            positiveCount,
            negativeCount,
            neutralCount,
            sentimentDistribution: {
                positive: ((positiveCount / reviews.length) * 100).toFixed(1),
                negative: ((negativeCount / reviews.length) * 100).toFixed(1),
                neutral: ((neutralCount / reviews.length) * 100).toFixed(1)
            },
            keyFeatures,
            positiveInsights,
            negativeInsights,
            averageScore: averageScore.toFixed(2)
        };
    }

    extractKeyFeatures(sentimentDetails) {
        const featureWords = {};
        const commonFeatures = ['quality', 'price', 'design', 'performance', 'battery', 'camera', 'screen', 'build', 'value', 'service'];

        sentimentDetails.forEach(detail => {
            const tokenizer = new natural.WordTokenizer();
            const words = tokenizer.tokenize(detail.text.toLowerCase());
            words.forEach(word => {
                if (commonFeatures.includes(word) || word.length > 5) {
                    featureWords[word] = (featureWords[word] || 0) + 1;
                }
            });
        });

        return Object.entries(featureWords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([word, count]) => `${word.charAt(0).toUpperCase() + word.slice(1)} (${count} mentions)`);
    }

    extractInsights(sentimentDetails) {
        if (sentimentDetails.length === 0) return [];

        const insights = sentimentDetails
            .slice(0, 5)
            .map(detail => {
                // Get the first sentence of the review
                const sentences = detail.text.split(/[.!?]/);
                return sentences[0].trim();
            })
            .filter(insight => {
                // Filter out JavaScript code, HTML tags, and invalid content
                const hasCode = /var\s+\w+|function\s*\(|if\s*\(|window\.|document\.|<script|<\/script|{|}|\[|\]|=>/.test(insight);
                const hasHTML = /<[^>]+>/.test(insight);
                const isValidLength = insight.length > 10 && insight.length < 150;
                const hasLetters = /[a-zA-Z]{3,}/.test(insight); // Must have at least 3 consecutive letters

                return !hasCode && !hasHTML && isValidLength && hasLetters;
            });

        return insights.slice(0, 4);
    }

    generateRecommendation(analysis) {
        const { overallSentiment, confidenceScore, positiveCount, negativeCount, totalReviews } = analysis;

        const positiveRatio = positiveCount / totalReviews;
        const confidence = Math.floor(confidenceScore * 100);

        let summary, recommended;

        if (overallSentiment === 'POSITIVE' && positiveRatio > 0.7) {
            summary = 'Highly recommended based on overwhelmingly positive customer feedback';
            recommended = true;
        } else if (overallSentiment === 'POSITIVE' && positiveRatio > 0.5) {
            summary = 'Generally recommended with mostly positive reviews from customers';
            recommended = true;
        } else if (overallSentiment === 'NEGATIVE') {
            summary = 'Consider alternatives due to significant customer concerns';
            recommended = false;
        } else {
            summary = 'Mixed reviews - consider your specific needs and preferences';
            recommended = null;
        }

        const bestForOptions = [
            'Users seeking proven quality and reliability',
            'Customers who value positive community feedback',
            'Buyers looking for well-reviewed products',
            'Users who prioritize customer satisfaction'
        ];

        return {
            summary,
            confidence,
            recommended,
            bestFor: bestForOptions[Math.floor(Math.random() * bestForOptions.length)]
        };
    }

    // Indian E-commerce Platform Scrapers
    async scrapeMyntra(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('.pdp-name, .product-title, h1');
                return title ? title.textContent.trim() : 'Myntra Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('.pdp-price, .price');
                const rating = document.querySelector('.index-overallRating, .rating');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.user-review, .review-text, .user-review-data');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('Myntra scraping error:', error);
            return { productName: 'Myntra Product', reviews: [], additionalData: {} };
        }
    }

    async scrapeSnapdeal(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('.pdp-product-name, .product-title, h1');
                return title ? title.textContent.trim() : 'Snapdeal Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('.payBlkBig, .price, .final-price');
                const rating = document.querySelector('.avrg-rating, .rating-score');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.user-review, .review-summary, .urc-text');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('Snapdeal scraping error:', error);
            return { productName: 'Snapdeal Product', reviews: [], additionalData: {} };
        }
    }

    async scrapePaytmMall(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('[data-qa="product-name"], .product-title, h1');
                return title ? title.textContent.trim() : 'Paytm Mall Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('[data-qa="selling-price"], .price');
                const rating = document.querySelector('.rating, .stars');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.review-text, .user-review, .review-content');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('Paytm Mall scraping error:', error);
            return { productName: 'Paytm Mall Product', reviews: [], additionalData: {} };
        }
    }

    async scrapeShopclues(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('.prd_name, .product-title, h1');
                return title ? title.textContent.trim() : 'ShopClues Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('.f_price, .price, .final-price');
                const rating = document.querySelector('.rating, .stars-rating');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.review-text, .user-review, .review-content');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('ShopClues scraping error:', error);
            return { productName: 'ShopClues Product', reviews: [], additionalData: {} };
        }
    }

    async scrapeBigBasket(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('.GroceryPDP___StyledH1, .product-title, h1');
                return title ? title.textContent.trim() : 'BigBasket Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('.Label-sc, .price, .final-price');
                const rating = document.querySelector('.Rating___StyledDiv, .rating');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.review-text, .user-review, .review-content');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('BigBasket scraping error:', error);
            return { productName: 'BigBasket Product', reviews: [], additionalData: {} };
        }
    }

    async scrapeNykaa(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('.product-title, .css-1gc4xu7, h1');
                return title ? title.textContent.trim() : 'Nykaa Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('.css-1jczs19, .price, .final-price');
                const rating = document.querySelector('.css-1a1p7iq, .rating');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.css-1ybb2pr, .review-text, .user-review');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('Nykaa scraping error:', error);
            return { productName: 'Nykaa Product', reviews: [], additionalData: {} };
        }
    }

    // International Platform Scrapers
    async scrapeBestBuy(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('.sr-product-title, .product-title, h1');
                return title ? title.textContent.trim() : 'Best Buy Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('.pricing-price__range, .sr-price, .current-price');
                const rating = document.querySelector('.sr-rating, .rating');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.review-text, .ugc-review-text, .user-review');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('Best Buy scraping error:', error);
            return { productName: 'Best Buy Product', reviews: [], additionalData: {} };
        }
    }

    async scrapeEbay(page) {
        try {
            const productName = await page.evaluate(() => {
                const title = document.querySelector('.x-item-title, .notranslate, h1');
                return title ? title.textContent.trim() : 'eBay Product';
            });

            const additionalData = await page.evaluate(() => {
                const price = document.querySelector('.notranslate, .u-flL, .price');
                const rating = document.querySelector('.ebay-star-rating, .rating');

                return {
                    price: price ? price.textContent.trim() : null,
                    rating: rating ? rating.textContent.trim() : null
                };
            });

            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('.review-text, .ebay-review-text, .reviews .review');
                const extractedReviews = [];

                reviewElements.forEach(review => {
                    const text = review.textContent.trim();
                    if (text && text.length > 15) {
                        extractedReviews.push({ text, rating: null });
                    }
                });

                return extractedReviews;
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('eBay scraping error:', error);
            return { productName: 'eBay Product', reviews: [], additionalData: {} };
        }
    }

    // Enhanced Generic Scraper for Any Website
    async scrapeGenericAdvanced(page) {
        try {
            console.log('🔧 Using enhanced generic scraper');

            const productName = await page.evaluate(() => {
                // Comprehensive product title selectors
                const titleSelectors = [
                    'h1', '.product-title', '.title', '#title', '.product-name',
                    '.pdp-name', '.item-title', '.main-title', '.product-heading',
                    '[class*="title"]', '[class*="product"]', '[data-qa*="title"]',
                    '.entry-title', '.post-title', '.page-title'
                ];

                for (const selector of titleSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.trim().length > 5) {
                        let title = element.textContent.trim();
                        // Enhanced filtering for button texts and unwanted content
                        const unwantedTexts = [
                            'add to cart', 'add to order', 'buy now', 'purchase', 'order now',
                            'add to bag', 'add to wishlist', 'add to basket', 'shop now',
                            'view details', 'see more', 'learn more', 'click here'
                        ];

                        const isUnwanted = unwantedTexts.some(unwanted =>
                            title.toLowerCase().includes(unwanted)
                        );

                        if (!isUnwanted && title.length > 10 && title.length < 200) {
                            return title;
                        }
                    }
                }

                // Enhanced fallback: extract from URL
                const url = window.location.href;
                const urlPatterns = [
                    /\/([^\/]+)\/dp\//,  // Amazon-style
                    /\/([^\/]+)-p-/,     // Generic product pattern
                    /\/([^\/]+)\.html/,  // HTML files
                    /\/([^\/]+)\/?$/     // Last segment
                ];

                for (const pattern of urlPatterns) {
                    const match = url.match(pattern);
                    if (match && match[1]) {
                        const urlName = decodeURIComponent(match[1])
                            .replace(/[-_]/g, ' ')
                            .replace(/\d+$/, '')
                            .trim();
                        if (urlName.length > 5 && urlName.length < 100) {
                            return urlName;
                        }
                    }
                }

                // Final fallback to page title
                const pageTitle = document.title || 'Generic Product';
                return pageTitle.length > 200 ? 'Generic Product' : pageTitle;
            });

            const additionalData = await page.evaluate(() => {
                // Enhanced price detection
                const priceSelectors = [
                    '.price', '.cost', '.amount', '.value', '[class*="price"]',
                    '[class*="cost"]', '[data-qa*="price"]', '.final-price',
                    '.current-price', '.selling-price', '.product-price'
                ];

                let price = null;
                for (const selector of priceSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.match(/[$₹€£¥]/)) {
                        price = element.textContent.trim();
                        break;
                    }
                }

                // Enhanced rating detection
                const ratingSelectors = [
                    '.rating', '.stars', '.score', '[class*="rating"]',
                    '[class*="stars"]', '[data-qa*="rating"]', '.review-score'
                ];

                let rating = null;
                for (const selector of ratingSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.match(/\d+(\.\d+)?/)) {
                        rating = element.textContent.trim();
                        break;
                    }
                }

                return { price, rating };
            });

            const reviews = await page.evaluate(() => {
                // Comprehensive review selectors
                const reviewSelectors = [
                    '.review', '.reviews', '.user-review', '.customer-review',
                    '.review-text', '.review-content', '.comment', '.feedback',
                    '.testimonial', '.user-comment', '.review-body', '.review-description',
                    '[class*="review"]', '[class*="comment"]', '[class*="feedback"]',
                    '[data-qa*="review"]', '.user-feedback', '.customer-feedback'
                ];

                const extractedReviews = [];
                let reviewsFound = false;

                for (const selector of reviewSelectors) {
                    if (reviewsFound) break;

                    const elements = document.querySelectorAll(selector);
                    console.log(`Trying selector: ${selector}, found: ${elements.length}`);

                    elements.forEach(element => {
                        const text = element.textContent.trim();
                        if (text && text.length > 20 && text.length < 2000) {
                            // Filter out navigation and irrelevant text
                            if (!text.includes('Add to cart') &&
                                !text.includes('Buy now') &&
                                !text.includes('Sign in') &&
                                !text.match(/^(Home|Shop|Products|About|Contact)$/i)) {
                                extractedReviews.push({ text, rating: null });
                            }
                        }
                    });

                    if (extractedReviews.length > 0) {
                        reviewsFound = true;
                    }
                }

                // Remove duplicates
                const uniqueReviews = extractedReviews.filter((review, index, self) =>
                    index === self.findIndex(r => r.text === review.text)
                );

                console.log(`Extracted ${uniqueReviews.length} unique reviews`);
                return uniqueReviews.slice(0, 50); // Limit to 50 reviews
            });

            return { productName, reviews, additionalData };
        } catch (error) {
            console.error('Enhanced generic scraping error:', error);
            return { productName: 'Generic Product', reviews: [], additionalData: {} };
        }
    }

    // Helper method: Auto-scroll page to load lazy-loaded content
    async autoScrollPage(page, scrolls = 3) {
        console.log(`   📜 Auto-scrolling page ${scrolls} times to load content...`);

        for (let i = 0; i < scrolls; i++) {
            await page.evaluate((scrollIndex) => {
                window.scrollTo(0, document.body.scrollHeight * (scrollIndex + 1) / (scrollIndex + 2));
            }, i);

            // Random delay between scrolls
            const delay = 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Helper method: Expand all "Read more" buttons in reviews
    async expandAllReviews(page) {
        console.log(`   📖 Attempting to expand collapsed reviews...`);

        try {
            const expandedCount = await page.evaluate(() => {
                const readMoreButtons = document.querySelectorAll([
                    '[data-hook="expand-collapse-button"]',
                    'a[data-hook="review-more-button"]',
                    '.review-text-button',
                    '.a-expander-prompt',
                    'a[href*="expand"]',
                    '.read-more',
                    '.show-more',
                    'button[aria-label*="Read more"]',
                    '.cr-review-read-more'
                ].join(', '));

                let count = 0;
                readMoreButtons.forEach(button => {
                    try {
                        if (button.offsetParent !== null) { // Check if visible
                            button.click();
                            count++;
                        }
                    } catch (e) {
                        // Ignore click errors
                    }
                });

                return count;
            });

            if (expandedCount > 0) {
                console.log(`      ✓ Expanded ${expandedCount} reviews`);
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                console.log(`      ℹ️ No expandable reviews found`);
            }
        } catch (error) {
            console.log(`      ⚠️ Error expanding reviews: ${error.message}`);
        }
    }
}

module.exports = WebScraper;
