import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust the URL as per your backend server

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`); // The backend API URL for fetching projects
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};
