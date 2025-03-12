// Sidebar.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaProjectDiagram, FaStore, FaCog, FaBars, FaTimes } from "react-icons/fa"; // <-- Add FaBars and FaTimes
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import "./Sidebar.css";

// Accept toggleTheme, toggleSidebar, isCollapsed, and themeMode as props
interface SidebarProps {
  toggleTheme: () => void; // Function to toggle the theme
  toggleSidebar: () => void; // Function to toggle sidebar
  isCollapsed: boolean; // State to determine if sidebar is collapsed
  themeMode: "light" | "dark"; // Accept themeMode as a prop
}

const Sidebar: React.FC<SidebarProps> = ({ toggleTheme, toggleSidebar, isCollapsed, themeMode }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar toggle button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars /> {/* The hamburger menu icon */}
      </button>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">
              <FaHome /> {!isCollapsed && "Dashboard"}
            </Link>
          </li>
          <li>
            <Link to="/projects">
              <FaProjectDiagram /> {!isCollapsed && "Projects"}
            </Link>
          </li>
          <li>
            <Link to="/ai-marketplace">
              <FaStore /> {!isCollapsed && "AI Marketplace"}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="settings-menu">
        <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
          <FaCog /> {!isCollapsed && "Settings"}
        </button>
        {showSettings && (
          <div className="settings-dropdown">
            {!isCollapsed && (
              <div className="appearance-toggle">
                <p>Appearance</p>
                <button onClick={toggleTheme}>
                  {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            )}
            {isCollapsed && (
              <div className="appearance-toggle">
                <button onClick={toggleTheme}>
                  {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
