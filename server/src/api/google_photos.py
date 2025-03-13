import requests
from fastapi import HTTPException

# Google Photos API endpoint
GOOGLE_PHOTOS_API_URL = "https://photoslibrary.googleapis.com/v1/mediaItems:search"

# Function to fetch image URLs from Google Photos
def fetch_google_photos(access_token: str):
    """
    Fetch image URLs from Google Photos using the provided OAuth access token.
    :param access_token: OAuth access token for Google Photos
    :return: List of image URLs
    """
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    
    # Request payload (this can be modified to filter based on specific albums, media types, etc.)
    payload = {
        "pageSize": 100,  # Fetch up to 100 items, modify as needed
        "filters": {
            "mediaTypeFilter": {
                "mediaTypes": ["PHOTO"]  # Only fetch photos, you can add VIDEO if needed
            }
        }
    }
    
    try:
        # Make the request to Google Photos API
        response = requests.post(GOOGLE_PHOTOS_API_URL, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch Google Photos.")
        
        # Parse the response to extract image URLs
        data = response.json()
        image_urls = []

        # Check if the response contains media items
        if "mediaItems" in data:
            for item in data["mediaItems"]:
                image_urls.append(item["baseUrl"] + "=w600-h400")  # You can modify the size (w600-h400) as needed
        
        return image_urls
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Google Photos: {str(e)}")
