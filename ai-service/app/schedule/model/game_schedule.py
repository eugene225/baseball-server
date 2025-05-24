from datetime import date
from sqlmodel import SQLModel, Field

class GameSchedule(SQLModel, table=True):
    __tablename__ = 'game_schedules'

    id: int | None = Field(default=None, primary_key=True)
    date: date
    time: str
    home_team: str
    away_team: str
    home_score: int | None = None
    away_score: int | None = None
    stadium: str
    tv: str