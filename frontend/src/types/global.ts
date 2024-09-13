// 에러 응답 데이터 타입 정의
export interface ErrorResponse {
    message: string;
}

export enum Weather {
    SUNNY = '☀️',
    CLOUDY = '🌥️',
    RAINY = '🌧️',
}
