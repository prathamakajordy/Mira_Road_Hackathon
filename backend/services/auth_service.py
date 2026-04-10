from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user import User
from utils.security import get_password_hash, create_access_token, verify_password

def register_user(db: Session, name: str, email: str, password: str):
    # Normalize email
    normalized_email = email.lower().strip()

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": True,
                "message": "Email already exists",
                "code": "EMAIL_EXISTS",
                "field": "email"
            }
        )

    # Hash password
    hashed_password = get_password_hash(password)

    # Create user in DB
    new_user = User(
        name=name,
        email=normalized_email,
        password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT token with user_id
    token = create_access_token(data={"sub": new_user.id})

    return new_user, token

def login_user(db: Session, email: str, password: str):
    # Normalize email
    normalized_email = email.lower().strip()

    # Fetch user
    user = db.query(User).filter(User.email == normalized_email).first()

    # Verify user exists and password matches
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": True,
                "message": "Invalid email or password",
                "code": "INVALID_CREDENTIALS"
            }
        )

    # Generate JWT token
    token = create_access_token(data={"sub": user.id})

    return user, token
