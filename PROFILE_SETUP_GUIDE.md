# User Profile System - Integration Guide

## Overview

A complete first-time profile setup system that:
- ✅ Redirects new users to profile setup after signup
- ✅ Collects: photo, name, age, city, interests, bio
- ✅ Uses age for group filtering
- ✅ Saves to Firestore database
- ✅ Allows profile editing in settings

---

## Files Created

### 1. `firebase-profile.js` (13 KB)
Complete profile management module with:
- `renderProfileSetup()` - First-time profile form
- `renderProfileSettings()` - Profile edit form
- `getAgeGroupLabel()` - Age to group mapping
- Helper functions for interests and age groups

### 2. Updated `firebase-firestore.js`
Added profile functions:
- `getUserProfile(userId)` - Get user profile
- `saveUserProfile(profileData)` - Save profile to Firestore
- `hasCompletedProfile(userId)` - Check if setup is done
- `uploadProfilePhoto(file)` - Handle photo upload
- `getUsersByAgeGroup(minAge, maxAge)` - Filter users by age
- `getGroupsByUserAge(userAge)` - Get age groups for user
- `filterEventsByUserAge(events, userAge)` - Filter events by age

### 3. Updated `app.css`
Added 300+ lines of profile styling:
- Profile setup card styling
- Form inputs and interactions
- Photo upload area
- Age group display
- Interests grid
- Profile settings page

### 4. Updated `app.html`
Added script tag: `<script src="firebase-profile.js?v=1"></script>`

---

## How It Works

### Flow 1: First-Time Signup → Profile Setup

```
User clicks "Create Account"
  ↓
Enters: email, password, name
  ↓
Account created in Firebase Auth
  ↓
App checks: hasCompletedProfile(user.uid)
  ↓
Result: false (new user)
  ↓
Redirect to: ?view=profile-setup
  ↓
User fills profile form:
  - Photo (required)
  - Name (required)
  - Age (required)
  - City (required)
  - Interests (optional)
  - Bio (optional)
  ↓
Clicks "Klára og fara til heimabæjar"
  ↓
Saves to Firestore:
  - profileCompleted: true
  - photo: base64 image
  - displayName: user's name
  - age: user's age
  - city: user's city
  - interests: []
  - bio: description
  ↓
Redirect to home page
  ↓
User is fully set up! ✅
```

### Flow 2: Existing User Editing Profile

```
User clicks "Prófíll" in sidebar
  ↓
App loads profile settings page
  ↓
Shows current profile data
  ↓
User edits fields
  ↓
Clicks "Vista breytingar"
  ↓
Updates Firestore with new data
  ↓
Confirmation message
  ↓
Profile updated! ✅
```

---

## Integration Steps

### Step 1: Check Profile on Login

In app.js, after user logs in, add:

```javascript
// After successful login
const hasProfile = await window.firebaseFirestore.hasCompletedProfile(user.uid);

if (!hasProfile) {
  // New user: show profile setup
  window.location.replace("app.html?view=profile-setup");
} else {
  // Existing user: show home
  window.location.replace("app.html?view=home");
}
```

### Step 2: Handle Profile Setup Form

In app.js, add form submission handler:

```javascript
if (form.dataset.form === "profile-setup") {
  event.preventDefault();
  
  const formData = new FormData(form);
  const photoFile = formData.get("photo");
  const age = parseInt(formData.get("age"));
  
  try {
    // Upload photo
    const photoUrl = await window.firebaseFirestore.uploadProfilePhoto(photoFile);
    
    // Get interests
    const interests = Array.from(form.querySelectorAll("input[name='interests']:checked"))
      .map(el => el.value);
    
    // Save profile
    await window.firebaseFirestore.saveUserProfile({
      displayName: formData.get("displayName"),
      age: age,
      city: formData.get("city"),
      bio: formData.get("bio"),
      interests: interests,
      photoUrl: photoUrl,
    });
    
    // Redirect to home
    window.location.replace("app.html?view=home");
  } catch (error) {
    console.error("Profile setup failed", error);
    showProfileError("Ekki tókst að vista prófíl");
  }
}
```

### Step 3: Update Age Group Display

In firebase-profile.js, update on age input:

```javascript
const ageInput = document.getElementById("profile-age");
const ageGroupDisplay = document.getElementById("age-group-display");

if (ageInput) {
  ageInput.addEventListener("input", () => {
    const age = parseInt(ageInput.value);
    if (age) {
      const group = window.firebaseProfile.getAgeGroupLabel(age);
      ageGroupDisplay.innerHTML = `<span class="age-group-label">${group}</span>`;
    }
  });
}
```

### Step 4: Add View Case in app.js

Add to the view handler:

```javascript
case "profile-setup":
  screen.innerHTML = window.firebaseProfile.renderProfileSetup();
  handleProfileSetupForm();
  updateAgeGroupDisplay();
  break;
```

---

## Database Schema

### Users Collection

```javascript
{
  userId: "ABC123XYZ",           // Firebase Auth UID
  email: "user@example.com",      // From auth
  displayName: "Anna",            // User's name
  age: 28,                        // Birth age
  city: "reykjavik",             // Location
  photoUrl: "data:image/...",    // Base64 or URL
  bio: "Love hiking and coffee", // Optional
  interests: ["travel", "food"], // Optional array
  profileCompleted: true,         // Completion flag
  createdAt: timestamp,           // Account creation
  updatedAt: timestamp,           // Last update
}
```

