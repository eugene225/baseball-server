from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=OPENAI_API_KEY)

MODEL = "gpt-3.5-turbo"

def generate_game_review(rating: float, team: str, opponent: str, game_date: str, additional_notes: str = None) -> str:
    prompt = f"""
    야구 경기 후기를 작성해주세요.
    - 별점: {rating:.1f}/5.0
    - 우리 팀: {team}
    - 상대 팀: {opponent}
    - 경기 날짜: {game_date}
    - 추가 메모: {additional_notes if additional_notes else "없음"}
    
    다음 조건을 지켜주세요:
    1. 100자 이내로 작성
    2. 별점에 맞는 감정을 담아서 작성
    3. 팀 이름을 자연스럽게 포함
    4. 경기 내용을 간략히 언급
    """

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "당신은 야구 경기 후기를 작성하는 전문가입니다."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,
        temperature=0.7
    )

    return response.choices[0].message.content.strip()
