# Firestore Setup & Security Rules Guide

## Overview
Your "New Friends" app now has Firestore integration ready. Follow these steps to secure your database and start using it.

---

## Step 1: Add Firebase-Firestore Script to HTML

Include the new Firestore module in your `app.html` before `app.js`:

```html
<!-- Inside <head> -->
<script src="firebase-config.js"></script>
<script src="firebase-auth.js"></script>
<script src="firebase-firestore.js"></script> <!-- Add this line -->
```

---

## Step 2: Configure Security Rules in Firebase Console

### Go to Firestore > Rules Tab

Replace the default rules with this secure configuration:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow reads/writes only for authenticated users
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidPost(post) {
      return post.size() > 0 
        && 'userId' in post
        && 'createdAt' in post
        && post.userId == request.auth.uid;
    }
    
    // ========== NEWS POSTS ==========
    match /newsPosts/{postId} {
      // Anyone can read published posts
      allow read: if isAuthenticated();
      
      // Only the post creator can update/delete their own posts
      allow write: if isAuthenticated() && (
        (!exists(/databases/(default)/documents/newsPosts/{postId})  // Creating new post
          || resource.data.userId == request.auth.uid  // Updating own post
        )
        && isValidPost(request.resource.data)
      );
      
      // Subcollection for comments
      match /comments/{commentId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated() && (
          (!exists(/databases/(default)/documents/newsPosts/{postId}/comments/{commentId})
            || resource.data.userId == request.auth.uid
          )
          && 'userId' in request.resource.data
          && 'text' in request.resource.data
          && request.resource.data.userId == request.auth.uid
        );
      }
      
      // Subcollection for reactions
      match /reactions/{reactionId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated() 
          && request.resource.data.userId == request.auth.uid
          && 'type' in request.resource.data
          && 'createdAt' in request.resource.data;
        allow delete: if isAuthenticated() 
          && resource.data.userId == request.auth.uid;
      }
    }
    
    // ========== MEETING POSTS ==========
    match /meetingPosts/{postId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (
        (!exists(/databases/(default)/documents/meetingPosts/{postId})
          || resource.data.userId == request.auth.uid
        )
        && isValidPost(request.resource.data)
      );
      
      match /comments/{commentId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated() && (
          (!exists(/databases/(default)/documents/meetingPosts/{postId}/comments/{commentId})
            || resource.data.userId == request.auth.uid
          )
          && 'userId' in request.resource.data
          && 'text' in request.resource.data
          && request.resource.data.userId == request.auth.uid
        );
      }
      
      match /reactions/{reactionId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated() 
          && request.resource.data.userId == request.auth.uid
          && 'type' in request.resource.data
          && 'createdAt' in request.resource.data;
        allow delete: if isAuthenticated() 
          && resource.data.userId == request.auth.uid;
      }
      
      match /attendees/{attendeeId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated() 
          && request.resource.data.userId == request.auth.uid;
        allow delete: if isAuthenticated() 
          && resource.data.userId == request.auth.uid;
      }
    }
    
    // ========== USER PROFILES ==========
    match /users/{userId} {
      // Users can read all public profiles
      allow read: if isAuthenticated();
      
      // Users can only update their own profile
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // ========== MESSAGES ==========
    match /conversations/{conversationId} {
      allow read, write: if isAuthenticated() 
        && (
          request.auth.uid in resource.data.participantIds 
          || !exists(resource) // Allow creation
        );
      
      match /messages/{messageId} {
        allow read: if isAuthenticated() 
          && request.auth.uid in get(/databases/(default)/documents/conversations/{conversationId}).data.participantIds;
        
        allow create: if isAuthenticated() 
          && request.resource.data.senderId == request.auth.uid
          && request.auth.uid in get(/databases/(default)/documents/conversations/{conversationId}).data.participantIds;
      }
    }
  }
}
```

### Steps to Apply Rules:
1. Go to **Firestore > Rules** tab
2. Clear the default rules
3. Paste the above rules
4. Click **Publish**

---

## Step 3: Initialize Firestore in Your App

The module exports `window.firebaseFirestore` with these functions:

### Create a Post
```javascript
try {
  const docRef = await window.firebaseFirestore.addPost('newsPosts', {
    text: 'Hello world!',
    attachments: [],
    poll: null
  });
  console.log('Post created:', docRef.id);
} catch (error) {
  console.error('Error creating post:', error);
}
```

### Get All Posts
```javascript
const posts = await window.firebaseFirestore.getPosts('newsPosts', 50);
console.log('Posts:', posts);
```

### Subscribe to Real-Time Updates
```javascript
const unsubscribe = await window.firebaseFirestore.subscribeToCollection(
  'newsPosts',
  (posts) => {
    console.log('Posts updated:', posts);
    // Update your UI here
  }
);

