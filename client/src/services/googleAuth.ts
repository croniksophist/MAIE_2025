// src/services/googleAuth.ts

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback";

if (!GOOGLE_CLIENT_ID) {
  console.error("Google Client ID is not set in environment variables");
}

export const getGoogleAuthURL = (): string => {
  const baseURL = "https://accounts.google.com/o/oauth2/auth";
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "token",
    scope: "https://www.googleapis.com/auth/photoslibrary.readonly",
    include_granted_scopes: "true",
  });

  return `${baseURL}?${params.toString()}`;
};
