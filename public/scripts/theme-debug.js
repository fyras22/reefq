/**
 * Theme Debug Script
 * This script helps diagnose theme switching issues
 */
(function () {
  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Theme Debug: Script loaded");

    // Check initial theme state
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.classList.contains("dark")
      ? "dark"
      : "light";
    const storedTheme = localStorage.getItem("theme");

    console.log("Theme Debug: Initial theme class:", currentTheme);
    console.log("Theme Debug: Stored theme:", storedTheme);
    console.log(
      "Theme Debug: Data theme attribute:",
      htmlElement.dataset.theme
    );

    // Monitor theme changes
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          const newTheme = htmlElement.classList.contains("dark")
            ? "dark"
            : "light";
          console.log("Theme Debug: Theme changed to:", newTheme);
          console.log(
            "Theme Debug: Data theme attribute:",
            htmlElement.dataset.theme
          );
        }
      });
    });

    // Observe class changes on html element
    observer.observe(htmlElement, { attributes: true });

    // Find theme toggle buttons
    const themeButtons = document.querySelectorAll(
      'button[aria-label*="Switch to"]'
    );
    console.log(
      "Theme Debug: Found",
      themeButtons.length,
      "theme toggle buttons"
    );

    // Add click logging
    themeButtons.forEach((button, index) => {
      const originalClick = button.onclick;
      button.addEventListener("click", function (e) {
        console.log("Theme Debug: Theme button", index, "clicked");
        console.log(
          "Theme Debug: Button aria-label:",
          button.getAttribute("aria-label")
        );
      });
    });
  });
})();
