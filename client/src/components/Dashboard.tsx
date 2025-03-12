import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

// Define a type for the expected data from the API
interface DashboardData {
  // Define the shape of the data you expect from the API
  // For example:
  // id: number;
  // name: string;
  [key: string]: any;  // You can adjust the type to reflect the actual response structure
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null); // State for the fetched data
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/protected-endpoint");
        setData(response.data); // Assuming the response data is of type DashboardData
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Dashboard;
