# src/schemas/project.py
from pydantic import BaseModel
from typing import Optional

class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass  # You can add more fields if needed for project creation

class Project(ProjectBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True  # Convert ORM model to Pydantic model
