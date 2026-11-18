# Profile Setup - Integration Checklist

## ✅ What's Already Done

- [x] Created `firebase-profile.js` - Profile UI & logic (13 KB)
- [x] Updated `firebase-firestore.js` - Database functions (+400 lines)
- [x] Updated `app.css` - Profile styling (+300 lines)
- [x] Updated `app.html` - Added profile script
- [x] Created `PROFILE_SETUP_GUIDE.md` - Full documentation
- [x] Created `PROFILE_QUICK_START.md` - Quick reference

## ⏳ What You Need to Do in app.js

### Task 1: Add Profile View Case (5 min)

Find where views are rendered in app.js and add:

```javascript
case "profile-setup":
  screen.innerHTML = window.firebaseProfile.renderProfileSetup();
  handleProfileSetupForm();
  attachPhotoUploadListeners();
  attachAgeGroupDisplay();
  break;
```

### Task 2: Add Profile Check After Login (5 min)

Find where successful login redirects and add:

```javascript
// After successful login (around line 1217)
try {
  const user = await window.firebaseAuth.getCurrentUser?.() || {currentUser: null};
  
  if (user?.currentUser) {
    const hasProfile = await window.firebaseFirestore.hasCompletedProfile(user.currentUser.uid);
    
    if (!hasProfile) {
      // New user: redirect to profile setup
      window.location.replace("app.html?view=profile-setup");
      return;
    }
  }
  
  // Existing user: redirect to home
  window.location.replace("app.html?view=home");
} catch (error) {
  console.error("Profile check failed", error);
  window.location.replace("app.html?view=home");
}
```

### Task 3: Add Profile Setup Form Handler (10 min)

Add before the form submission handlers:

```javascript
// Profile setup form handler
if (form.dataset.form === "profile-setup") {
  event.preventDefault();
  
  const submitButton = form.querySelector('[type="submit"]');
  const errorDiv = document.getElementById("profile-setup-error");
  
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  errorDiv.hidden = true;
  
  try {
    const photoFile = form.elements.photo.files[0];
    if (!photoFile) {
      throw new Error("Vinsamlegast veldu mynd");
    }
    
    // Get selected interests
    const interests = Array.from(
      form.querySelectorAll('input[name="interests"]:checked')
    ).map(el => el.value);
    
    // Upload photo
    const photoUrl = await window.firebaseFirestore.uploadProfilePhoto(photoFile);
    
    // Save profile
    await window.firebaseFirestore.saveUserProfile({
      displayName: form.elements.displayName.value.trim(),
      age: parseInt(form.elements.age.value),
      city: form.elements.city.value,
      bio: form.elements.bio.value.trim(),
      interests: interests,
      photoUrl: photoUrl,
    });
    
    // Redirect to home
    window.location.replace("app.html?view=home");
  } catch (error) {
    console.error("Profile setup failed", error);
    errorDiv.textContent = error.message || "Ekki tókst að vista prófíl";
    errorDiv.hidden = false;
    submitButton.disabled = false;
    submitButton.setAttribute("aria-busy", "false");
  }
  return;
}
```

### Task 4: Add Helper Functions (5 min)

Add these functions to app.js:

```javascript
function handleProfileSetupForm() {
  const form = document.querySelector('[data-form="profile-setup"]');
  if (!form) return;
  
  form.addEventListener("submit", async (event) => {
    // Handled in main form submission handler above
  });
}

function attachPhotoUploadListeners() {
  const photoInput = document.getElementById("profile-photo");
  const photoPreview = document.getElementById("photo-preview");
  
  if (!photoInput) return;
  
  photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  });
  
  // Drag and drop support
  photoPreview.addEventListener("dragover", (e) => {
    e.preventDefault();
    photoPreview.style.opacity = "0.7";
  });
  
  photoPreview.addEventListener("dragleave", () => {
    photoPreview.style.opacity = "1";
  });
  
  photoPreview.addEventListener("drop", (e) => {
    e.preventDefault();
    photoPreview.style.opacity = "1";
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      photoInput.files = files;
      const event = new Event("change", { bubbles: true });
      photoInput.dispatchEvent(event);
    }
  });
}

function attachAgeGroupDisplay() {
  const ageInput = document.getElementById("profile-age");
  const ageGroupDisplay = document.getElementById("age-group-display");
  
  if (!ageInput || !ageGroupDisplay) return;
  
  function updateAgeGroup() {
    const age = parseInt(ageInput.value);
    if (age && age >= 18 && age <= 150) {
      const group = window.firebaseProfile.getAgeGroupLabel(age);
      ageGroupDisplay.innerHTML = `<span class="age-group-label">${group}</span>`;
    } else {
      ageGroupDisplay.innerHTML = '<span class="age-group-label">Veldu aldur</span>';
    }
  }
  
  ageInput.addEventListener("input", updateAgeGroup);
  updateAgeGroup();
}

function attachBioCounter() {
  const bioInput = document.getElementById("profile-bio");
  const bioCounter = document.getElementById("bio-count");
  
  if (!bioInput || !bioCounter) return;
  
  bioInput.addEventListener("input", () => {
    bioCounter.textContent = bioInput.value.length;
  });
}
```

