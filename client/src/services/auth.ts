// src/services/auth.ts
import httpClient from "@/api/httpClient";

// Login - Handles user login with email and password
export const login = async (email: string, password: string) => {
  const response = await httpClient.post("/auth/login", { email, password });
  return response.data; // Return the user data or JWT token
};

// Logout - Logs out the user
export const logout = async () => {
  return await httpClient.post("/auth/logout");
};

// Get User - Fetches the authenticated user's details
export const getUser = async () => {
  const response = await httpClient.get("/auth/me");
  return response.data; // Return the user data
};

// Enable MFA - Initiates the MFA setup
export const enableMFA = async () => {
  const response = await httpClient.post("/mfa/enable");
  return response.data; // Assuming the response contains MFA secret or QR code
};

// Verify MFA - Verifies the MFA code entered by the user
export const verifyMFA = async (code: string) => {
  const response = await httpClient.post("/mfa/verify", { code });
  return response.data; // Return verification status (success/failure)
};
