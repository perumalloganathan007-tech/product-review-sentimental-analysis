// Direct API test to verify web scraping works
const fetch = require('node-fetch');

async function testRealScraping() {
    console.log('🧪 Testing Real Web Scraping API\n');

    const testData = {
        name: "Real Data Test",
        description: "Testing with actual Flipkart products",
        products: [
            {
                name: "Samsung Galaxy M14 5G",
                urls: ["https://www.flipkart.com/samsung-galaxy-m14-5g-sapphire-blue-128-gb/p/itm6f7e5c77b42d3"]
            },
            {
                name: "POCO M6 5G",
                urls: ["https://www.flipkart.com/poco-m6-5g-orion-blue-128-gb/p/itm1e52814f06bee"]
            }
        ]
    };

    console.log('📤 Sending request to API...');
    console.log('URLs:', testData.products.map(p => p.urls[0]).join('\n     '));
    console.log('\n⏳ Please wait 30-60 seconds for web scraping...\n');

    try {
        const startTime = Date.now();
        const response = await fetch('http://localhost:9000/api/compare/urls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`📥 Response received in ${duration}s`);
        console.log(`Status: ${response.status} ${response.statusText}\n`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ ERROR:', errorText);
            process.exit(1);
        }

        const result = await response.json();

        console.log('✅ SUCCESS! Web scraping completed!\n');
        console.log('='.repeat(70));
        console.log('📊 COMPARISON RESULT');
        console.log('='.repeat(70));

        const p1 = result.comparison.products[0];
        const p2 = result.comparison.products[1];

        console.log('\n📱 PRODUCT 1:');
        console.log(`   Name: ${p1.productName}`);
        console.log(`   Price: ${p1.price}`);
        console.log(`   Data Source: ${p1.dataSource}`);
        console.log(`   Total Reviews: ${p1.totalReviews}`);
        console.log(`   Sentiment: ${p1.overallSentiment}`);
        console.log(`   Confidence: ${(p1.confidenceScore * 100).toFixed(1)}%`);
        console.log(`   Distribution: ✅ ${p1.positiveCount} | ❌ ${p1.negativeCount} | ⚪ ${p1.neutralCount}`);

        console.log('\n📱 PRODUCT 2:');
        console.log(`   Name: ${p2.productName}`);
        console.log(`   Price: ${p2.price}`);
        console.log(`   Data Source: ${p2.dataSource}`);
        console.log(`   Total Reviews: ${p2.totalReviews}`);
        console.log(`   Sentiment: ${p2.overallSentiment}`);
        console.log(`   Confidence: ${(p2.confidenceScore * 100).toFixed(1)}%`);
        console.log(`   Distribution: ✅ ${p2.positiveCount} | ❌ ${p2.negativeCount} | ⚪ ${p2.neutralCount}`);

        console.log('\n🏆 WINNER:', result.comparison.winner.productName);
        console.log('   Reason:', result.comparison.winner.reason);

        console.log('\n' + '='.repeat(70));
        console.log('✅ CHARTS WILL DISPLAY with this data!');
        console.log('='.repeat(70));

        // Verify chart data exists
        const hasChartData = p1.positiveCount !== undefined &&
                            p1.negativeCount !== undefined &&
                            p1.neutralCount !== undefined &&
                            p2.positiveCount !== undefined &&
                            p2.negativeCount !== undefined &&
                            p2.neutralCount !== undefined;

        if (hasChartData) {
            console.log('✅ All sentiment counts present - Charts ready to render!');
        } else {
            console.log('⚠️  Warning: Some sentiment counts missing');
        }

    } catch (error) {
        console.error('❌ EXCEPTION:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Check if server is running
console.log('🔍 Checking if server is running on http://localhost:9000...\n');
fetch('http://localhost:9000')
    .then(() => {
        console.log('✅ Server is running!\n');
        return testRealScraping();
    })
    .catch((err) => {
        console.error('❌ Cannot connect to server!');
        console.error('   Make sure the server is running: node mock-server.js');
        console.error('   Error:', err.message);
        process.exit(1);
    });
