from fastapi import APIRouter
from services.aws_s3_service import list_s3_images

router = APIRouter()

@router.get("/s3-images")
async def get_s3_images(bucket_name: str):
    """
    Endpoint to fetch image URLs from an S3 bucket.
    :param bucket_name: S3 Bucket name
    :return: List of image URLs
    """
    image_urls = list_s3_images(bucket_name)
    if image_urls:
        return {"image_urls": image_urls}
    else:
        return {"message": "No images found or error occurred"}
