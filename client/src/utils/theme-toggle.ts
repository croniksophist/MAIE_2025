const toggleDarkMode = (): void => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
};

// On page load, set the saved theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme: string = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
});

// Add event listener to the toggle button
const themeToggleButton = document.getElementById("theme-toggle");
if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleDarkMode);
} else {
  console.error("Theme toggle button not found in the DOM");
}
// Make the file a module
export {};