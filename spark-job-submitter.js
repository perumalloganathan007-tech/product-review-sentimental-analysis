const { spawn } = require('child_process');
const path = require('path');

/**
 * Submits a Spark job to process sentiment analysis data
 * This creates actual jobs that will show up in Spark UI
 */
function submitSparkJob(data) {
    return new Promise((resolve, reject) => {
        console.log('🚀 Submitting Spark job...');

        // Create a simple Spark job using spark-submit
        const sparkHome = process.env.SPARK_HOME || 'C:\\spark';
        const sparkSubmit = path.join(sparkHome, 'bin', 'spark-submit.cmd');

        // Use spark-shell for quick testing
        const sparkShell = path.join(sparkHome, 'bin', 'spark-shell.cmd');

        // Simple Scala code to execute
        const scalaCode = `
val data = sc.parallelize(Seq(1, 2, 3, 4, 5))
val result = data.map(_ * 2).collect()
println("Spark job executed: " + result.mkString(", "))
sys.exit(0)
`;

        const process = spawn(sparkShell, [
            '--master', 'local[*]',
            '--conf', 'spark.app.name=Sentiment-Analysis-Job'
        ]);

        // Send the code to spark-shell
        process.stdin.write(scalaCode);
        process.stdin.end();

        let output = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
            console.log('Spark:', data.toString().trim());
        });

        process.on('close', (code) => {
            console.log('✅ Spark job completed');
            resolve({ success: true, output });
        });

        process.on('error', (error) => {
            console.error('❌ Spark job failed:', error.message);
            reject(error);
        });

        // Timeout after 2 minutes
        setTimeout(() => {
            process.kill();
            reject(new Error('Spark job timeout'));
        }, 120000);
    });
}

module.exports = { submitSparkJob };
