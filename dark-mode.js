// Global dark mode setup - only runs once per session
(function initDarkMode() {
  // Only run once
  if (window._darkModeInitialized) return;
  window._darkModeInitialized = true;

  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  // Get dark mode state from localStorage, default to "on"
  const isDarkMode = localStorage.getItem("darkMode") !== "off";
  
  // Apply dark mode class
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  // Attach listener only once - only move toggle when user clicks it
  themeToggle.addEventListener("change", (event) => {
    const isNowDark = event.target.checked;
    document.body.classList.toggle("dark-mode", isNowDark);
    localStorage.setItem("darkMode", isNowDark ? "on" : "off");
  });
})();


