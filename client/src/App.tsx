import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./store/store";
import { useAuth } from "react-oidc-context";
import { setUser } from "./store/slices/authSlice";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Import Components and Pages
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PrivateRoute from "./components/PrivateRoute";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import TokenDashboard from "./components/TokenDashboard";
import BlogList from "./features/blog/BlogList";
import BlogPostWrapper from "./features/blog/BlogPostWrapper";
import ProjectDetail from "./pages/ProjectDetail";
import CreateProject from "./pages/CreateProject";
import AIMarketplace from "./pages/AIMarketplace";
import Marketplace from "./pages/Marketplace";
import Projects from "./pages/Projects";

// Import Main Layout
import MainLayout from "./layouts/MainLayout";

// Import Global Styles
import "./styles/index.css";
import "./styles/global.css";

// Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
// Corrected imports
import { ThemeProvider as ThemeContextProvider, useTheme } from "./context/ThemeContext"; 

const App: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { themeMode, toggleTheme } = useTheme(); // Access themeMode from context
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Manage mobile menu state

  useEffect(() => {
    if (auth.isAuthenticated) {
      const user = auth.user;
      if (user) {
        dispatch(
          setUser({
            email: user.profile?.email || "",
            username: user.profile?.name || "",
          })
        );
      }
    }
  }, [auth.isAuthenticated, dispatch, auth.user]);

  const theme = createTheme({
    palette: {
      mode: themeMode, // Set theme mode here
    },
  });

  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemeContextProvider> 
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MainLayout
              toggleTheme={toggleTheme}
              themeMode={themeMode}
              isMenuOpen={isMenuOpen} // Pass menu state
              setMenuOpen={setIsMenuOpen} // Pass menu toggle function
            >
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/tokens" element={<TokenDashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/project/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
                <Route path="/ai-marketplace" element={<AIMarketplace />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPostWrapper />} />
              </Routes>
            </MainLayout>
          </ThemeProvider>
        </ThemeContextProvider>
      </Provider>
    </AuthProvider>
  );
};

export default App;
