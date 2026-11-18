# Age Group Security System

## Overview
This system prevents users from manipulating their age to access age-restricted groups they shouldn't be part of. Once a user's age group is locked during initial profile setup, it cannot be changed.

## How It Works

### 1. Initial Profile Setup (First Time)
- User enters their age (e.g., 28)
- **Age group is NOT displayed** during form entry (removed to prevent gaming the system)
- When user clicks "Klára og fara til heimabæjar", the system:
  - Saves their age to Firestore
  - Calculates their age group: 28 → "26-35 ára"
  - **Locks the age group** with timestamp `ageGroupLockedAt`

### 2. Profile Settings (Editing Later)
- Age field is **read-only** (disabled input, grayed out)
- Shows warning: "⚠️ Aldurinn þinn verður ekki hægt að breyta eftir skráningu til að verja aldurshópa okkar."
- Shows locked age group: "Þinn aldurshópur: 26-35 ára"
- Other fields (name, bio, interests, city, photo) can still be edited

### 3. Backend Protection (Firestore)
- New function `updateUserProfile()` enforces age lock
- If a user tries to change their age in profile settings:
  - System checks if `ageGroupLockedAt` timestamp exists
  - If locked, age modification is rejected with error message
  - Other profile data updates are allowed

## Age Group Ranges

| Group | Age Range | Label |
|-------|-----------|-------|
| Group 1 | 18-25 | 18-25 ára |
| Group 2 | 26-35 | 26-35 ára |
| Group 3 | 36-50 | 36-50 ára |
| Group 4 | 50+ | 50+ ára |

## Firestore Profile Data Structure

```javascript
{
  userId: "auth-uid",
  displayName: "Anna Bórsdóttir",
  email: "anna@example.com",
  age: 28,                                    // Set during signup, cannot be changed
  ageGroup: "26-35 ára",                      // Locked at signup
  ageGroupLockedAt: Timestamp,                // Lock timestamp
  city: "reykjavik",
  bio: "I love hiking and meeting new people",
  interests: ["travel", "food", "sports"],
  photoUrl: "data:image/...",
  profileCompleted: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Security Benefits

✅ **Prevents Age Fraud**: Users cannot change age to access younger/older groups
✅ **Age Group Integrity**: Each user stays in their assigned age group permanently
✅ **Social Safety**: Helps maintain appropriate age-based group dynamics
✅ **Transparent to Users**: Warning message explains why age cannot be changed
✅ **Backend Enforced**: Firestore security rules work alongside frontend protection

## Implementation Details

### Profile Setup Flow
1. User fills form (photo, name, age, city, bio, interests)
2. Frontend sends to `firebase-firestore.saveUserProfile()`
3. Backend calculates age group: `calcAgeGroup(age) → "26-35 ára"`
4. Backend locks age group with `ageGroupLockedAt` timestamp
5. Frontend redirects to home

### Profile Edit Flow
1. Frontend renders age field with `readonly` attribute
2. If user tries to submit age change, frontend shows error (from `updateUserProfile()`)
3. All other fields can be edited normally
4. `updateUserProfile()` deletes any `ageGroup` changes from update data

## Firestore Rules

Add to your Firestore security rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId || 
                     request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId &&
                       (resource.data.ageGroupLockedAt == null ||
                        request.resource.data.age == resource.data.age);
      allow delete: if false;
    }
  }
}
```

## Testing

**Test Case 1: Initial Setup**
1. Create new account
2. Fill profile form (enter age 28)
3. Submit
4. Check Firestore: `ageGroup: "26-35 ára"` and `ageGroupLockedAt: <timestamp>` present

**Test Case 2: Prevent Age Change**
1. Login to existing account with locked age group
2. Click profile settings
3. Try to change age field (should be disabled/readonly)
4. Verify warning message is visible
5. Try to submit form without changing age (should work)
6. Try to submit form with age change (should fail)

**Test Case 3: Other Fields Can Still Change**
1. In profile settings, change: name, bio, interests, city, photo
2. Submit changes
3. Verify they save correctly
4. Verify age and ageGroup remain unchanged

## Migration for Existing Users

If you have existing users without locked age groups, run this script:

```javascript
// Lock existing profiles
async function lockExistingProfiles() {
  const users = await db.collection('users')
    .where('profileCompleted', '==', true)
    .where('ageGroupLockedAt', '==', null)
    .get();
  
  for (const doc of users.docs) {
    const data = doc.data();
    if (data.age) {
      let ageGroup = null;
      if (data.age >= 18 && data.age <= 25) ageGroup = "18-25 ára";
      else if (data.age >= 26 && data.age <= 35) ageGroup = "26-35 ára";
      else if (data.age >= 36 && data.age <= 50) ageGroup = "36-50 ára";
      else if (data.age > 50) ageGroup = "50+ ára";
      
      if (ageGroup) {
        await doc.ref.update({
          ageGroup: ageGroup,
          ageGroupLockedAt: new Date()
        });
      }
    }
  }
}
```

## Notes

- Age group is calculated server-side, not client-side
- Age group never changes even if age is somehow modified in database
- System uses Icelandic labels for age groups
- All timestamps use Firestore server time for accuracy
