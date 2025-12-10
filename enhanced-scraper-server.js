// Enhanced Flipkart Web Scraper Server
console.log("🚀 Starting Enhanced Flipkart Web Scraper Server...");

const http = require('http');
const WebScraper = require('./webscraper.js');

const scraper = new WebScraper();

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const url = new URL(req.url, 'http://localhost:9000');

  if (url.pathname === '/scrape' && req.method === 'GET') {
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'URL parameter is required' }));
      return;
    }

    try {
      console.log('🔍 Scraping:', targetUrl);
      const result = await scraper.scrapeProductReviews(targetUrl);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        product: result.productName,
        price: result.price,
        rating: result.rating,
        reviewCount: result.reviewCount,
        reviews: result.reviews?.length || 0,
        sentiment: result.sentiment,
        data: result
      }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (url.pathname === '/' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Enhanced Flipkart Scraper</title>
    <style>
        body { font-family: Arial; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
        .success { border-left: 4px solid #28a745; }
        .error { border-left: 4px solid #dc3545; }
        input[type='url'] { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .loading { color: #6c757d; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🚀 Enhanced Flipkart Web Scraper</h1>
        <p>Enter a Flipkart product URL to scrape with enhanced selectors:</p>

        <input type='url' id='urlInput' placeholder='https://www.flipkart.com/product-url' />
        <button onclick='scrapeUrl()'>Scrape Product</button>

        <div id='result'></div>
    </div>

    <script>
        async function scrapeUrl() {
            const url = document.getElementById('urlInput').value;
            const resultDiv = document.getElementById('result');

            if (!url) {
                resultDiv.innerHTML = '<div class="result error">Please enter a URL</div>';
                return;
            }

            resultDiv.innerHTML = '<div class="result loading">🔄 Scraping... This may take 10-30 seconds</div>';

            try {
                const response = await fetch('/scrape?url=' + encodeURIComponent(url));
                const data = await response.json();

                if (data.success) {
                    resultDiv.innerHTML = \`
                        <div class='result success'>
                            <h3>✅ Scraping Successful!</h3>
                            <p><strong>Product:</strong> \${data.product}</p>
                            <p><strong>Price:</strong> \${data.price || 'Not found'}</p>
                            <p><strong>Rating:</strong> \${data.rating || 'Not found'}</p>
                            <p><strong>Review Count:</strong> \${data.reviewCount || 0}</p>
                            <p><strong>Reviews Extracted:</strong> \${data.reviews}</p>
                            <p><strong>Sentiment:</strong> \${data.sentiment || 'N/A'}</p>
                        </div>
                    \`;
                } else {
                    resultDiv.innerHTML = \`<div class='result error'>❌ Error: \${data.error}</div>\`;
                }
            } catch (error) {
                resultDiv.innerHTML = \`<div class='result error'>❌ Network Error: \${error.message}</div>\`;
            }
        }

        // Allow Enter key to submit
        document.getElementById('urlInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') scrapeUrl();
        });
    </script>
</body>
</html>
    `);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(9000, () => {
  console.log('✅ Enhanced Web Scraper Server running on http://localhost:9000');
  console.log('🔧 Enhanced with latest 2025 Flipkart selectors');
  console.log('💡 Test URL: https://www.flipkart.com/vivo-t4x-5g-marine-blue-128-gb/p/itm017656bdd097b');
});
