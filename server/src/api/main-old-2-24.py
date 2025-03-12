import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
import os
from fastapi import FastAPI, UploadFile, File, Depends
import boto3
from typing import List
from src.models.models import Project, Session
from services.projects_service import ProjectsService
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Configure AWS credentials from environment variables
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION_NAME = os.getenv("AWS_REGION_NAME")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# Initialize S3 client using Boto3
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION_NAME,
)

# Initialize FastAPI app
app = FastAPI()

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

# Helper function for DB session management
def get_db():   
    db = Session()  # Creates Database session
    try:
        yield db
    finally:
        db.close()

# Upload file to AWS S3
@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    try:
        s3_client.upload_fileobj(
            file.file, 
            S3_BUCKET_NAME, 
            file.filename
        )
        return {"filename": file.filename, "message": "Upload successful!"}
    except Exception as e:
        return {"message": "Upload failed!", "error": str(e)}

# Create a new project
@app.post("/projects/", response_model=Project)
async def create_project(project: Project, db: Session = Depends(get_db)):
    projects_service = ProjectsService(db)
    new_object_output = projects_service.create_project(name=project.name, description=project.description)
    return new_object_output

# Get list of all projects
@app.get("/projects/", response_model=List[Project])
async def get_projects(db: Session = Depends(get_db)):
    project_service = ProjectsService(db)
    get_list_all_http_results = project_service.get_projects()
    return get_list_all_http_results
