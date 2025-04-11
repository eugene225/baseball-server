from fastapi import FastAPI, Request, HTTPException
from app.crawling.rank import get_kbo_rank
from fastapi.middleware.cors import CORSMiddleware
import time
from app.utils.logger import logger
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from app.llm.open_ai import generate_game_review

app = FastAPI(
    title="My Baseball API",
    description="baseball app 에서 사용되는 데이터 관련 api를 제공합니다.",
    version="1.0.0",
    docs_url="/docs"
)

# 요청 로깅 미들웨어
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # 요청 정보 로깅
    logger.info(f"Request: {request.method} {request.url}")
    logger.info(f"Headers: {dict(request.headers)}")
    logger.info(f"Query params: {dict(request.query_params)}")
    
    response = await call_next(request)
    
    # 응답 시간 로깅
    process_time = time.time() - start_time
    logger.info(f"Response time: {process_time:.2f} seconds")
    logger.info(f"Response status: {response.status_code}")
    
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001", "http://52.65.47.31:5000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/kbo/rank")
def read_kbo_rank():
    return get_kbo_rank()

class ReviewRequest(BaseModel):
    rating: float = Field(..., ge=0.0, le=5.0, multiple_of=0.5)  # 0.5 단위로 0.5부터 5.0까지
    team: str
    opponent: str
    game_date: date
    additional_notes: Optional[str] = None

@app.post("/game/review")
async def generate_game_review_endpoint(request: ReviewRequest):
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
