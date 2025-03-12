# src/models/project.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base_class import Base
from src.models.user import User  # Importing the SQLAlchemy User model here, no schema import

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="projects")  # Assuming User has a relationship with Project
