const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// Import our webscraper class
const WebScraper = require('./webscraper.js');

async function testFlipkartDirectly() {
    console.log('🔧 Testing Flipkart scraping directly with updated selectors...');

    const scraper = new WebScraper();

    const testUrl = 'https://www.flipkart.com/vivo-t4x-5g-marine-blue-128-gb/p/itm017656bdd097b';

    try {
        console.log(`🌐 Testing URL: ${testUrl}`);
        const result = await scraper.scrapeProductReviews(testUrl);

        console.log('\n📊 RESULTS:');
        console.log(`Product: ${result.productName}`);
        console.log(`Price: ${result.price || 'Not found'}`);
        console.log(`Rating: ${result.rating || 'Not found'}`);
        console.log(`Review Count: ${result.reviewCount || 0}`);
        console.log(`Reviews Found: ${result.reviews?.length || 0}`);

        if (!result.price || !result.rating) {
            console.log('\n⚠️ MISSING DATA - this indicates selectors need further updating');
        } else {
            console.log('\n✅ SUCCESS - price and rating extracted successfully!');
        }

    } catch (error) {
        console.error('❌ Error testing scraper:', error.message);
    }
}

// Run the test
testFlipkartDirectly().then(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
}).catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
