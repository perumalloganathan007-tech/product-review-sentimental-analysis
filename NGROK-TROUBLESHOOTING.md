# 🔧 Ngrok Troubleshooting Guide

## Common Error: "Endpoint Already Online" (ERR_NGROK_334)

### Error Message You're Seeing:
```
WARNING:pyngrok.process.ngrok: failed to start tunnel
err="failed to start tunnel: The endpoint 'https://ungainable-superleniently-cleveland.ngrok-free.dev' is already online. Either
1. stop your existing endpoint first, or
2. start both endpoints with `--pooling-enabled` to load balance between them.

ERR_NGROK_334
```

### What This Means:
- 🔴 You have another ngrok tunnel already running with the same account
- 🔴 Free ngrok tier allows only **1 tunnel at a time**
- 🔴 Previous tunnel didn't close properly

---

## ✅ Solution 1: Use the Reconnect Cell (Easiest)

In the notebook, find and run this cell:

**"🔧 Troubleshooting: Reconnect Ngrok"**

This cell will:
1. Kill all existing ngrok processes
2. Wait 3 seconds for cleanup
3. Create a fresh tunnel
4. Display new public URL

---

## ✅ Solution 2: Manual Cleanup in Notebook

Add and run this cell:

```python
from pyngrok import ngrok
import time

print("🔄 Cleaning up ngrok...")

# Kill all processes
ngrok.kill()
time.sleep(5)  # Wait for cleanup

# Reconnect
try:
    ngrok.set_auth_token("34BJhKldBN9PXl1dG5wWqzYZl5C_5n9fZ52ohTAfHNUiCZFX1")
    spark_port = 4040  # or your actual Spark UI port
    public_url = ngrok.connect(spark_port, bind_tls=True)
    
    print(f"✅ New URL: {public_url}")
except Exception as e:
    print(f"❌ Error: {e}")
```

---

## ✅ Solution 3: Check for Other Running Notebooks

**If you have multiple Colab notebooks open:**

1. Go to each tab with a Colab notebook
2. Check if any are running ngrok
3. Stop those notebooks: `Runtime` → `Disconnect and delete runtime`
4. Wait 30 seconds
5. Return to this notebook and run Step 1.5 again

---

## ✅ Solution 4: Use Different Ngrok Account (If Available)

If you have another ngrok account:

1. Get new auth token from https://dashboard.ngrok.com/get-started/your-authtoken
2. Replace token in Step 1.5:
```python
NGROK_AUTH_TOKEN = "your_new_token_here"
```
3. Run Step 1.5 again

---

## ✅ Solution 5: Use Local Access Only

**Spark still works without ngrok!**

```python
# Find your Spark UI port
print(spark.sparkContext.uiWebUrl)

# Output example: http://192.168.xxx.xxx:4040
# Access this URL in your Colab environment
```

**Limitations:**
- ❌ Can't share with others
- ❌ Only accessible within Colab session
- ✅ All Spark features still work
- ✅ Jobs, DAGs, Stages all visible

---

## ✅ Solution 6: Wait and Auto-Expire

Ngrok free tier tunnels expire after inactivity:

1. Wait 2-3 minutes
2. Run Step 1.5 cell again
3. Old tunnel should have expired
4. New tunnel should connect

---

## Understanding Ngrok Free Tier Limits

| Feature | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Concurrent Tunnels | 1 | Multiple |
| Tunnel Lifetime | ~2 hours | Unlimited |
| Custom Domains | ❌ | ✅ |
| Reserved Domains | ❌ | ✅ |
| IP Whitelisting | ❌ | ✅ |

---

## Alternative: Localtunnel (Free Alternative to Ngrok)

If ngrok keeps failing, try localtunnel:

```python
# Install localtunnel
!npm install -g localtunnel

# In a separate cell
import subprocess
import time

# Start localtunnel
spark_port = 4040
process = subprocess.Popen(
    ['lt', '--port', str(spark_port)],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

time.sleep(3)
print("Check output for URL")
```

---

## Checking Ngrok Status

### Check Active Tunnels:
```python
from pyngrok import ngrok

tunnels = ngrok.get_tunnels()
print(f"Active tunnels: {len(tunnels)}")

for tunnel in tunnels:
    print(f"  {tunnel.name}: {tunnel.public_url} -> {tunnel.config['addr']}")
```

