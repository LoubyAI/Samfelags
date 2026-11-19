// Shared utilities for all pages
function setupPageDefaults(pageName) {
  console.log(`${pageName}: Setting up page defaults`);
  
  // Setup theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.checked = localStorage.getItem("darkMode") === "on";
    document.body.classList.toggle("dark-mode", themeToggle.checked);
    themeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode", themeToggle.checked);
      localStorage.setItem("darkMode", themeToggle.checked ? "on" : "off");
      console.log(`${pageName}: Dark mode toggled`, themeToggle.checked);
    });
  }
  
  // Setup sign out
  document.querySelector('[data-action="sign-out"]')?.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const { auth, authSdk } = await getFirebaseAuthClient();
      await authSdk.signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error(`${pageName}: Sign out error:`, error);
      window.location.href = "index.html";
    }
  });
}

async function checkAuthAndWait(pageName) {
  console.log(`${pageName}: Checking auth state...`);
  
  const { auth, authSdk } = await getFirebaseAuthClient();
  
  if (!auth.currentUser) {
    console.log(`${pageName}: No user, waiting for auth state...`);
    await new Promise((resolve) => {
      const unsubscribe = authSdk.onAuthStateChanged(auth, (user) => {
        console.log(`${pageName}: Auth state changed, user:`, user?.email);
        unsubscribe();
        resolve(user);
      });
      setTimeout(() => {
        console.log(`${pageName}: Auth state wait timeout`);
        unsubscribe();
        resolve(null);
      }, 2000);
    });
  }
  
  if (!auth.currentUser) {
    console.log(`${pageName}: User not authenticated, redirecting to login`);
    window.location.href = "index.html";
    return null;
  }
  
  console.log(`${pageName}: User authenticated:`, auth.currentUser.email);
  return auth;
}
