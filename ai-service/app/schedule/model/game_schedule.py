# model/game_schedule.py
from sqlalchemy import Column, Integer, String, Date, Boolean, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class GameSchedule(Base):
    __tablename__ = 'game_schedules'
    __table_args__ = (
        UniqueConstraint('date', 'home_team', 'away_team', 'game_order', name='uq_game_key'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    time = Column(String(20), nullable=False)
    home_team = Column(String(20), nullable=False)
    away_team = Column(String(20), nullable=False)
    home_score = Column(Integer, nullable=True)
    away_score = Column(Integer, nullable=True)
    stadium = Column(String(30), nullable=False)
    tv = Column(String(30), nullable=False)
    is_double_header = Column(Boolean, nullable=False) # 더블헤더 구분을 위한 필드
    game_order = Column(Integer, nullable=False) # 더블헤더 구분을 위한 필드 1=첫경기, 2=두번째경기
