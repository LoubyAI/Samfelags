// Shared utilities for all pages
function setupPageDefaults(pageName) {
  console.log(`${pageName}: Setting up page defaults`);
  
  // Setup theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const isDarkMode = localStorage.getItem("darkMode") === "on";
    themeToggle.checked = isDarkMode;
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    console.log(`${pageName}: Initial dark mode:`, isDarkMode);
    
    themeToggle.addEventListener("change", () => {
      const isNowDark = themeToggle.checked;
      document.body.classList.toggle("dark-mode", isNowDark);
      localStorage.setItem("darkMode", isNowDark ? "on" : "off");
      console.log(`${pageName}: Dark mode toggled to:`, isNowDark);
    });
  } else {
    console.warn(`${pageName}: Theme toggle element not found`);
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
