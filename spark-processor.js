/**
 * Spark Processor - Bridge between Node.js and Spark
 * This module spawns Spark jobs to process sentiment analysis data
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class SparkProcessor {
    constructor() {
        this.sparkHome = process.env.SPARK_HOME || 'C:\\spark';
        this.pythonPath = process.env.PYTHON_PATH || 'python';
        this.isSparkAvailable = this.checkSparkAvailability();
    }

    checkSparkAvailability() {
        try {
            // Check if Spark home exists
            if (fs.existsSync(path.join(this.sparkHome, 'bin', 'spark-submit.cmd')) ||
                fs.existsSync(path.join(this.sparkHome, 'bin', 'spark-submit'))) {
                console.log('✅ Spark found at:', this.sparkHome);
                return true;
            }
            console.log('⚠️  Spark not found at:', this.sparkHome);
            return false;
        } catch (error) {
            console.log('⚠️  Spark availability check failed:', error.message);
            return false;
        }
    }

    /**
     * Process sentiment analysis using Spark
     * @param {Array} data - Array of review data
     * @param {Object} options - Processing options
     * @returns {Promise<Object>} - Analysis results
     */
    async processSentimentAnalysis(data, options = {}) {
        if (!this.isSparkAvailable) {
            console.log('⚠️  Spark not available, using local processing');
            return this.processLocally(data, options);
        }

        try {
            console.log('🚀 Starting Spark job for sentiment analysis...');

            // Write data to temporary file for Spark to process
            const tempDataFile = path.join(__dirname, 'tmp', `spark-input-${Date.now()}.json`);
            const tempOutputFile = path.join(__dirname, 'tmp', `spark-output-${Date.now()}.json`);

            // Ensure tmp directory exists
            const tmpDir = path.join(__dirname, 'tmp');
            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
            }

            fs.writeFileSync(tempDataFile, JSON.stringify(data));

            // Create Spark job parameters
            const sparkScript = path.join(__dirname, 'spark-sentiment-job.py');

            // If Python Spark script doesn't exist, create it
            if (!fs.existsSync(sparkScript)) {
                this.createSparkScript(sparkScript);
            }

            // Execute Spark job
            const result = await this.executeSparkJob(sparkScript, tempDataFile, tempOutputFile);

            // Read results
            let analysisResult;
            if (fs.existsSync(tempOutputFile)) {
                analysisResult = JSON.parse(fs.readFileSync(tempOutputFile, 'utf8'));

                // Clean up temporary files
                fs.unlinkSync(tempDataFile);
                fs.unlinkSync(tempOutputFile);
            } else {
                console.log('⚠️  Spark output not found, using local processing');
                analysisResult = this.processLocally(data, options);
            }

            console.log('✅ Spark job completed successfully');
            return analysisResult;

        } catch (error) {
            console.error('❌ Spark job failed:', error.message);
            console.log('⚠️  Falling back to local processing');
            return this.processLocally(data, options);
        }
    }

    executeSparkJob(scriptPath, inputFile, outputFile) {
        return new Promise((resolve, reject) => {
            const sparkSubmit = path.join(this.sparkHome, 'bin', 'spark-submit.cmd');

            const args = [
                '--master', 'local[*]',
                '--driver-memory', '2g',
                '--executor-memory', '2g',
                scriptPath,
                inputFile,
                outputFile
            ];

            console.log('Executing:', sparkSubmit, args.join(' '));

            const sparkProcess = spawn(sparkSubmit, args, {
                env: { ...process.env, SPARK_HOME: this.sparkHome }
            });

            let stdout = '';
            let stderr = '';

            sparkProcess.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log('Spark:', data.toString().trim());
            });

            sparkProcess.stderr.on('data', (data) => {
                stderr += data.toString();
                // Spark writes logs to stderr, so we just collect it
            });

            sparkProcess.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                } else {
                    reject(new Error(`Spark job failed with code ${code}\n${stderr}`));
                }
            });

            sparkProcess.on('error', (error) => {
                reject(new Error(`Failed to start Spark: ${error.message}`));
            });

            // Timeout after 5 minutes
            setTimeout(() => {
                sparkProcess.kill();
                reject(new Error('Spark job timeout'));
            }, 300000);
        });
    }

    createSparkScript(scriptPath) {
        const scriptContent = `
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf, count, when
from pyspark.sql.types import StringType
import json
import sys

# Simple sentiment analyzer
def analyze_sentiment(text):
    if not text:
        return "NEUTRAL"

    text_lower = text.lower()

    positive_words = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'awesome', 'fantastic']
    negative_words = ['bad', 'poor', 'terrible', 'worst', 'hate', 'disappointed', 'awful', 'horrible', 'useless']

    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)

    if positive_count > negative_count:
        return "POSITIVE"
    elif negative_count > positive_count:
        return "NEGATIVE"
    else:
        return "NEUTRAL"

def main():
    if len(sys.argv) < 3:
        print("Usage: spark-sentiment-job.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    # Create Spark session
    spark = SparkSession.builder \\
        .appName("Sentiment Analysis Job") \\
        .config("spark.ui.port", "4040") \\
        .getOrCreate()

    # Read input data
    with open(input_file, 'r') as f:
        data = json.load(f)

    # Create DataFrame
    df = spark.createDataFrame(data)

    # Register UDF
    sentiment_udf = udf(analyze_sentiment, StringType())

    # Apply sentiment analysis
    df_with_sentiment = df.withColumn("sentiment", sentiment_udf(col("text")))

    # Calculate statistics
    sentiment_counts = df_with_sentiment.groupBy("sentiment").count().collect()

    total_count = df_with_sentiment.count()

    result = {
        "total_reviews": total_count,
        "positive_count": 0,
        "negative_count": 0,
        "neutral_count": 0
    }

    for row in sentiment_counts:
        sentiment = row['sentiment']
        count = row['count']
        if sentiment == "POSITIVE":
            result['positive_count'] = count
        elif sentiment == "NEGATIVE":
            result['negative_count'] = count
        elif sentiment == "NEUTRAL":
            result['neutral_count'] = count

    # Calculate percentages
    if total_count > 0:
        result['positive_percentage'] = (result['positive_count'] / total_count) * 100
        result['negative_percentage'] = (result['negative_count'] / total_count) * 100
        result['neutral_percentage'] = (result['neutral_count'] / total_count) * 100

    # Write output
    with open(output_file, 'w') as f:
        json.dump(result, f)

    spark.stop()

if __name__ == "__main__":
    main()
`;
        fs.writeFileSync(scriptPath, scriptContent.trim());
        console.log('✅ Created Spark Python script:', scriptPath);
    }

    /**
     * Fallback local processing when Spark is not available
     */
    processLocally(data, options = {}) {
        console.log('📊 Processing locally without Spark...');

        const totalReviews = data.length;
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        data.forEach(item => {
            const text = (item.text || item.review || '').toLowerCase();
            const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best'];
            const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'hate', 'disappointed'];

            const positiveScore = positiveWords.filter(word => text.includes(word)).length;
            const negativeScore = negativeWords.filter(word => text.includes(word)).length;

            if (positiveScore > negativeScore) positiveCount++;
            else if (negativeScore > positiveScore) negativeCount++;
            else neutralCount++;
        });

        return {
            total_reviews: totalReviews,
            positive_count: positiveCount,
            negative_count: negativeCount,
            neutral_count: neutralCount,
            positive_percentage: (positiveCount / totalReviews) * 100,
            negative_percentage: (negativeCount / totalReviews) * 100,
            neutral_percentage: (neutralCount / totalReviews) * 100
        };
    }
}

module.exports = SparkProcessor;
