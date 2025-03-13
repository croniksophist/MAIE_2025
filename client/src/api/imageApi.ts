// src/api/imageApi.ts
import axios from 'axios';

// Fetch images from S3 bucket
export const fetchS3Images = async (bucketName: string): Promise<string[]> => {
  try {
    const response = await axios.get(`/s3-images?bucket_name=${bucketName}`);
    return response.data.image_urls;
  } catch (error) {
    console.error("Error fetching S3 images:", error);
    return [];
  }
};

// Fetch images from Google Photos using OAuth access token
export const fetchGooglePhotos = async (accessToken: string): Promise<string[]> => {
  try {
    const response = await axios.get(`/google-photos?access_token=${accessToken}`);
    return response.data.image_urls;
  } catch (error) {
    console.error("Error fetching Google Photos:", error);
    return [];
  }
};