### Kill All Tunnels:
```python
from pyngrok import ngrok
import time

ngrok.kill()
time.sleep(2)
print("✅ All tunnels killed")
```

### Check Ngrok Process:
```python
import subprocess

result = subprocess.run(['ps', 'aux'], capture_output=True, text=True)
ngrok_processes = [line for line in result.stdout.split('\n') if 'ngrok' in line]

if ngrok_processes:
    print("🔴 Ngrok processes found:")
    for proc in ngrok_processes:
        print(f"  {proc}")
else:
    print("✅ No ngrok processes running")
```

---

## Port Conflict Issues

### If Spark UI port 4040 is busy:

The code now **automatically finds a free port**:

```python
# This is already in the notebook
def find_free_port(start_port=4040):
    port = start_port
    while port < start_port + 100:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            port += 1
    return start_port

spark_ui_port = find_free_port(4040)
```

Check output for:
```
Spark UI Port: 4041  # or 4042, 4043, etc.
```

---

## Testing Ngrok Connection

### Test if ngrok is working:
```python
from pyngrok import ngrok
import time

try:
    # Kill existing
    ngrok.kill()
    time.sleep(2)
    
    # Set token
    ngrok.set_auth_token("34BJhKldBN9PXl1dG5wWqzYZl5C_5n9fZ52ohTAfHNUiCZFX1")
    
    # Test with simple port
    test_url = ngrok.connect(8888, bind_tls=True)
    print(f"✅ Ngrok working! Test URL: {test_url}")
    
    # Disconnect test
    ngrok.disconnect(test_url)
    print("✅ Cleanup successful")
    
except Exception as e:
    print(f"❌ Ngrok test failed: {e}")
```

---

## Best Practices

### ✅ DO:
- Run reconnect cell if error occurs
- Wait 3-5 seconds between attempts
- Close other notebooks using ngrok
- Check for existing tunnels before creating new ones
- Use `ngrok.kill()` to clean up properly

### ❌ DON'T:
- Create multiple tunnels simultaneously
- Run Step 1.5 multiple times rapidly
- Keep old notebooks running with ngrok
- Share your ngrok auth token publicly
- Expect instant reconnection (wait 2-3 seconds)

---

## Quick Checklist

When ngrok fails:

- [ ] Check if other Colab notebooks are running
- [ ] Run `ngrok.kill()` and wait 3 seconds
- [ ] Verify auth token is correct
- [ ] Check Spark UI port is correct
- [ ] Try the reconnect cell in notebook
- [ ] Wait 30 seconds and retry
- [ ] Consider using local access if urgent

---

## Success Output

When ngrok works correctly, you should see:

```
✅ Spark Session Created
   Spark Version: 3.5.0
   Spark UI Port: 4040
   Local Web UI: http://localhost:4040

🌐 Setting up ngrok tunnel for Spark Web UI...
🔄 Closing any existing ngrok tunnels...
🔗 Creating ngrok tunnel to port 4040...

======================================================================
🎉 SPARK WEB UI IS NOW PUBLIC!
======================================================================

🌍 Public URL: https://xxxx-yyyy-zzzz.ngrok-free.app
   (ngrok free tier - may show interstitial page on first visit)

📊 Access your Spark Web UI from anywhere using the URL above!

💡 Tips:
   • Click 'Visit Site' if you see ngrok warning page
   • Bookmark the URL for easy access
   • Share with team members to view job progress
======================================================================

✅ Setup complete! Ready for data analysis with Spark!
   Spark UI: https://xxxx-yyyy-zzzz.ngrok-free.app
```

---

## Still Having Issues?

### Option A: Skip Ngrok Entirely
Comment out the ngrok section and use local access:
```python
# Skip ngrok setup
spark_ui_url = f"http://localhost:{spark_ui_port}"
print(f"✅ Using local access: {spark_ui_url}")
```

### Option B: Use Spark Without Web UI
Focus on the analysis, skip monitoring:
```python
# Disable Spark UI
spark = SparkSession.builder \
    .config("spark.ui.enabled", "false") \
    .getOrCreate()
```

### Option C: Use Pandas Only
If Spark is causing issues, use pandas analysis:
- Skip Step 1.5 (Spark setup)
- Skip Step 3.5 (Spark processing)
- Continue with Step 4 onwards (pandas-based)

---

**Remember:** Spark works fine without ngrok! The Web UI is for monitoring, not required for functionality.
