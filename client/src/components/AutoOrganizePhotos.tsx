import React, { useState } from "react";
import { categorizePhotos } from "../services/photoCategorization";

const AutoOrganizePhotos: React.FC<{ photoUrls: string[] }> = ({ photoUrls }) => {
  const [categorizedImages, setCategorizedImages] = useState<{ [key: string]: string[] }>({});

  const handleOrganize = async () => {
    const categorized = await categorizePhotos(photoUrls);
    setCategorizedImages(categorized);
  };

  return (
    <div className="auto-organize">
      <button onClick={handleOrganize}>Auto-Organize Photos</button>

      {Object.keys(categorizedImages).length > 0 && (
        <div className="organized-results">
          {Object.entries(categorizedImages).map(([category, images]) => (
            <div key={category}>
              <h3>{category}</h3>
              <ul>
                {images.map((url) => (
                  <li key={url}>
                    <img src={url} alt={category} width="100" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoOrganizePhotos;
