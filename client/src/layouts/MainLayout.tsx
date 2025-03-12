import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./MainLayout.css"; // Import styles

interface MainLayoutProps {
  children: React.ReactNode; 
  toggleTheme: () => void; 
  themeMode: "light" | "dark"; 
  isMenuOpen: boolean; // Add this line
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>; // Add this line
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, toggleTheme, themeMode }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false); // State for mobile menu visibility

  // Toggle the sidebar collapse/expand state
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Toggle the mobile menu state
  const toggleMobileMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="layout">
      {/* Pass toggleSidebar, isCollapsed, themeMode, toggleTheme, isMenuOpen, and setMenuOpen to Sidebar */}
      <Sidebar 
        toggleSidebar={toggleSidebar} 
        isCollapsed={isSidebarCollapsed} 
        themeMode={themeMode} 
        toggleTheme={toggleTheme} 
      />
      <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <Navbar 
          toggleTheme={toggleTheme} 
          themeMode={themeMode} // Pass themeMode to Navbar
          toggleSidebar={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed} 
          isMenuOpen={isMenuOpen} // Pass menu state to Navbar
          setMenuOpen={setMenuOpen} // Pass setMenuOpen function to Navbar
        />
        <div className="page-content">
          {/* Add padding-top dynamically if menu is open on mobile */}
          <div className={isMenuOpen ? "menu-open" : ""}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
