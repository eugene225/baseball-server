import os
import json
import re
import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.crawling.schedule import get_kbo_schedule
from app.schedule.model.game_schedule import GameSchedule

class GameScheduleService:
    MATCH_WITH_SCORE_PATTERN = re.compile(r"([가-힣A-Z]+)(\d+)vs(\d+)([가-힣A-Z]+)")
    MATCH_NO_SCORE_PATTERN = re.compile(r"([가-힣A-Z]+)vs([가-힣A-Z]+)")

    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_game_schedule(self, year: int, month: int) -> dict:
        try:
            # 1. 크롤링 정보 가져오기
            schedule_data = get_kbo_schedule(year, month)

            # 2. yyyy-mm.json 파일 경로 설정
            file_name = f"{year}-{month:02d}.json"
            file_path = os.path.join("data", file_name)

            # 3. 파일이 있는지 확인
            if os.path.exists(file_path):
                with open(file_path, "r") as file:
                    existing_data = json.load(file)

                if existing_data == schedule_data:
                    return {"success": False, "message": "No changes in the schedule data"}

                with open(file_path, "w") as file:
                    json.dump(schedule_data, file)
                    await self.delete_game_schedule_in_db(year, month)
                    await self.save_game_schedule_in_db(year, month, schedule_data["data"])
                    return {"success": True, "message": "Data updated successfully"}

            else:
                with open(file_path, "w") as file:
                    json.dump(schedule_data, file)
                print(f"Data : {schedule_data}")
                await self.save_game_schedule_in_db(year, month, schedule_data["data"])
                return {"success": True, "message": "Data saved successfully"}

        except Exception as e:
            logging.error(f"Error saving game schedule: {e}")
            return {"success": False, "message": str(e)}

    async def delete_game_schedule_in_db(self, year: int, month: int) -> bool:
        try:
            start_date = datetime(year, month, 1)
            end_month = month + 1 if month < 12 else 1
            end_year = year if month < 12 else year + 1
            end_date = datetime(end_year, end_month, 1)

            deleted = await self.db.execute(
                GameSchedule.__table__.delete().where(
                    GameSchedule.date >= start_date,
                    GameSchedule.date < end_date
                )
            )
            return deleted.rowcount > 0
        except Exception as e:
            logging.error(f"Error deleting game schedule: {e}")
            return False

    async def save_game_schedule_in_db(self, year: int, month: int, schedule_data: list):
        try:
            batch = []
            for schedule in schedule_data:
                convertDate = self.convert_to_yyyymmdd(schedule["날짜"], year)
                match_str = schedule["경기"]
                home_team, home_score, away_score, away_team = self.parse_match_info(match_str)

                game_schedule = GameSchedule(
                    date=datetime.strptime(convertDate, "%Y-%m-%d"),
                    time=schedule["시간"],
                    home_team=home_team,
                    away_team=away_team,
                    home_score=home_score,
                    away_score=away_score,
                    stadium=schedule["구장"],
                    tv=schedule["TV"]
                )
                batch.append(game_schedule)

                if len(batch) >= 70:
                    self.db.bulk_save_objects(batch)
                    batch = []

            if batch:
                self.db.bulk_save_objects(batch)
        except Exception as e:
            logging.error(f"Error updating schedule in DB: {e}")
            raise

    def convert_to_yyyymmdd(self, date_str: str, year: int) -> str:
        try:
            date_part = date_str.split('(')[0].strip()
            month, day = map(int, date_part.split('.'))
            return f"{year}-{month:02d}-{day:02d}"
        except ValueError as e:
            logging.error(f"Invalid date format: {date_str}")
            raise ValueError(f"Invalid date format: {date_str}")

    def parse_match_info(self, match_str: str):
        if not isinstance(match_str, str) or not match_str.strip():
            return None, None, None, None

        if re.search(r"\d", match_str):
            match = self.MATCH_WITH_SCORE_PATTERN.match(match_str)
            if match:
                home_team, home_score, away_score, away_team = match.groups()
                return home_team, int(home_score), int(away_score), away_team
        else:
            match = self.MATCH_NO_SCORE_PATTERN.match(match_str)
            if match:
                home_team, away_team = match.groups()
                return home_team, None, None, away_team

        logging.error(f"Invalid match format: {match_str}")
        raise ValueError(f"Invalid match format: {match_str}")
