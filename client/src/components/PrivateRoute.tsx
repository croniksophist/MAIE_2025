import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store"; // Adjust path as needed

// Type definition for PrivateRoute props
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Access the authentication state from Redux store
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // If not authenticated, redirect to login page, otherwise render the children
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
