import React, { useState } from "react";
import { SelectChangeEvent } from '@mui/material';
import { Box, TextField, Typography, Button, Grid, Paper, Rating, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from "@mui/material";

// Simulated data for plugins
const plugins = [
  {
    name: "AI Cut Detection Pro",
    description: "Identifies best cut points based on AI",
    type: "Video Editing",
    rating: 4.5,
    price: "Free",
    compatibility: "Adobe Premiere, DaVinci Resolve",
    installable: true,
    installed: false,
  },
  {
    name: "Color Enhance X",
    description: "Advanced color correction AI plugin",
    type: "Color Grading",
    rating: 4.7,
    price: "Freemium",
    compatibility: "Adobe Premiere, Final Cut Pro",
    installable: true,
    installed: false,
  },
  {
    name: "AI Noise Reduction",
    description: "Reduce audio noise using AI-driven filtering",
    type: "Audio Processing",
    rating: 4.2,
    price: "$29.99",
    compatibility: "Adobe Premiere, Avid Pro Tools",
    installable: true,
    installed: false,
  },
  {
    name: "Deepfake Detector",
    description: "Detects deepfakes in video content",
    type: "Video Analysis",
    rating: 4.9,
    price: "Subscription",
    compatibility: "DaVinci Resolve, Final Cut Pro",
    installable: false,
    installed: false,
  },
];

const Marketplace: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedPrice, setSelectedPrice] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Name");
  const [filteredPlugins, setFilteredPlugins] = useState(plugins);

  // Filter plugins based on search query, selected type, and selected price
  const filterPlugins = () => {
    let filtered = plugins.filter((plugin) => {
      const matchesSearch = plugin.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "All" || plugin.type === selectedType;
      const matchesPrice = selectedPrice === "All" || plugin.price === selectedPrice;
      return matchesSearch && matchesType && matchesPrice;
    });

    // Sort plugins based on the selected sort option
    if (sortBy === "Name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Price") {
      filtered = filtered.sort((a, b) => {
        const priceA = parseFloat(a.price === "Free" ? "0" : a.price.replace(/[^\d.-]/g, ""));
        const priceB = parseFloat(b.price === "Free" ? "0" : b.price.replace(/[^\d.-]/g, ""));
        return priceA - priceB;
      });
    }

    setFilteredPlugins(filtered);
  };

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    filterPlugins();
  };

  // Handle type change
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value);
    filterPlugins();
  };

  // Handle price change
  const handlePriceChange = (event: SelectChangeEvent<string>) => {
    setSelectedPrice(event.target.value);
    filterPlugins();
  };

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
    filterPlugins();
  };

  // Handle installation toggle
  const handleInstallToggle = (pluginName: string) => {
    const updatedPlugins = filteredPlugins.map((plugin) => {
      if (plugin.name === pluginName) {
        return { ...plugin, installed: !plugin.installed };
      }
      return plugin;
    });
    setFilteredPlugins(updatedPlugins);
  };

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        AI Plugin Marketplace
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search plugins..."
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {/* Plugin Type Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select value={selectedType} onChange={handleTypeChange} label="Filter by Type">
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Video Editing">Video Editing</MenuItem>
          <MenuItem value="Color Grading">Color Grading</MenuItem>
          <MenuItem value="Audio Processing">Audio Processing</MenuItem>
          <MenuItem value="Video Analysis">Video Analysis</MenuItem>
        </Select>
      </FormControl>

      {/* Plugin Price Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Filter by Price</InputLabel>
        <Select value={selectedPrice} onChange={handlePriceChange} label="Filter by Price">
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Free">Free</MenuItem>
          <MenuItem value="Freemium">Freemium</MenuItem>
          <MenuItem value="Subscription">Subscription</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
        </Select>
      </FormControl>

      {/* Sort by */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Sort by</InputLabel>
        <Select value={sortBy} onChange={handleSortChange} label="Sort by">
          <MenuItem value="Name">Name</MenuItem>
          <MenuItem value="Rating">Rating</MenuItem>
          <MenuItem value="Price">Price</MenuItem>
        </Select>
      </FormControl>

      {/* Plugin Listings */}
      <Grid container spacing={3} justifyContent="center">
        {filteredPlugins.length > 0 ? (
          filteredPlugins.map((plugin, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ padding: "15px", textAlign: "center", boxShadow: 3 }}>
                <Typography variant="h6">{plugin.name}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {plugin.description}
                </Typography>

                {/* Plugin Rating */}
                <Rating name="plugin-rating" value={plugin.rating} precision={0.1} readOnly sx={{ mb: 2 }} />

                {/* Pricing and Compatibility */}
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Price: {plugin.price} | Compatibility: {plugin.compatibility}
                </Typography>

                {/* Install Button */}
                {plugin.installable ? (
                  <Button
                    variant="contained"
                    color={plugin.installed ? "secondary" : "primary"}
                    onClick={() => handleInstallToggle(plugin.name)}
                  >
                    {plugin.installed ? "Uninstall" : "Install"}
                  </Button>
                ) : (
                  <Button variant="contained" color="secondary" disabled>
                    Not Installable
                  </Button>
                )}
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
