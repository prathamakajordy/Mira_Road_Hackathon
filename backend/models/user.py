import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from config.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    simpleMode = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    lastLogin = Column(DateTime, nullable=True)
