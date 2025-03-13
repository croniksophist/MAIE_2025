from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from server.database import SessionLocal
from server.models.user import User

# Initialize Firebase Admin SDK (ensure this only runs once)
if not firebase_admin._apps:
    cred = credentials.Certificate("path/to/your/firebase/credentials.json")  # Path to your Firebase Admin SDK credentials
    firebase_admin.initialize_app(cred)

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

auth_router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Function to verify Firebase ID Token
def verify_firebase_token(id_token: str):
    try:
        # Verify the Firebase ID token
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token  # This contains the UID and other claims
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Expired Firebase token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying Firebase token: {str(e)}")

# Register new user - No change required here
@auth_router.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(password)
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = User(email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

# Login using Firebase token
@auth_router.post("/login")
def login(id_token: str, db: Session = Depends(get_db)):
    # Verify the Firebase token
    decoded_token = verify_firebase_token(id_token)
    user_email = decoded_token.get("email")  # Get the email from the decoded token

    # Check if user exists in the database
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate an access token for the user to use with your API
    token = create_access_token({"sub": user.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}

# Fetch profile data
@auth_router.get("/profile")
def get_profile(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"email": user.email, "is_admin": user.is_admin}
