// Global dark mode setup - runs IMMEDIATELY in <head> before DOM renders
(function initDarkMode() {
  // Only run once
  if (window._darkModeInitialized) return;
  window._darkModeInitialized = true;

  console.log("[dark-mode.js] Initializing dark mode");

  // Apply dark mode class immediately to prevent flash
  // Default is ON (dark mode) unless explicitly set to "off"
  const darkModeValue = localStorage.getItem("darkMode");
  const isDarkMode = darkModeValue !== "off";
  console.log("[dark-mode.js] localStorage.darkMode:", darkModeValue, "=> isDarkMode:", isDarkMode);
  
  if (isDarkMode) {
    console.log("[dark-mode.js] Applying dark-mode class to documentElement and body");
    // Add classes immediately (before any rendering happens)
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
  } else {
    console.log("[dark-mode.js] NOT applying dark-mode (light mode active)");
  }

  // Setup toggle listener after DOM is ready
  function setupToggle() {
    console.log("[dark-mode.js] setupToggle called");
    const themeToggle = document.getElementById("theme-toggle");
    console.log("[dark-mode.js] themeToggle element found:", !!themeToggle, themeToggle);
    
    if (themeToggle) {
      console.log("[dark-mode.js] Setting themeToggle.checked to:", isDarkMode);
      themeToggle.checked = isDarkMode;
      
      const changeHandler = (event) => {
        const isNowDark = event.target.checked;
        console.log("[dark-mode.js] Toggle change event - new value:", isNowDark);
        
        // Update classes
        if (isNowDark) {
          document.documentElement.classList.add("dark-mode");
          document.body.classList.add("dark-mode");
        } else {
          document.documentElement.classList.remove("dark-mode");
          document.body.classList.remove("dark-mode");
        }
        
        // Update localStorage
        localStorage.setItem("darkMode", isNowDark ? "on" : "off");
        console.log("[dark-mode.js] Stored darkMode as:", isNowDark ? "on" : "off");
        console.log("[dark-mode.js] Dark mode classes updated");
      };
      
      themeToggle.addEventListener("change", changeHandler);
      console.log("[dark-mode.js] Event listener attached successfully");
    } else {
      console.error("[dark-mode.js] ERROR: theme-toggle element NOT FOUND in DOM!");
      console.log("[dark-mode.js] Available IDs in document:", [...document.querySelectorAll('[id]')].map(el => el.id).join(', '));
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    console.log("[dark-mode.js] DOM is still loading, adding DOMContentLoaded listener");
    document.addEventListener("DOMContentLoaded", setupToggle);
  } else {
    console.log("[dark-mode.js] DOM is already ready, calling setupToggle immediately");
    setupToggle();
  }
})();



