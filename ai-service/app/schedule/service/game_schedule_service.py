import logging
import re
from datetime import datetime, date
from sqlalchemy import text, select
from sqlalchemy.orm import Session
from app.schedule.model.game_schedule import GameSchedule

class GameScheduleService:
    MATCH_WITH_SCORE_PATTERN = re.compile(r"([가-힣A-Z]+)(\d+)vs(\d+)([가-힣A-Z]+)")
    MATCH_NO_SCORE_PATTERN = re.compile(r"([가-힣A-Z]+)vs([가-힣A-Z]+)")

    def __init__(self, db: Session):
        self.db = db
        
    async def get_game_schedule(self, year: int, month: int, day: int = None) -> list:
        """
        특정 일(day) 또는 월(month)의 경기 일정을 조회
        """
        try:
            start_date, end_date = self._get_date_range(year, month, day)
            query = text("""
                SELECT * FROM game_schedules 
                WHERE date BETWEEN :start_date AND :end_date
                ORDER BY date, time
            """)
            result = await self.db.execute(query, {"start_date": start_date, "end_date": end_date})
            return result.mappings().all()
        except Exception as e:
            logging.error(f"Error getting game schedule: {e}")
            return []

    async def save_game_schedule_in_db(self, year: int, month: int, schedule_data: list):
        """
        월별 경기 일정을 DB에 저장 또는 갱신
        """
        try:
            start_date, end_date = self._get_date_range(year, month)
            existing_rows = await self._get_existing_schedules(start_date, end_date)
            print("existing_rows", existing_rows)

            existing_map = {
                (row.date, row.time, row.home_team, row.away_team): row
                for row in existing_rows
            }

            incoming_keys = set()

            for schedule in schedule_data:
                game_schedule = self._parse_schedule_item(schedule, year)
                if game_schedule is None:
                    continue

                key = (game_schedule.date, game_schedule.time, game_schedule.home_team, game_schedule.away_team)
                incoming_keys.add(key)

                if key in existing_map:
                    self._update_if_needed(existing_map[key], game_schedule)
                else:
                    self.db.add(game_schedule)

            await self._delete_removed_schedules(existing_map, incoming_keys)
            await self.db.commit()

        except Exception as e:
            logging.error(f"Error updating schedule in DB: {e}")
            raise

    async def delete_game_schedule_in_db(self, year: int, month: int) -> bool:
        """
        월별 경기 일정 삭제
        """
        try:
            start_date, end_date = self._get_date_range(year, month)
            result = await self.db.execute(
                GameSchedule.__table__.delete().where(
                    GameSchedule.date >= start_date,
                    GameSchedule.date < end_date
                )
            )
            await self.db.commit()
            return result.rowcount > 0
        except Exception as e:
            logging.error(f"Error deleting game schedule: {e}")
            return False

    def convert_to_yyyymmdd(self, date_str: str, year: int) -> str:
        """
        'MM.DD(요일)' 형식 문자열을 'YYYY-MM-DD' 형식으로 변환
        """
        try:
            date_part = date_str.split('(')[0].strip()
            month, day = map(int, date_part.split('.'))
            return f"{year}-{month:02d}-{day:02d}"
        except ValueError:
            logging.error(f"Invalid date format: {date_str}")
            raise ValueError(f"Invalid date format: {date_str}")

    def parse_match_info(self, match_str: str):
        """
        경기 문자열을 분석하여 팀과 점수를 추출
        """
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

    # ======= Private Methods =======

    def _get_date_range(self, year: int, month: int, day: int = None) -> tuple[date, date]:
        """
        year, month, day를 받아 시작일과 종료일 범위 계산
        """
        if day:
            start_date = end_date = date(year, month, day)
        else:
            start_date = date(year, month, 1)
            next_month = month + 1 if month < 12 else 1
            next_year = year if month < 12 else year + 1
            end_date = date(next_year, next_month, 1)
        return start_date, end_date

    async def _get_existing_schedules(self, start_date: date, end_date: date) -> list[GameSchedule]:
        """
        DB에서 주어진 날짜 범위의 기존 경기 일정 조회
        """
        result = await self.db.execute(
            select(GameSchedule).where(GameSchedule.date >= start_date, GameSchedule.date < end_date)
        )
        return result.scalars().all()

    def _parse_schedule_item(self, schedule: dict, year: int) -> GameSchedule | None:
        """
        schedule dict를 받아 GameSchedule 객체 생성 (파싱 실패 시 None)
        """
        try:
            convert_date = self.convert_to_yyyymmdd(schedule["날짜"], year)
            date_obj = datetime.strptime(convert_date, "%Y-%m-%d").date()
            time = schedule["시간"]
            home_team, home_score, away_score, away_team = self.parse_match_info(schedule["경기"])

            if not home_team or not away_team:
                return None

            return GameSchedule(
                date=date_obj,
                time=time,
                home_team=home_team,
                away_team=away_team,
                home_score=home_score,
                away_score=away_score,
                stadium=schedule.get("구장"),
                tv=schedule.get("TV")
            )
        except Exception as e:
            logging.error(f"Failed to parse schedule item {schedule}: {e}")
            return None

    def _update_if_needed(self, existing: GameSchedule, new: GameSchedule):
        """
        기존 데이터와 새로운 데이터를 비교해 변경사항이 있으면 업데이트
        """
        if (
            existing.home_score != new.home_score or
            existing.away_score != new.away_score or
            existing.stadium != new.stadium or
            existing.tv != new.tv
        ):
            existing.home_score = new.home_score
            existing.away_score = new.away_score
            existing.stadium = new.stadium
            existing.tv = new.tv
            self.db.add(existing)

    async def _delete_removed_schedules(self, existing_map: dict, incoming_keys: set):
        """
        기존 DB에 있지만 이번 데이터에 없는 일정 삭제
        """
        to_delete = [row for key, row in existing_map.items() if key not in incoming_keys]
        for row in to_delete:
            await self.db.delete(row)