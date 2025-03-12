import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, List, ListItem } from "@mui/material";
import FileUpload from "../components/FileUpload"; // Import the FileUpload component

const ProjectDetail: React.FC = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // State to store uploaded files
  const [projects, setProjects] = useState<any[]>([]); // State for list of projects
  const navigate = useNavigate();

  // Simulate fetching projects from an API or Redux state
  useEffect(() => {
    // Simulate fetching projects from an API or Redux state
    const fetchedProjects: { id: number, name: string }[] = []; // Explicitly type the fetchedProjects
    setProjects(fetchedProjects);
  }, []);

  // Handle files added from the FileUpload component
  const handleFilesAdded = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // Navigate to create a new project page
  const handleCreateProject = () => {
    navigate("/create-project");
  };

  // If there are no projects, display a splash message
  if (projects.length === 0) {
    return (
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h4">No Projects Available</Typography>
        <Typography variant="body1" sx={{ marginTop: "20px" }}>
          It looks like you haven't created any projects yet. Start by creating a new project.
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: "20px" }}
          onClick={handleCreateProject}
        >
          Create New Project
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">Project: {id}</Typography>

      {/* File Upload Component */}
      <FileUpload onFilesAdded={handleFilesAdded} />

      {/* Display Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">Uploaded Files:</Typography>
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={index}>{file.name}</ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Project File Structure */}
      <div className="file-structure" style={{ marginTop: "30px" }}>
        <Typography variant="h6">File Structure</Typography>
        <ul>
          <li>📁 Pre-Production</li>
          <li>📁 Production</li>
          <li>📂 Footage
            <ul>
              <li>📄 footage_01.mp4</li>
            </ul>
          </li>
          <li>📁 Post-Production</li>
        </ul>
      </div>

      {/* File Preview */}
      <div className="file-preview" style={{ marginTop: "30px" }}>
        <Typography variant="h6">File Preview</Typography>
        <video controls width="500">
          <source src="sample.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </Box>
  );
};

export default ProjectDetail;
