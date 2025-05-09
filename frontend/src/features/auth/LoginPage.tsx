import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginSignUp.module.css';
import { signIn } from '../../api/auth';
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

  const navigate = useNavigate();
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
    <div className={styles.formContainer}>
      <h2 className={styles.title}>로그인</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <p className={styles.linkText}>
        계정이 없으신가요? <Link to="/signup" className={styles.link}>회원가입</Link>
      </p>
    </div>
  );
}

export default LogInPage;
