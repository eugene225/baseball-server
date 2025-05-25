from fastapi import HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI 클라이언트 인스턴스 생성
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ReviewRequest(BaseModel):
    review: str

class StickerResponse(BaseModel):
    sentiment_score: float
    sticker: str

SYSTEM_PROMPT = """
        당신은 야구 경기 후기를 보고 감정 점수와 감정 스티커를 분석하는 역할입니다.
        감정 점수는 -1.0(매우 부정적)에서 1.0(매우 긍정적)까지 부여합니다.
        각 점수에 따라 아래 이모지 중 하나를 선택해 주세요:
        - -1.0 ~ -0.6: 😡
        - -0.6 ~ -0.2: 😔
        - -0.2 ~ 0.2: 😐
        - 0.2 ~ 0.6: 🙂
        - 0.6 ~ 1.0: 😄
        출력은 아래 형식만 따르세요:
        감정 점수: <숫자>
        감정 스티커: <이모지>
    """

def analyze_review(request: ReviewRequest) -> StickerResponse:
    user_prompt = f"""
        후기 = "{request.review}"
        감정 점수와 스티커를 위 기준에 따라 분석해주세요.
    """

    try:
        print("user_prompt:", user_prompt)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=100,
            temperature=0.3,
        )

        content = response.choices[0].message.content.strip()
        print("content:", content)

        # 감정 점수 및 이모지 추출
        lines = [line.strip() for line in content.splitlines() if line.strip()]
        score_line = next((line for line in lines if "감정 점수" in line), None)
        sticker_line = next((line for line in lines if "감정 스티커" in line), None)

        if not score_line or not sticker_line:
            raise ValueError("응답 형식이 올바르지 않습니다.")

        score = float(score_line.split(":")[1].strip())
        sticker = sticker_line.split(":")[1].strip()

        return StickerResponse(sentiment_score=score, sticker=sticker)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"분석 중 오류 발생: {str(e)}")
