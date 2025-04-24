from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from app.schedule.service.game_schedule_service import GameScheduleService
from app.database.db import get_db
import logging

logging.basicConfig(level=logging.INFO)
scheduler = BackgroundScheduler()

def start_schedule_task():
    @scheduler.scheduled_job('cron', hour=17, minute=42)
    def scheduled_job():
        logging.info("스케줄 저장 작업 시작")
        try:
            with get_db() as db:
                today = datetime.today()
                service = GameScheduleService(db)
                service.save_game_schedule(today.year, today.month)
        except Exception as e:
            logging.error(f"스케줄 저장 중 오류 발생: {e}")
        finally:
            db.close()
        logging.info("스케줄 저장 작업 완료")

    scheduler.start()