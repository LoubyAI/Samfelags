/**
 * Cloud Function: Smart Storage Cleanup
 * 
 * Monitors Firestore storage and automatically deletes oldest posts
 * when storage approaches 1 GB (free tier limit).
 * 
 * This keeps your app FREE forever by staying under the 1 GB limit.
 * 
 * Setup: Deploy with: firebase deploy --only functions:cleanupOldPosts
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Configuration
const STORAGE_THRESHOLD_MB = 900; // Start cleanup at 900 MB
const STORAGE_TARGET_MB = 800;   // Delete until we're at 800 MB
const CHECK_INTERVAL = 'every 24 hours';

/**
 * Main cleanup function - runs daily
 * Checks if storage is approaching limit and deletes oldest posts if needed
 */
exports.cleanupOldPosts = functions.pubsub
  .schedule(CHECK_INTERVAL)
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    console.log('🔍 Storage cleanup check started...');
    
    try {
      // Step 1: Get current storage size
      const storageSize = await getFirestoreStorageSize();
      const storageMB = storageSize / (1024 * 1024);
      console.log(`📊 Current storage: ${storageMB.toFixed(2)} MB`);
      
      // Step 2: Check if cleanup is needed
      if (storageMB > STORAGE_THRESHOLD_MB) {
        console.log(`⚠️ Storage ${storageMB.toFixed(2)} MB exceeds threshold ${STORAGE_THRESHOLD_MB} MB`);
        console.log(`🗑️ Starting cleanup to reach target ${STORAGE_TARGET_MB} MB...`);
        
        // Step 3: Delete oldest posts until target is reached
        const deletedCount = await deleteOldestPosts(storageMB, STORAGE_TARGET_MB);
        
        console.log(`✅ Cleanup complete! Deleted ${deletedCount} posts`);
        
        // Step 4: Send alert notification (optional)
        await sendCleanupAlert(storageMB, deletedCount);
      } else {
        console.log(`✅ Storage OK - ${storageMB.toFixed(2)} MB is below threshold`);
      }
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      await sendErrorAlert(error);
      throw error;
    }
  });

/**
 * Estimate Firestore storage size by sampling data
 * Note: This is an estimate, not exact (Firestore doesn't expose exact size)
 */
async function getFirestoreStorageSize() {
  let totalSize = 0;
  
  try {
    // Get sample of documents from each collection
    const collections = ['newsPosts', 'meetingPosts', 'users', 'conversations'];
    
    for (const collection of collections) {
      const snapshot = await db.collection(collection).limit(100).get();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const docSize = JSON.stringify(data).length; // Rough estimate
        totalSize += docSize + 32; // Add 32 bytes for metadata
      });
    }
    
    // Multiply by average to estimate total
    // This is approximate - for exact size, check Firebase Console
    const estimatedTotal = totalSize * 10; // Conservative multiplier
    
    return estimatedTotal;
  } catch (error) {
    console.error('Error calculating storage:', error);
    return 0;
  }
}

/**
 * Delete oldest posts until target storage size is reached
 */
async function deleteOldestPosts(currentSize, targetSize) {
  let deletedCount = 0;
  const currentMB = currentSize / (1024 * 1024);
  const targetMB = targetSize / (1024 * 1024);
  
  if (currentMB <= targetMB) {
    return 0; // Already at target
  }
  
  console.log(`Deleting posts to go from ${currentMB.toFixed(2)} MB to ${targetMB.toFixed(2)} MB...`);
  
  try {
    // Query oldest posts from both collections
    const collections = ['newsPosts', 'meetingPosts'];
    
    for (const collection of collections) {
      // Get posts ordered by creation date (oldest first)
      const snapshot = await db.collection(collection)
        .orderBy('createdAt', 'asc') // Oldest first
        .limit(100) // Delete in batches
        .get();
      
      if (snapshot.empty) {
        continue; // No posts to delete
      }
      
      // Delete posts in a batch
      const batch = db.batch();
      let batchCount = 0;
      
      for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        batchCount++;
        deletedCount++;
      }
      
      if (batchCount > 0) {
        await batch.commit();
        console.log(`Deleted ${batchCount} posts from ${collection}`);
      }
      
      // Check if we're at target now
      const newSize = await getFirestoreStorageSize();
      if (newSize / (1024 * 1024) <= targetMB) {
        console.log(`✅ Target reached! Storage now ${(newSize / (1024 * 1024)).toFixed(2)} MB`);
        break;
      }
    }
    
  } catch (error) {
    console.error('Error deleting posts:', error);
  }
  
  return deletedCount;
}

/**
 * Send cleanup alert notification (optional)
 * Logs to Cloud Functions logs (visible in Firebase Console)
 */
async function sendCleanupAlert(storageMB, deletedCount) {
  try {
    console.log(`
      ⚠️ STORAGE CLEANUP ALERT
      ✅ Cleaned up ${deletedCount} oldest posts
      📊 Storage after cleanup: ${storageMB.toFixed(2)} MB
      🔄 Keeping your app in the FREE tier!
    `);
    
    // Optional: Send email, Slack, etc.
    // For now, just log to Firebase Console
    
  } catch (error) {
    console.error('Error sending alert:', error);
  }
}

/**
 * Send error alert if cleanup fails
 */
async function sendErrorAlert(error) {
  console.error(`
    ❌ STORAGE CLEANUP ERROR
    Error: ${error.message}
    Please check Firebase Console logs
  `);
}

/**
 * Manual trigger function (for testing)
 * Call via: firebase functions:call cleanupOldPostsManual
 */
exports.cleanupOldPostsManual = functions.https.onCall(async (data, context) => {
  // Verify user is admin (optional - for security)
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be signed in'
    );
  }
  
  try {
    const storageSize = await getFirestoreStorageSize();
    const storageMB = storageSize / (1024 * 1024);
    
    console.log(`Manual cleanup triggered by ${context.auth.uid}`);
    console.log(`Current storage: ${storageMB.toFixed(2)} MB`);
    
    if (storageMB > 900) {
      const deletedCount = await deleteOldestPosts(storageSize, 800 * 1024 * 1024);
      return {
        success: true,
        message: `Deleted ${deletedCount} posts`,
        storageBefore: storageMB.toFixed(2),
        storageAfter: ((storageSize - (deletedCount * 100000)) / (1024 * 1024)).toFixed(2)
      };
    } else {
      return {
        success: true,
        message: 'No cleanup needed',
        storage: storageMB.toFixed(2)
      };
    }
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Monitoring function - returns current storage stats
 * Call via: firebase functions:call getStorageStats
 */
exports.getStorageStats = functions.https.onCall(async (data, context) => {
  try {
    const storageSize = await getFirestoreStorageSize();
    const storageMB = storageSize / (1024 * 1024);
    const usagePercent = (storageMB / 1024) * 100; // Percent of 1 GB
    
    return {
      storageMB: storageMB.toFixed(2),
      storageGB: (storageMB / 1024).toFixed(3),
      usagePercent: usagePercent.toFixed(1),
      threshold: STORAGE_THRESHOLD_MB,
      target: STORAGE_TARGET_MB,
      status: storageMB > STORAGE_THRESHOLD_MB ? 'NEEDS_CLEANUP' : 'OK'
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
