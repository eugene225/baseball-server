import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine
from app.schedule.model.game_schedule import Base
from app.utils.logger import logger
from app.batch.game_schedule_batch_scheduler import start_schedule_task
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import asyncio

app = FastAPI(
    title="My Baseball API",
    description="baseball app 에서 사용되는 데이터 관련 api를 제공합니다.",
    version="1.0.0",
    docs_url="/docs"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001", "https://haengbokza.site"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.on_event("startup")
async def on_startup():
    await init_db()

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

# 전역 예외 핸들러
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    logger.error(f"Request URL: {request.url}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error. Please try again later."},
    )

@app.get("/")
def read_root():
    return {"Hello": "World"}

from app.routes import schedule, rank, review
app.include_router(schedule.router)
app.include_router(rank.router)
app.include_router(review.router)

# DB 테이블 생성
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)