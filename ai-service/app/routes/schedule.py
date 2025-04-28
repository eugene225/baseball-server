from fastapi import APIRouter, Query
from datetime import datetime
from app.database.db import get_db
from app.crawling.schedule import get_kbo_schedule
from app.schedule.service.game_schedule_service import GameScheduleService
from fastapi.concurrency import run_in_threadpool

router = APIRouter(prefix="/kbo/schedule", tags=["KBO Schedule"])

@router.get("/")
async def read_kbo_schedule(
    year: int = Query(datetime.today().year, description="예: 2024"),
    month: int = Query(datetime.today().month, ge=1, le=12, description="예: 4")
):
    return await run_in_threadpool(get_kbo_schedule, year, month)

@router.post("/{year}/{month}")
def save_kbo_schedule(year: int, month: int):
    with get_db() as db:
        service = GameScheduleService(db)
        result = service.save_game_schedule(year, month)
        return {"success": result}