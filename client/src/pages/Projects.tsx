import React, { useState, useEffect } from "react";
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProjects = async () => {
      // Replace this with actual API or state management logic
      const fetchedProjects = [
        { id: 1, name: "Project 1" },
        { id: 2, name: "Project 2" },
      ];
      setProjects(fetchedProjects);
    };
    getProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">Projects</Typography>

      <List>
  {projects.map((project) => (
    <ListItemButton
      key={project.id}
      onClick={() => handleProjectClick(project.id)}
    >
      <ListItemText primary={project.name} />
    </ListItemButton>
  ))}
    </List>

      <Button variant="contained" sx={{ marginTop: "20px" }} onClick={() => navigate("/create-project")}>
        Create New Project
      </Button>
    </Box>
  );
};

export default Projects;
