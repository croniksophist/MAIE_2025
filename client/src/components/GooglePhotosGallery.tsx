import React, { useState, useEffect } from "react";
import { fetchGooglePhotos } from "../services/googlePhotos";
import PhotoAIAnalyzer from "./PhotoAIAnalyzer";

interface GooglePhotosGalleryProps {
  accessToken: string;
  filteredTags: string[]; // New prop for filtered tags
}

const GooglePhotosGallery: React.FC<GooglePhotosGalleryProps> = ({ accessToken, filteredTags }) => {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const images = await fetchGooglePhotos(accessToken);
      setPhotos(images);
    };
    loadPhotos();
  }, [accessToken]);

  // Filter photos based on tags (simple string matching)
  const filteredPhotos = photos.filter(photo =>
    filteredTags.some(tag => photo.filename.toLowerCase().includes(tag.toLowerCase()))
  );

  return (
    <div className="photo-gallery">
      {filteredPhotos.length === 0 ? (
        <p>No photos found.</p>
      ) : (
        filteredPhotos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <img src={photo.baseUrl} alt={photo.filename} className="photo-thumbnail" />
            <PhotoAIAnalyzer imageUrl={photo.baseUrl} /> {/* Optional AI analysis component */}
          </div>
        ))
      )}
    </div>
  );
};

export default GooglePhotosGallery;
