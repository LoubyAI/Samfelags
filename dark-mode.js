// Global dark mode setup - only runs once per session
(function initDarkMode() {
  // Only run once
  if (window._darkModeInitialized) return;
  window._darkModeInitialized = true;

  // Apply dark mode class immediately to avoid flash (before any rendering)
  const isDarkMode = localStorage.getItem("darkMode") !== "off";
  if (isDarkMode) {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
  }

  // Setup toggle listener if toggle element exists
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
})();


