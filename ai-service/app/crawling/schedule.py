import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
import pandas as pd
import time
from dotenv import load_dotenv
import aiohttp
from bs4 import BeautifulSoup
import logging
from datetime import datetime

load_dotenv()

# 연도를 포함한 KBO 일정 URL 템플릿
KBO_URL_TEMPLATE = "https://www.koreabaseball.com/Schedule/Schedule.aspx?seriesId=0&seasonId={year}"

async def get_kbo_schedule(year: int, month: int) -> dict:
    try:
        url = f"https://www.koreabaseball.com/Schedule/Schedule.aspx?seriesId=0&month={month}&year={year}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise Exception(f"Failed to fetch schedule: {response.status}")
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                schedule_data = []
                schedule_table = soup.find('table', {'class': 'tData'})
                
                if not schedule_table:
                    return {"count": 0, "data": []}
                
                rows = schedule_table.find_all('tr')
                
                for row in rows:
                    cells = row.find_all('td')
                    if len(cells) >= 4:
                        date = cells[0].text.strip()
                        time = cells[1].text.strip()
                        match = cells[2].text.strip()
                        stadium = cells[3].text.strip()
                        tv = cells[4].text.strip() if len(cells) > 4 else ""
                        
                        if date and time and match:
                            schedule_data.append({
                                "날짜": date,
                                "시간": time,
                                "경기": match,
                                "구장": stadium,
                                "TV": tv
                            })
                
                return {
                    "count": len(schedule_data),
                    "data": schedule_data
                }
                
    except Exception as e:
        logging.error(f"Error fetching KBO schedule: {e}")
        return {"count": 0, "data": []}
