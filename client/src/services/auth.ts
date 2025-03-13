// src/services/auth.ts
import httpClient from "@/api/httpClient";

// Login - Handles user login with email and password
export const login = async (email: string, password: string) => {
  try {
    const response = await httpClient.post("/auth/login", { email, password });
    return response.data; // Return the user data or JWT token
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Logout - Logs out the user
export const logout = async () => {
  try {
    return await httpClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

// Get User - Fetches the authenticated user's details
export const getUser = async () => {
  try {
    const response = await httpClient.get("/auth/me");
    return response.data; // Return the user data
  } catch (error) {
    console.error("Get User Error:", error);
    throw error;
  }
};

// Enable MFA - Initiates the MFA setup
export const enableMFA = async () => {
  try {
    const response = await httpClient.post("/mfa/enable");
    return response.data; // Assuming the response contains MFA secret or QR code
  } catch (error) {
    console.error("Enable MFA Error:", error);
    throw error;
  }
};

// Verify MFA - Verifies the MFA code entered by the user
export const verifyMFA = async (code: string) => {
  try {
    const response = await httpClient.post("/mfa/verify", { code });
    return response.data; // Return verification status (success/failure)
  } catch (error) {
    console.error("Verify MFA Error:", error);
    throw error;
  }
};
