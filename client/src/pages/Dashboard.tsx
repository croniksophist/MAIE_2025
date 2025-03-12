// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { fetchAIRecommendations } from "../services/apiClient"; // Import the API function
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from '../store/store';
import { loadProjects } from '../store/slices/projectSlice';
import { motion } from 'framer-motion'; // Import motion for animation
import AnimatedButton from '../components/AnimatedButton'; // Import the AnimatedButton component
import FileUpload from '../components/FileUpload'; // Import FileUpload component
import GoogleLoginButton from '../components/GoogleLoginButton'; // Import the GoogleLoginButton component
import GooglePhotosGallery from '../components/GooglePhotosGallery'; // Import the GooglePhotosGallery component
import PhotoSearch from '../components/PhotoSearch'; // Import the PhotoSearch component
import '../styles/dashboard.css'; // Import your custom styles

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.project);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]); // State to store AI recommendations
  const [loadingAI, setLoadingAI] = useState<boolean>(true); // State to track loading of AI recommendations
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // State to store files uploaded by the user
  const [accessToken, setAccessToken] = useState<string | null>(null); // State to store the Google access token
  const [filteredTags, setFilteredTags] = useState<string[]>([]); // State to store the filtered search tags

  // Dispatch the loadProjects action when the component mounts
  useEffect(() => {
    dispatch(loadProjects());

    // Fetch AI recommendations data from the API
    const getRecommendations = async () => {
      try {
        const data = await fetchAIRecommendations();
        setAiRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch AI recommendations:", error);
      } finally {
        setLoadingAI(false); // Set loading to false once data is fetched
      }
    };

    getRecommendations();
  }, [dispatch]);

  // Handler function for when files are added
  const handleFilesAdded = (files: File[]) => {
    setUploadedFiles(files); // Set the files in the state (you can also process them here)
    console.log('Files added:', files);
  };

  // Function to handle Google login and store the access token
  const handleGoogleLoginSuccess = (token: string) => {
    setAccessToken(token); // Store the access token in state
  };

  // Function to handle search input
  const handleSearch = (query: string) => {
    setFilteredTags([query]);  // Filter by search term (tags)
  };

  // Loading and error states
  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header>
        <h1>MAIE Dashboard</h1>
        {/* Add the animated button with a label and click handler */}
        <AnimatedButton label="New Project" onClick={() => console.log('New Project Clicked')} />
        {/* Include the Google Login Button */}
        <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} /> {/* Pass login success handler */}
      </header>

      {/* Render the GooglePhotosGallery only if the user is authenticated */}
      {accessToken && (
        <motion.section
          className="google-photos-gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Your Google Photos</h2>
          {/* Add the PhotoSearch component */}
          <PhotoSearch tags={filteredTags} onSearch={handleSearch} />
          <GooglePhotosGallery accessToken={accessToken} filteredTags={filteredTags} /> {/* Pass the filteredTags to the gallery */}
        </motion.section>
      )}

      {/* Other sections like Projects, File Upload, AI Recommendations remain the same */}
      {/* Project Overview */}
      <section className="project-overview">
        <h2>Project Overview</h2>
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td>{project.name}</td>
                <td>{project.status}</td>
                <td>{project.lastModified}</td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </section>

      {/* File Upload Section */}
      <motion.section
        className="file-upload"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>Upload Media Files</h2>
        <FileUpload onFilesAdded={handleFilesAdded} />
        {uploadedFiles.length > 0 && (
          <div>
            <h3>Uploaded Files:</h3>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.section>

      {/* AI Recommendations Section */}
      <motion.section
        className="ai-recommendations"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>AI Recommendations</h2>
        {loadingAI ? (
          <p>Loading AI recommendations...</p>
        ) : (
          <ul>
            {aiRecommendations.map((rec: { id: number; title: string; description: string }) => (
              <li key={rec.id}>
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
              </li>
            ))}
          </ul>
        )}
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;
