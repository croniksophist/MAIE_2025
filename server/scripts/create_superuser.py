import os
from sqlalchemy.orm import sessionmaker
from server.models.user import User
from passlib.context import CryptContext
from server.database import SessionLocal
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize CryptContext for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_superuser():
    """Create a superuser account with a hashed password."""
    session = SessionLocal()

    # Get input for admin email and password
    email = input("Enter admin email: ")
    password = input("Enter admin password: ")

    try:
        # Check if the user already exists
        if session.query(User).filter_by(email=email).first():
            print("Superuser already exists.")
        else:
            # Hash the password
            hashed_password = pwd_context.hash(password)
            superuser = User(email=email, hashed_password=hashed_password, is_admin=True)

            # Add to session and commit
            session.add(superuser)
            session.commit()
            print(f"Superuser {email} created successfully.")
    except SQLAlchemyError as e:
        # Catch database errors
        print(f"Error creating superuser: {str(e)}")
        session.rollback()
    finally:
        # Close the session
        session.close()

if __name__ == "__main__":
    create_superuser()
