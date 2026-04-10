from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from config.db import get_db
from services.auth_service import register_user, login_user
from models.schemas import RegisterRequest, RegisterResponse, UserResponse, LoginRequest, LoginResponse

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=RegisterResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    user, token = register_user(db, request.name, request.email, request.password)
    return RegisterResponse(
        token=token,
        user=UserResponse(
            _id=user.id,
            name=user.name,
            email=user.email
        )
    )

@router.post("/login", status_code=status.HTTP_200_OK, response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user, token = login_user(db, request.email, request.password)
    return LoginResponse(
        token=token,
        user=UserResponse(
            _id=user.id,
            name=user.name,
            email=user.email
        )
    )
