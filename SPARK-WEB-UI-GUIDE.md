# 🎯 Spark Web UI Quick Reference Guide

## What You'll See After Running the Notebook

### 📊 Jobs Tab

After running Step 3.5 and 3.6, you'll see **12 Spark jobs** in the Jobs tab:

| Job # | Description | Operations |
|-------|-------------|------------|
| 0 | Count rows | WholeStageCodegen, Scan |
| 1 | Compute statistics | Aggregate, Exchange |
| 2 | Group by analysis | HashAggregate, Exchange (shuffle) |
| 3 | SQL query | WholeStageCodegen, Scan |
| 4 | Complex aggregations | Multiple HashAggregates, Exchanges |
| 5 | Window functions | Window, Sort, Exchange |
| 6 | Repartition | Exchange (shuffle), Scan |
| 7 | Joins | BroadcastHashJoin, Exchange |
| 8 | Sort and filter | Sort, Filter, Project |
| 9 | Distinct values | Aggregate, Exchange |
| 10 | Union | Union, Scan |
| 11 | Pivot table | HashAggregate, Exchange |
| 12 | UDF application | MapPartitions, HashAggregate |

## 🎨 DAG Visualization

Click on any job to see its DAG (Directed Acyclic Graph):

### Example DAG Components:

```
WholeStageCodegen (1)
   ↓
Exchange (Shuffle)
   ↓
HashAggregate
   ↓
WholeStageCodegen (2)
   ↓
Result
```

### Common DAG Nodes:

- **WholeStageCodegen** - Optimized code generation
- **Exchange** - Shuffle operation (data movement between executors)
- **HashAggregate** - Aggregation operations (sum, count, avg)
- **BroadcastHashJoin** - Join with broadcast
- **Sort** - Sorting operations
- **Filter** - Row filtering
- **Project** - Column selection
- **Scan** - Reading data
- **Window** - Window function operations

## 📈 Stages Tab

Each job consists of multiple stages:

### Stage Information:
- **Stage ID** - Unique identifier
- **Duration** - Time taken to complete
- **Tasks** - Number of tasks (one per partition)
- **Input** - Data read
- **Output** - Data written
- **Shuffle Read** - Data received from other executors
- **Shuffle Write** - Data sent to other executors

### Example Stage Details:
```
Stage 5: HashAggregate
  Duration: 0.5s
  Tasks: 4
  Input: 1.2 MB
  Shuffle Read: 500 KB
  Shuffle Write: 200 KB
```

## 🔍 Detailed Metrics

Click on any stage to see:

### Task Metrics:
- Task completion time
- GC time
- Result serialization time
- Peak execution memory
- Input/Output bytes
- Shuffle read/write bytes

### Executor Metrics:
- CPU time
- Memory usage
- Disk spill
- Network I/O

## 💾 Storage Tab

Shows cached DataFrames:

```
RDD Name: products
Storage Level: Memory and Disk
Cached Partitions: 4
Fraction Cached: 100%
Size in Memory: 2.5 MB
```

## 📝 SQL Tab

Shows SQL query execution:

### Example SQL Query:
```sql
SELECT COUNT(*) as total_records,
       COUNT(DISTINCT *) as unique_records
FROM products
```

### Query Details:
- **Logical Plan** - High-level query plan
- **Physical Plan** - Actual execution plan
- **Duration** - Query execution time
- **Code Generation** - Generated Java code

## 🎯 Environment Tab

Shows Spark configuration:
- Spark version
- Driver memory
- Executor memory
- Shuffle partitions
- Serialization settings

## 👥 Executors Tab

Shows executor information:
- Executor ID
- Address
- Status
- RDD blocks
- Storage memory
- Task time
- Input/Output

## 🔥 How to Interpret DAG Visualizations

### Simple Query Example:

**Query:** `spark_df.groupBy("category").count().show()`

**DAG:**
```
Scan CSV → Filter → HashAggregate → Exchange → HashAggregate → Result
```

### Complex Query Example:

**Query:** Window function with aggregation

