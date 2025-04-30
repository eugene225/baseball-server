from fastapi import APIRouter
from app.crawling.rank import get_kbo_rank

router = APIRouter(prefix="/kbo/rank", tags=["KBO Rank"])

@router.get("")
@router.get("/")
def read_kbo_rank():
    return get_kbo_rank()