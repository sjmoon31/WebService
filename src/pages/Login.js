import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './login.module.css';

function Login() {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/member/login', { email, password });
      const jwtToken = response.data.jwtToken;

      // JWT 토큰과 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem('jwtToken', jwtToken.accessToken);
      localStorage.setItem('userName', jwtToken.userName);
      localStorage.setItem('userEmail', jwtToken.userEmail);
      navigate('/main');
    } catch (error) {
      alert('로그인 실패');
    }
  };

  const googleClientId = '740052018127-4sbj9ecjqgsugg3ogkmrv7vvjnegejk2.apps.googleusercontent.com';
  const googleRedirectUrl = 'http://localhost:3000/auth/google/callback'; //google로부터 redirect 당할 url
  const googleScope = 'email profile';

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: googleRedirectUrl,
    response_type: 'code',
    scope: googleScope,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const loginHandler = () => {
    window.location.href = googleAuthUrl;
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.userBox}>
            <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
          </div>
          <div className={styles.userBox}>
            <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Password</label>
          </div>
          <button className={styles.loginBtn} type="submit">Login</button>
        </form>
        <button className={styles.loginBtn} onClick={loginHandler}>Login with Google</button>
        <div className={styles.buttonContainer}>
          <Link to="/main" className={styles.linkButton}>메인페이지</Link>
          <Link to="/join" className={styles.linkButton}>회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;