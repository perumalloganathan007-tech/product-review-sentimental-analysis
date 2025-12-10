// Test script to check what data the comparison endpoint returns
const axios = require('axios').default;

async function testComparisonData() {
    try {
        console.log('🔍 Testing comparison data...');

        const response = await axios.post('http://localhost:9000/api/compare/urls', {
            urls: [
                'https://www.amazon.in/REDMAGIC-Gaming-Mouse-FCC-Ver/dp/B0C1GMMB28/ref=sr_1_3?crid=3JI67DFM6XJ7K&dib=eyJ2IjoiMSJ9.f-haL4Nu81_JvXQ9dKaVv_ZTGH4Y2mPtWKDY5vsFB81prfJvnuI3NBnd90eQVM11gVzeVpGm4rrA9I8P8eEg5FNSVglfab-uzjb4Dvu3GjsMA_24c247ByPi0Jb7NXmGTOZlgO33JoJtEjWTbtfBirQd48BHamUXuF2pCKce8M7T9v0rTSHqMrBfjXfOavBdAfj97iO6RMypZTm1lUNB-yj4zJ3G5okRDyJDZtGYAJQ.czuvCo6y-E_QtvDvp7LTPzN1-900HmSats3vTVY1IFk&dib_tag=se&keywords=redmagic&nsdOptOutParam=true&qid=1760199407&sprefix=redmagic%2Caps%2C282&sr=8-3',
                'https://www.amazon.in/dp/B0BZDCPBYH/ref=sspa_dk_detail_2?pd_rd_i=B0BZDCPBYH&pd_rd_w=NxrD0&content-id=amzn1.sym.67d3dec9-3503-44a1-a945-e969d04cca69&pf_rd_p=67d3dec9-3503-44a1-a945-e969d04cca69&pf_rd_r=9GEV7A8DWM0RHKMC9PTH&pd_rd_wg=D77JD&pd_rd_r=929e7c08-605d-456e-84f8-1d24b4409409&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM&th=1'
            ],
            options: {}
        });

        console.log('\n📊 COMPARISON RESPONSE:');
        console.log('Status:', response.data.status);
        console.log('Message:', response.data.message);

        if (response.data.comparison && response.data.comparison.products) {
            const products = response.data.comparison.products;

            products.forEach((product, index) => {
                console.log(`\n🔍 PRODUCT ${index + 1} DATA:`);
                console.log('Product Name:', product.productName || product.title);
                console.log('Data Source:', product.dataSource);
                console.log('Total Reviews:', product.totalReviews);
                console.log('Confidence Score:', product.confidenceScore);
                console.log('Sentiment Score:', product.sentimentScore);
                console.log('Overall Sentiment:', product.overallSentiment);
                console.log('Positive Count:', product.positiveCount);
                console.log('Negative Count:', product.negativeCount);
                console.log('Neutral Count:', product.neutralCount);
                console.log('Sentiment Breakdown:', product.sentimentBreakdown);
                console.log('Price:', product.price);
                console.log('Rating:', product.rating);
            });
        }

    } catch (error) {
        console.error('❌ Error testing comparison data:', error.message);
    }
}

testComparisonData();
