// user 관련 타입 정의
export interface UserInfo {
    nickname: string;
    myTeam: string;
    fcmToken?: string;
}

export interface AuthContextType {
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
    login: (userId: string, accessToken: string) => void;
    logout: () => void;
}

// 회원가입 데이터 타입 정의
export interface SignUpData {
    email: string;
    password: string;
    nickname: string;
}

// 로그인 데이터 타입 정의
export interface SignInData {
    email: string;
    password: string;
}

// 로그인 응답 데이터 타입 정의
export interface AuthResponse {
    userId: number,
    accessToken: string;
}