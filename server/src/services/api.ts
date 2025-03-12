import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";  // Replace with the actual backend URL

// Async function to fetch projects from the API
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;  // Assuming the API returns an array of projects
  } catch (error) {
    throw new Error('Failed to fetch projects: ' + error.message);  // Handling errors
  }
};
