import React, { useEffect, useState } from "react";
import "./AIRecommendationSidebar.css";

const AIRecommendationSidebar: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/get-recommendations") // Fetch AI suggestions
      .then((res) => res.json())
      .then((data) => setRecommendations(data.suggestions));
  }, []);

  return (
    <div className="ai-recommendation-sidebar">
      <h3>✨ AI Recommendations</h3>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default AIRecommendationSidebar;
