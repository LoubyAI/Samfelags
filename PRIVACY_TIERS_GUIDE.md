# Privacy Tiers & Two-Photo System Guide

## Overview

**New Friends** implements a three-tier privacy system where users control what different audiences see on their profiles. The key innovation is the **two-photo system**: a public photo for strangers and a private photo for friends/groups.

---

## Privacy Tiers

### Tier 1: Strangers (Óþekkir einstaklingar)

**Who sees this?**
- People browsing the app who are NOT your friends
- People NOT in your interest groups

**What they see:**
- 📸 **Public Photo** (you choose what to share)
- 👤 **Nickname** (gælunafn)
- 🎂 **Age group** (aldurshópur)
- 💜 **Interests** (áhugamál) - optional

**What they DON'T see:**
- ❌ Full name (Fullt nafn)
- ❌ Birthday (Fæðingardagur)
- ❌ Private photo
- ❌ Bio/About me
- ❌ City/Location
- ❌ Email

**Use case:** Browse profiles safely without revealing your true identity until you're ready

---

### Tier 2: Accepted Friends (Samþykktir vinir)

**Who sees this?**
- People you've accepted friend requests from
- Your confirmed friends in the app

**What they see:**
- 📸 **Private Photo** (your real profile photo)
- 👤 **Full Name** (Fullt nafn - as registered in official records)
- 👤 **Nickname** (gælunafn)
- 🎂 **Age** (Aldur) + Age group
- 💜 **Interests** (Áhugamál)
- 📝 **Bio** (Um þig)
- 📍 **City/Location** (Borg/Svæði)

**Can they do?**
- Send messages
- See your complete profile
- Invite you to events

---

### Tier 3: Interest Groups & Events (Áhugamálahópar & Viðburðir)

**Who sees this?**
- Group organizers
- People in the same interest group
- Event organizers
- Other attendees

**What they see:**
- 📸 **Private Photo** (your real profile photo)
- 👤 **Full Name** (Fullt nafn - for roster/organization)
- 🎂 **Age** + Age group
- 💜 **Interests** (relevant to group)
- 📍 **City/Location** (Borg/Svæði)

**Why full name?**
- Group organizers need real identities to manage rosters
- Event organization requires verifiable attendee information
- Safety and accountability within groups

---

## The Two-Photo System

### Photo 1: Public Photo (Almenn mynd)

**Used by:** Strangers viewing your profile

**What to upload:**
- A photo that represents you but doesn't have to be your face
- Could be a headshot, casual photo, or partial photo
- Should still be clearly YOU (no celebrities or random images)

**Purpose:**
- Let strangers know you're a real person
- Maintain privacy while browsing
- Build initial trust

**Rules:**
- Must be an actual photo (no artwork, filters, or AI images)
- Must be recognizably you
- Can't be your private photo

---

### Photo 2: Private Photo (Prófílmynd fyrir vini)

**Used by:** Friends and group members

**What to upload:**
- Your clearest, most recent photo
- Ideally a headshot or portrait photo
- Should clearly show your face

**Purpose:**
- Real identity verification for friends
- Group organizers need to recognize attendees
- Prevents catfishing and identity fraud

**Rules (MUST follow - profile deletion if violated):**
- Must be an actual photo of YOU
- Must be current (not old photos)
- Must clearly show your face
- No artwork, filters, or old pictures
- No celebrities or strangers

---

## Community Policy

By joining **New Friends**, users agree to:

✅ **Use your official registered name.** The name shown on your private profile page to accepted friends and interest groups must be your name as registered in official records (e.g., þjóðskrá).

✅ **Use your correct birthday.** Your age must be accurate (this cannot be changed).

✅ **Your private photo must be a real photo of YOU.** A current real photo so people know who they are meeting.

**Consequences of violations:**
- 🚨 If your real name or photo violates these rules, your profile will be **deleted**
- Friends or group organizers can report fake profiles
- Reported profiles reviewed by moderators and the New Friends team
- Fake names result in immediate account deletion

---

## Implementation Details

### Database Fields

