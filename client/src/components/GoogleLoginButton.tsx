import React from "react";
import { getGoogleAuthURL } from "../services/googleAuth";

// Define the type for the props that will be passed to this component
interface GoogleLoginButtonProps {
  onLoginSuccess: (token: string) => void; // Declare the onLoginSuccess prop type
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLoginSuccess }) => {
  const handleLogin = () => {
    const authURL = getGoogleAuthURL();
    window.location.href = authURL; // Redirect to Google login
    // You would typically need to handle the redirection and passing the token after successful login.
  };

  return (
    <button onClick={handleLogin} className="google-login-btn">
      Connect Google Photos
    </button>
  );
};

export default GoogleLoginButton;
