const API_URL = "https://photoslibrary.googleapis.com/v1/mediaItems";

export const fetchGooglePhotos = async (accessToken: string) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch Google Photos");

    const data = await response.json();
    return data.mediaItems || [];
  } catch (error) {
    console.error("Google Photos API Error:", error);
    return [];
  }
};
