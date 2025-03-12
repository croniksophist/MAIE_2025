# src/models/user.py
from sqlalchemy import Column, Integer, String
from src.db.base_class import Base  # Base class for SQLAlchemy models

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
