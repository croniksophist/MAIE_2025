// src/api/httpClient.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Set up request interceptor for logging or adding additional headers if needed
httpClient.interceptors.request.use(
  (config) => {
    // Add authorization header or any custom logic if needed, comment or uncomment line below
    // config.headers['Authorization'] = `Bearer ${your_token_here}`;
    return config;
  },
  (error) => {
    // Handle request error globally
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Set up response interceptor to handle errors globally
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response error globally
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default httpClient;
