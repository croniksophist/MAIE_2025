import React, { useState } from "react";
import "./AIEditingAssistant.css";

const AIEditingAssistant: React.FC = () => {
  const [editSuggestions, setEditSuggestions] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/editing-assist");
      const data = await response.json();
      setEditSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching AI editing suggestions:", error);
    }
  };

  return (
    <div className="ai-editing-assistant">
      <h3>🎬 AI Editing Assistant</h3>
      <button onClick={fetchSuggestions}>Get AI Suggestions</button>
      {editSuggestions && <p>{editSuggestions}</p>}
    </div>
  );
};

export default AIEditingAssistant;