---

## Age Groups

| Group | Min | Max | Label |
|-------|-----|-----|-------|
| 1 | 18 | 25 | 18-25 ára |
| 2 | 26 | 35 | 26-35 ára |
| 3 | 36 | 50 | 36-50 ára |
| 4 | 50+ | 150 | 50+ ára |

---

## Filter Events by Age

### Example: Show only age-appropriate events

```javascript
// Get user's profile
const profile = await window.firebaseFirestore.getUserProfile(userId);

// Get all events
const allEvents = await window.firebaseFirestore.getPosts("events");

// Filter by user's age
const userEvents = await window.firebaseFirestore.filterEventsByUserAge(
  allEvents,
  profile.age
);

// Display events
displayEvents(userEvents);
```

### Event Structure

```javascript
{
  id: "event123",
  title: "Coffee meetup",
  ageGroupRequired: {
    min: 25,
    max: 35,  // Only 25-35 can attend
  }
}
```

---

## Find Users by Age Group

### Example: Find all users in age group

```javascript
// Find users aged 26-35
const users = await window.firebaseFirestore.getUsersByAgeGroup(26, 35);

// Display users
users.forEach(user => {
  console.log(`${user.displayName} (${user.age}) from ${user.city}`);
});
```

---

## Photo Upload

### Current Implementation
Photos are stored as **base64 strings** in Firestore (up to ~1MB).

### For Production (Optional)
Use Firebase Storage for larger images:

```javascript
async uploadPhotoToStorage(file) {
  const { storage, storageSdk } = await getStorageClient();
  const user = await getCurrentUser();
  
  const photoRef = storageSdk.ref(storage, `profiles/${user.uid}/photo.jpg`);
  await storageSdk.uploadBytes(photoRef, file);
  
  const url = await storageSdk.getDownloadURL(photoRef);
  return url;
}
```

---

## Security Rules for Profiles

Add to firestore-rules.txt:

```javascript
match /users/{userId} {
  // User can read all profiles (public)
  allow read: if isAuthenticated();
  
  // User can only edit own profile
  allow write: if isAuthenticated() && request.auth.uid == userId;
}
```

---

## Styling Classes

### Profile Setup
- `.profile-setup-container` - Full-screen container
- `.profile-setup-card` - Centered form card
- `.photo-upload-area` - Drag-and-drop area
- `.interests-grid` - Multi-select grid
- `.age-group-display` - Age group indicator
- `.form-group` - Form field wrapper

### Profile Settings
- `.profile-settings-container` - Settings page
- `.settings-card` - Settings form card
- `.photo-preview-container` - Photo display

---

## Key Features

✅ **Photo Upload**
- Drag-and-drop support
- File validation (JPG, PNG, GIF)
- Real-time preview

✅ **Age-Based Grouping**
- Automatic age group assignment
- Filter users by age
- Age-restricted events

✅ **Interests**
- 8 pre-defined interests
- Multi-select checkboxes
- Emoji indicators

✅ **Profile Completion Check**
- Redirect new users to setup
- Prevents skipping
- One-time setup flow

✅ **Secure Database**
- Firestore rules prevent unauthorized access
- Each user can only edit own profile
- Timestamps for audit trail

---

## Testing

### Test First-Time Signup
1. Create new account with email/password
2. Should redirect to profile-setup page
3. Fill form with:
   - Photo (upload any image)
   - Name: "Test User"
   - Age: 28
   - City: Reykjavík
   - Interests: Select 2-3
   - Bio: "Test bio"
4. Click "Klára og fara til heimabæjar"
5. Should redirect to home
6. Check Firebase Console: users collection has new document with profileCompleted: true

### Test Profile Editing
1. Log in with account from step 1
2. Click "Prófíll" in sidebar
3. Click "Breyta prófíl" (edit button)
4. Update name and bio
5. Click "Vista breytingar"
6. Verify changes in Firebase Console

### Test Age Filtering
```javascript
// In browser console
const users = await window.firebaseFirestore.getUsersByAgeGroup(26, 35);
console.log(users); // Shows users aged 26-35
```

---

## Next Steps

1. ✅ Publish Firestore security rules (critical!)
2. ✅ Integrate profile checks in login flow (Step 1)
3. ✅ Add form submission handler (Step 2)
4. ✅ Update age group display (Step 3)
5. ✅ Test with real signup
6. Add profile to sidebar/header (optional)
7. Implement profile image in posts (optional)
8. Add "Find Friends" page filtered by age/interests (optional)

---

## Troubleshooting

### "Profile not saving"
- Check Firebase security rules are published
- Verify user is logged in
- Check browser console for errors
- Check Firestore has users collection

### "Photo not uploading"
- Check file size < 5MB
- Check file format is image
- Check browser has FileReader API
- Try with smaller image file

### "Age group not showing"
- Verify age value is valid (18-150)
- Clear browser cache
- Check AGE_GROUPS constant in firebase-profile.js

---

## Questions?

Refer to:
- [firestore-rules.txt](firestore-rules.txt) - Security rules
- [firebase-firestore.js](firebase-firestore.js) - Database functions
- [firebase-profile.js](firebase-profile.js) - Profile UI and logic
- [app.js](app.js) - Integration points
