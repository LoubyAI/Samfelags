// Global dark mode setup - runs IMMEDIATELY in <head> before DOM renders
(function initDarkMode() {
  // Only run once
  if (window._darkModeInitialized) return;
  window._darkModeInitialized = true;

  console.log("[dark-mode.js] Initializing dark mode");

  // Apply dark mode class immediately to prevent flash
  const isDarkMode = localStorage.getItem("darkMode") !== "off";
  console.log("[dark-mode.js] isDarkMode from localStorage:", isDarkMode);
  
  if (isDarkMode) {
    console.log("[dark-mode.js] Applying dark-mode class to documentElement and body");
    // Add classes immediately (before any rendering happens)
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
  }

  // Setup toggle listener after DOM is ready
  function setupToggle() {
    console.log("[dark-mode.js] setupToggle called, looking for theme-toggle...");
    const themeToggle = document.getElementById("theme-toggle");
    console.log("[dark-mode.js] themeToggle element found:", !!themeToggle);
    
    if (themeToggle) {
      console.log("[dark-mode.js] Setting themeToggle.checked to:", isDarkMode);
      themeToggle.checked = isDarkMode;
      
      themeToggle.addEventListener("change", (event) => {
        const isNowDark = event.target.checked;
        console.log("[dark-mode.js] Toggle changed to:", isNowDark);
        document.documentElement.classList.toggle("dark-mode", isNowDark);
        document.body.classList.toggle("dark-mode", isNowDark);
        localStorage.setItem("darkMode", isNowDark ? "on" : "off");
        console.log("[dark-mode.js] Dark mode classes updated and localStorage saved");
      });
      
      console.log("[dark-mode.js] Event listener attached to toggle");
    } else {
      console.warn("[dark-mode.js] theme-toggle element NOT FOUND");
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    console.log("[dark-mode.js] DOM is loading, adding DOMContentLoaded listener");
    document.addEventListener("DOMContentLoaded", setupToggle);
  } else {
    console.log("[dark-mode.js] DOM is already ready, calling setupToggle immediately");
    setupToggle();
  }
})();



