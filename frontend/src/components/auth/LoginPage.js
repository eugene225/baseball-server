import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 임포트
import './LoginSignUp.css';
import { signIn } from '../api/auth'; // API 호출 함수 임포트

function LogInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate(); // useHistory 대신 useNavigate 훅 사용

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const signInData = { email, password };
      const response = await signIn(signInData);
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
      setError(error.message);
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
