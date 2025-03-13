import aioboto3
from fastapi import HTTPException
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# S3 Configuration
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION_NAME = os.getenv("AWS_REGION_NAME")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# AWS S3 Client initialization using aioboto3
async def get_s3_client():
    """Return an S3 client."""
    session = aioboto3.Session()
    return await session.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION_NAME,
    )

# Function to fetch image URLs from the S3 bucket
async def fetch_s3_images(bucket_name: str):
    """
    Fetch image URLs from an S3 bucket.
    :param bucket_name: Name of the S3 bucket
    :return: List of image URLs
    """
    try:
        async with get_s3_client() as s3:
            # List objects in the S3 bucket
            response = await s3.list_objects_v2(Bucket=bucket_name)
            if "Contents" not in response:
                raise HTTPException(status_code=404, detail="No images found in the S3 bucket.")
            
            image_urls = []
            # Iterate over the S3 objects and build image URLs
            for obj in response["Contents"]:
                image_key = obj["Key"]
                image_url = f"https://{bucket_name}.s3.{AWS_REGION_NAME}.amazonaws.com/{image_key}"
                image_urls.append(image_url)
        
        return image_urls
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching S3 images: {str(e)}")
