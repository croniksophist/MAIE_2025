import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Your backend base URL

// Fetch images from AWS S3
export const fetchAWSBucketImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/aws-bucket-images`);
    return response.data; // Assuming the response contains an array of image URLs
  } catch (error) {
    console.error("Error fetching images from AWS S3:", error);
    return []; // Return an empty array in case of error
  }
};

// Fetch all projects from the backend
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/`);
    return response.data; // Assuming the response contains an array of projects
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return an empty array in case of error
  }
};

// Fetch a single project by ID
export const fetchProjectById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
    return response.data; // Assuming the response contains the project data
  } catch (error) {
    console.error("Error fetching project:", error);
    return null; // Return null in case of error
  }
};

// Fetch a token from localStorage or another source
export const getAuthToken = () => {
  // Example of how to get the token from localStorage
  return localStorage.getItem("auth_token"); // Assuming token is saved as "auth_token"
};

// Add authorization token dynamically to requests
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Get the token dynamically
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Set the Authorization header with the token
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
