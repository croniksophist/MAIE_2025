const CLOUD_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key=YOUR_GOOGLE_API_KEY";

export const analyzeImage = async (imageUrl: string) => {
  try {
    const response = await fetch(CLOUD_VISION_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { source: { imageUri: imageUrl } },
            features: [
              { type: "LABEL_DETECTION" },  // Detect objects
              { type: "FACE_DETECTION" },   // Detect faces
              { type: "TEXT_DETECTION" },   // Detect text
            ],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("AI analysis failed");

    const data = await response.json();
    return data.responses[0];  // Return AI-generated insights
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};
