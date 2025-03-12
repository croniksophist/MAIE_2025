export const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE";
export const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";

export const getGoogleAuthURL = () => {
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
