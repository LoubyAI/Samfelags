// Global dark mode setup - runs IMMEDIATELY in <head> before DOM renders
(function initDarkMode() {
  // Only run once
  if (window._darkModeInitialized) return;
  window._darkModeInitialized = true;

  // Apply dark mode class immediately to prevent flash
  const isDarkMode = localStorage.getItem("darkMode") !== "off";
  if (isDarkMode) {
    // Add classes immediately (before any rendering happens)
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
  }

  // Setup toggle listener after DOM is ready
  function setupToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.checked = isDarkMode;
      themeToggle.addEventListener("change", (event) => {
        const isNowDark = event.target.checked;
        document.documentElement.classList.toggle("dark-mode", isNowDark);
        document.body.classList.toggle("dark-mode", isNowDark);
        localStorage.setItem("darkMode", isNowDark ? "on" : "off");
      });
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupToggle);
  } else {
    setupToggle();
  }
})();


