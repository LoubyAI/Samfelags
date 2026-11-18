# Age Group Security Testing Guide

## Quick Test Checklist

### Test 1: Initial Profile Setup (First Time User)
**What to test:** Age group is NOT displayed during form entry, then locked after submission

**Steps:**
1. Create a new account or use a test account
2. Click "Complete Profile" or redirect to profile setup
3. Fill in form fields:
   - Photo: Choose any image
   - Name: "Test User"
   - Age: 28 ← **KEY FIELD**
   - City: Reykjavík
   - Bio: "Testing age lock system"
   - Interests: Select 2-3
4. ✓ **Verify:** Age group display is NOT visible in the form
5. Click "Klára og fara til heimabæjar" (Submit)
6. Check Firestore (Firebase Console):
   - Open: `users` collection → your user document
   - Verify these fields exist:
     ```
     age: 28
     ageGroup: "26-35 ára"      ← Should be calculated
     ageGroupLockedAt: <date>   ← Should have timestamp
     ```
7. ✓ **Result:** PASS if age group was calculated and locked

### Test 2: Profile Settings - Age is Read-Only
**What to test:** Age field is disabled and cannot be edited

**Steps:**
1. Login with the test account from Test 1
2. Click "Profile Settings" or "Edit Profile"
3. Look at the age field:
   - ✓ Should show: 28 (or the age you entered)
   - ✓ Should appear GRAYED OUT / DISABLED
   - ✓ Should have READONLY attribute (try clicking - cannot edit)
   - ✓ Should show LOCK ICON or DISABLED STYLING
4. ✓ **Verify** warning message is visible:
   - "⚠️ Aldurinn þinn verður ekki hægt að breyta eftir skráningu til að verja aldurshópa okkar."
5. ✓ **Verify** age group display is visible:
   - Should show: "Þinn aldurshópur: 26-35 ára"
6. ✓ **Result:** PASS if age field is truly read-only and warning shows

### Test 3: Edit Other Profile Fields (Should Work)
**What to test:** Other fields can be edited even though age is locked

**Steps:**
1. In Profile Settings (from Test 2), try editing:
   - Name: Change "Test User" to "Anna Bórsdóttir" ← Should work ✓
   - City: Change to "Akureyri" ← Should work ✓
   - Bio: Add some text ← Should work ✓
   - Interests: Check/uncheck some ← Should work ✓
   - Photo: Upload new image ← Should work ✓
2. ✓ **Verify:** Age field cannot be edited
3. Click "Vista breytingar" (Save Changes)
4. ✓ **Result:** PASS if other fields save but age remains unchanged

### Test 4: Verify Age Group Does Not Change
**What to test:** Age group stays locked even if something tries to change it

**Steps:**
1. In Firestore Console, manually try to edit the user document:
   - Change `age: 28` to `age: 50`
2. Try to save (may be blocked by security rules)
3. ✓ **Verify:** Either:
   - Security rules prevent the update, OR
   - If update succeeds, verify `ageGroup` remains "26-35 ára"
   - `ageGroupLockedAt` timestamp should NOT change
4. ✓ **Result:** PASS if age group cannot be modified

### Test 5: Test Different Age Groups
**What to test:** Correct age group is assigned for each age range

**Repeat Tests 1-3 for each age group:**

**Test with Age 22:**
- Expected age group: "18-25 ára"
- Steps: Follow Test 1 but enter age 22
- Firestore should show: `ageGroup: "18-25 ára"`

**Test with Age 32:**
- Expected age group: "26-35 ára"
- Steps: Follow Test 1 but enter age 32
- Firestore should show: `ageGroup: "26-35 ára"`

**Test with Age 42:**
- Expected age group: "36-50 ára"
- Steps: Follow Test 1 but enter age 42
- Firestore should show: `ageGroup: "36-50 ára"`

**Test with Age 55:**
- Expected age group: "50+ ára"
- Steps: Follow Test 1 but enter age 55
- Firestore should show: `ageGroup: "50+ ára"`

