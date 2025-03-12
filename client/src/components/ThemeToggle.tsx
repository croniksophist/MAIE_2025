import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const ThemeToggle: React.FC = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Sync the theme with localStorage and apply the theme to the body on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setThemeMode(storedTheme);
      document.body.classList.toggle("dark-mode", storedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode); // Store theme preference in localStorage
      document.body.classList.toggle("dark-mode", newMode === "dark"); // Apply dark mode class to body
      return newMode;
    });
  };

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;
