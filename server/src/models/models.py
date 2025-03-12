from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DB_CONNECTION_STRING", "sqlite:///./test.db")  # Default to SQLite if not set

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Import Base from the correct location
from src.models.base import Base  # Import Base from user.py where declarative_base() is defined

# User model for authentication
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)

    # Relationship with projects
    projects = relationship("Project", back_populates="owner")

# Project model
class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))  # Foreign key linking to User

    # Relationships
    owner = relationship("User", back_populates="projects")
    media_files = relationship("MediaFile", back_populates="project")

# Media File model
class MediaFile(Base):
    __tablename__ = 'media_files'  # Stores media files related to projects

    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)  # File name
    s3_key = Column(String(255), nullable=False)  # S3 storage key
    upload_date = Column(DateTime, default=datetime.utcnow)
    project_id = Column(Integer, ForeignKey('projects.id'))  # Foreign key linking to Project

    # Relationship with Project model
    project = relationship("Project", back_populates="media_files")

    # Relationship with AI tags
    ai_tags = relationship("AITag", back_populates="media_file")

# AI Tag model
class AITag(Base):
    __tablename__ = 'ai_tags'

    id = Column(Integer, primary_key=True)
    tag_name = Column(String(100), nullable=False)

    # Foreign key linking to MediaFile
    media_file_id = Column(Integer, ForeignKey('media_files.id'))
    media_file = relationship("MediaFile", back_populates="ai_tags")

# Function to create tables
def init_db():
    Base.metadata.create_all(bind=engine)
