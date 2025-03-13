# src/api/google_photos_router.py

from fastapi import APIRouter, HTTPException
from src.services.google_photos_service import fetch_google_photos  # Assuming you have this service
from typing import List

router = APIRouter()

@router.get("/google-photos")
async def get_google_photos(access_token: str):
    """
    Endpoint to fetch image URLs from Google Photos.
    :param access_token: Google OAuth access token
    :return: List of image URLs
    """
    try:
        image_urls = await fetch_google_photos(access_token)
        if image_urls:
            return {"image_urls": image_urls}
        else:
            raise HTTPException(status_code=404, detail="No images found or error occurred.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Google Photos: {str(e)}")
