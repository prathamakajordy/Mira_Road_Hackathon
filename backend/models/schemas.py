from pydantic import BaseModel, EmailStr, Field, model_validator

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirmPassword: str

    @model_validator(mode='after')
    def check_passwords_match(self) -> 'RegisterRequest':
        if self.password != self.confirmPassword:
            raise ValueError('Passwords do not match')
        return self

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    
    model_config = {
        "populate_by_name": True
    }

class RegisterResponse(BaseModel):
    token: str
    user: UserResponse
    savedAssessment: None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user: UserResponse
