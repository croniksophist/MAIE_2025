"""Script to initialize or migrate databases."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from alembic.config import Config
from alembic import command

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///maie.db")  # Default to SQLite

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def initialize_db():
    """Apply database migrations using Alembic."""
    print("Initializing database...")
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("Database initialization complete.")

if __name__ == "__main__":
    initialize_db()