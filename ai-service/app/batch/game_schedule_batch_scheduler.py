from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.executors.asyncio import AsyncIOExecutor
from datetime import datetime
from app.schedule.service.game_schedule_service import GameScheduleService
from app.database.db import get_db
import logging

logging.basicConfig(level=logging.INFO)
scheduler = AsyncIOScheduler(executors={"default": AsyncIOExecutor()})


async def save_schedule_task():
    logging.info("스케줄 저장 작업 시작")
    try:
        with get_db() as db:
            today = datetime.today()
            service = GameScheduleService(db)
            result = await service.save_game_schedule(today.year, today.month)
            logging.info(f"스케줄 저장 결과: {result}")
    except Exception as e:
        logging.error(f"스케줄 저장 중 오류 발생: {e}")
    logging.info("스케줄 저장 작업 완료")


async def scheduled_job():
    logging.info("스케줄러 작업 실행")
    await save_schedule_task()


def start_schedule_task():
    @scheduler.scheduled_job('cron', hour=17, minute=46)
    async def job():
        await scheduled_job()
    scheduler.start()
