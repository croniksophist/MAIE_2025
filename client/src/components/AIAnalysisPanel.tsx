import React, { useState } from "react";
import "./AIAnalysisPanel.css"; // Ensure styles are applied

const AIAnalysisPanel: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);

  const analyzeMedia = async () => {
    try {
      const response = await fetch("/api/analyze-media"); // Adjust with real API
      const data = await response.json();
      setAnalysisResults(data.analysis); // Assume 'analysis' contains AI output
    } catch (error) {
      console.error("Error analyzing media:", error);
    }
  };

  return (
    <div className="ai-analysis-panel">
      <h3>🎥 AI Media Analysis</h3>
      <button onClick={analyzeMedia}>Analyze Media</button>
      {analysisResults && <p>{analysisResults}</p>}
    </div>
  );
};

export default AIAnalysisPanel;
