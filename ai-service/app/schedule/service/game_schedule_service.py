import logging
import re
from datetime import datetime, date
from sqlalchemy import text, select, case
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
                WHERE date >= :start_date AND date < :end_date
                ORDER BY date, time
            """)
            
            # 읽기 전용 트랜잭션으로 처리
            async with self.db.begin():
                result = await self.db.execute(query, {"start_date": start_date, "end_date": end_date})
                data = result.mappings().all()
                
                return data
                
        except Exception as e:
            logging.error(f"Error getting game schedule: {e}")
            return []

    async def save_game_schedule_in_db(self, year: int, month: int, schedule_data: list):
        """
        월별 경기 일정을 DB에 저장 또는 갱신
        - 기존 데이터가 있으면 업데이트, 없으면 삽입 (BULK UPSERT)
        """
        try:
            # 더블헤더 처리
            schedule_data = self.check_double_header_games(schedule_data)
            
            # 모든 스케줄을 파싱하여 GameSchedule 객체 리스트 생성
            game_schedules = []
            for schedule in schedule_data:
                try:
                    game_schedule = self._parse_schedule_item(schedule, year)
                    if game_schedule:
                        game_schedules.append(game_schedule)
                except Exception as e:
                    logging.error(f"Error parsing schedule item {schedule}: {e}")
                    continue
            
            # 벌크 UPSERT 실행
            if game_schedules:
                await self._bulk_upsert_game_schedules(game_schedules)
            await self.db.commit()
            
            return {
                "success": True,
                "message": f"Successfully updated {len(game_schedules)} game schedules",
                "count": len(game_schedules),
                "year": year,
                "month": month
            }
            
        except Exception as e:
            logging.error(f"Error in save_game_schedule_in_db: {e}")
            await self.db.rollback()
            return {
                "success": False,
                "message": f"Error saving game schedules: {str(e)}",
                "count": 0,
                "year": year,
                "month": month
            }

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

        teams = self._extract_teams_from_match(match_str)
        if not teams:
            return None, None, None, None

        home_team, away_team = teams
        
        # 점수 추출
        if re.search(r"\d", match_str):
            match = self.MATCH_WITH_SCORE_PATTERN.match(match_str)
            if match:
                _, home_score, away_score, _ = match.groups()
                return home_team, int(home_score), int(away_score), away_team
        
        # 점수가 없는 경우
        return home_team, None, None, away_team
    
    def check_double_header_games(self, schedule_data: list):
        """
        스케줄 데이터에서 더블헤더 경기를 감지하고 game_order 설정
        """
        # 날짜별로 경기를 그룹화
        date_games = {}
        
        for i, game in enumerate(schedule_data):
            date = game["날짜"]
            match = game["경기"]
            
            # 경기명에서 팀명만 추출 (점수 제거)
            teams = self._extract_teams_from_match(match)
            if not teams:
                continue
                
            team_key = f"{teams[0]}vs{teams[1]}"
            
            if date not in date_games:
                date_games[date] = {}
            
            if team_key not in date_games[date]:
                date_games[date][team_key] = []
            
            date_games[date][team_key].append(i)
        
        # 더블헤더 확인 및 game_order 설정
        double_header_count = 0
        for date, matches in date_games.items():
            for team_key, indices in matches.items():
                if len(indices) > 1:
                    # 같은 날짜, 같은 팀 조합에 여러 개의 시간이 있으면 더블헤더
                    double_header_count += 1
                    
                    # 시간 순으로 정렬하여 game_order 설정
                    sorted_indices = sorted(indices, key=lambda idx: schedule_data[idx]["시간"])
                    for order, idx in enumerate(sorted_indices, 1):
                        schedule_data[idx]["game_order"] = order
                        schedule_data[idx]["is_double_header"] = True
                else:
                    # 단일 경기
                    schedule_data[indices[0]]["game_order"] = 1
                    schedule_data[indices[0]]["is_double_header"] = False
        
        return schedule_data

    def _extract_teams_from_match(self, match_str: str) -> list:
        """
        경기 문자열에서 팀명만 추출 (점수 제거)
        예: "NC6vs6두산" -> ["NC", "두산"]
        예: "NCvs두산" -> ["NC", "두산"]
        """
        if not isinstance(match_str, str) or not match_str.strip():
            return []
            
        try:
            # 점수가 있는 경우: "NC6vs6두산"
            if re.search(r"\d", match_str):
                match = self.MATCH_WITH_SCORE_PATTERN.match(match_str)
                if match:
                    home_team, _, _, away_team = match.groups()
                    return [home_team, away_team]
            else:
                # 점수가 없는 경우: "NCvs두산"
                match = self.MATCH_NO_SCORE_PATTERN.match(match_str)
                if match:
                    home_team, away_team = match.groups()
                    return [home_team, away_team]
            
            return []
            
        except Exception as e:
            logging.error(f"Error extracting teams from match: {match_str}, error: {e}")
            return []

    # ======= Private Methods =======

    def _get_date_range(self, year: int, month: int, day: int = None) -> tuple[date, date]:
        """
        year, month, day를 받아 시작일과 종료일 범위 계산
        """
        if day:
            start_date = date(year, month, day)
            end_date = date(year, month, day+1)
        else:
            start_date = date(year, month, 1)
            # 다음 달의 1일을 종료일로 설정
            if month == 12:
                end_date = date(year + 1, 1, 1)
            else:
                end_date = date(year, month + 1, 1)
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

            game_order = schedule.get("game_order", 1)  # 기본값 1
            is_double_header = schedule.get("is_double_header", False)  # 기본값 False

            return GameSchedule(
                date=date_obj,
                time=time,
                home_team=home_team,
                away_team=away_team,
                home_score=home_score,
                away_score=away_score,
                stadium=schedule.get("구장"),
                tv=schedule.get("TV"),
                game_order=game_order,
                is_double_header=is_double_header
            )
        except Exception as e:
            logging.error(f"Failed to parse schedule item {schedule}: {e}")
            return None

    async def _bulk_upsert_game_schedules(self, game_schedules: list[GameSchedule]):
        """
        GameSchedule 객체 리스트를 받아 DB에 저장 또는 갱신 (BULK UPSERT)
        """
        try:            
            # VALUES 절을 동적으로 생성
            values_list = []
            for game_schedule in game_schedules:
                values_list.append(f"(:date_{len(values_list)}, :time_{len(values_list)}, :home_team_{len(values_list)}, :away_team_{len(values_list)}, :home_score_{len(values_list)}, :away_score_{len(values_list)}, :stadium_{len(values_list)}, :tv_{len(values_list)}, :game_order_{len(values_list)}, :is_double_header_{len(values_list)})")
            
            # 벌크 UPSERT 쿼리 생성
            query = text(f"""
                INSERT INTO game_schedules 
                (date, time, home_team, away_team, home_score, away_score, stadium, tv, game_order, is_double_header)
                VALUES {', '.join(values_list)}
                ON DUPLICATE KEY UPDATE
                time = VALUES(time),
                home_score = VALUES(home_score),
                away_score = VALUES(away_score),
                stadium = VALUES(stadium),
                tv = VALUES(tv),
                is_double_header = VALUES(is_double_header)
            """)
            
            # 파라미터 딕셔너리 생성
            params = {}
            for i, game_schedule in enumerate(game_schedules):
                params.update({
                    f'date_{i}': game_schedule.date,
                    f'time_{i}': game_schedule.time,
                    f'home_team_{i}': game_schedule.home_team,
                    f'away_team_{i}': game_schedule.away_team,
                    f'home_score_{i}': game_schedule.home_score,
                    f'away_score_{i}': game_schedule.away_score,
                    f'stadium_{i}': game_schedule.stadium,
                    f'tv_{i}': game_schedule.tv,
                    f'game_order_{i}': game_schedule.game_order,
                    f'is_double_header_{i}': game_schedule.is_double_header
                })
            
            await self.db.execute(query, params)            
        except Exception as e:
            logging.error(f"Error in bulk upsert: {e}")
            raise