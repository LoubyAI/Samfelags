const firestoreVersion = "13.3.0";
let firestoreClientPromise;

async function getFirebaseAuthClient() {
  if (!window.firebaseConfig?.apiKey) {
    throw new Error("Firebase config is missing");
  }

  const appSdk = await import(`https://www.gstatic.com/firebasejs/${firestoreVersion}/firebase-app.js`);
  const authSdk = await import(`https://www.gstatic.com/firebasejs/${firestoreVersion}/firebase-auth.js`);
  
  // Use getApp() to get the existing app, don't create a new one
  let app;
  try {
    app = appSdk.getApp();
  } catch (error) {
    // App doesn't exist yet, initialize it
    app = appSdk.initializeApp(window.firebaseConfig);
  }
  
  const auth = authSdk.getAuth(app);
  auth.languageCode = "is";
  
  return { auth, authSdk };
}

async function getFirestoreClient() {
  if (!window.firebaseConfig?.projectId) {
    const error = new Error("Firebase config is missing projectId");
    error.code = "app/firebase-config-missing";
    throw error;
  }

  if (!firestoreClientPromise) {
    firestoreClientPromise = Promise.all([
      import(`https://www.gstatic.com/firebasejs/${firestoreVersion}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${firestoreVersion}/firebase-firestore.js`),
    ]).then(([appSdk, firestoreSdk]) => {
      let app;
      try {
        app = appSdk.getApp();
      } catch (error) {
        // App doesn't exist yet, initialize it
        app = appSdk.initializeApp(window.firebaseConfig);
      }
      const db = firestoreSdk.getFirestore(app);
      
      // Enable offline persistence for better UX
      if (typeof window !== "undefined" && !("indexedDB" in window)) {
        console.warn("IndexedDB not available; offline persistence disabled");
      } else {
        firestoreSdk.enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === "failed-precondition") {
            console.log("Multiple tabs open; persistence disabled");
          } else if (err.code === "unimplemented") {
            console.log("Browser doesn't support persistence");
          }
        });
      }

      return { db, firestoreSdk };
    });
  }

  try {
    return await firestoreClientPromise;
  } catch (error) {
    firestoreClientPromise = undefined;
    throw error;
  }
}

async function getCurrentUser() {
  try {
    const { auth, authSdk } = await getFirebaseAuthClient();
    return authSdk.currentUser || null;
  } catch (error) {
    console.warn("Could not get current user", error);
    return null;
  }
}

