import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBell, FaBars, FaTimes, FaTh, FaColumns } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // Import styles

interface NavbarProps {
  toggleTheme: () => void;
  themeMode: "light" | "dark";
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleTheme,
  themeMode,
  isSidebarCollapsed,
  toggleSidebar,
  isMenuOpen,
  setMenuOpen,
}) => {
  const { user } = useAuth();
  const currentTheme = localStorage.getItem("theme") || "light";

  // Handle toggle of mobile menu
  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <h2 className="logo">MAIE</h2>

      {/* Hamburger icon for mobile menu */}
      <IconButton
        onClick={handleMenuToggle}
        className="menu-toggle"
        color="inherit"
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </IconButton>

      {/* Navigation Links */}
      <ul className={`nav-links ${isMenuOpen ? "show" : ""} ${isSidebarCollapsed ? "" : "expanded"}`}>
        {/* Sidebar Toggle Button (Using FaTh & FaColumns for distinction) */}
        <li>
          <IconButton onClick={toggleSidebar} color="inherit">
            {isSidebarCollapsed ? <FaTh /> : <FaColumns />}
          </IconButton>
        </li>

        {/* Dark Mode Toggle */}
        <li>
          <IconButton onClick={toggleTheme} color="inherit">
            {currentTheme === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </li>

        {/* Notifications */}
        <li>
          <Link to="/notifications">
            <FaBell className="icon" />
          </Link>
        </li>

        {/* User Profile or Login */}
        <li>
          {user ? (
            <Link to="/profile">
              <FaUserCircle className="icon" />
            </Link>
          ) : (
            <div className="link-container">
              <Link to="/login">Login</Link>
              <FaUserCircle className="icon" />
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
