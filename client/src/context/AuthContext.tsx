import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

// Define types for user and notification
interface User {
  name: string;
  email: string;
}

interface Notification {
  message: string;
  timestamp: string;
  read: boolean;
  type: 'error' | 'info' | 'warning'; // Type of the notification
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  notifications: Notification[];  // Add notification state here
  addNotification: (message: string, type: 'error' | 'info' | 'warning') => void; // Function to add notifications
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap your app and provide context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [notifications, setNotifications] = useState<Notification[]>([]);  // Notification state

  // Add notification function
  const addNotification = (message: string, type: 'error' | 'info' | 'warning') => {
    const newNotification: Notification = {
      message,
      timestamp: new Date().toLocaleString(),
      read: false,
      type,
    };
  
    // Prevent adding duplicate notifications
    if (!notifications.some((notification) => notification.message === message)) {
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    }
  };  

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        // Fetch user profile after successful login
        fetchProfile(email);
        addNotification("Login successful", 'info');  // Add success notification
      } else {
        addNotification("Login failed", 'error');  // Add error notification
        console.error("Login failed");
      }
    } catch (error) {
      addNotification("Error during login: " + error, 'error');  // Add error notification
      console.error("Error during login:", error);
    }
  };

  // Fetch the user profile
  const fetchProfile = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:8000/auth/profile?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data)); // Store the user data
      } else {
        addNotification("Failed to fetch profile", 'error');  // Add error notification
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      addNotification("Error fetching profile: " + error, 'error');  // Add error notification
      console.error("Error fetching profile:", error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    addNotification("Logged out successfully", 'info');  // Add logout success notification
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, notifications, addNotification }}>
      {children}
    </AuthContext.Provider>
  );
};
