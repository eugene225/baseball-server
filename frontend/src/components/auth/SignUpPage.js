import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginSignUp.css'; // CSS 파일로 스타일링
import { signUp } from '../api/auth'; // API 호출 함수 임포트

function SignUpPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 비밀번호와 비밀번호 확인 필드 일치 여부 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 회원가입 데이터 객체 생성
      const signUpData = { nickname, email, password };
      // signUp 함수 호출하여 서버로 데이터 전송
      const response = await signUp(signUpData);
      console.log(response);
      
      setSuccessMessage('회원가입이 완료되었습니다. 로그인 해주세요.');
      setError('');
      // 회원가입 후 로그인 페이지로 리디렉션
      window.location.href = '/login';
    } catch (error) {
      // 에러 처리
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">회원가입</button>
      </form>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <p>이미 회원이신가요? <Link to="/login">로그인</Link></p>
    </div>
  );
}

export default SignUpPage;
