import logging
import os
from logging.handlers import TimedRotatingFileHandler
import glob
from datetime import datetime, timedelta

# 로그 디렉토리 생성 (절대 경로 사용)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
log_dir = os.path.join(BASE_DIR, "logs")
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# 오래된 로그 파일 삭제 함수
def cleanup_old_logs():
    now = datetime.now()
    for log_file in glob.glob(os.path.join(log_dir, "api.log.*")):
        # 파일 생성 시간 확인
        file_time = datetime.fromtimestamp(os.path.getctime(log_file))
        # 3일 이상 된 파일 삭제
        if now - file_time > timedelta(days=3):
            try:
                os.remove(log_file)
                logger.info(f"Deleted old log file: {log_file}")
            except Exception as e:
                logger.error(f"Error deleting log file {log_file}: {e}")

# 로깅 설정
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# 파일 핸들러 설정 (매일 자정에 새로운 파일로 변경)
file_handler = TimedRotatingFileHandler(
    os.path.join(log_dir, 'api.log'),
    when='midnight',
    interval=1,
    backupCount=3
)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))

# 콘솔 핸들러 설정
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))

# 핸들러 추가
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# 초기 로그 정리 실행
cleanup_old_logs() 