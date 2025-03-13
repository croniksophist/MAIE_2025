# server/src/routers/review.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.models.models import Review, Plugin, User
from src.schemas.review import ReviewCreate, ReviewResponse
from src.models.models import SessionLocal

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Add a review for a plugin
@router.post("/reviews/", response_model=ReviewResponse)
async def add_review(review: ReviewCreate, db: Session = Depends(get_db)):
    # Validate that the plugin exists
    plugin = db.query(Plugin).filter(Plugin.id == review.plugin_id).first()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")

    # Create and store the new review
    db_review = Review(
        rating=review.rating,
        review_text=review.review_text,
        plugin_id=review.plugin_id,
        user_id=review.user_id,  # Assuming user_id comes from the authenticated session
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review

# Get all reviews for a specific plugin
@router.get("/reviews/{plugin_id}", response_model=list[ReviewResponse])
async def get_reviews(plugin_id: int, db: Session = Depends(get_db)):
    # Retrieve reviews for the plugin
    reviews = db.query(Review).filter(Review.plugin_id == plugin_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this plugin")
    
    return reviews
