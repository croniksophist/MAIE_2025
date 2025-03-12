import sys
import os
import logging
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, BackgroundTasks
import aioboto3
from typing import List
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
from uuid import uuid4
from datetime import datetime

# Add the src directory to sys.path (assuming your structure is server/src)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

# Import necessary models and services
from src.models.models import SessionLocal, Project as ProjectModel  # Ensure this path matches your structure
from src.schemas.project import Project as ProjectSchema  # Correct schema import
from src.services.projects_service import ProjectsService  # Import the service for project-related logic

# Helper function to get the database session
def get_db():
    db = SessionLocal()  # Create a new session from the sessionmaker
    try:
        yield db
    finally:
        db.close()  # Close the session when done

# Load environment variables from .env file
load_dotenv()
DB_CONNECTION_STRING = os.getenv('DB_CONNECTION_STRING')

# Configure AWS credentials from environment variables
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION_NAME = os.getenv("AWS_REGION_NAME")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# Initialize FastAPI app
app = FastAPI()

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

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# CORS Handling (Enable CORS for the frontend URL during development and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend URL (React app during development)
        "https://your-frontend.com",  # Production frontend URL (replace with actual)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Directory to store uploaded files (optional, can be modified for direct S3 upload)
UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# File Upload Helper Function (Asynchronous)
async def upload_to_s3(file: UploadFile, file_path: str):
    """Upload file to S3 asynchronously."""
    try:
        async with get_s3_client() as s3:
            await s3.upload_fileobj(file.file, S3_BUCKET_NAME, file.filename)
        logger.info(f"File {file.filename} uploaded to S3 successfully.")
    except Exception as e:
        logger.error(f"Error uploading file {file.filename} to S3: {e}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# Upload file endpoint (with AI processing simulation)
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Simulate AI processing after file upload."""
    # Save the file locally (you can modify this to upload to S3 if needed)
    file_path = os.path.join(UPLOAD_DIR, f"{uuid4()}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Simulate AI processing response (replace with actual AI logic)
    ai_response = {
        "filename": file.filename,
        "analysis": "AI detected a high-action scene with fast transitions.",
    }

    return ai_response

# Upload file to AWS S3 with error handling and file type validation
@app.post("/uploadfile/")  # Corrected the route, to avoid conflicting with other endpoints
async def create_upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Validate file type and upload to S3 in the background."""
    allowed_file_types = ["image/jpeg", "image/png", "application/pdf"]  # Add more as needed
    if file.content_type not in allowed_file_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_file_types)}"
        )
    
    # Add S3 upload task to the background
    background_tasks.add_task(upload_to_s3, file, file.filename)
    return {"filename": file.filename, "message": "Upload started in the background", "success": True}

# Dependency Injection for ProjectService
def get_project_service(db: Session = Depends(get_db)):
    return ProjectsService(db)

# Create a new project
@app.post("/projects/", response_model=ProjectSchema)
async def create_project(project: ProjectSchema, project_service: ProjectsService = Depends(get_project_service)):
    """Create a new project."""
    try:
        new_project = project_service.create_project(
            name=project.name,
            description=project.description
        )
        return new_project
    except Exception as e:
        logger.error(f"Failed to create project: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create project: {str(e)}"
        )

# Get list of all projects
@app.get("/projects/", response_model=List[ProjectSchema])
async def get_projects(project_service: ProjectsService = Depends(get_project_service)):
    """Retrieve a list of all projects."""
    try:
        projects = project_service.get_projects()
        return projects
    except Exception as e:
        logger.error(f"Failed to fetch projects: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch projects: {str(e)}"
        )
