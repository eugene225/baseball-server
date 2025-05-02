import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 임포트
import './LoginSignUp.css';
import { signIn } from '../../api/auth'; // API 호출 함수 임포트
import { useAuth } from '../../contexts/AuthContext';
import { AuthResponse } from '../../types/auth';

// 상태와 이벤트 핸들러 타입 정의
type SignInFormValues = {
  email: string;
  password: string;
};

const LogInPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate(); // useHistory 대신 useNavigate 훅 사용
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const signInData: SignInFormValues = { email, password };
      const response: AuthResponse = await signIn(signInData);

      await login(response.userId.toString(), response.accessToken);
      setSuccessMessage('로그인 성공!');
      navigate('/');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
    </div>
  );
}

export default LogInPage;
