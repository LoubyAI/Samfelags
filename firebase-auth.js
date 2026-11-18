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
  async signInWithGoogle() {
    const { auth, authSdk } = await getFirebaseAuthClient();
    const provider = new authSdk.GoogleAuthProvider();
    return authSdk.signInWithPopup(auth, provider);
  },

  async signOut() {
    if (!hasFirebaseConfig()) return;

    const { auth, authSdk } = await getFirebaseAuthClient();
    await authSdk.signOut(auth);
  },
};