**DAG:**
```
Scan CSV
   ↓
Filter
   ↓
Project
   ↓
Exchange (shuffle by partition key)
   ↓
Sort
   ↓
Window
   ↓
Exchange (shuffle for final aggregation)
   ↓
HashAggregate
   ↓
Result
```

## 📊 Understanding Shuffle Operations

**Exchange** nodes indicate shuffle operations (data movement):

### When Shuffles Occur:
- **groupBy** - Redistributing data by key
- **join** - Bringing matching records together
- **repartition** - Changing partition count
- **distinct** - Removing duplicates
- **orderBy** - Global sorting
- **window** - Partitioning for window functions

### Shuffle Metrics to Watch:
- **Shuffle Write** - Data written during shuffle
- **Shuffle Read** - Data read during shuffle
- **Spill to Disk** - Memory overflow to disk (bad!)

### Good vs Bad:
✅ **Good:** Small shuffle sizes (< 100 MB)
✅ **Good:** Few stages (< 10)
✅ **Good:** Short task durations (< 1s)

⚠️ **Bad:** Large shuffles (> 1 GB)
⚠️ **Bad:** Many stages (> 50)
⚠️ **Bad:** Skewed partitions (one task takes much longer)

## 🎨 Visual Indicators

### Job Status Colors:
- 🟢 **Green** - Succeeded
- 🔵 **Blue** - Running
- 🔴 **Red** - Failed
- ⚫ **Black** - Queued

### Stage Progress:
- Progress bar shows task completion
- Green = completed
- Blue = running
- Gray = not started

## 💡 Pro Tips

1. **Click on job descriptions** to see SQL query text
2. **Expand stages** to see individual tasks
3. **Click on Exchange nodes** to see shuffle details
4. **Check Executor tab** for resource utilization
5. **Use SQL tab** for query optimization insights
6. **Monitor Storage tab** for caching effectiveness

## 🔧 Troubleshooting

### No Jobs Showing?
- ✅ Make sure you ran Step 1.5 (Spark setup)
- ✅ Run Step 3.5 (Process data with Spark)
- ✅ Refresh the Spark Web UI page
- ✅ Check if Spark session is active

### DAG Not Displaying?
- ✅ Click on the job description link
- ✅ Wait for job to complete
- ✅ Ensure JavaScript is enabled in browser

### Slow Performance?
- ⚠️ Check for large shuffle operations
- ⚠️ Look for skewed partitions
- ⚠️ Monitor memory usage in Executors tab
- ⚠️ Check GC time in task metrics

## 📚 Key Concepts

### Lazy Evaluation:
Spark doesn't execute until an **action** is called:
- **Transformations** (lazy): select, filter, groupBy, map
- **Actions** (eager): show, count, collect, save

### Wide vs Narrow Dependencies:
- **Narrow** - No shuffle needed (filter, map, select)
- **Wide** - Shuffle required (groupBy, join, repartition)

### Partitions:
- Each task processes one partition
- More partitions = more parallelism
- But too many = overhead
- Sweet spot: 2-4 partitions per CPU core

## 🎓 Learning Exercise

Try running different operations and observe the DAG:

```python
# 1. Simple transformation (narrow)
spark_df.select("column1").show()
# DAG: Scan → Project → Result

# 2. Aggregation (wide)
spark_df.groupBy("category").count().show()
# DAG: Scan → HashAggregate → Exchange → HashAggregate → Result

# 3. Join (wide)
df1.join(df2, "key").show()
# DAG: Scan → Scan → BroadcastHashJoin → Result

# 4. Window function (complex)
spark_df.withColumn("rank", row_number().over(window)).show()
# DAG: Scan → Exchange → Sort → Window → Result
```

## 📖 Additional Resources

- **Spark UI Guide:** https://spark.apache.org/docs/latest/web-ui.html
- **DAG Visualization:** Understanding execution plans
- **Performance Tuning:** Optimizing Spark jobs

---

**Remember:** The Spark Web UI is your best friend for understanding and optimizing Spark jobs!

🔗 Access your Spark UI via the ngrok URL provided in the notebook output.
