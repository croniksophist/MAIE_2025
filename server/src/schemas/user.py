# src/schemas/user.py
from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str  # Required for creating a user

class User(UserBase):
    id: int

    class Config:
        orm_mode = True  # Allow ORM model to be converted to Pydantic model