```
{
  // Immutable (locked after signup)
  displayName: "Jón Jónsson",        // Full official name
  birthday: "1995-06-15",            // Date of birth (YYYY-MM-DD)
  
  // Editable
  nickname: "JJ",                    // Public nickname
  photoPublicUrl: "...",             // Public photo (for strangers)
  photoPrivateUrl: "...",            // Private photo (for friends/groups)
  bio: "Mér finnst ferðalög frábær", // Bio (friends only)
  city: "Reykjavík",                 // Location
  interests: ["travel", "music"],    // Interests
  
  // System fields
  ageGroup: "26-35 ára",             // Age group (locked at signup)
  ageGroupLockedAt: timestamp,       // When age group was locked
  currentAge: 28,                    // Calculated yearly from birthday
  profileCompleted: true,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

### Frontend Functions

**Profile Setup (First Time):**
```javascript
firebaseProfile.renderProfileSetup()
// Shows form with:
// - Private photo (required)
// - Public photo (optional)
// - Full name
// - Birthday
// - Nickname
// - City, bio, interests (optional)
// - Community policy modal (must accept)
```

**Profile Settings (Editable):**
```javascript
firebaseProfile.renderProfileSettings(profile)
// Shows form with:
// - Private photo (editable)
// - Public photo (editable)
// - Full name (readonly, with lock icon)
// - Birthday (readonly, with lock icon)
// - Nickname (editable)
// - Everything else (editable)
```

**Public Profile View (Strangers):**
```javascript
firebaseProfile.renderPublicProfile(profile)
// Shows:
// - Public photo
// - Nickname
// - Age group
// - Interests (optional)
// - Action: Send friend request
// - Action: Report profile
```

**Private Profile View (Friends/Groups):**
```javascript
firebaseProfile.renderPrivateProfile(profile)
// Shows:
// - Private photo
// - Full name + nickname
// - Age + age group
// - Bio
// - Interests
// - City
// - Action: Send message
```

### Backend Protection

**saveUserProfile():**
- ✅ Accepts both `photoPrivateUrl` and `photoPublicUrl`
- ✅ Locks `displayName` on first save
- ✅ Locks `birthday` on first save
- ✅ Calculates and locks `ageGroup` on first save
- ✅ Stores `currentAge` (recalculates yearly)

**updateUserProfile():**
- ✅ Prevents `displayName` changes (throws error if attempted)
- ✅ Prevents `birthday` changes (throws error if attempted)
- ✅ Allows photo updates (`photoPrivateUrl`, `photoPublicUrl`)
- ✅ Allows nickname edits
- ✅ Allows bio, interests, city updates
- ✅ Never recalculates locked `ageGroup`

---

## Security Measures

### Three-Layer Protection

1. **Frontend**: HTML `readonly` attributes on name/birthday fields
2. **Backend**: Validation in `updateUserProfile()` throws errors
3. **Database**: `ageGroupLockedAt` timestamp prevents recalculation

### Age Group Locking

- Calculated at signup from birthday
- Cannot change even if birthday is changed
- Protects group integrity (can't jump to younger/older groups)
- Timestamp (`ageGroupLockedAt`) marks the lock point

### Photo Verification

- Private photo used as identity proof
- Visible to friends and groups only
- Community policy enforces real photos only
- Report feature allows moderators to review violations

---

## User Flow

### First-Time Signup

1. User fills signup form
2. Accepts community policy modal ✅
3. Provides:
   - Private photo (required)
   - Public photo (optional)
   - Full name + Birthday (locked forever)
   - Nickname + City + Bio + Interests (optional)
4. Profile saved with `ageGroup` locked
5. Enters app with limited profile

### Profile Editing

1. User can ALWAYS:
   - ✅ Update both photos
   - ✅ Update nickname
   - ✅ Update bio, interests, city

2. User can NEVER:
   - ❌ Change full name
   - ❌ Change birthday
   - ❌ Change age group

3. If they try:
   - Frontend: Field is readonly
   - Backend: Error thrown
   - Database: Changes stripped before save

### Viewing Profiles

**Stranger viewing:**
- Sees public photo + nickname + age group + interests
- Can send friend request

**Friend viewing:**
- Sees private photo + full name + everything else
- Can send messages

**Group member viewing:**
- Sees private photo + full name + everything
- Can see in group roster

---

## Icelandic Terms Reference

- **Fullt nafn** = Full name (locked)
- **Fæðingardagur** = Birthday (locked)
- **Gælunafn** = Nickname (editable)
- **Aldurshópur** = Age group (locked)
- **Núverandi aldur** = Current age (recalculated yearly)
- **Almenn mynd** = Public photo (for strangers)
- **Prófílmynd** = Private photo (for friends/groups)
- **Um þig** = About me / Bio
- **Áhugamál** = Interests

---

## Testing the System

### Test Scenario 1: Stranger View
1. User A creates account with both photos
2. User B (not a friend) views User A's profile
3. ✅ Verify: Only public photo, nickname, age group visible
4. ✅ Verify: Full name and private photo hidden

### Test Scenario 2: Friend View
1. User A and User B become friends
2. User B views User A's profile
3. ✅ Verify: Private photo, full name, everything visible
4. ✅ Verify: Displays both name and nickname

### Test Scenario 3: Try to Change Name
1. User A views profile settings
2. ✅ Verify: Full name field is readonly
3. Try to edit via browser console
4. ✅ Verify: Backend rejects change with error

### Test Scenario 4: Birthday Auto-Updates Age
1. User A's birthday is 1995-06-14
2. Today is 2024-06-14
3. ✅ Verify: `currentAge` = 29
4. Tomorrow (2024-06-15)
5. ✅ Verify: `currentAge` still = 29 (hasn't recalculated yet)
6. Next day that code runs
7. ✅ Verify: `currentAge` = 29 (birthdays are June 14)

### Test Scenario 5: Age Group Lock
1. User A signs up on June 14, age 28 → "26-35 ára"
2. User A changes birthday in settings (attempt)
3. ✅ Verify: Error thrown
4. User A's true birthday passes → now age 29
5. ✅ Verify: `ageGroup` still "26-35 ára" (not recalculated)
6. ✅ Verify: `currentAge` = 29 (but group is locked)

---

## Notes for Developers

- **Photo URLs** are stored as strings in the database (Firebase Cloud Storage URLs)
- **Age calculation** must handle YYYY-MM-DD format (not Date objects)
- **Age group** only locks once - check `ageGroupLockedAt` before setting
- **Readonly fields** must be protected at both frontend and backend
- **Timestamps** use Firestore server timestamps for consistency
- **Policy modal** must be shown and accepted before profile is created

---

## Future Enhancements

- Photo verification (AI-based face detection)
- Badge system (verified profiles)
- Photo appeal process (if profile deleted)
- Moderation dashboard for team
- Automated spam/fake detection
