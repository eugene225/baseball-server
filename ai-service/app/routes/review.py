from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from app.llm.open_ai import generate_game_review
from app.utils.logger import logger

router = APIRouter(prefix="/game/review", tags=["Game Review"])

class ReviewRequest(BaseModel):
    rating: float = Field(..., ge=0.0, le=5.0, multiple_of=0.5)
    team: str
    opponent: str
    game_date: date
    additional_notes: Optional[str] = None

@router.post("")
@router.post("/")
def generate_game_review_endpoint(request: ReviewRequest):
    try:
        review = generate_game_review(
            request.rating,
            request.team,
            request.opponent,
            request.game_date.strftime("%Y-%m-%d"),
            request.additional_notes
        )
        return {"review": review}
    except Exception as e:
        logger.error(f"Error generating review: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
