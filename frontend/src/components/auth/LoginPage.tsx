import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 임포트
import './LoginSignUp.css';
import { signIn } from '../../api/auth'; // API 호출 함수 임포트
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

  const navigate = useNavigate(); // useHistory 대신 useNavigate 훅 사용

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const signInData: SignInFormValues = { email, password };
      const response: AuthResponse = await signIn(signInData);
      console.log(response);

      // 로그인 성공 시, 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem('user', JSON.stringify({
        userId: response.userId,
        accessToken: response.accessToken,
      }));

      setSuccessMessage('로그인 성공!');
      setError('');

      // 로그인 성공 후 메인 페이지로 리디렉션
      navigate('/');
    } catch (error) {
      setError((error as Error).message);
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
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
    </div>
  );
}

export default LogInPage;
