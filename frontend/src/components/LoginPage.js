import React from 'react';
import { Link } from 'react-router-dom';
import './LoginSignUp.css';

function LoginPage() {
  return (
    <div className="form-container">
      <h2>로그인</h2>
      <form>
        <input type="text" placeholder="아이디" required />
        <input type="password" placeholder="비밀번호" required />
        <button type="submit">로그인</button>
      </form>
      <p>아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
    </div>
  );
}

export default LoginPage;
