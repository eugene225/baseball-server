import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import logging

async def get_kbo_schedule(year: int, month: int) -> dict:
    try:
        url = f"https://www.koreabaseball.com/Schedule/Schedule.aspx?seriesId=0&seasonId={year}&teamCode=&month={month}"

        # Selenium Hub URL 가져오기
        selenium_url = os.getenv("SELENIUM_HUB_URL", "http://localhost:4444/wd/hub")

        chrome_options = Options()
        chrome_options.add_argument("--headless")  # 헤드리스 모드
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

        # 원격 WebDriver 설정
        driver = webdriver.Remote(
            command_executor=selenium_url,
            options=chrome_options
        )

        try:
            driver.get(url)

            # 테이블 로딩을 기다림
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.ID, "tblScheduleList"))
            )

            soup = BeautifulSoup(driver.page_source, 'html.parser')
            table = soup.find("table", {"id": "tblScheduleList"})
            if not table:
                logging.error("테이블을 찾을 수 없습니다.")
                return {"success": False, "count": 0, "data": []}

            rows = table.find("tbody").find_all("tr")
            logging.info(f"총 {len(rows)}개의 행이 있습니다.")

            schedule_data = []
            current_date = ""

            for row in rows:
                cols = row.find_all("td")
                if not cols:
                    continue

                if "day" in cols[0].get("class", []):
                    current_date = cols[0].text.strip()
                    time = cols[1].text.strip()
                    match = cols[2].text.strip()
                    stadium = cols[7].text.strip() if len(cols) > 7 else ""
                    tv = cols[5].text.strip() if len(cols) > 5 else ""
                else:
                    time = cols[0].text.strip()
                    match = cols[1].text.strip()
                    stadium = cols[6].text.strip() if len(cols) > 6 else ""
                    tv = cols[4].text.strip() if len(cols) > 4 else ""

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
            with open("error_page.html", "w") as f:
                f.write(driver.page_source)
            return {"success": False, "count": 0, "data": []}

        finally:
            driver.quit()

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return {"success": False, "count": 0, "data": []}