### Task 5: Call Helper on Page Load (2 min)

Find where the page loads and add:

```javascript
// Add after the page loads
attachBioCounter();
```

## 📋 Testing Checklist

- [ ] **Test 1: New Account Signup**
  - [ ] Create new account with email/password/name
  - [ ] Should redirect to profile-setup page
  - [ ] Form should be visible
  - [ ] All fields should be present

- [ ] **Test 2: Photo Upload**
  - [ ] Upload a photo
  - [ ] Preview should show immediately
  - [ ] File should be valid (JPG/PNG/GIF)
  - [ ] Can drag & drop (optional)

- [ ] **Test 3: Age Group Display**
  - [ ] Enter age: 28
  - [ ] Should show: "26-35 ára"
  - [ ] Try other ages: 20, 40, 55
  - [ ] Groups should update correctly

- [ ] **Test 4: Form Validation**
  - [ ] Submit without photo → error
  - [ ] Submit without name → error
  - [ ] Submit without age → error
  - [ ] Submit without city → error
  - [ ] All fields filled → success

- [ ] **Test 5: Profile Saved**
  - [ ] Fill complete form
  - [ ] Click "Klára og fara til heimabæjar"
  - [ ] Should redirect to home page
  - [ ] Check Firebase Console:
    - [ ] `users` collection exists
    - [ ] New document with userId
    - [ ] All fields saved (name, age, city, bio, interests)
    - [ ] `profileCompleted: true`
    - [ ] `createdAt` timestamp

- [ ] **Test 6: Returning User**
  - [ ] Log out
  - [ ] Log back in with same account
  - [ ] Should go directly to home (skip profile setup)
  - [ ] Should NOT show profile setup page

- [ ] **Test 7: Profile Editing** (optional, requires app.js work)
  - [ ] Click "Prófíll" in sidebar
  - [ ] Load profile settings
  - [ ] Edit name or bio
  - [ ] Click "Vista breytingar"
  - [ ] Check Firebase: data updated

- [ ] **Test 8: Error Handling**
  - [ ] Try with network disconnected (should show error)
  - [ ] Try with invalid file (should show error)
  - [ ] Try with extremely large file (should validate)
  - [ ] Check error messages are clear (Icelandic)

## 🔧 Troubleshooting

**"Profile setup page not showing"**
- [ ] Check case "profile-setup" is added
- [ ] Check firebase-profile.js is loaded
- [ ] Check ?view=profile-setup in URL

**"Photo not uploading"**
- [ ] Check file is valid image
- [ ] Check file < 5MB
- [ ] Check browser console for errors
- [ ] Check FileReader is supported

**"Profile not saving"**
- [ ] Check Firestore rules are published
- [ ] Check users collection exists
- [ ] Check browser console for errors
- [ ] Check network request in DevTools

**"Age group not showing"**
- [ ] Check AGE_GROUPS constant exists
- [ ] Check age input is valid (18-150)
- [ ] Check attachAgeGroupDisplay() is called
- [ ] Try entering different age

**"Form submission fails"**
- [ ] Check all required fields filled
- [ ] Check Firebase Config is loaded
- [ ] Check Auth is initialized
- [ ] Check Firestore is connected

## 📞 Support

If you get stuck:

1. Check browser console for error messages
2. Check Firefox/Chrome DevTools > Network tab
3. Look at Firebase Console > Firestore > Data
4. Read the full guide: PROFILE_SETUP_GUIDE.md
5. Compare code with examples in PROFILE_QUICK_START.md

## 🚀 Final Steps

Once you complete the integration:

1. ✅ Publish Security Rules
2. ✅ Test with new account
3. ✅ Verify profile saves to Firestore
4. ✅ Test returning users skip setup
5. ✅ Deploy to production
6. ✅ Invite users to sign up!

---

**Estimated Integration Time: 20-30 minutes**
**Testing Time: 10-15 minutes**
**Total: ~45 minutes to full launch**

Good luck! 🎉
