#!/usr/bin/env python3
"""
Mock API Server for Sentiment Analysis System
Provides mock endpoints to test frontend-backend integration while resolving SBT compilation issues.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import time
import random
from datetime import datetime
import mimetypes
import os

class MockAPIHandler(BaseHTTPRequestHandler):

    def _set_cors_headers(self):
        """Set CORS headers to allow frontend access"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_json_response(self, data, status_code=200):
        """Send JSON response with proper headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def _generate_mock_analysis(self, product_name, review_count=100):
        """Generate mock sentiment analysis data"""
        positive = int(review_count * (0.6 + random.random() * 0.2))
        negative = int(review_count * (0.1 + random.random() * 0.2))
        neutral = review_count - positive - negative

        overall = "POSITIVE" if positive > negative + neutral else "NEGATIVE" if negative > positive else "NEUTRAL"

        return {
            "id": int(time.time() * 1000),
            "productName": product_name,
            "overallSentiment": overall,
            "confidenceScore": round(0.7 + random.random() * 0.3, 3),
            "totalReviews": review_count,
            "positiveCount": positive,
            "negativeCount": negative,
            "neutralCount": neutral,
            "sentimentDistribution": {
                "positive": round(positive / review_count * 100, 1),
                "negative": round(negative / review_count * 100, 1),
                "neutral": round(neutral / review_count * 100, 1)
            },
            "analysisDate": datetime.now().isoformat(),
            "processingTime": random.randint(1000, 5000)
        }

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        if path == '/api/test/db':
            response = {
                "status": "success",
                "message": "Database connection successful (Mock Server)",
                "database": "PostgreSQL (Simulated)",
                "products_count": 5,
                "timestamp": datetime.now().isoformat()
            }
            self._send_json_response(response)

        elif path == '/api/test/stats':
            response = {
                "status": "success",
                "stats": {
                    "products": 5,
                    "analyses": 3,
                    "reviews": 250,
                    "comparisons": 1,
                    "totalRecords": 259
                },
                "database_info": {
                    "type": "PostgreSQL (Mock)",
                    "database": "sentiment_analysis",
                    "tables": ["products", "analyses", "reviews", "comparisons", "comparison_analyses"]
                },
                "timestamp": datetime.now().isoformat()
            }
            self._send_json_response(response)

        elif path == '/api/analyses':
            analyses = [
                self._generate_mock_analysis("iPhone 15 Pro", 1250),
                self._generate_mock_analysis("Samsung Galaxy S24", 980),
                self._generate_mock_analysis("Google Pixel 8", 750),
                self._generate_mock_analysis("OnePlus 12", 420)
            ]
            response = {
                "status": "success",
                "analyses": analyses,
                "total": len(analyses)
            }
            self._send_json_response(response)

        elif path.startswith('/api/analysis/'):
            analysis_id = path.split('/')[-1]
            analysis = self._generate_mock_analysis("Sample Product", 200)
            analysis["id"] = analysis_id

            response = {
                "status": "success",
                "analysis": analysis,
                "reviews": [
                    {"id": 1, "reviewText": "Great product!", "sentiment": "POSITIVE", "confidenceScore": 0.9},
                    {"id": 2, "reviewText": "Not bad", "sentiment": "NEUTRAL", "confidenceScore": 0.7},
                    {"id": 3, "reviewText": "Could be better", "sentiment": "NEGATIVE", "confidenceScore": 0.6}
                ]
            }
            self._send_json_response(response)

        elif path == '/test' or path == '/':
            # Serve the test HTML file
            try:
                with open('app/views/test.scala.html', 'r', encoding='utf-8') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self._send_json_response({"error": "Test page not found"}, 404)

        else:
            self._send_json_response({"error": "Not found"}, 404)

    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        # Simulate processing delay
        time.sleep(1)

        if path == '/api/analyze/dataset':
            # Parse form data (simplified)
            try:
                # For multipart form data, we'll just extract the product name from the data
                post_str = post_data.decode('utf-8')
                product_name = "Test Product"
                if 'productName' in post_str:
                    # Simple extraction (not production-ready parsing)
                    lines = post_str.split('\n')
                    for line in lines:
                        if 'name="productName"' in line:
                            idx = lines.index(line)
                            if idx + 2 < len(lines):
                                product_name = lines[idx + 2].strip()
                                break

                analysis = self._generate_mock_analysis(product_name, 150 + random.randint(0, 200))

                response = {
                    "status": "success",
                    "message": "Dataset analysis completed",
                    "analysis": analysis,
                    "product": {
                        "id": int(time.time()),
                        "name": product_name,
                        "description": f"Analysis for {product_name}",
                        "category": "Electronics"
                    }
                }
                self._send_json_response(response)
            except Exception as e:
                self._send_json_response({"error": str(e)}, 500)

        elif path == '/api/analyze/urls':
            try:
                data = json.loads(post_data.decode('utf-8'))
                urls = data.get('urls', [])

                analyses = []
                for url in urls:
                    try:
                        from urllib.parse import urlparse
                        hostname = urlparse(url).hostname or "unknown"
                        product_name = f"Product from {hostname}"
                        analyses.append(self._generate_mock_analysis(product_name, 80 + random.randint(0, 150)))
                    except:
                        analyses.append(self._generate_mock_analysis("Unknown Product", 100))

                response = {
                    "status": "success",
                    "message": "URL analysis completed",
                    "analyses": analyses,
                    "totalUrls": len(urls)
                }
                self._send_json_response(response)
            except Exception as e:
                self._send_json_response({"error": str(e)}, 500)

        elif path == '/api/compare/datasets':
            product_names = ["Product A", "Product B"]  # Default
            comparisons = [self._generate_mock_analysis(name, 100 + random.randint(0, 100)) for name in product_names]

            winner = max(comparisons, key=lambda x: x['positiveCount'])

            response = {
                "status": "success",
                "message": "Dataset comparison completed",
                "comparison": {
                    "id": int(time.time()),
                    "products": comparisons,
                    "comparisonDate": datetime.now().isoformat(),
                    "winner": winner['productName']
                }
            }
            self._send_json_response(response)

        elif path == '/api/compare/urls':
            try:
                data = json.loads(post_data.decode('utf-8'))
                urls = data.get('urls', [])

                comparisons = []
                for url in urls:
                    try:
                        from urllib.parse import urlparse
                        hostname = urlparse(url).hostname or "unknown"
                        product_name = f"Product from {hostname}"
                        comparisons.append(self._generate_mock_analysis(product_name, 75 + random.randint(0, 125)))
                    except:
                        comparisons.append(self._generate_mock_analysis("Unknown Product", 100))

                response = {
                    "status": "success",
                    "message": "URL comparison completed",
                    "comparison": {
                        "id": int(time.time()),
                        "products": comparisons,
                        "comparisonDate": datetime.now().isoformat(),
                        "totalUrls": len(urls)
                    }
                }
                self._send_json_response(response)
            except Exception as e:
                self._send_json_response({"error": str(e)}, 500)

        else:
            self._send_json_response({"error": "Not found"}, 404)

def run_server(port=9000):
    """Start the mock API server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, MockAPIHandler)

    print(f"🚀 Mock API Server running at http://localhost:{port}")
    print(f"📊 Test interface available at http://localhost:{port}/test")
    print(f"🔗 API endpoints available:")
    print(f"   GET  /api/test/db")
    print(f"   GET  /api/test/stats")
    print(f"   POST /api/analyze/dataset")
    print(f"   POST /api/analyze/urls")
    print(f"   GET  /api/analyses")
    print(f"   POST /api/compare/datasets")
    print(f"   POST /api/compare/urls")
    print(f"\n✨ This mock server simulates the Scala Play backend while compilation issues are resolved.")
    print(f"🔧 Frontend-backend integration testing can proceed immediately!")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 Mock server stopped.")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
