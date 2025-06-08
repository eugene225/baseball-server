# model/game_schedule.py
from sqlalchemy import Column, Integer, String, Date, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class GameSchedule(Base):
    __tablename__ = 'game_schedules'
    __table_args__ = (
        UniqueConstraint('date', 'home_team', 'away_team', name='uq_game_date_teams'),
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
