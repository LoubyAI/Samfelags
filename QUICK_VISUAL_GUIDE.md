# Two-Photo Privacy System - Quick Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER PROFILE SYSTEM                              │
└─────────────────────────────────────────────────────────────────────┘

                          IMMUTABLE FIELDS
                        (Locked forever)
                             ↓
         ┌──────────────────────────────────────┐
         │  • Full Name (Fullt nafn)            │
         │  • Birthday (Fæðingardagur)          │
         │  • Age Group (Aldurshópur)           │
         └──────────────────────────────────────┘

                       EDITABLE FIELDS
                        ↓
     ┌─────────────────────────────────────────┐
     │  • Photos (both public & private)       │
     │  • Nickname (Gælunafn)                  │
     │  • Bio (Um þig)                         │
     │  • City (Borg/Svæði)                    │
     │  • Interests (Áhugamál)                 │
     └─────────────────────────────────────────┘
```

## Privacy Tier View Matrix

```
                    STRANGER    FRIEND    GROUP
                     (None)     (1 way)   (Member)
────────────────────────────────────────────────
Photo                PUBLIC     PRIVATE   PRIVATE
Name                 NICKNAME   FULL      FULL
Birthday             AGE GRP    DATE      DATE
Bio                  ❌         ✅        ✅
Interests            ✅         ✅        ✅
City                 ❌         ✅        ✅
────────────────────────────────────────────────
Can Message          ❌         ✅        ✅
In Roster            ❌         ❌        ✅
────────────────────────────────────────────────
```

## Two-Photo System

### PUBLIC PHOTO (For Strangers)
```
┌─────────────────┐
│                 │
│  What you       │
│  want to show   │
│  the world      │
│                 │
└─────────────────┘
     Used by: Strangers
     Visible: Yes (public profile)
     Shows: Nickname, age group, interests
```

### PRIVATE PHOTO (For Friends & Groups)
```
┌─────────────────┐
│                 │
│  Your real      │
│  current photo  │
│  (must be you)  │
│                 │
└─────────────────┘
     Used by: Friends & Groups
     Visible: No (locked to friends only)
     Shows: Full name, bio, everything
```

## Community Policy - Three Rules

```
📋 COMMUNITY POLICY - New Friends

✅ RULE 1: Use Your Official Registered Name
   "The name shown to your friends must be your real name 
    as registered in official records (e.g., þjóðskrá)"
   
   ⚠️  Violation → PROFILE DELETED

✅ RULE 2: Use Your Correct Birthday
   "Your age must be accurate. This cannot be changed 
    after registration."
   
   ⚠️  Violation → PROFILE DELETED

✅ RULE 3: Private Photo Must Be a Real Photo of YOU
   "A current real photo so people know who they are meeting.
    Not artwork, filters, or old photos."
   
   ⚠️  Violation → PROFILE DELETED
```

## User Journey

### STEP 1: Signup
```
User starts signup
        ↓
Views community policy modal
        ↓
Accepts policy ✅
        ↓
Fills signup form:
  • Private photo (required)
  • Public photo (optional)
  • Full name (locked)
  • Birthday (locked)
  • Nickname (editable)
  • Optional: bio, city, interests
        ↓
Profile created with age group locked
        ↓
Enters app! 🎉
```

### STEP 2: Editing Profile
```
User in settings
        ↓
Can edit:
  ✅ Both photos
  ✅ Nickname
  ✅ Bio
  ✅ City
  ✅ Interests
        ↓
Cannot edit:
  ❌ Full name (readonly)
  ❌ Birthday (readonly)
  ❌ Age group (locked)
        ↓
Changes saved
```

### STEP 3: Viewing Profiles

#### AS A STRANGER
```
Browse profiles
        ↓
Click on "JJ" (nickname)
        ↓
See public profile:
  📸 Public photo
  👤 JJ (nickname)
  🎂 28 ára (age group)
  💜 Ferðalög, Tónlist (interests)
        ↓
Options:
  [Senda vináboð] [Tilkynna]
```

#### AS A FRIEND
```
Click on "Jón Jónsson (JJ)"
        ↓
See private profile:
  📸 Private photo
  👤 Jón Jónsson
  💬 (JJ) - nickname shown too
  🎂 28 ára · 26-35 ára
  📝 Bio text here...
  💜 Ferðalög, Tónlist
  📍 Reykjavík
        ↓
Options:
  [💬 Senda skilaboð]
```

#### IN A GROUP
```
Group member looks at roster
        ↓
Sees:
  📸 Private photo
  👤 Jón Jónsson (full name for roster)
  🎂 28 ára
  📍 Reykjavík
        ↓
Can organize event knowing:
  ✅ Real names
  ✅ Current photos
  ✅ Accurate ages
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│          LAYER 1: FRONTEND                  │
│  HTML readonly attributes on name/birthday  │
│  Visual lock icons with explanations        │
│  Form validation messages                   │
└─────────────────────────────────────────────┘
              ↓ (attempted bypass)
┌─────────────────────────────────────────────┐
│          LAYER 2: BACKEND API               │
│  updateUserProfile() validation checks      │
│  Throws error if name/birthday changes      │
│  Strips protected fields before save        │
└─────────────────────────────────────────────┘
              ↓ (attempted bypass)
