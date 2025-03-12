import React, { useEffect, useState } from "react";
import { analyzeImage } from "../services/photoAI";

const PhotoAIAnalyzer: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const aiData = await analyzeImage(imageUrl);
      if (aiData) {
        const detectedTags = aiData.labelAnnotations.map((label: any) => label.description);
        setTags(detectedTags);
      }
    };
    fetchTags();
  }, [imageUrl]);

  return (
    <div className="photo-ai-tags">
      <strong>AI Tags:</strong>
      {tags.length > 0 ? (
        <ul>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : (
        <p>Analyzing...</p>
      )}
    </div>
  );
};

export default PhotoAIAnalyzer;
