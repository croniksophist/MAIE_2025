import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./MainLayout.css"; // Import styles

interface MainLayoutProps {
  toggleTheme: () => void;
  themeMode: "light" | "dark";
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  toggleTheme, 
  themeMode,
  isMenuOpen,
  setMenuOpen
}) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Toggle the sidebar collapse/expand state
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  return (
    <div className="layout">
      {/* Pass toggleSidebar, isCollapsed, themeMode, toggleTheme to Sidebar */}
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;