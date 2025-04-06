from bs4 import BeautifulSoup
import requests
from typing import List, Dict

KBO_RANK_URL = "https://sports.news.naver.com/kbaseball/record/index.nhn?category=kbo"

def get_kbo_rank() -> List[Dict]:
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

        return rankings

    except requests.RequestException as e:
        print(f"HTTP 요청 중 오류 발생: {e}")
        return []
    except Exception as e:
        print(f"크롤링 중 오류 발생: {e}")
        return []
