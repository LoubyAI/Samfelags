/**
 * Firestore Integration Examples
 * 
 * This file demonstrates how to use the firebaseFirestore API
 * in your app.js and other modules.
 */

// ============================================
// EXAMPLE 1: Initialize and Get Current User
// ============================================
async function ensureUserSignedIn() {
  try {
    // This checks if user is authenticated
    const { auth } = await window.firebaseAuth.getAuth?.() || {};
    if (!auth?.currentUser) {
      throw new Error("User not signed in");
    }
    return auth.currentUser;
  } catch (error) {
    console.error("Auth check failed:", error);
    // Redirect to login page
    window.location.href = "?view=login";
  }
}

// ============================================
// EXAMPLE 2: Create a News Post
// ============================================
async function createNewsPost(postText) {
  try {
    await ensureUserSignedIn();
    
    const postData = {
      text: postText,
      attachments: [],  // Array of file URLs
      poll: null,       // Optional: { question: "...", options: [...] }
      images: []        // Optional: array of image objects
    };
    
    const docRef = await window.firebaseFirestore.addPost('newsPosts', postData);
    console.log("✓ Post created with ID:", docRef.id);
    
    // Optionally show success message
    return docRef.id;
  } catch (error) {
    console.error("✗ Failed to create post:", error.message);
    if (error.message.includes("not signed in")) {
      alert("Please sign in first");
    } else {
      alert("Error creating post: " + error.message);
    }
  }
}

// ============================================
// EXAMPLE 3: Load All Posts (Once)
// ============================================
async function loadNewsPosts() {
  try {
    const posts = await window.firebaseFirestore.getPosts('newsPosts', 50);
    console.log("Loaded posts:", posts);
    
    // Update your UI with posts
    posts.forEach(post => {
      console.log(`${post.displayName}: ${post.text}`);
      console.log(`  Created: ${new Date(post.createdAt.seconds * 1000).toLocaleString()}`);
    });
    
    return posts;
  } catch (error) {
    console.error("Failed to load posts:", error);
  }
}

// ============================================
// EXAMPLE 4: Real-Time Posts with Live Updates
// ============================================
let postsUnsubscribe = null;

async function startListeningToNewsPosts() {
  try {
    postsUnsubscribe = await window.firebaseFirestore.subscribeToCollection(
      'newsPosts',
      (posts) => {
        console.log("Posts updated:", posts);
        
        // Update your UI here
        const container = document.getElementById('news-posts-container');
        if (container) {
          container.innerHTML = posts
            .map(post => `
              <div class="post">
                <h3>${post.displayName}</h3>
                <p>${post.text}</p>
                <small>${new Date(post.createdAt.seconds * 1000).toLocaleString()}</small>
                ${post.userId === getCurrentUserId() ? `
                  <button onclick="deletePost('newsPosts', '${post.id}')">Delete</button>
                  <button onclick="editPost('newsPosts', '${post.id}')">Edit</button>
                ` : ''}
              </div>
            `)
            .join('');
        }
      }
    );
    
    console.log("✓ Listening to real-time updates");
  } catch (error) {
    console.error("Failed to start listening:", error);
  }
}

// Stop listening when needed (e.g., when user navigates away)
function stopListeningToNewsPosts() {
  if (postsUnsubscribe) {
    postsUnsubscribe();
    console.log("✓ Stopped listening to updates");
  }
}

// ============================================
// EXAMPLE 5: Update a Post
// ============================================
async function updatePost(postId, newText) {
  try {
    await ensureUserSignedIn();
    
    await window.firebaseFirestore.updatePost('newsPosts', postId, {
      text: newText
    });
    
    console.log("✓ Post updated");
  } catch (error) {
    console.error("✗ Failed to update post:", error.message);
    if (error.message.includes("Unauthorized")) {
      alert("You can only edit your own posts");
    }
  }
}

