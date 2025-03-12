import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

# Get the database URL from environment variables
DATABASE_URL = os.getenv("DB_CONNECTION_STRING", "sqlite:///./maie.db")  # Default to SQLite if not set

# Create the database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model class for SQLAlchemy models
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

# Function to create the database tables
def init_db():
    import models  # Import models here to ensure they're loaded
    Base.metadata.create_all(bind=engine)
