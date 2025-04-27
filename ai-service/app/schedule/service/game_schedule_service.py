import os
import json
import re
from app.crawling.schedule import get_kbo_schedule
from app.schedule.model.game_schedule import GameSchedule
from sqlalchemy.orm import Session
from datetime import datetime

class GameScheduleService:
    MATCH_WITH_SCORE_PATTERN = re.compile(r"([가-힣A-Z]+)(\d+)vs(\d+)([가-힣A-Z]+)")
    MATCH_NO_SCORE_PATTERN = re.compile(r"([가-힣A-Z]+)vs([가-힣A-Z]+)")

    def __init__(self, db: Session):
        self.db = db

    async def save_game_schedule(self, year: int, month: int) -> bool:
        # 1. 크롤링 정보 가져오기
        schedule_data = await get_kbo_schedule(year, month)

        # 2. yyyy-mm.json 파일 경로 설정
        file_name = f"{year}-{month:02d}.json"
        file_path = os.path.join("data", file_name)  # 파일 경로 설정

        # 3. 파일이 있는지 확인
        if os.path.exists(file_path):
            # 3.1 파일이 있으면 파일 내용 비교
            with open(file_path, "r") as file:
                existing_data = json.load(file)

            # 3.2 파일이 같으면 return False
            if existing_data == schedule_data:
                return False  # 파일이 동일하면 업데이트 필요 없음

            # 3.3 파일이 다르면, 파일을 새로 저장하고 DB 업데이트
            with open(file_path, "w") as file:
                await json.dump(schedule_data, file)

        # 4. 파일이 없으면 새로 저장하고 DB 업데이트
        else:
            # 새로 파일을 저장
            with open(file_path, "w") as file:
                json.dump(schedule_data, file)
        
        # DB에 해당 년-월 데이터 추가
        await self.update_schedule_in_db(year, month, schedule_data["data"])
        return True

    async def update_schedule_in_db(self, year: int, month: int, schedule_data: list):
        # DB에서 해당 연-월의 기존 데이터를 삭제
        start_date = datetime(year, month, 1)
        # 다음 달 1일을 구해서 범위 끝으로 사용
        end_month = month + 1 if month < 12 else 1
        end_year = year if month < 12 else year + 1
        end_date = datetime(end_year, end_month, 1)

        deleted = await self.db.query(GameSchedule).filter(
            GameSchedule.date >= start_date,
            GameSchedule.date < end_date
        ).delete()
        await self.db.commit()

        # 새로운 데이터 추가
        batch_size = 70  # 배치사이즈 결정
        batch = []

        for schedule in schedule_data:
            print(schedule)
            # {'날짜': '05.01(수)', '시간': '18:30', '경기': '삼성9vs2두산', '게임센터': '리뷰', '하이라이트': '하이라이트', 'TV': 'MS-T', '라디오': '-', '구장': '잠실', '비고': '-'}
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

            # 배치사이즈에 도달하면 DB에 저장
            if len(batch) >= batch_size:
                await self.db.bulk_save_objects(batch)
                await self.db.commit()
                batch = []

        # 남은 데이터 저장
        if batch:
            await self.db.bulk_save_objects(batch)
            await self.db.commit()

    def convert_to_yyyymmdd(self, date_str: str, year: int) -> datetime:
        date_part = date_str.split('(')[0].strip()
        month, day = map(int, date_part.split('.'))
        converted_date = f"{year}-{month:02d}-{day:02d}"

        try:
            datetime.strptime(converted_date, "%Y-%m-%d")
            return converted_date
        except ValueError:
            raise ValueError(f"Invalid date format: {date_str}")
        
    def parse_match_info(self, match_str: str):
        if not isinstance(match_str, str) or not match_str.strip():
            return None, None, None, None

        # 스코어 포함된 경우
        if re.search(r"\d", match_str):
            match = self.MATCH_WITH_SCORE_PATTERN.match(match_str)
            if match:
                home_team, home_score, away_score, away_team = match.groups()
                return home_team, int(home_score), int(away_score), away_team
        else:
            # 스코어 없이 팀명만 있는 경우
            match = self.MATCH_NO_SCORE_PATTERN.match(match_str)
            if match:
                home_team, away_team = match.groups()
                return home_team, None, None, away_team

        # 형식이 이상할 경우
        raise ValueError(f"Invalid match format: {match_str}")
