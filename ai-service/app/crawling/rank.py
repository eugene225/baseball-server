import os
import json
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
from dotenv import load_dotenv
from typing import List, TypedDict

load_dotenv()

# 한글 → 영문 키 매핑
key_map = {
    "순위": "rank",
    "팀명": "team",
    "경기": "games",
    "승": "wins",
    "패": "losses",
    "무": "draws",
    "승률": "win_rate",
    "게임차": "games_behind",
    "연속": "streak"
}

class TeamRank(TypedDict):
    rank: str
    team: str
    games: str
    wins: str
    losses: str
    draws: str
    win_rate: str
    games_behind: str
    streak: str

def get_kbo_rank():
    today = datetime.today().strftime("%Y-%m-%d")
    yesterday = (datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    base_dir = os.path.join(os.getcwd(), "data")
    os.makedirs(base_dir, exist_ok=True)
    file_path = os.path.join(base_dir, f"{today}_rank.json")
    yesterday_file_path = os.path.join(base_dir, f"{yesterday}_rank.json")
    
    # 전날 파일 삭제
    if os.path.exists(yesterday_file_path):
        try:
            os.remove(yesterday_file_path)
        except Exception as e:
            print(f"Error deleting yesterday's rank file: {e}")

    # 1. 이미 저장된 파일이 있으면
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            saved_data = json.load(f)
        return {
            "status": "success",
            "date": today,
            "count": len(saved_data),
            "data": saved_data
        }

    # 2. 아니면 크롤링으로 데이터 수집
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    hub_url = os.getenv("SELENIUM_HUB_URL")
    driver = webdriver.Remote(
        command_executor=hub_url,
        options=options
    )

    try:
        url = "https://www.koreabaseball.com/Record/TeamRank/TeamRankDaily.aspx"
        driver.get(url)

        # 테이블 로딩 대기
        table = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "tData"))
        )
        rows = table.find_elements(By.TAG_NAME, "tr")

        header = [th.text for th in rows[0].find_elements(By.TAG_NAME, "th")]
        data_rows = rows[1:]

        raw_data = []
        for row in data_rows:
            cols = [td.text.strip() for td in row.find_elements(By.TAG_NAME, "td")]
            if cols:
                raw_data.append(cols)

        df = pd.DataFrame(raw_data, columns=header)

        # 키 매핑 처리
        result_data: List[TeamRank] = [
            {key_map[k]: v for k, v in item.items() if k in key_map}
            for item in df.to_dict(orient="records")
        ]

        # JSON 파일로 저장
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(result_data, f, ensure_ascii=False, indent=2)

        return {
            "status": "success",
            "date": today,
            "count": len(result_data),
            "data": result_data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "data": []
        }
    finally:
        driver.quit()
