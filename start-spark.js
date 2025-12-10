#!/usr/bin/env node

/**
 * Spark Integration Helper
 * Starts a local Spark application that connects to your Node.js server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Spark Application for Sentiment Analysis...\n');

// Spark configuration
const SPARK_HOME = process.env.SPARK_HOME || 'C:\\spark';
const sparkShell = path.join(SPARK_HOME, 'bin', 'spark-shell.cmd');

// Start spark-shell with your application context
const sparkProcess = spawn(sparkShell, [
    '--master', 'local[*]',
    '--driver-memory', '2g',
    '--conf', 'spark.app.name=Sentiment-Analysis-App',
    '--conf', 'spark.ui.port=4040'
], {
    stdio: 'inherit',
    shell: true
});

sparkProcess.on('close', (code) => {
    console.log(`\n✅ Spark application exited with code ${code}`);
});

sparkProcess.on('error', (error) => {
    console.error('❌ Failed to start Spark:', error.message);
    console.log('\n💡 Make sure SPARK_HOME is set correctly');
    console.log('   Current SPARK_HOME:', SPARK_HOME);
});

console.log('\n📊 Spark Web UI: http://localhost:4040');
console.log('⌨️  Press Ctrl+C to stop Spark\n');