window.firebaseFirestore = {
  async addPost(collectionName, postData) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in to create posts");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const enrichedData = {
      ...postData,
      userId: user.uid,
      userEmail: user.email,
      displayName: user.displayName || user.email,
      createdAt: firestoreSdk.serverTimestamp(),
      updatedAt: firestoreSdk.serverTimestamp(),
    };

    return firestoreSdk.addDoc(firestoreSdk.collection(db, collectionName), enrichedData);
  },

  async updatePost(collectionName, postId, updateData) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in to update posts");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const postRef = firestoreSdk.doc(db, collectionName, postId);
    
    // Verify user owns the post before updating
    const postSnap = await firestoreSdk.getDoc(postRef);
    if (!postSnap.exists() || postSnap.data().userId !== user.uid) {
      throw new Error("Unauthorized: You can only update your own posts");
    }

    return firestoreSdk.updateDoc(postRef, {
      ...updateData,
      updatedAt: firestoreSdk.serverTimestamp(),
    });
  },

  async deletePost(collectionName, postId) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in to delete posts");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const postRef = firestoreSdk.doc(db, collectionName, postId);
    
    // Verify user owns the post before deleting
    const postSnap = await firestoreSdk.getDoc(postRef);
    if (!postSnap.exists() || postSnap.data().userId !== user.uid) {
      throw new Error("Unauthorized: You can only delete your own posts");
    }

    return firestoreSdk.deleteDoc(postRef);
  },

  async getPosts(collectionName, limit = 50) {
    const { db, firestoreSdk } = await getFirestoreClient();
    const q = firestoreSdk.query(
      firestoreSdk.collection(db, collectionName),
      firestoreSdk.orderBy("createdAt", "desc"),
      firestoreSdk.limit(limit)
    );

    const snapshot = await firestoreSdk.getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getPostById(collectionName, postId) {
    const { db, firestoreSdk } = await getFirestoreClient();
    const postRef = firestoreSdk.doc(db, collectionName, postId);
    const postSnap = await firestoreSdk.getDoc(postRef);
    
    if (!postSnap.exists()) {
      return null;
    }

    return {
      id: postSnap.id,
      ...postSnap.data()
    };
  },

  async subscribeToCollection(collectionName, callback, limit = 50) {
    const { db, firestoreSdk } = await getFirestoreClient();
    const q = firestoreSdk.query(
      firestoreSdk.collection(db, collectionName),
      firestoreSdk.orderBy("createdAt", "desc"),
      firestoreSdk.limit(limit)
    );

    return firestoreSdk.onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(posts);
    });
  },

  async addReaction(collectionName, postId, reactionType) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in to react");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const reactionsRef = firestoreSdk.doc(
      db, 
      collectionName, 
      postId, 
      "reactions", 
      `${user.uid}-${reactionType}`
    );

    return firestoreSdk.setDoc(reactionsRef, {
      userId: user.uid,
      type: reactionType,
      createdAt: firestoreSdk.serverTimestamp(),
    });
  },

  async removeReaction(collectionName, postId, reactionType) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in to remove reactions");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const reactionsRef = firestoreSdk.doc(
      db, 
      collectionName, 
      postId, 
      "reactions", 
      `${user.uid}-${reactionType}`
    );

    return firestoreSdk.deleteDoc(reactionsRef);
  },

  async getReactions(collectionName, postId) {
    const { db, firestoreSdk } = await getFirestoreClient();
    const reactionsRef = firestoreSdk.collection(
      db, 
      collectionName, 
      postId, 
      "reactions"
    );

    const snapshot = await firestoreSdk.getDocs(reactionsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // ========== USER PROFILE FUNCTIONS ==========
  
  async getUserProfile(userId) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const userRef = firestoreSdk.doc(db, "users", userId);
    const userSnap = await firestoreSdk.getDoc(userRef);
    
    return userSnap.exists() ? userSnap.data() : null;
  },

  async saveUserProfile(profileData) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const userRef = firestoreSdk.doc(db, "users", user.uid);
    
    // Calculate current age from birthday
    let currentAge = null;
    let ageGroup = null;
    
    if (profileData.birthday) {
      const birthDate = new Date(profileData.birthday);
      const today = new Date();
      currentAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        currentAge--;
      }

      // Calculate age group based on current age
      if (currentAge >= 18 && currentAge <= 25) ageGroup = "18-25 ára";
      else if (currentAge >= 26 && currentAge <= 35) ageGroup = "26-35 ára";
      else if (currentAge >= 36 && currentAge <= 50) ageGroup = "36-50 ára";
      else if (currentAge > 50) ageGroup = "50+ ára";
    }
    
    const enrichedData = {
      ...profileData,
      userId: user.uid,
      email: user.email || profileData.email,
      updatedAt: firestoreSdk.serverTimestamp(),
      profileCompleted: true,
      currentAge: currentAge, // Calculated, updates yearly
      // Store both photo URLs from the profile data
      photoPrivateUrl: profileData.photoPrivateUrl || null,
      photoPublicUrl: profileData.photoPublicUrl || null,
    };

    // Lock the age group if this is the first time setting it
    if (ageGroup && !profileData.ageGroup) {
      enrichedData.ageGroup = ageGroup;
      enrichedData.ageGroupLockedAt = firestoreSdk.serverTimestamp();
    }

    if (!profileData.createdAt) {
      enrichedData.createdAt = firestoreSdk.serverTimestamp();
    }

    await firestoreSdk.setDoc(userRef, enrichedData, { merge: true });
    return enrichedData;
  },

  async hasCompletedProfile(userId) {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const userRef = firestoreSdk.doc(db, "users", user.uid);
    const userSnap = await firestoreSdk.getDoc(userRef);
    
    return userSnap.exists() && userSnap.data().profileCompleted === true;
  },

  async updateUserProfile(profileData) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in");
    }

    const { db, firestoreSdk } = await getFirestoreClient();
    const userRef = firestoreSdk.doc(db, "users", user.uid);
    const userSnap = await firestoreSdk.getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User profile not found");
    }

    const currentProfile = userSnap.data();
    
    // Prevent birthday modification if already set
    if (currentProfile.birthday && profileData.birthday) {
      if (profileData.birthday !== currentProfile.birthday) {
        throw new Error("Fæðingardagur getur ekki verið breytt eftir skráningu til að verja aldurshópa okkar.");
      }
    }

    // Prevent full name modification if already set
    if (currentProfile.displayName && profileData.displayName) {
      if (profileData.displayName !== currentProfile.displayName) {
        throw new Error("Fullt nafn getur ekki verið breytt eftir skráningu til að ganga úr skugga um auðkenni.");
      }
    }

    const updateData = {
      ...profileData,
      updatedAt: firestoreSdk.serverTimestamp(),
    };

    // Never update ageGroup if it's already locked
    if (currentProfile.ageGroupLockedAt) {
      delete updateData.ageGroup;
    }

    // Never allow birthday to be changed
    if (currentProfile.birthday) {
      delete updateData.birthday;
    }

    // Never allow full name to be changed
    if (currentProfile.displayName) {
      delete updateData.displayName;
    }

    // Nickname CAN be edited
    // profileData.nickname will be preserved if provided
    
    // Photos CAN be edited (both public and private)
    // profileData.photoPrivateUrl and photoPublicUrl will be preserved if provided

    await firestoreSdk.setDoc(userRef, updateData, { merge: true });
    return updateData;
  },

  async uploadProfilePhoto(file) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in");
    }

    // For now, return a data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async getUsersByAgeGroup(minAge, maxAge) {
    const { db, firestoreSdk } = await getFirestoreClient();
    const usersRef = firestoreSdk.collection(db, "users");
    
    const query = firestoreSdk.query(
      usersRef,
      firestoreSdk.where("age", ">=", minAge),
      firestoreSdk.where("age", "<=", maxAge),
      firestoreSdk.where("profileCompleted", "==", true)
    );

    const snapshot = await firestoreSdk.getDocs(query);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getGroupsByUserAge(userAge) {
    const ageGroups = [
      { name: "18-25", min: 18, max: 25 },
      { name: "26-35", min: 26, max: 35 },
      { name: "36-50", min: 36, max: 50 },
      { name: "50+", min: 50, max: 150 },
    ];

    const userGroups = ageGroups.filter(
      group => userAge >= group.min && userAge <= group.max
    );

    return userGroups;
  },

  async filterEventsByUserAge(events, userAge) {
    return events.filter(event => {
      if (!event.ageGroupRequired) return true;
      
      const eventMinAge = event.ageGroupRequired.min;
      const eventMaxAge = event.ageGroupRequired.max;
      
      return userAge >= eventMinAge && userAge <= eventMaxAge;
    });
  },

  async deleteUserProfile(userId) {
    const { db, firestoreSdk } = await getFirestoreClient();
    const userRef = firestoreSdk.doc(db, "users", userId);
    await firestoreSdk.deleteDoc(userRef);
  },
};