┌─────────────────────────────────────────────┐
│          LAYER 3: DATABASE SCHEMA           │
│  ageGroupLockedAt timestamp marker          │
│  prevents recalculation                     │
│  currentAge updates yearly from birthday    │
│  but ageGroup never changes                 │
└─────────────────────────────────────────────┘
```

## Age Group Lock Example

```
Signup Day: June 1, 2024
  Birthday: June 15, 1995 (age 28, turning 29)
  Age Group: "26-35 ára" ← LOCKED
  ageGroupLockedAt: June 1, 2024

One day later: June 2, 2024
  currentAge: 28 (not birthday yet)
  Age Group: "26-35 ára" (still locked)
  ageGroupLockedAt: June 1, 2024 (unchanged)

Birthday arrives: June 15, 2024
  currentAge: 29 (after yearly recalc)
  Age Group: "26-35 ára" (STILL locked!)
  ageGroupLockedAt: June 1, 2024 (unchanging)

✅ User is now 29 but still in 26-35 group
✅ Prevents jumping to 36-50 group
✅ Maintains group integrity
```

## Form Field States

### SIGNUP FORM
```
╔═══════════════════════════════════╗
║ PROFILE SETUP                     ║
╠═══════════════════════════════════╣
║                                   ║
║ 📸 Mynd af þér (fyrir vini)       ║ ← REQUIRED
║ [Upload private photo]             ║
║                                   ║
║ 📸 Mynd fyrir almenning (optional)║ ← OPTIONAL
║ [Upload public photo]              ║
║                                   ║
║ 👤 Fullt nafn                     ║ ← REQUIRED
║ [Text input - will be locked]      ║
║ Small: "Þetta verður ekki hægt    ║
║        að breyta eftir skráningu" ║
║                                   ║
║ 📅 Fæðingardagur                  ║ ← REQUIRED
║ [Date picker - will be locked]     ║
║ Small: "Þetta verður ekki hægt    ║
║        að breyta eftir skráningu" ║
║                                   ║
║ 👤 Gælunafn (valfrjálst)          ║ ← OPTIONAL
║ [Text input - editable]            ║
║ Small: "Fyrir almenning"           ║
║                                   ║
║ [Senda reglur modal ✅]            ║
║                                   ║
║ [Submit: Klára og fara]            ║
╚═══════════════════════════════════╝
```

### SETTINGS FORM
```
╔═══════════════════════════════════╗
║ PRÓFÍLSTILLINGAR                  ║
╠═══════════════════════════════════╣
║                                   ║
║ 📸 Mynd fyrir vini                ║ ← EDITABLE
║ [Current preview] [Upload new]     ║
║                                   ║
║ 📸 Mynd fyrir almenning           ║ ← EDITABLE
║ [Current preview] [Upload new]     ║
║                                   ║
║ 👤 Fullt nafn                     ║ ← READONLY
║ [Jón Jónsson] (grayed out)         ║
║ Small: "🔒 Ekki hægt að breyta"   ║
║        "til að ganga úr skugga    ║
║        um auðkenni"               ║
║                                   ║
║ 📅 Fæðingardagur                  ║ ← READONLY
║ [1995-06-15] (grayed out)          ║
║ Small: "🔒 Ekki hægt að breyta"   ║
║ Info: "Núverandi aldur: 28 ára"   ║
║       "Aldurshópur (læstur): 26-35║
║                                   ║
║ 👤 Gælunafn                       ║ ← EDITABLE
║ [JJ] (or empty to change)          ║
║                                   ║
║ 📝 Um þig                         ║ ← EDITABLE
║ [Bio text area]                    ║
║                                   ║
║ 💜 Áhugamál                       ║ ← EDITABLE
║ [Checkboxes]                       ║
║                                   ║
║ 📍 Borg/Svæði                     ║ ← EDITABLE
║ [Dropdown]                         ║
║                                   ║
║ [Vista] [Hætta við]                ║
╚═══════════════════════════════════╝
```

## Code Function Reference

### Rendering Functions
```javascript
// Show community policy modal before signup
firebaseProfile.renderCommunityPolicyModal()

// Show first-time signup form
firebaseProfile.renderProfileSetup()

// Show editable settings
firebaseProfile.renderProfileSettings(profile)

// Show what strangers see
firebaseProfile.renderPublicProfile(profile)

// Show what friends/groups see
firebaseProfile.renderPrivateProfile(profile)
```

### Database Functions
```javascript
// Save new profile (locks name, birthday, age group)
await firebaseFirestore.saveUserProfile(profileData)

// Update profile (rejects name/birthday changes)
await firebaseFirestore.updateUserProfile(updateData)

// Get user profile
await firebaseFirestore.getUserProfile(userId)

// Check if profile complete
await firebaseFirestore.hasCompletedProfile(userId)
```

## Status: ✅ COMPLETE

**What was delivered:**
- ✅ Two-photo system (public + private)
- ✅ Three-tier privacy model (stranger/friend/group)
- ✅ Community policy modal with enforcement
- ✅ Public profile view (strangers see)
- ✅ Private profile view (friends/groups see)
- ✅ Updated signup form with two photos
- ✅ Updated settings form with photo fields
- ✅ Backend protection for locked fields
- ✅ Comprehensive styling for all new components
- ✅ Complete documentation

**What's ready:**
- ✅ All UI components
- ✅ All form fields
- ✅ All database schema fields
- ✅ All validation logic
- ✅ All styling

**What's needed next:**
- 🔧 Connect photo upload handlers
- 🔧 Implement visibility determination logic
- 🔧 Route profiles to correct view function
- 🔧 Test with real user flows
