// src/services/googlePhotos.ts

import axios from 'axios';

const API_URL = "https://photoslibrary.googleapis.com/v1/mediaItems";

export const fetchGooglePhotos = async (accessToken: string): Promise<any[]> => {
  if (!accessToken) {
    console.error("Access token is required");
    return [];
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.mediaItems || [];
  } catch (error) {
    console.error("Google Photos API Error:", error);
    return [];
  }
};
