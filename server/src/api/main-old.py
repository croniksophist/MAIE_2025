# api/main.py
import os
from fastapi import FastAPI, UploadFile, File, Depends
import boto3
from typing import List
from models.models import Project, Session # Use the model that comes in the data service call.
from services.projects_service import ProjectsService

# Configure AWS credentials (best to use environment variables)
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION_NAME = os.environ.get("AWS_REGION_NAME")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION_NAME,
)  # establishes a S3 Client Connection using BOTO3

# Initialize FastAPI - Can reference earlier files that does this for use. This example has full structure and framework deployment to a point
app = FastAPI()

# Helper Function dependency that creates and manages session for use
def get_db():   # db connects using
   db = Session() # Creates Database on that Session

      # anything happens, return, if api ends, db connections must terminate
   try:
       yield db
   finally: # happens at end regardless is failed for DB
        db.close()

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    try:
        s3_client.upload_fileobj(
            file.file, #
            S3_BUCKET_NAME, # bucket storage container, should store in cloud environment for safety. Can get hacked by people if  .gith ignore.
            file.filename # transfer original or modify using new key for uploaded and processing.
        )
        return {"filename": file.filename, "message": "Upload successful!"}
    except Exception as e:
        print(e)
        return {"message": "Upload failed!", "error": str(e)}


@app.post("/projects/", response_model=Project) # Create a project and pushes to an AWS server after database object creates it.  It must go to services object for scalability.
async def create_project(project: Project,db: Session = Depends(get_db) ):
    projects_service = ProjectsService(db)      # connect with DB sessions object, created with fastapi endpoints http request methods" object (gets request response after  creating upload. Then can have AI Class run, and uploads to client. Upload example shows 51.755 and the cloud)

    new_object_output= projects_service.create_project(name=project.name, description=project.description)
    # can transfer data from the object class and it is JSON upload and process to services.

    # returns HTTP and data
    return new_object_output

# FastAPI endpoint GET listing all "Rows" from database, no parameters since GET

# creates object object to return the value
@app.get("/projects/", response_model=List[Project])
async def get_projects(db: Session = Depends(get_db)):    # The fastAPI route and what we intend upload video content from what user shares" file transfer to "AI Class with sample model". This
        # connect "API + AI uploads, the client can be used on Boto functions and external cloud as  a model call

    project_service = ProjectsService(db)

    get_list_all_http_results = project_service.get_projects()

    # "get/read api command. HTTP Get uploads, read and sends API. BOTO class is used here"""""The
    return get_list_all_http_results