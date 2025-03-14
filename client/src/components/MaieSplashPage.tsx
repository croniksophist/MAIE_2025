import React, { useState, useEffect } from "react";
import { 
  FaTwitter, FaLinkedin, FaFacebook, FaGithub, FaYoutube, FaDiscord, 
  FaSun, FaMoon 
} from "react-icons/fa";

const MaieSplashPage: React.FC = () => {
  // User authentication state (Replace with actual authentication logic)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || !localStorage.getItem("theme");
  });

  // Toggle dark mode and store preference
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Check user authentication status
  useEffect(() => {
    const userToken = localStorage.getItem("authToken"); // Assuming you store an auth token
    if (userToken) setIsAuthenticated(true);
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen flex flex-col items-center justify-center text-center relative transition-all duration-500`}>
      
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-5 right-5 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-500 transition-all duration-300"
      >
        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </button>

      <div className="z-10 max-w-4xl text-center">
        <h1 className={`text-6xl font-extrabold bg-gradient-to-r ${isDarkMode ? "from-green-400 to-blue-500" : "from-blue-500 to-purple-600"} text-transparent bg-clip-text animate-fadeIn`}>
          Welcome to MAIE
        </h1>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          The AI-Powered Media Exchange. Seamlessly integrate AI plugins, collaborate on projects, and revolutionize media production.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          {isAuthenticated ? (
            <a href="/dashboard" className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:scale-105 transition-transform">
              Go to Dashboard
            </a>
          ) : (
            <>
              <a href="/register" className="px-6 py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform">
                Get Started
              </a>
              <a href="/login" className="px-6 py-3 text-lg font-semibold border border-white rounded-lg shadow-md hover:scale-105 transition-transform">
                Log In
              </a>
            </>
          )}
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="absolute bottom-8 flex gap-6">
        <a href="#" className="social-icon"><FaFacebook className="w-6 h-6 text-blue-500 hover:text-white transition-transform hover:scale-110" /></a>
        <a href="#" className="social-icon"><FaTwitter className="w-6 h-6 text-blue-400 hover:text-white transition-transform hover:scale-110" /></a>
        <a href="#" className="social-icon"><FaLinkedin className="w-6 h-6 text-blue-400 hover:text-white transition-transform hover:scale-110" /></a>
        <a href="#" className="social-icon"><FaGithub className="w-6 h-6 text-gray-300 hover:text-white transition-transform hover:scale-110" /></a>
        <a href="#" className="social-icon"><FaYoutube className="w-6 h-6 text-red-500 hover:text-white transition-transform hover:scale-110" /></a>
        <a href="#" className="social-icon"><FaDiscord className="w-6 h-6 text-indigo-400 hover:text-white transition-transform hover:scale-110" /></a>
      </div>

      {/* Animated Background */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isDarkMode ? "opacity-30" : "opacity-10"}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-600/60 to-transparent animate-gradient"></div>
      </div>
    </div>
  );
};

export default MaieSplashPage;
