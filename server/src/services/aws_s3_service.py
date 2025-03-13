import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from typing import List

# Initialize S3 Client
s3_client = boto3.client(
    's3',
    aws_access_key_id='your-aws-access-key',
    aws_secret_access_key='your-aws-secret-key',
    region_name='your-region'
)

def list_s3_images(bucket_name: str) -> List[str]:
    """
    List all image URLs in the given S3 bucket.
    :param bucket_name: S3 Bucket name
    :return: List of image URLs
    """
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        image_urls = []

        if 'Contents' in response:
            for obj in response['Contents']:
                if obj['Key'].endswith(('.jpg', '.jpeg', '.png', '.gif')):  # Image file extensions
                    image_url = f"https://{bucket_name}.s3.amazonaws.com/{obj['Key']}"
                    image_urls.append(image_url)
        
        return image_urls
    except (NoCredentialsError, PartialCredentialsError) as e:
        print(f"Error accessing S3: {e}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

