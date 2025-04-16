import os
import json
from datetime import datetime
from bs4 import BeautifulSoup
import requests
from typing import List, Dict

KBO_RANK_URL = "https://sports.news.naver.com/kbaseball/record/index.nhn?category=kbo"
CACHE_FILE_PATH = 'kbo_rank_cache.json'

def get_cached_data() -> Dict:
    """캐시 파일에서 데이터를 읽어옵니다."""
    if os.path.exists(CACHE_FILE_PATH):
        with open(CACHE_FILE_PATH, 'r', encoding='utf-8') as file:
            return json.load(file)
    return {}

def save_to_cache(data: List[Dict]) -> None:
    """새 데이터를 캐시 파일에 저장합니다."""
    cache_data = {
        "date": datetime.now().strftime("%Y-%m-%d"),  # 오늘 날짜
        "rankings": data
    }
    with open(CACHE_FILE_PATH, 'w', encoding='utf-8') as file:
        json.dump(cache_data, file, ensure_ascii=False, indent=4)

def get_kbo_rank() -> List[Dict]:
    """KBO 순위를 가져오는 함수"""
    cached_data = get_cached_data()

    # 캐시된 데이터가 있고, 오늘 날짜의 데이터가 있을 경우 캐시 사용
    cached_date = cached_data.get("date")
    if cached_date == datetime.now().strftime("%Y-%m-%d"):
        print("캐시된 데이터 반환")
        return cached_data.get("rankings", [])

    # 캐시가 없거나 날짜가 다른 경우 새로 요청하여 캐시
    try:
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        response = requests.get(KBO_RANK_URL, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # 순위 테이블 tbody 선택
        table_body = soup.find('tbody', {'id': 'regularTeamRecordList_table'})
        if not table_body:
            raise Exception("순위 테이블 tbody를 찾을 수 없습니다.")
        
        rankings = []
        for row in table_body.find_all('tr'):
            rank = row.find('th').text.strip() if row.find('th') else ""
            cols = row.find_all('td')
            if len(cols) >= 11:
                team_name = cols[0].select_one("span[id^='team_']").text.strip()
                team_info = {
                    'rank': rank,
                    'team': team_name,
                    'games': cols[1].text.strip(),
                    'wins': cols[2].text.strip(),
                    'losses': cols[3].text.strip(),
                    'draws': cols[4].text.strip(),
                    'win_rate': cols[5].text.strip(),
                    'games_behind': cols[6].text.strip(),
                    'recent_10': cols[10].text.strip(),  # 9승-1패-0무
                    'streak': cols[7].text.strip(),      # 예: 3승
                }
                rankings.append(team_info)

        # 새 데이터를 캐시하고 반환
        save_to_cache(rankings)
        print("새 데이터 반환 및 캐시 저장")
        return rankings

    except requests.RequestException as e:
        print(f"HTTP 요청 중 오류 발생: {e}")
        return []
    except Exception as e:
        print(f"크롤링 중 오류 발생: {e}")
        return []
