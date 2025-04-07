from fastapi import FastAPI
from app.crawling.rank import get_kbo_rank
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="My Baseball API",
    description="baseball app 에서 사용되는 데이터 관련 api를 제공합니다.",
    version="1.0.0",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001", "http://52.65.47.31:5000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/kbo/rank")
def read_kbo_rank():
    return get_kbo_rank()



# # 모델과 토크나이저 초기화
# model = None
# tokenizer = None

# # 요청 데이터 구조
# class RequestData(BaseModel):
#     prompt: str

# # Hugging Face 로그인
# login(token="")

# # 모델 로딩 함수 (캐싱)
# @lru_cache(maxsize=1)
# def load_model():
#     global model, tokenizer
#     model_name = "beomi/KoAlpaca-Polyglot-5.8B"

#     try:
#         print("🚀 모델 로드 중... (M1/M2 호환 버전)")

#         tokenizer = AutoTokenizer.from_pretrained(model_name)
#         model = AutoModelForCausalLM.from_pretrained(
#             model_name,
#             device_map="auto",  # 또는 device="mps" 명시 가능
#             torch_dtype=torch.float16  # M1/M2에서 지원하는 dtype
#         )

#         tokenizer.pad_token = tokenizer.eos_token
#         model.config.pad_token_id = model.config.eos_token_id

#         print("✅ 모델 로드 완료!")

#     except Exception as e:
#         print(f"❌ 모델 로드 실패: {e}")
#         model, tokenizer = None, None

# # lifespan: 서버 시작 시 모델 로드
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     load_model()
#     print("✅ lifespan에서 모델 로딩 완료")
#     yield

# app = FastAPI(lifespan=lifespan)

# # 텍스트 생성 API
# @app.post("/generate/")
# async def generate_text(request: RequestData):
#     global model, tokenizer

#     if model is None or tokenizer is None:
#         return {"error": "❌ 모델이 아직 로드되지 않았습니다."}

#     inputs = tokenizer(request.prompt, return_tensors="pt", padding=True, truncation=True, max_length=128)
#     inputs = {k: v.to("mps") for k, v in inputs.items()}  # M1/M2에서는 "mps" 디바이스 사용

#     output = await asyncio.to_thread(
#         model.generate,
#         inputs["input_ids"],
#         max_length=100,
#         num_return_sequences=1,
#         temperature=0.7,
#         top_k=40,
#         top_p=0.85,
#         do_sample=True,
#         early_stopping=True,
#         pad_token_id=tokenizer.eos_token_id
#     )

#     generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
#     return {"response": generated_text}
