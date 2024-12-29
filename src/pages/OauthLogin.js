import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OauthLogin.module.css';

const googleClientId = 'GOOGLE_CLIENT_ID'; // Google Cloud Console에서 발급받은 클라이언트 ID
const googleClientSecret = 'GOOGLE_CLIENT_SECRET'; // Google Cloud Console에서 발급받은 클라이언트 시크릿s
const googleRedirectUrl = 'http://localhost:3000/auth/google/callback'; // Google로부터 Redirect 당할 URL

const OauthLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeCodeForToken = async (code) => {
      try {
        // Google OAuth 토큰 요청
        const response = await axios.post(
          'https://oauth2.googleapis.com/token',
          new URLSearchParams({
            code: code,
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: googleRedirectUrl,
            grant_type: 'authorization_code',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const { access_token } = response.data;

        // 백엔드 서버로 토큰 전달하여 JWT 토큰 받기
        const backendResponse = await axios.post(
          'http://localhost:8080/member/authenticate', // 백엔드의 인증 엔드포인트
          { accessToken: access_token },
          {
            headers: {
              'Content-Type': 'application/json', // JSON 데이터 형식 전달
            },
          }
        );

        const { jwtToken, userInfo } = backendResponse.data;

        // JWT 토큰과 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem('jwtToken', jwtToken.accessToken);
        localStorage.setItem('userName', jwtToken.userName);
        localStorage.setItem('userEmail', jwtToken.userEmail);

        // 성공적으로 처리되었으면 /welcome 페이지로 리다이렉트
        navigate('/main');
      } catch (error) {
        console.error(
          'Error exchanging authorization code or sending token to backend:',
          error.response?.data || error
        );
      }
    };

    const code = new URLSearchParams(location.search).get('code');
    if (code) {
      exchangeCodeForToken(code); // Authorization Code를 기반으로 작업 실행
    }
  }, [location.search, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <p>로그인 중입니다. 잠시만 기다려 주세요...</p>
      </div>
    </div>
  );
};

export default OauthLogin;
