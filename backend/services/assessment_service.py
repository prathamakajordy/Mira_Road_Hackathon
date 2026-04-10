from sqlalchemy.orm import Session
from models.assessment import Assessment


def create_assessment(
    db: Session,
    user_id: str,
    input_data: dict,
    prediction: str,
    risk_score: float,
) -> Assessment:
    """Persist a new assessment record tied to the given user_id."""
    record = Assessment(
        user_id=user_id,
        input_data=input_data,
        prediction=prediction,
        risk_score=risk_score,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_user_assessments(db: Session, user_id: str) -> list[Assessment]:
    """Return all assessments for user_id, newest first. Never leaks other users' data."""
    return (
        db.query(Assessment)
        .filter(Assessment.user_id == user_id)
        .order_by(Assessment.created_at.desc())
        .all()
    )
