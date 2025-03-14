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

// Import Splash Elements
// @ts-ignore - Add this line to ignore the TypeScript error
import MaieSplashPage from './components/MaieSplashPage';

// Import Main Layout
import MainLayout from "./layouts/MainLayout";

// Import Global Styles
import "./styles/index.css";
import "./styles/global.css";

// Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
// Corrected imports
import { ThemeProvider as ThemeContextProvider, useTheme } from "./context/ThemeContext";

// Import API Functions
import { fetchS3Images, fetchGooglePhotos } from "./api/imageApi";  // Have this API setup

const App: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { themeMode, toggleTheme } = useTheme(); // Access themeMode from context
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Manage mobile menu state
  const [s3Images, setS3Images] = useState<string[]>([]); // State for S3 images
  const [googlePhotosImages, setGooglePhotosImages] = useState<string[]>([]); // State for Google Photos images
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching images

  useEffect(() => {
    // Fetch user data on authentication
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

    // Fetch images from S3 and Google Photos
    const loadImages = async () => {
      const s3BucketName = "your-s3-bucket-name";  // Replace with your actual S3 bucket name
      const googleAccessToken = "your-google-access-token";  // Replace with actual OAuth access token

      try {
        setLoading(true);
        const fetchedS3Images = await fetchS3Images(s3BucketName);
        const fetchedGooglePhotos = await fetchGooglePhotos(googleAccessToken);

        setS3Images(fetchedS3Images);
        setGooglePhotosImages(fetchedGooglePhotos);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [auth.isAuthenticated, dispatch]);

  const theme = createTheme({
    palette: {
      mode: themeMode, // Set theme mode here
    },
  });

  if (loading) {
    return <div>Loading images...</div>;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemeContextProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              {/* Add the splash page as the root route */}
              <Route path="/MaieSplashPage" element={<MaieSplashPage />} />
              
              {/* Wrap all other routes in MainLayout */}
              <Route 
                element={
                  <MainLayout
                    toggleTheme={toggleTheme}
                    themeMode={themeMode}
                    isMenuOpen={isMenuOpen}
                    setMenuOpen={setIsMenuOpen}
                  />
                }
              >
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
              </Route>
            </Routes>
          </ThemeProvider>
        </ThemeContextProvider>
      </Provider>
    </AuthProvider>
  );
};

export default App;