// src/components/ImageGallery.tsx
import React, { useState, useEffect } from 'react';
import { fetchS3Images, fetchGooglePhotos } from '../api/imageApi'; // Import API functions

// Define types for the state
interface ImageGalleryState {
  s3Images: string[];
  googlePhotosImages: string[];
  loading: boolean;
}

const ImageGallery: React.FC = () => {
  const [state, setState] = useState<ImageGalleryState>({
    s3Images: [],
    googlePhotosImages: [],
    loading: true,
  });

  useEffect(() => {
    const loadImages = async () => {
      const s3BucketName = 'your-s3-bucket-name';
      const googleAccessToken = 'your-google-access-token'; // Replace with actual token

      try {
        const fetchedS3Images = await fetchS3Images(s3BucketName);
        const fetchedGooglePhotos = await fetchGooglePhotos(googleAccessToken);

        setState({
          s3Images: fetchedS3Images,
          googlePhotosImages: fetchedGooglePhotos,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching images:", error);
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    loadImages();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (state.loading) {
    return <div>Loading images...</div>;
  }

  return (
    <div>
      <h2>S3 Images</h2>
      <div>
        {state.s3Images.length > 0 ? (
          state.s3Images.map((image, index) => (
            <img key={index} src={image} alt={`S3 image ${index}`} />
          ))
        ) : (
          <p>No images found in S3</p>
        )}
      </div>

      <h2>Google Photos</h2>
      <div>
        {state.googlePhotosImages.length > 0 ? (
          state.googlePhotosImages.map((image, index) => (
            <img key={index} src={image} alt={`Google Photo ${index}`} />
          ))
        ) : (
          <p>No images found in Google Photos</p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