// ============================================
// EXAMPLE 6: Delete a Post
// ============================================
async function deletePost(collectionName, postId) {
  if (!confirm("Are you sure? This cannot be undone.")) {
    return;
  }
  
  try {
    await ensureUserSignedIn();
    
    await window.firebaseFirestore.deletePost(collectionName, postId);
    console.log("✓ Post deleted");
  } catch (error) {
    console.error("✗ Failed to delete post:", error.message);
    if (error.message.includes("Unauthorized")) {
      alert("You can only delete your own posts");
    }
  }
}

// ============================================
// EXAMPLE 7: Add a Reaction (Heart, etc.)
// ============================================
async function addReaction(postId, reactionType = 'heart') {
  try {
    await ensureUserSignedIn();
    
    await window.firebaseFirestore.addReaction('newsPosts', postId, reactionType);
    console.log(`✓ Added ${reactionType} reaction`);
  } catch (error) {
    console.error("Failed to add reaction:", error);
  }
}

async function removeReaction(postId, reactionType = 'heart') {
  try {
    await ensureUserSignedIn();
    
    await window.firebaseFirestore.removeReaction('newsPosts', postId, reactionType);
    console.log(`✓ Removed ${reactionType} reaction`);
  } catch (error) {
    console.error("Failed to remove reaction:", error);
  }
}

// ============================================
// EXAMPLE 8: Get Reactions for a Post
// ============================================
async function getPostReactions(postId) {
  try {
    const reactions = await window.firebaseFirestore.getReactions('newsPosts', postId);
    console.log("Reactions:", reactions);
    
    // Count reactions by type
    const counts = {};
    reactions.forEach(reaction => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    });
    
    return counts;
  } catch (error) {
    console.error("Failed to get reactions:", error);
  }
}

// ============================================
// EXAMPLE 9: Get Specific Post
// ============================================
async function getPostDetails(postId) {
  try {
    const post = await window.firebaseFirestore.getPostById('newsPosts', postId);
    
    if (!post) {
      console.log("Post not found");
      return null;
    }
    
    console.log("Post details:", post);
    console.log(`Author: ${post.displayName}`);
    console.log(`Text: ${post.text}`);
    console.log(`Created: ${new Date(post.createdAt.seconds * 1000).toLocaleString()}`);
    
    return post;
  } catch (error) {
    console.error("Failed to get post:", error);
  }
}

// ============================================
// EXAMPLE 10: Create Meeting Post with Event
// ============================================
async function createMeetingPost(title, date, time, location, maxAttendees = null) {
  try {
    await ensureUserSignedIn();
    
    const postData = {
      text: title,
      event: {
        date,        // "2026-12-15"
        time,        // "18:00"
        location,    // "Bræðraborgarstíg 2, Reykjavík"
        maxAttendees // null = unlimited
      },
      attachments: [],
      images: []
    };
    
    const docRef = await window.firebaseFirestore.addPost('meetingPosts', postData);
    console.log("✓ Meeting post created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Failed to create meeting:", error);
  }
}

// ============================================
// HELPER: Get Current User ID
// ============================================
async function getCurrentUserId() {
  try {
    const { auth } = await window.firebaseAuth.getAuth?.() || {};
    return auth?.currentUser?.uid;
  } catch (error) {
    return null;
  }
}

// ============================================
// INTEGRATION: Wire Into Your App
// ============================================

// Example: Run when page loads
async function initializeFirestoreUI() {
  try {
    // Check if user is signed in
    const user = await ensureUserSignedIn();
    console.log("User signed in:", user.email);
    
    // Start listening to real-time updates
    await startListeningToNewsPosts();
    
  } catch (error) {
    console.log("User not signed in; showing login screen");
  }
}

// Example: Run when user navigates away
function cleanupFirestoreUI() {
  stopListeningToNewsPosts();
}

// ============================================
// TEST QUERIES IN BROWSER CONSOLE
// ============================================
/*
// 1. Create a test post
await createNewsPost("Hello from Firestore!");

// 2. Load all posts
await loadNewsPosts();

// 3. Add a reaction
await addReaction(postId, 'heart');

// 4. Get reactions
await getPostReactions(postId);

// 5. Update a post
await updatePost(postId, "Updated text");

// 6. Delete a post
await deletePost('newsPosts', postId);
*/