✓ **Result:** PASS if all age groups map correctly

### Test 6: Edge Cases
**What to test:** System handles boundary ages correctly

**Minimum age (18):**
1. Create account with age 18
2. Firestore should show: `ageGroup: "18-25 ára"`

**Maximum age (120):**
1. Create account with age 120
2. Firestore should show: `ageGroup: "50+ ára"`

**Age 25-26 boundary:**
1. Test age 25 → Should give "18-25 ára"
2. Test age 26 → Should give "26-35 ára"

**Age 35-36 boundary:**
1. Test age 35 → Should give "26-35 ára"
2. Test age 36 → Should give "36-50 ára"

**Age 50-51 boundary:**
1. Test age 50 → Should give "36-50 ára" (50 is included in 36-50)
2. Test age 51 → Should give "50+ ára"

✓ **Result:** PASS if boundaries are correct

## Developer Testing

### Test Firestore Integration
```javascript
// In browser console while logged in:

// 1. Test saveUserProfile
await window.firebaseFirestore.saveUserProfile({
  age: 28,
  displayName: "Test User",
  city: "reykjavik",
  bio: "Test",
  interests: ["travel"]
});

// 2. Check the user document in Firestore
// Should show: ageGroup: "26-35 ára", ageGroupLockedAt: <timestamp>

// 3. Test updateUserProfile
try {
  await window.firebaseFirestore.updateUserProfile({
    age: 35  // Try to change age
  });
} catch (error) {
  console.log("Error (expected):", error.message);
  // Should output: "Aldur getur ekki verið breytt eftir skráningu til að verja aldurshópa okkar."
}

// 4. Test updating other fields (should work)
await window.firebaseFirestore.updateUserProfile({
  displayName: "New Name",
  bio: "New bio",
  interests: ["food", "sports"]
});
// Should succeed without error
```

### Expected Behavior Summary

| Action | Result | Status |
|--------|--------|--------|
| Fill profile setup form with age 28 | Age group NOT shown in form | ✓ |
| Submit profile setup form | ageGroup locked to "26-35 ára" | ✓ |
| View profile settings | Age field appears READONLY | ✓ |
| View profile settings | Warning message visible | ✓ |
| View profile settings | Locked age group displayed | ✓ |
| Try to edit age in settings | Field disabled/grayed out | ✓ |
| Edit other fields in settings | All other fields work | ✓ |
| Save profile settings | Age unchanged, other fields saved | ✓ |
| Call updateUserProfile with age change | Error thrown | ✓ |
| Call updateUserProfile with other changes | Update succeeds | ✓ |

## Troubleshooting

**Problem:** Age group not appearing in Firestore after setup
- Check browser console for errors
- Verify `saveUserProfile()` completed successfully
- Check that Firebase connection is working
- Try refreshing page and creating new account

**Problem:** Age field is still editable in settings
- Clear browser cache (Ctrl+Shift+Delete)
- Verify firebase-profile.js was updated with `readonly` attribute
- Check that `updateUserProfile()` function exists in firebase-firestore.js

**Problem:** Warning message not showing
- Verify message in firebase-profile.js renderProfileSettings()
- Check if profile-preview.html needs updating if testing there
- Ensure app.css has proper styling for warning message

**Problem:** Different age groups than expected
- Verify saveUserProfile() age group calculation logic
- Check exact age values (28 vs "28" - should be int)
- Verify age ranges: 18-25, 26-35, 36-50, 50+

## Performance Notes

- Age group calculation happens server-side (firebaseFirestore.js)
- No client-side calculation in profile settings
- Firestore timestamp ensures accuracy across time zones
- Read-only attribute has zero performance impact

## Security Verification

✓ Frontend protection: readonly HTML attribute
✓ Backend protection: updateUserProfile() validation
✓ Database protection: ageGroupLockedAt timestamp marker
✓ User transparency: Clear warning message in Icelandic
✓ No sensitive data exposed: Age group is calculated only from age
