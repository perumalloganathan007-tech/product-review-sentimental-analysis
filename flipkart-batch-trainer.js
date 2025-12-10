// Flipkart Scraper Batch Training Script
// This script helps train the scraper with multiple URLs

const testUrls = {
    // Mobile phones - High volume category
    mobiles: [
        'https://www.flipkart.com/samsung-galaxy-m34-5g-midnight-blue-128-gb/p/itm6b69601a6f3e2',
        'https://www.flipkart.com/apple-iphone-13-blue-128-gb/p/itm6c568fad394df',
        'https://www.flipkart.com/realme-narzo-60-pro-5g-cosmic-black-128-gb/p/itm2a4f5f3e5c2d8'
    ],
    
    // Electronics - Complex pricing
    electronics: [
        'https://www.flipkart.com/hp-15s-intel-core-i5-12th-gen/p/itm8d9e1a2b3c4d5',
        'https://www.flipkart.com/sony-bravia-139-cm-55-inch-ultra-hd-4k/p/itm5f6g7h8i9j0k1'
    ],
    
    // Fashion - Variable discounts
    fashion: [
        'https://www.flipkart.com/puma-mens-polo-t-shirt/p/itma1b2c3d4e5f6g',
        'https://www.flipkart.com/levis-mens-511-slim-fit-jeans/p/itmh7i8j9k0l1m2n'
    ],
    
    // Books - Lower prices
    books: [
        'https://www.flipkart.com/atomic-habits-james-clear/p/itmo3p4q5r6s7t8u'
    ]
};

class FlipkartTrainer {
    constructor() {
        this.results = {
            total: 0,
            successful: 0,
            failed: 0,
            details: []
        };
        this.apiBase = 'http://localhost:9000/api';
    }

    async trainSingleUrl(url, category) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Training with ${category} URL`);
        console.log(`URL: ${url}`);
        console.log('='.repeat(60));

        this.results.total++;

        try {
            const response = await fetch(`${this.apiBase}/scrape-flipkart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            console.log('✓ SUCCESS!');
            console.log(`  Product: ${data.productName || 'N/A'}`);
            console.log(`  Price: ${data.price || 'N/A'}`);
            console.log(`  Rating: ${data.rating || 'N/A'}`);
            console.log(`  Reviews: ${data.reviewCount || 0}`);
            console.log(`  Data Quality: ${data.dataQuality}%`);
            
            this.results.successful++;
            this.results.details.push({
                url,
                category,
                success: true,
                dataQuality: data.dataQuality,
                data
            });

            return data;

        } catch (error) {
            console.error('✗ FAILED!');
            console.error(`  Error: ${error.message}`);
            
            this.results.failed++;
            this.results.details.push({
                url,
                category,
                success: false,
                error: error.message
            });

            return null;
        }
    }

    async trainBatch(urls, category) {
        console.log(`\n${'█'.repeat(60)}`);
        console.log(`BATCH TRAINING: ${category.toUpperCase()}`);
        console.log(`Total URLs: ${urls.length}`);
        console.log('█'.repeat(60));

        for (let i = 0; i < urls.length; i++) {
            console.log(`\n[${i + 1}/${urls.length}] Processing...`);
            await this.trainSingleUrl(urls[i], category);
            
            // Wait between requests to avoid rate limiting
            if (i < urls.length - 1) {
                console.log('\nWaiting 2 seconds before next request...');
                await this.sleep(2000);
            }
        }
    }

    async trainAll() {
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║     FLIPKART SCRAPER COMPREHENSIVE TRAINING SESSION       ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log(`\nStart Time: ${new Date().toLocaleString()}\n`);

        for (const [category, urls] of Object.entries(testUrls)) {
            await this.trainBatch(urls, category);
        }

        this.printSummary();
    }

    printSummary() {
        console.log('\n\n');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                    TRAINING SUMMARY                        ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log(`\nEnd Time: ${new Date().toLocaleString()}`);
        console.log(`\nTotal URLs Tested: ${this.results.total}`);
        console.log(`✓ Successful: ${this.results.successful} (${this.getSuccessRate()}%)`);
        console.log(`✗ Failed: ${this.results.failed}`);
        
        // Calculate average data quality
        const successfulDetails = this.results.details.filter(d => d.success);
        if (successfulDetails.length > 0) {
            const avgQuality = successfulDetails.reduce((sum, d) => sum + d.dataQuality, 0) / successfulDetails.length;
            console.log(`\n📊 Average Data Quality: ${avgQuality.toFixed(2)}%`);
        }

        // Show category breakdown
        console.log('\n📋 Category Breakdown:');
        const categories = {};
        this.results.details.forEach(d => {
            if (!categories[d.category]) {
                categories[d.category] = { total: 0, success: 0 };
            }
            categories[d.category].total++;
            if (d.success) categories[d.category].success++;
        });

        for (const [cat, stats] of Object.entries(categories)) {
            const rate = ((stats.success / stats.total) * 100).toFixed(0);
            console.log(`  ${cat}: ${stats.success}/${stats.total} (${rate}%)`);
        }

        // Show failed URLs
        if (this.results.failed > 0) {
            console.log('\n⚠ Failed URLs:');
            this.results.details
                .filter(d => !d.success)
                .forEach(d => {
                    console.log(`  - ${d.url}`);
                    console.log(`    Error: ${d.error}`);
                });
        }

        // Recommendations
        console.log('\n💡 Recommendations:');
        if (this.getSuccessRate() >= 90) {
            console.log('  ✓ Excellent! Scraper is working well.');
        } else if (this.getSuccessRate() >= 70) {
            console.log('  ⚠ Moderate performance. Consider updating selectors.');
        } else {
            console.log('  ✗ Poor performance. Selectors need immediate update!');
            console.log('  → Check Flipkart HTML structure');
            console.log('  → Update CSS selectors in webscraper.js');
        }

        console.log('\n' + '═'.repeat(60));
    }

    getSuccessRate() {
        return this.results.total > 0 
            ? Math.round((this.results.successful / this.results.total) * 100)
            : 0;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Save results to file (for Node.js environment)
    saveResults(filename = 'training-results.json') {
        const fs = require('fs');
        const results = {
            ...this.results,
            timestamp: new Date().toISOString(),
            successRate: this.getSuccessRate()
        };
        fs.writeFileSync(filename, JSON.stringify(results, null, 2));
        console.log(`\n💾 Results saved to: ${filename}`);
    }
}

// Usage examples:

// 1. Train with all URLs
async function runFullTraining() {
    const trainer = new FlipkartTrainer();
    await trainer.trainAll();
}

// 2. Train specific category
async function trainMobiles() {
    const trainer = new FlipkartTrainer();
    await trainer.trainBatch(testUrls.mobiles, 'mobiles');
    trainer.printSummary();
}

// 3. Quick test with single URL
async function quickTest() {
    const trainer = new FlipkartTrainer();
    await trainer.trainSingleUrl(testUrls.mobiles[0], 'mobiles');
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FlipkartTrainer, testUrls };
}

// Browser usage: Call these functions from console
console.log('Flipkart Trainer loaded! Available commands:');
console.log('  - runFullTraining()     : Train with all URLs');
console.log('  - trainMobiles()        : Train with mobile URLs only');
console.log('  - quickTest()           : Quick test with one URL');
console.log('\nExample: runFullTraining();');
