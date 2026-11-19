const firebaseVersion = "13.3.0";
let authClientPromise;

function hasFirebaseConfig() {
  const config = window.firebaseConfig;
  return Boolean(
    config &&
      ["apiKey", "authDomain", "projectId", "appId"].every(
        (key) => typeof config[key] === "string" && config[key].trim(),
      ),
  );
}

async function getFirebaseAuthClient() {
  if (!hasFirebaseConfig()) {
    const error = new Error("Firebase web app config is missing");
    error.code = "app/firebase-config-missing";
    throw error;
  }

  if (!authClientPromise) {
    authClientPromise = Promise.all([
      import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-auth.js`),
    ]).then(([appSdk, authSdk]) => {
      const app = appSdk.initializeApp(window.firebaseConfig);
      const auth = authSdk.getAuth(app);
      auth.languageCode = "is";
      return { auth, authSdk };
    });
  }

  try {
    return await authClientPromise;
  } catch (error) {
    authClientPromise = undefined;
    throw error;
  }
}

window.firebaseAuth = {
  async getAuthClient() {
    return getFirebaseAuthClient();
  },

  async signInWithGoogle() {
    const { auth, authSdk } = await getFirebaseAuthClient();
    const provider = new authSdk.GoogleAuthProvider();
    return authSdk.signInWithPopup(auth, provider);
  },

  async signInWithEmail(email, password) {
    const { auth, authSdk } = await getFirebaseAuthClient();
    return authSdk.signInWithEmailAndPassword(auth, email, password);
  },

  async createAccount(email, password, displayName) {
    const { auth, authSdk } = await getFirebaseAuthClient();
    const credential = await authSdk.createUserWithEmailAndPassword(auth, email, password);
    try {
      await authSdk.updateProfile(credential.user, { displayName });
    } catch (error) {
      console.error("Account was created, but the display name could not be saved.", error);
      const profileError = new Error("Account created, but profile update failed.");
      profileError.code = "app/profile-update-failed";
      throw profileError;
    }
    return credential;
  },

  async sendPasswordResetEmail(email) {
    const { auth, authSdk } = await getFirebaseAuthClient();
    return authSdk.sendPasswordResetEmail(auth, email);
  },

  async signOut() {
    if (!hasFirebaseConfig()) return;

    const { auth, authSdk } = await getFirebaseAuthClient();
    await authSdk.signOut(auth);
  },

  async deleteAccount(email, password) {
    const { auth, authSdk } = await getFirebaseAuthClient();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user signed in");
    }

    // Re-authenticate the user
    const credential = authSdk.EmailAuthProvider.credential(email, password);
    await authSdk.reauthenticateWithCredential(user, credential);

    // Delete the Firebase Auth account
    await authSdk.deleteUser(user);
  },
};
