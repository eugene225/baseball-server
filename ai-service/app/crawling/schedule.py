import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
import pandas as pd
import time
from dotenv import load_dotenv

load_dotenv()

# 연도를 포함한 KBO 일정 URL 템플릿
KBO_URL_TEMPLATE = "https://www.koreabaseball.com/Schedule/Schedule.aspx?seriesId=0&seasonId={year}"

def get_kbo_schedule(year: int, month: int):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-software-rasterizer")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--window-size=1920x1080")

    chromedriver_path = os.getenv("CHROME_DRIVER_PATH", "/usr/bin/chromedriver")
    service = Service(executable_path=chromedriver_path, port=9515)

    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(120)

    # 연도를 URL에 반영
    url = KBO_URL_TEMPLATE.format(year=year)
    driver.get(url)

    # 시즌 연도 수동 선택
    season_select = Select(driver.find_element(By.ID, "ddlYear"))
    season_select.select_by_value(str(year))

    # 월 수동 선택
    month_select = Select(driver.find_element(By.ID, "ddlMonth"))
    month_select.select_by_value(f"{month:02d}")

    # 페이지가 새로 로딩되므로 대기 (간단하게 sleep 사용)
    time.sleep(2)

    table = driver.find_element(By.CLASS_NAME, "tbl-type06")
    thead = table.find_element(By.TAG_NAME, "thead")
    header = [th.text for th in thead.find_elements(By.TAG_NAME, "th")]
    tbody = table.find_element(By.TAG_NAME, "tbody")
    rows = tbody.find_elements(By.TAG_NAME, "tr")

    if len(rows) == 1:
        driver.quit()
        return {
            "status": "empty",
            "message": f"{year}년 {month:02d}월에 경기 일정이 없습니다.",
            "data": []
        }

    lines = []
    for row in rows:
        cells = row.find_elements(By.TAG_NAME, "td")
        line_data = [cell.text for cell in cells]
        lines.append(line_data)

    data = []
    game_day = None

    for line in lines:
        if line[0].endswith(')'):
            game_day = line[0]
            data.append(line)
        else:
            line.insert(0, game_day)
            data.append(line)

    df = pd.DataFrame(data, columns=header)
    df = df.replace('', '-')

    driver.quit()

    return {
        "status": "success",
        "year": year,
        "month": f"{month:02d}",
        "count": len(df),
        "data": df.to_dict(orient='records')
    }
