// Demo: How product names are extracted from URLs

function extractProductNameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        const pathname = urlObj.pathname;

        console.log(`\n🔍 Analyzing URL: ${url}`);
        console.log(`🌐 Hostname: ${hostname}`);
        console.log(`📁 Pathname: ${pathname}`);

        if (hostname.includes('amazon')) {
            // Amazon: /product-name/dp/PRODUCT_ID
            const match = pathname.match(/\/([^\/]+)\/dp\/|\/dp\/[^\/]+\/([^\/]+)/);
            if (match) {
                const productPart = match[1] || match[2];
                const cleaned = productPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                console.log(`✅ Extracted: "${cleaned}"`);
                return cleaned;
            }
        }

        return null;
    } catch (error) {
        console.log('❌ Error:', error.message);
        return null;
    }
}

function enhancedAmazonExtraction(url) {
    console.log(`\n🔧 Enhanced Amazon Extraction for: ${url}`);

    // Amazon URL patterns: /product-name/dp/ASIN
    const amazonMatch = url.match(/\/([^\/]+)\/dp\/[A-Z0-9]+/);
    if (amazonMatch) {
        console.log(`🎯 Pattern match found: ${amazonMatch[1]}`);

        const urlName = decodeURIComponent(amazonMatch[1])
            .replace(/-/g, ' ')
            .replace(/\d+$/, '')
            .replace(/[+%]/g, ' ')
            .trim();

        console.log(`✨ Final extracted name: "${urlName}"`);
        return urlName;
    }

    return null;
}

// Your actual URLs from the screenshot
const urls = [
    "https://www.amazon.in/Samsung-Storage-Enhanced-Unmatched-Nightography/dp/B0FDBB2VRC/ref=sr_1_1_sspa?crid=1B95SJLPZHNC3&dib=eyJ2IjoiMSJ9.Ml5REdkLFJYHlFH9Hr_n5HyCcc8E9zfGEbZOTuVSrjua8Y81LUPkwCdBzmVP_OHy9Trz-8cFEu5bzrl1YQhzabmrQtyOwptzIk9xf8j7J6q4ROfVmOLWljyVD4ub_VOxoyTf6PjFaBBkwNkKZbr34jfGz7h3-x4T-GETvvW-rZ4ljvzG0nEhuHjqPmk5xvooYtRx-n4X4W0195Lr8AFY1PV8v-rRu7Xy5ATraRHjVVY.ZWgPzhDJ0G55aRMbZe0jqEcJdnj0S-FxS9keW3sAzNQ&dib_tag=se&keywords=neo+9+pro&qid=1760189214&sprefix=neo+9%2Caps%2C263&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",

    "https://www.amazon.in/iQOO-Titanium-Dimensity-Processor-Shock-Resistance/dp/B0FC5TDB9P/ref=sr_1_1_sspa?adgrpid=1313918000953057&dib=eyJ2IjoiMSJ9.LtT6cXZeZ7T4AHlXy2Itkr5L_OsVniIsZwsOxZkDxMfqpTjq73neBDv0mYWG3zTCOBEjlVGv5-373MlyJHwQFdG7Rjv0OsM8_u1x6G3zq_ciy2ul3lAth6MtCIDP0g_F.2WWiQhmlyFIriZwI-7gAhXSl_dDDsvoB0sN6lTrVeLA&dib_tag=se&hvadid=82120134664042&hvbmt=be&hvdev=c&hvlocphy=155160&hvnetw=o&hvqmt=e&hvtargid=kwd-82120751729137%3Aloc-90&hydadcr=24571_1955349&keywords=amazon%2Bmobil&mcid=5dce726f800a3702b48b0e9ddea6cbe0&msclkid=8c950d965feb107a3c9e6571aff4ba21&nsdOptOutParam=true&qid=1760030754&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1"
];

console.log("🚀 URL EXTRACTION DEMONSTRATION");
console.log("=====================================");

urls.forEach((url, index) => {
    console.log(`\n📱 PRODUCT ${index + 1}:`);

    // Method 1: Basic extraction
    extractProductNameFromUrl(url);

    // Method 2: Enhanced extraction (what the actual scraper uses)
    enhancedAmazonExtraction(url);
});
