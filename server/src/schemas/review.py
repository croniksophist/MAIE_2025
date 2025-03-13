# server/src/schemas/review.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema for creating a review
class ReviewCreate(BaseModel):
    rating: int  # Rating out of 5
    review_text: Optional[str] = None  # Optional text for the review
    plugin_id: int  # The ID of the plugin being reviewed

    class Config:
        orm_mode = True

# Schema for review response (when returning review data)
class ReviewResponse(ReviewCreate):
    id: int
    user_id: int
    plugin_id: int
    created_at: datetime

    class Config:
        orm_mode = True
