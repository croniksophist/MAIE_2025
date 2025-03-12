// services/apiClient.ts
import axios from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";

// Create an axios instance with a base URL
const apiClient = axios.create({
  baseURL: "https://api.maie.com", // Replace with your actual base URL
});

// Add an interceptor to inject the Authorization token in the headers
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString(); // Correct token retrieval

      if (token) {
        // Instead of directly assigning to headers, use the `set` method on AxiosHeaders
        config.headers?.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Error fetching auth session", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch AI recommendations using the apiClient (axios)
export const fetchAIRecommendations = async () => {
  try {
    const response = await apiClient.get("/ai-recommendations"); // API endpoint for AI recommendations
    return response.data; // Return the response data directly
  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    return []; // Return an empty array if there's an error
  }
};

export default apiClient;
