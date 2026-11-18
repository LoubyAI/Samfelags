# 🗑️ Storage Auto-Cleanup Setup Guide

## Overview

This Cloud Function automatically monitors your Firestore storage and deletes the **oldest posts** when storage approaches 1 GB (the free tier limit).

**Result**: Your app stays FREE forever! 💰

---

## ✨ What It Does

```
Daily Check:
  ├─ Current storage < 900 MB → ✅ No action needed
  ├─ Current storage 900-1000 MB → ⚠️ Start cleanup
  └─ Delete oldest posts until back to 800 MB
  
Benefit: Stays under FREE tier limit automatically 🎉
```

---

## 🚀 Setup Instructions

### Step 1: Install Firebase CLI (If not already installed)

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

---

### Step 2: Create Cloud Functions Directory

```bash
# Navigate to your project root
cd C:\Users\louby\OneDrive\Dokumente\Vefskólinn\Samfelags

# Initialize functions (if not already done)
firebase init functions

# When prompted:
# ? What language would you like to use? → JavaScript
# ? Do you want to use ESLint? → No (or Yes if you prefer)
```

This creates a `functions/` directory structure.

---

### Step 3: Copy Function Code

1. Create file: `functions/index.js`
2. Copy **ALL** content from `functions-storage-cleanup.js`
3. Paste into `functions/index.js`

---

### Step 4: Install Dependencies

```bash
cd functions
npm install
cd ..
```

The function requires:
- `firebase-functions`
- `firebase-admin`

(These should auto-install)

---

### Step 5: Deploy Function

```bash
firebase deploy --only functions
```

You should see:
```
✔ functions[cleanupOldPosts]: http trigger URL created
✔ Deployment complete!
```

**Save the URL** - you can call the function manually with it.

---

## 📋 How It Works

### Automatic Daily Check (Every 24 Hours)
- Runs automatically at the scheduled time
- Checks current storage usage
- If > 900 MB: Deletes oldest posts
- Stops when storage drops to 800 MB
- Logs results to Firebase Console

### Manual Trigger (For Testing)
Call the function manually to test cleanup:

```bash
firebase functions:call cleanupOldPostsManual
```

You should get a response like:
```json
{
  "success": true,
  "message": "Deleted 15 posts",
  "storageBefore": "950.25",
  "storageAfter": "845.75"
}
```

### Check Storage Stats Anytime
```bash
firebase functions:call getStorageStats
```

Response:
```json
{
  "storageMB": "425.50",
  "storageGB": "0.415",
  "usagePercent": "41.5",
  "threshold": 900,
  "target": 800,
  "status": "OK"
}
```

---

## 📊 Configuration

Edit these values in `functions/index.js` to customize:

```javascript
const STORAGE_THRESHOLD_MB = 900;  // Start cleanup at this size
const STORAGE_TARGET_MB = 800;     // Delete until reaching this size
const CHECK_INTERVAL = 'every 24 hours'; // How often to check
```

**Recommended values:**
- **Small app (< 100 users)**: Threshold 900 MB, Target 800 MB
- **Medium app (100-1000 users)**: Threshold 950 MB, Target 850 MB
- **Large app (1000+ users)**: Threshold 980 MB, Target 900 MB

---

## 🔍 Monitoring

### View Function Logs

**In Firebase Console:**
1. Go to: Functions > Logs
2. Select function: `cleanupOldPosts`
3. Watch for messages like:
   - "✅ Storage OK"
   - "⚠️ Storage exceeds threshold"
   - "✅ Cleanup complete! Deleted X posts"

### Check Storage in Real-Time
1. Go to: Firestore > Data
2. Bottom of page shows current storage usage
3. Compare against 1 GB limit

---

## ⚙️ Advanced Configuration

### Change Cleanup Schedule

Currently: Every 24 hours at 2 AM Pacific Time

