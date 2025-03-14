from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Boolean, Text, Float
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

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    hashed_password = Column(String(128), nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)

    # Relationship with projects
    projects = relationship("Project", back_populates="owner")
    reviews = relationship("Review", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"

# Project model
class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))  # Foreign key linking to User

    # Relationships
    owner = relationship("User", back_populates="projects")
    media_files = relationship("MediaFile", back_populates="project")
    plugins = relationship("Plugin", secondary="project_plugins", back_populates="projects")
    reviews = relationship("Review", back_populates="project")

    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name}, owner_id={self.owner_id})>"

# Media File model
class MediaFile(Base):
    __tablename__ = 'media_files'  # Stores media files related to projects

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False, index=True)  # File name
    s3_key = Column(String(255), nullable=False)  # S3 storage key
    upload_date = Column(DateTime, default=datetime.utcnow)
    project_id = Column(Integer, ForeignKey('projects.id'))  # Foreign key linking to Project

    # Relationship with Project model
    project = relationship("Project", back_populates="media_files")

    # Relationship with AI tags
    ai_tags = relationship("AITag", back_populates="media_file")

    def __repr__(self):
        return f"<MediaFile(id={self.id}, filename={self.filename}, project_id={self.project_id})>"

# AI Tag model
class AITag(Base):
    __tablename__ = 'ai_tags'

    id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String(100), nullable=False, index=True)

    # Foreign key linking to MediaFile
    media_file_id = Column(Integer, ForeignKey('media_files.id'))
    media_file = relationship("MediaFile", back_populates="ai_tags")

    def __repr__(self):
        return f"<AITag(id={self.id}, tag_name={self.tag_name}, media_file_id={self.media_file_id})>"

# Plugin model
class Plugin(Base):
    __tablename__ = 'plugins'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String)
    type = Column(String, nullable=False)  # e.g., Video Editing, Audio Processing, etc.
    price = Column(String, nullable=False)
    compatibility = Column(String)
    installable = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Changed from Integer to Float for more precise rating
    rating = Column(Float, default=0.0)

    # Many-to-many relationship with projects
    projects = relationship("Project", secondary="project_plugins", back_populates="plugins")
    reviews = relationship("Review", back_populates="plugin")

    def __repr__(self):
        return f"<Plugin(id={self.id}, name={self.name}, type={self.type}, price={self.price}, rating={self.rating})>"

# Association table for many-to-many relationship between Project and Plugin
class ProjectPlugins(Base):
    __tablename__ = 'project_plugins'

    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), primary_key=True)
    plugin_id = Column(Integer, ForeignKey('plugins.id', ondelete='CASCADE'), primary_key=True)

    # Added these relationships to match the paste example
    project = relationship("Project", back_populates="plugins_association")
    plugin = relationship("Plugin", back_populates="projects_association")

    def __repr__(self):
        return f"<ProjectPlugins(project_id={self.project_id}, plugin_id={self.plugin_id})>"

# Review model for plugin ratings
class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)  # Rating out of 5
    review_text = Column(Text, nullable=True)  # Optional review text
    created_at = Column(DateTime, default=datetime.utcnow)

    # Foreign keys for user, plugin, and project
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    plugin_id = Column(Integer, ForeignKey('plugins.id'), nullable=False)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=True)  # Optional project association

    # Relationships
    user = relationship("User", back_populates="reviews")
    plugin = relationship("Plugin", back_populates="reviews")
    project = relationship("Project", back_populates="reviews")

    def __repr__(self):
        return f"<Review(id={self.id}, rating={self.rating}, user_id={self.user_id}, plugin_id={self.plugin_id})>"

# Function to create tables
def init_db():
    Base.metadata.create_all(bind=engine)