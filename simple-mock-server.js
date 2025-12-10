const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    console.log(`${req.method} ${path}`);

    res.setHeader('Content-Type', 'application/json');

    try {
        if (path === '/api/test/db') {
            res.writeHead(200);
            res.end(JSON.stringify({
                status: "success",
                message: "Database connection is healthy",
                timestamp: new Date().toISOString(),
                dbStatus: "connected"
            }));
        } else if (path === '/api/analyze/dataset') {
            // Mock dataset analysis
            const mockAnalysis = {
                analysis: {
                    id: Date.now(),
                    productName: "Sample Product",
                    overallSentiment: "POSITIVE",
                    confidenceScore: 0.85,
                    totalReviews: 150,
                    positiveCount: 90,
                    negativeCount: 30,
                    neutralCount: 30,
                    sentimentDistribution: {
                        positive: 60.0,
                        negative: 20.0,
                        neutral: 20.0
                    },
                    processingTime: 1250,
                    analysisDate: new Date().toISOString()
                }
            };
            res.writeHead(200);
            res.end(JSON.stringify(mockAnalysis));
        } else if (path === '/api/analyze/urls') {
            // Mock URL analysis
            const mockURLAnalysis = {
                analyses: [{
                    id: Date.now(),
                    productName: "Sample Product from URL",
                    overallSentiment: "POSITIVE",
                    confidenceScore: 0.78,
                    totalReviews: 200,
                    positiveCount: 120,
                    negativeCount: 40,
                    neutralCount: 40,
                    sentimentDistribution: {
                        positive: 60.0,
                        negative: 20.0,
                        neutral: 20.0
                    },
                    processingTime: 2100,
                    analysisDate: new Date().toISOString()
                }]
            };
            res.writeHead(200);
            res.end(JSON.stringify(mockURLAnalysis));
        } else if (path === '/api/analyses') {
            // Mock history
            const mockHistory = {
                analyses: [
                    {
                        id: 1,
                        productName: "iPhone 15 Pro",
                        totalReviews: 250,
                        sentimentDistribution: { positive: 65, negative: 15, neutral: 20 },
                        overallSentiment: "POSITIVE",
                        analysisDate: new Date().toISOString()
                    },
                    {
                        id: 2,
                        productName: "Samsung Galaxy S24",
                        totalReviews: 180,
                        sentimentDistribution: { positive: 55, negative: 25, neutral: 20 },
                        overallSentiment: "POSITIVE",
                        analysisDate: new Date().toISOString()
                    }
                ]
            };
            res.writeHead(200);
            res.end(JSON.stringify(mockHistory));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Endpoint not found" }));
        }
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
});

const PORT = 9000;
server.listen(PORT, () => {
    console.log(`🚀 Simple Mock API Server running at http://localhost:${PORT}`);
    console.log('📊 Available endpoints:');
    console.log('   GET  /api/test/db');
    console.log('   POST /api/analyze/dataset');
    console.log('   POST /api/analyze/urls');
    console.log('   GET  /api/analyses');
});
