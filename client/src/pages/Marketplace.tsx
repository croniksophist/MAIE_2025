import React, { useState } from "react";
import { Box, TextField, Typography, Button, Grid, Paper } from "@mui/material";

const Marketplace: React.FC = () => {
  const [search, setSearch] = useState("");

  const plugins = [
    { name: "AI Cut Detection Pro", description: "Identifies best cut points based on AI" },
    { name: "Color Enhance X", description: "Advanced color correction AI plugin" },
    { name: "AI Noise Reduction", description: "Reduce audio noise using AI-driven filtering" },
    { name: "Deepfake Detector", description: "Detects deepfakes in video content" },
  ];

  const filteredPlugins = plugins.filter((plugin) =>
    plugin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        AI Plugin Marketplace
      </Typography>

      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search plugins..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3} justifyContent="center">
        {filteredPlugins.length > 0 ? (
          filteredPlugins.map((plugin, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ padding: "15px", textAlign: "center", boxShadow: 3 }}>
                <Typography variant="h6">{plugin.name}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {plugin.description}
                </Typography>
                <Button variant="contained" color="primary">
                  Install
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>No plugins found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Marketplace;
