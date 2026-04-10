import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON
from config.db import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    input_data = Column(JSON, nullable=False)
    prediction = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
