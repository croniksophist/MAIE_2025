import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context"; // OIDC hook

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();  // Check if the user is authenticated using OIDC

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