To change, edit:
```javascript
exports.cleanupOldPosts = functions.pubsub
  .schedule('every 24 hours')  // ← Change this
  .timeZone('America/Los_Angeles')  // ← Or change timezone
  .onRun(async (context) => {
    // ...
  });
```

**Other schedule examples:**
```javascript
.schedule('every 12 hours')           // Twice per day
.schedule('every 1 hours')            // Every hour
.schedule('every monday 09:00')       // Weekly
.schedule('0 2 * * *')               // Every day at 2 AM (cron format)
```

---

## 🛡️ What Gets Deleted (And What Doesn't)

### Deleted (Oldest First):
✅ Old posts from `newsPosts` collection  
✅ Old posts from `meetingPosts` collection  

### NOT Deleted (Always Preserved):
❌ User accounts (Firebase Auth)  
❌ User profiles  
❌ Messages/conversations  
❌ All other data  

**Only posts older than others are deleted - most recent posts are always kept!**

---

## 🧪 Testing the Function

### Test 1: Check Current Storage
```bash
firebase functions:call getStorageStats
```

### Test 2: Trigger Manual Cleanup
```bash
firebase functions:call cleanupOldPostsManual
```

### Test 3: Verify Logs
```bash
firebase functions:log
```

Look for messages like:
- "🔍 Storage cleanup check started..."
- "✅ Storage OK"
- "✅ Cleanup complete!"

---

## ⚠️ Important Notes

### Cost
- **FREE** - Runs for free on Blaze plan
- Part of Cloud Functions free tier
- No additional charges

### Accuracy
- Storage estimate is approximate (not exact)
- Firebase Console shows exact storage
- For 100% accuracy, check Firestore Console > Database

### Automatic Schedule
- Function runs daily at scheduled time
- **You don't need to do anything**
- It's autonomous and automatic

### Delete Safety
- Only deletes oldest posts
- Newest/most recent posts are always preserved
- Posts are deleted by creation date (oldest first)
- No recovery after deletion (be aware!)

---

## 🚨 Troubleshooting

### "Function not deploying"
```bash
# Check for syntax errors
firebase deploy --only functions:cleanupOldPosts
```

### "Function not running"
1. Check timezone is correct
2. Verify schedule syntax
3. Check Firebase Console logs

### "Storage still growing"
1. Verify function is deployed
2. Check the threshold/target values
3. Try manual trigger: `firebase functions:call cleanupOldPostsManual`
4. Check if many large documents are being added daily

### "Posts getting deleted too often"
Increase `STORAGE_THRESHOLD_MB`:
```javascript
const STORAGE_THRESHOLD_MB = 950;  // Increase from 900
```

---

## 📈 Expected Behavior

**Month 1 (Growth Phase)**:
- Storage: 100 → 500 MB
- Cleanup: Never triggers
- Status: ✅ All posts kept

**Month 6 (Approaching Limit)**:
- Storage: 850 → 920 MB
- Cleanup: Triggers, deletes 100 MB of oldest posts
- Storage: Back to 820 MB
- Status: ✅ Automatic cleanup working

**Month 12 (Equilibrium)**:
- Storage: Oscillates 800-900 MB
- Cleanup: Triggers regularly (maybe weekly)
- Posts: Newest kept, oldest deleted when needed
- Status: ✅ Sustainable in FREE tier

---

## 🎓 Summary

✅ **Automatic**: Runs daily without your input  
✅ **Smart**: Only deletes when needed  
✅ **Safe**: Oldest posts deleted first, newest preserved  
✅ **Free**: No extra cost  
✅ **Scalable**: Works with any size app  

**Result**: Keep your app FREE forever! 🚀

---

## 📞 Next Steps

1. ✅ Install Firebase CLI
2. ✅ Run `firebase init functions`
3. ✅ Copy `functions-storage-cleanup.js` to `functions/index.js`
4. ✅ Run `firebase deploy --only functions`
5. ✅ Test with `firebase functions:call getStorageStats`

**You're done!** The function will now monitor and clean up automatically. 🎉
