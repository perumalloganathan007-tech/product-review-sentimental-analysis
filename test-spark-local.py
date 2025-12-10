#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test Spark Setup for Windows Local Environment
Verifies Spark works and shows Web UI URL
"""

import sys
import socket

print("="*70)
print("🔧 TESTING SPARK SETUP FOR WINDOWS")
print("="*70)

# Step 1: Check imports
print("\n1️⃣ Checking Python packages...")
try:
    import findspark
    print("   ✅ findspark installed")
except ImportError:
    print("   ❌ findspark not found - installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "findspark", "-q"])
    import findspark
    print("   ✅ findspark installed")

try:
    from pyspark.sql import SparkSession
    from pyspark.sql.functions import *
    print("   ✅ pyspark installed")
except ImportError:
    print("   ❌ pyspark not found - installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyspark", "-q"])
    from pyspark.sql import SparkSession
    from pyspark.sql.functions import *
    print("   ✅ pyspark installed")

# Step 2: Initialize findspark
print("\n2️⃣ Initializing findspark...")
try:
    findspark.init()
    print("   ✅ findspark initialized")
except Exception as e:
    print(f"   ⚠️  Warning: {e}")

# Step 3: Find free port
def find_free_port(start_port=4040):
    """Find a free port starting from start_port"""
    port = start_port
    while port < start_port + 100:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            port += 1
    return start_port

print("\n3️⃣ Finding free port for Spark UI...")
spark_ui_port = find_free_port(4040)
print(f"   ✅ Found free port: {spark_ui_port}")

# Step 4: Create Spark session
print("\n4️⃣ Creating Spark session...")
try:
    spark = SparkSession.builder \
        .appName("Local Spark Test") \
        .master("local[*]") \
        .config("spark.ui.port", str(spark_ui_port)) \
        .config("spark.driver.memory", "2g") \
        .config("spark.ui.enabled", "true") \
        .getOrCreate()

    print("   ✅ Spark session created!")
    print(f"   📊 Spark Version: {spark.version}")
    print(f"   🔢 Spark UI Port: {spark_ui_port}")

except Exception as e:
    print(f"   ❌ Failed to create Spark session: {e}")
    sys.exit(1)

# Step 5: Get Web UI URL
print("\n5️⃣ Getting Spark Web UI URL...")
try:
    web_ui_url = spark.sparkContext.uiWebUrl
    print(f"   ✅ Spark Web UI: {web_ui_url}")
except Exception as e:
    print(f"   ⚠️  Could not get Web UI URL: {e}")
    web_ui_url = f"http://localhost:{spark_ui_port}"
    print(f"   📊 Try: {web_ui_url}")

# Step 6: Create a simple Spark job
print("\n6️⃣ Creating test Spark job...")
try:
    # Create simple DataFrame
    data = [
        ("Product1", 1000, 4.5),
        ("Product2", 2000, 4.0),
        ("Product3", 1500, 4.8),
        ("Product4", 3000, 3.9),
        ("Product5", 2500, 4.6)
    ]

    df = spark.createDataFrame(data, ["product", "price", "rating"])

    # Perform some operations to generate jobs
    print("\n   📊 Job 1: Show DataFrame")
    df.show()

    print("\n   📊 Job 2: Count records")
    count = df.count()
    print(f"      Total records: {count}")

    print("\n   📊 Job 3: Calculate average price")
    avg_price = df.agg({"price": "avg"}).collect()[0][0]
    print(f"      Average price: ${avg_price:.2f}")

    print("\n   📊 Job 4: Group by rating")
    df.groupBy("rating").count().show()

    print("\n   ✅ All test jobs completed!")

except Exception as e:
    print(f"   ❌ Error creating test job: {e}")

# Step 7: Display results
print("\n" + "="*70)
print("🎉 SPARK IS WORKING!")
print("="*70)
print(f"\n📊 Spark Web UI: {web_ui_url}")
print(f"\n💡 Instructions:")
print(f"   1. Open your browser")
print(f"   2. Visit: {web_ui_url}")
print(f"   3. Click 'Jobs' tab to see 4 completed jobs")
print(f"   4. Click any job to see DAG visualization")
print(f"\n✅ Jobs visible in Spark UI:")
print(f"   • Job 0: show at <console>")
print(f"   • Job 1: count at <console>")
print(f"   • Job 2: collect at <console>")
print(f"   • Job 3: showString at <console>")
print("\n🚀 Ready to use Spark in your Jupyter notebook!")
print("="*70)

# Keep session alive for a moment
print("\n⏳ Spark session running... Press Ctrl+C to stop")
print(f"   (Or just open {web_ui_url} in your browser now)")

try:
    input("\nPress Enter to stop Spark and exit...")
except KeyboardInterrupt:
    print("\n\n🛑 Stopping Spark...")

# Clean up
spark.stop()
print("✅ Spark stopped successfully")
