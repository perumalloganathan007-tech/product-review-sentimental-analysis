// Main JavaScript for Sentiment Analysis Application

class SentimentAnalysisApp {
    constructor() {
        this.currentAnalysisId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHistory();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(e.target.getAttribute('href').substring(1));
            });
        });

        // Dataset Analysis Form
        document.getElementById('datasetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitDatasetAnalysis();
        });

        // URL Analysis Form
        document.getElementById('urlForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitUrlAnalysis();
        });

        // Dataset Comparison Form
        document.getElementById('datasetCompareForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitDatasetComparison();
        });

        // URL Comparison Form
        document.getElementById('urlCompareForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitUrlComparison();
        });

        // Add dataset file button
        document.getElementById('addDatasetFile').addEventListener('click', () => {
            this.addDatasetFileGroup();
        });

        // Add product URL button
        document.getElementById('addProductUrl').addEventListener('click', () => {
            this.addProductUrlGroup();
        });

        // Export buttons
        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportReport('pdf');
        });

        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportReport('csv');
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        // Load data for specific sections
        if (sectionId === 'history') {
            this.loadHistory();
        }
    }

    showLoading(text = 'Processing your request...', subtext = 'This may take a few moments') {
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingSubtext').textContent = subtext;
        const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
        modal.show();
    }

    hideLoading() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
        if (modal) {
            modal.hide();
        }
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    async submitDatasetAnalysis() {
        const form = document.getElementById('datasetForm');
        const formData = new FormData(form);

        this.showLoading('Analyzing dataset...', 'Processing reviews and performing sentiment analysis');

        try {
            const response = await fetch('/api/analyze/dataset', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.currentAnalysisId = result.id;
            this.displayAnalysisResults(result);
            this.showAlert('Dataset analysis completed successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('Error analyzing dataset. Please try again.', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async submitUrlAnalysis() {
        const form = document.getElementById('urlForm');
        const urls = document.getElementById('productUrls').value.split('\n').filter(url => url.trim());
        const productNames = document.getElementById('productNames').value.split('\n').filter(name => name.trim());

        if (urls.length === 0) {
            this.showAlert('Please enter at least one product URL.', 'warning');
            return;
        }

        const requestData = {
            urls: urls,
            productNames: productNames.length > 0 ? productNames : null
        };

        this.showLoading('Analyzing product URLs...', 'Scraping reviews and performing sentiment analysis');

        try {
            const response = await fetch('/api/analyze/urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = await response.json();

            if (results.length === 1) {
                this.currentAnalysisId = results[0].id;
                this.displayAnalysisResults(results[0]);
            } else {
                this.displayMultipleAnalysisResults(results);
            }

            this.showAlert('URL analysis completed successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('Error analyzing URLs. Please check URLs and try again.', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async submitDatasetComparison() {
        const form = document.getElementById('datasetCompareForm');
        const formData = new FormData(form);

        this.showLoading('Comparing datasets...', 'Analyzing multiple products and calculating comparisons');

        try {
            const response = await fetch('/api/compare/datasets', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.displayComparisonResults(result);
            this.showAlert('Dataset comparison completed successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('Error comparing datasets. Please try again.', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async submitUrlComparison() {
        const form = document.getElementById('urlCompareForm');
        const products = [];

        document.querySelectorAll('.product-url-group').forEach(group => {
            const name = group.querySelector('.url-product-name').value.trim();
            const urls = group.querySelector('.url-product-urls').value.split('\n').filter(url => url.trim());

            if (name && urls.length > 0) {
                products.push({ name, urls });
            }
        });

        if (products.length < 2) {
            this.showAlert('Please enter at least 2 products for comparison.', 'warning');
            return;
        }

        const requestData = {
            name: document.getElementById('urlComparisonName').value,
            description: document.getElementById('urlComparisonDescription').value || null,
            products: products
        };

        this.showLoading('Comparing product URLs...', 'Scraping reviews and calculating comparisons');

        try {
            const response = await fetch('/api/compare/urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.displayComparisonResults(result);
            this.showAlert('URL comparison completed successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('Error comparing URLs. Please try again.', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    displayAnalysisResults(analysis) {
        const resultsContainer = document.getElementById('resultsContent');

        const html = `
            <div class="results-grid">
                <div class="result-card">
                    <div class="result-card-header">
                        <h4>Sentiment Distribution</h4>
                    </div>
                    <div class="result-card-body">
                        <canvas id="sentimentChart" class="sentiment-chart"></canvas>
                    </div>
                </div>

                <div class="result-card">
                    <div class="result-card-header">
                        <h4>Analysis Summary</h4>
                    </div>
                    <div class="result-card-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-value positive">${analysis.positiveCount}</div>
                                <div class="stat-label">Positive Reviews</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value neutral">${analysis.neutralCount}</div>
                                <div class="stat-label">Neutral Reviews</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value negative">${analysis.negativeCount}</div>
                                <div class="stat-label">Negative Reviews</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${analysis.totalReviews}</div>
                                <div class="stat-label">Total Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            ${analysis.overallSuggestion ? `
                <div class="recommendation-card">
                    <h4><i class="fas fa-lightbulb"></i> Recommendation</h4>
                    <p>${analysis.overallSuggestion}</p>
                </div>
            ` : ''}
        `;

        resultsContainer.innerHTML = html;

        // Create sentiment chart
        this.createSentimentChart('sentimentChart', {
            positive: parseFloat(analysis.positivePercentage),
            neutral: parseFloat(analysis.neutralPercentage),
            negative: parseFloat(analysis.negativePercentage)
        });

        // Show results section
        this.showSection('results');
    }

    displayMultipleAnalysisResults(analyses) {
        const resultsContainer = document.getElementById('resultsContent');

        let html = '<div class="row">';

        analyses.forEach((analysis, index) => {
            html += `
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>Product ${index + 1} Analysis</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="chart${index}" style="height: 300px;"></canvas>
                            <div class="mt-3">
                                <small class="text-muted">
                                    Total Reviews: ${analysis.totalReviews} |
                                    Overall: <span class="sentiment-badge sentiment-${analysis.overallSentiment.toLowerCase()}">${analysis.overallSentiment}</span>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        resultsContainer.innerHTML = html;

        // Create charts for each analysis
        analyses.forEach((analysis, index) => {
            this.createSentimentChart(`chart${index}`, {
                positive: parseFloat(analysis.positivePercentage),
                neutral: parseFloat(analysis.neutralPercentage),
                negative: parseFloat(analysis.negativePercentage)
            });
        });

        this.showSection('results');
    }

    displayComparisonResults(comparison) {
        const resultsContainer = document.getElementById('resultsContent');

        let html = `
            <div class="comparison-header mb-4">
                <h3>${comparison.comparison.name}</h3>
                ${comparison.comparison.description ? `<p class="text-muted">${comparison.comparison.description}</p>` : ''}
            </div>

            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h5>Product Comparison</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="comparisonChart" style="height: 400px;"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>Best Product</h5>
                        </div>
                        <div class="card-body text-center">
                            ${comparison.bestProduct ? `
                                <h4 class="text-success">${comparison.bestProduct.name}</h4>
                                <div class="mt-3">
                                    <div class="stat-value positive">${comparison.comparisonSummary.bestProductScore.toFixed(2)}</div>
                                    <div class="stat-label">Score</div>
                                </div>
                            ` : '<p>No best product determined</p>'}
                        </div>
                    </div>
                </div>
            </div>

            <div class="recommendation-card">
                <h4><i class="fas fa-trophy"></i> Comparison Summary</h4>
                <p>${comparison.comparisonSummary.recommendation}</p>
            </div>

            <div class="table-responsive mt-4">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Total Reviews</th>
                            <th>Positive %</th>
                            <th>Neutral %</th>
                            <th>Negative %</th>
                            <th>Overall Sentiment</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparison.analyses.map(item => `
                            <tr>
                                <td><strong>${item.product.name}</strong></td>
                                <td>${item.analysis.totalReviews}</td>
                                <td><span class="badge bg-success">${item.analysis.positivePercentage}%</span></td>
                                <td><span class="badge bg-warning">${item.analysis.neutralPercentage}%</span></td>
                                <td><span class="badge bg-danger">${item.analysis.negativePercentage}%</span></td>
                                <td><span class="sentiment-badge sentiment-${item.analysis.overallSentiment.toLowerCase()}">${item.analysis.overallSentiment}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        resultsContainer.innerHTML = html;

        // Create comparison chart
        this.createComparisonChart('comparisonChart', comparison.analyses);

        this.showSection('results');
    }

    createSentimentChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                    data: [data.positive, data.neutral, data.negative],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createComparisonChart(canvasId, analyses) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        const labels = analyses.map(item => item.product.name);
        const positiveData = analyses.map(item => parseFloat(item.analysis.positivePercentage));
        const negativeData = analyses.map(item => parseFloat(item.analysis.negativePercentage));
        const neutralData = analyses.map(item => parseFloat(item.analysis.neutralPercentage));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Positive %',
                        data: positiveData,
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        borderWidth: 1
                    },
                    {
                        label: 'Neutral %',
                        data: neutralData,
                        backgroundColor: '#ffc107',
                        borderColor: '#ffc107',
                        borderWidth: 1
                    },
                    {
                        label: 'Negative %',
                        data: negativeData,
                        backgroundColor: '#dc3545',
                        borderColor: '#dc3545',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    addDatasetFileGroup() {
        const container = document.getElementById('datasetFiles');
        const groupDiv = document.createElement('div');
        groupDiv.className = 'dataset-file-group mb-3';
        groupDiv.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-control product-name" name="productNames" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Dataset File</label>
                    <input type="file" class="form-control dataset-file" name="datasets" accept=".csv,.json,.xlsx,.xls" required>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <select class="form-select dataset-type" name="datasetTypes">
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                        <option value="excel">Excel</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <div class="form-check">
                        <input class="form-check-input is-preprocessed" type="checkbox" name="isPreprocessed">
                        <label class="form-check-label">Preprocessed</label>
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-danger btn-sm remove-group">Remove</button>
                </div>
            </div>
        `;

        container.appendChild(groupDiv);

        // Add remove functionality
        groupDiv.querySelector('.remove-group').addEventListener('click', () => {
            groupDiv.remove();
        });
    }

    addProductUrlGroup() {
        const container = document.getElementById('productUrls');
        const groupDiv = document.createElement('div');
        groupDiv.className = 'product-url-group mb-3';
        groupDiv.innerHTML = `
            <div class="row">
                <div class="col-md-5">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-control url-product-name" required>
                </div>
                <div class="col-md-5">
                    <label class="form-label">Product URLs</label>
                    <textarea class="form-control url-product-urls" rows="2" placeholder="One URL per line" required></textarea>
                </div>
                <div class="col-md-2">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-danger btn-sm d-block remove-group">Remove</button>
                </div>
            </div>
        `;

        container.appendChild(groupDiv);

        // Add remove functionality
        groupDiv.querySelector('.remove-group').addEventListener('click', () => {
            groupDiv.remove();
        });
    }

    async loadHistory() {
        try {
            const response = await fetch('/api/analyses');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analyses = await response.json();
            this.displayHistory(analyses);
        } catch (error) {
            console.error('Error loading history:', error);
            this.showAlert('Error loading analysis history.', 'warning');
        }
    }

    displayHistory(analyses) {
        const tbody = document.querySelector('#historyTable tbody');

        if (analyses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No analyses found</td></tr>';
            return;
        }

        tbody.innerHTML = analyses.map(item => `
            <tr>
                <td><strong>${item.product.name}</strong></td>
                <td><span class="badge bg-info">${item.analysis.inputType}</span></td>
                <td>${item.analysis.totalReviews}</td>
                <td><span class="badge bg-success">${item.analysis.positivePercentage}%</span></td>
                <td><span class="badge bg-danger">${item.analysis.negativePercentage}%</span></td>
                <td><span class="sentiment-badge sentiment-${item.analysis.overallSentiment.toLowerCase()}">${item.analysis.overallSentiment}</span></td>
                <td>${item.analysis.createdAt ? new Date(item.analysis.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="app.viewAnalysis(${item.analysis.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="app.exportReport('pdf', ${item.analysis.id})">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async viewAnalysis(analysisId) {
        try {
            const response = await fetch(`/api/analysis/${analysisId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analysisDetails = await response.json();
            this.currentAnalysisId = analysisId;

            // Handle both old and new response formats
            const analysis = analysisDetails.analysis || analysisDetails;
            this.displayAnalysisResults(analysis);
        } catch (error) {
            console.error('Error loading analysis:', error);
            this.showAlert('Error loading analysis details.', 'danger');
        }
    }

    exportReport(format, analysisId = null) {
        const id = analysisId || this.currentAnalysisId;

        if (!id) {
            this.showAlert('No analysis selected for export.', 'warning');
            return;
        }

        const url = `/api/report/${format}/${id}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `analysis_report_${id}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showAlert(`${format.toUpperCase()} report download started.`, 'success');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SentimentAnalysisApp();
});
