import React from 'react';
import { Link } from 'react-router-dom';
import './LoginSignUp.css';

function SignUpPage() {
  return (
    <div className="form-container">
      <h2>회원가입</h2>
      <form>
        <input type="text" placeholder="아이디" required />
        <input type="email" placeholder="이메일" required />
        <input type="password" placeholder="비밀번호" required />
        <input type="password" placeholder="비밀번호 확인" required />
        <button type="submit">회원가입</button>
      </form>
      <p>이미 회원이신가요? <Link to="/login">로그인</Link></p>
    </div>
  );
}

export default SignUpPage;
