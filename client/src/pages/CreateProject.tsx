import React, { useState } from "react";
import { Box, TextField, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const navigate = useNavigate();
  const theme = useTheme(); // Get theme from MUI

  // Handle form submission
  const handleCreateProject = () => {
    console.log("Creating project:", projectName, projectDescription);
    navigate("/projects");
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: 600,
        margin: "0 auto",
        bgcolor: theme.palette.background.default, // Apply background color based on theme
        color: theme.palette.text.primary, // Apply text color based on theme
      }}
    >
      <Typography variant="h4">Create a New Project</Typography>
      <TextField
        label="Project Name"
        variant="outlined"
        fullWidth
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        sx={{
          marginTop: "20px",
          bgcolor: theme.palette.mode === "dark" ? "#333" : "white", // Adapt input background
          input: { color: theme.palette.text.primary }, // Ensure input text is readable
        }}
      />
      <TextField
        label="Project Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        sx={{
          marginTop: "20px",
          bgcolor: theme.palette.mode === "dark" ? "#333" : "white",
          input: { color: theme.palette.text.primary },
        }}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: "20px" }}
        onClick={handleCreateProject} // Fixed function reference error
      >
        Create Project
      </Button>
    </Box>
  );
};

export default CreateProject;
