from fastapi import APIRouter, HTTPException
from app.llm.open_ai import analyze_review, ReviewRequest, StickerResponse
from app.utils.logger import logger

router = APIRouter(prefix="/game/review", tags=["Game Review"])

@router.post("/analyze", response_model=StickerResponse)
def post_analyze_review(request: ReviewRequest):
    try:
        response = analyze_review(request)
        return response
    except Exception as e:
        logger.error(f"Error analyzing review: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))