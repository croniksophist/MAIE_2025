import React, { useState, useEffect } from "react";
import { getSmartContract } from "../services/smartContractService";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Button } from "@mui/material"; // ✅ Import MUI Button for styling

const AIMarketplace: React.FC = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Use React Router for navigation

  useEffect(() => {
    const fetchDatasets = async () => {
      const contract = await getSmartContract();
      if (contract) {
        try {
          const count = await contract.datasetCount();
          let items = [];
          for (let i = 1; i <= count; i++) {
            const data = await contract.getDataset(i);
            items.push({
              id: i,
              name: data.name,
              price: ethers.formatEther(data.price),
              owner: data.owner,
            });
          }
          setDatasets(items);
        } catch (error) {
          console.error("Error fetching datasets:", error);
          alert("Failed to fetch datasets.");
        }
      }
      setLoading(false);
    };

    fetchDatasets();
  }, []);

  const purchaseDataset = async (datasetId: number, price: string) => {
    const contract = await getSmartContract();
    if (contract) {
      try {
        await contract.purchaseDataset(datasetId, { value: ethers.parseEther(price) });
        alert("Dataset Purchased!");
      } catch (error) {
        console.error("Error purchasing dataset:", error);
        alert("Failed to purchase dataset.");
      }
    }
  };

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <div className="ai-marketplace">
      <h1>AI Dataset Marketplace</h1>
      <p>Welcome to Media AI Exchange (MAIE), the cloud-based platform for media companies to collaborate, share data, and innovate using AI-powered tools.</p>

      {/* Platform Overview */}
      <section>
        <h2>Platform Overview</h2>
        <p>MAIE allows media companies to pool resources, share datasets, and train machine learning models for media production.</p>
      </section>

      {/* Key Features */}
      <section>
        <h2>Key Features</h2>
        <ul>
          <li>🔹 **Shared AI Dataset Repository:** Contribute and access anonymized, ethically sourced media data.</li>
          <li>🔹 **Collaborative Model Training:** Work on AI models with industry peers.</li>
          <li>🔹 **APIs & SDKs:** Integrate AI into media production pipelines.</li>
          <li>🔹 **Resource Marketplace:** Rent/purchase AI computing resources and storage.</li>
          <li>🔹 **Smart Contracts:** Automate compensation and enforce data-sharing policies.</li>
        </ul>
      </section>

      {/* Available AI Datasets */}
      <section>
        <h2>Available AI Datasets</h2>
        {loading ? (
          <p>Loading datasets...</p>
        ) : datasets.length > 0 ? (
          <ul>
            {datasets.map((dataset) => (
              <li key={dataset.id}>
                <strong>{dataset.name}</strong> - {dataset.price} ETH
                <Button variant="contained" color="primary" onClick={() => purchaseDataset(dataset.id, dataset.price)}>
                  Buy
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No datasets available.</p>
        )}
      </section>

      {/* Toggle details for AI tools */}
      <section>
        <h2>Available AI Tools</h2>
        <ul>
          <li>🟢 AI Auto-Tagging</li>
          <li>🟢 AI Object Removal</li>
          <li>🟢 AI Video Stabilization</li>
          <li>🟢 AI Voice Enhancement</li>
        </ul>
        <Button variant="outlined" onClick={toggleDetails}>
          {showDetails ? "Hide More Details" : "Show More Details"}
        </Button>
        {showDetails && (
          <div className="more-details">
            <h3>How AI Tools Work</h3>
            <p>Enhance your media workflow with AI-powered automation and efficiency.</p>
            <Button variant="contained" onClick={() => navigate("/MaieSplashPage")}>
              Visit Main Splash Page
            </Button>
          </div>
        )}
      </section>

      {/* Collaborative Workspaces */}
      <section>
        <h2>Join Our Collaboration Network</h2>
        <p>Work with other media professionals to build AI-driven projects.</p>
        <Button variant="contained">Join Collaboration Space</Button>
      </section>

      {/* Resource Marketplace */}
      <section>
        <h2>AI Plugin Marketplace</h2>
        <p>Discover and install AI-powered plugins for your media projects.</p>
        <Button variant="contained" onClick={() => navigate("/marketplace")}>
          Visit AI Plugin Marketplace
        </Button>
      </section>

      {/* Data Sharing & Smart Contracts */}
      <section>
        <h2>Data Pooling & Smart Contracts</h2>
        <p>Use smart contracts to ensure transparency and compensation when sharing datasets.</p>
        <Button variant="contained">Learn More</Button>
      </section>

      {/* ✅ Token Economy (Updated) */}
      <section>
        <h2>Earn & Spend Tokens</h2>
        <p>Earn tokens for contributing datasets and models, spend them on AI resources.</p>
        <Button variant="contained" color="secondary" onClick={() => navigate("/tokens")}>
          View Token Dashboard
        </Button>
      </section>
    </div>
  );
};

export default AIMarketplace;