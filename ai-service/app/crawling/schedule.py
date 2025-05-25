from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import logging
from datetime import datetime

async def get_kbo_schedule(year: int, month: int) -> dict:
    try:
        url = f"https://www.koreabaseball.com/Schedule/Schedule.aspx?seriesId=0&seasonId={year}&teamCode=&month={month}"

        # 셀레니움 크롬 옵션 설정
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")

        # 드라이버 경로 (환경에 따라 수정)
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)

        # 페이지 로딩 대기
        driver.implicitly_wait(5)

        # BeautifulSoup으로 파싱
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        driver.quit()

        # 경기 일정 테이블
        table = soup.find("table", {"class": "tbl"})  # class 이름이 실제로 tbl-type06이라면 여기에 맞춰 수정
        rows = table.find("tbody").find_all("tr") if table else []

        schedule_data = []

        current_date = ""
        for row in rows:
            cols = row.find_all("td")
            if not cols:
                continue

            # 날짜가 rowspan으로 생략된 경우를 고려
            if cols[0].get("class", [None])[0] == "day":
                current_date = cols[0].text.strip()
                time = cols[1].text.strip()
                match = cols[2].text.strip()
                stadium = cols[7].text.strip()
                tv = cols[5].text.strip()
            else:
                time = cols[0].text.strip()
                match = cols[1].text.strip()
                stadium = cols[6].text.strip()
                tv = cols[4].text.strip()

            schedule_data.append({
                "날짜": current_date,
                "시간": time,
                "경기": match,
                "구장": stadium,
                "TV": tv
            })

        return {
            "success": True,
            "count": len(schedule_data),
            "data": schedule_data
        }

    except Exception as e:
        logging.error(f"Error fetching KBO schedule: {e}")
        return {
            "success": False,
            "count": 0,
            "data": []
        }