from fastapi import APIRouter, Query, Depends
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.crawling.schedule import get_kbo_schedule
from app.schedule.service.game_schedule_service import GameScheduleService
import logging

router = APIRouter(prefix="/kbo/schedule", tags=["KBO Schedule"])

@router.get("")
@router.get("/")
async def read_kbo_schedule(
    year: int = Query(datetime.today().year, description="예: 2024"),
    month: int = Query(datetime.today().month, ge=1, le=12, description="예: 4"),
    day: int = Query(None, ge=1, le=31, description="예: 15"),
    db: Session = Depends(get_db)
):
    service = GameScheduleService(db)
    schedules = await service.get_game_schedule(year, month, day)
    return schedules

@router.post("/{year}/{month}")
async def save_kbo_schedule(
    year: int, 
    month: int,
    db: Session = Depends(get_db)
):
    service = GameScheduleService(db)
    schedule_data = await get_kbo_schedule(year, month)
    result = await service.save_game_schedule_in_db(year, month, schedule_data["data"])
    return result