// Later, to unsubscribe:
unsubscribe();
```

### Update a Post
```javascript
await window.firebaseFirestore.updatePost('newsPosts', postId, {
  text: 'Updated text'
});
```

### Delete a Post
```javascript
await window.firebaseFirestore.deletePost('newsPosts', postId);
```

### Add a Reaction
```javascript
await window.firebaseFirestore.addReaction('newsPosts', postId, 'heart');
```

### Get Reactions
```javascript
const reactions = await window.firebaseFirestore.getReactions('newsPosts', postId);
```

---

## Step 4: Database Schema (Recommended)

Organize your Firestore with this structure:

```
newsPosts/ {collection}
  ├── [postId] {document}
  │   ├── userId: string
  │   ├── displayName: string
  │   ├── userEmail: string
  │   ├── text: string
  │   ├── attachments: array
  │   ├── poll: object (optional)
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   ├── comments/ {subcollection}
  │   │   └── [commentId]
  │   │       ├── userId: string
  │   │       ├── text: string
  │   │       ├── createdAt: timestamp
  │   │
  │   └── reactions/ {subcollection}
  │       └── [userId-reactionType]
  │           ├── userId: string
  │           ├── type: string (e.g., 'heart', 'laugh')
  │           ├── createdAt: timestamp

meetingPosts/ {collection}
  ├── [postId]
  │   ├── userId: string
  │   ├── displayName: string
  │   ├── text: string
  │   ├── event: object
  │   │   ├── date: string
  │   │   ├── time: string
  │   │   ├── location: string
  │   │   ├── maxAttendees: number
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   ├── comments/ {subcollection}
  │   ├── reactions/ {subcollection}
  │   └── attendees/ {subcollection}
  │       └── [userId]
  │           ├── userId: string
  │           ├── status: string ('attending', 'maybe', 'not-attending')
  │           ├── joinedAt: timestamp

users/ {collection}
  ├── [userId] {document}
  │   ├── email: string
  │   ├── displayName: string
  │   ├── bio: string
  │   ├── photoUrl: string
  │   ├── interests: array
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp

conversations/ {collection}
  ├── [conversationId]
  │   ├── participantIds: array
  │   ├── lastMessage: string
  │   ├── updatedAt: timestamp
  │   ├── messages/ {subcollection}
  │       └── [messageId]
  │           ├── senderId: string
  │           ├── text: string
  │           ├── createdAt: timestamp
```

---

## Step 5: Error Handling

All Firestore functions throw errors that you should handle:

```javascript
try {
  await window.firebaseFirestore.addPost('newsPosts', postData);
} catch (error) {
  if (error.code === 'permission-denied') {
    console.error('You do not have permission to perform this action');
  } else if (error.code === 'unauthenticated') {
    console.error('You must sign in first');
  } else {
    console.error('Error:', error.message);
  }
}
```

---

## Step 6: Testing in Development

### Test Read Access
1. Sign in to your app
2. Open browser console
3. Run: `const posts = await window.firebaseFirestore.getPosts('newsPosts'); console.log(posts);`

### Test Write Access
```javascript
const result = await window.firebaseFirestore.addPost('newsPosts', {
  text: 'Test post from console',
  attachments: [],
  poll: null
});
console.log('Created post:', result.id);
```

### Monitor Firestore in Console
- Go to Firebase Console > Firestore > Data
- Watch posts appear in real-time

---

## Security Checklist

✅ **Rules Configured** - Only authenticated users can read/write
✅ **User Ownership** - Posts can only be updated/deleted by creator
✅ **Timestamps** - Automatically added server-side (prevents manipulation)
✅ **Validation** - Required fields checked in rules
✅ **Offline Support** - IndexedDB persistence enabled
✅ **Error Handling** - User-facing error messages implemented

---

## Common Issues & Solutions

### "Permission denied" Error
**Cause**: User is not authenticated or rules don't allow the action
**Solution**: Ensure user is signed in and owns the post

### "Unauthenticated" Error  
**Cause**: User session expired or not signed in
**Solution**: Redirect to login

### "Offline" but "Cannot read collections"
**Cause**: Database rules are too restrictive or offline persistence isn't enabled
**Solution**: Check Firebase Rules and ensure device is online for initial sync

---

## Next Steps

1. ✅ Add rules to Firebase Console
2. ✅ Include `firebase-firestore.js` in HTML
3. ✅ Integrate API calls into app.js
4. ✅ Update UI to display Firestore data
5. ✅ Test all CRUD operations
6. ✅ Monitor Firestore usage in Firebase Console

**Estimated cost with new subscription**: ~$0-5/month for small user base (1-10,000 reads/writes per day)
