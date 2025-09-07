// src/pages/login/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

// asset 폴더에 아이콘
import KakaoIcon from '../../asset/kakao.png';
import GoogleIcon from '../../asset/google.png';
import NaverIcon from '../../asset/naver.png';
import EyeIcon from '../../asset/eye-icon.png';

const LoginPage: React.FC = () => {
  // 이메일과 비밀번호 입력을 관리하기 위한 state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 비밀번호 보이기/숨기기 토글을 위한 state
  const [showPassword, setShowPassword] = useState(false);

  // 로그인 버튼 클릭 시 실행될 함수 (지금은 알림창만)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // form 태그의 기본 동작(페이지 새로고침)을 막습니다.
    alert(`이메일: ${email}, 비밀번호: ${password}`);
    // TODO: 여기에 실제 서버로 로그인 요청을 보내는 API 호출 코드를 작성
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>로그인</h1>

        <form className={styles.form} onSubmit={handleLogin}>
          {/* 아이디(이메일) 입력 그룹 */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>아이디</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="이메일 형식으로 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 입력 그룹 */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'} // showPassword 값에 따라 타입 변경
                className={styles.passwordInput}
                placeholder="비밀번호를 입력하세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={EyeIcon}
                alt="show password"
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)} // 클릭 시 상태 토글
              />
            </div>
          </div>
          
          <button type="submit" className={styles.loginButton}>로그인</button>
        </form>

        {/* 소셜 로그인 버튼 영역 */}
        <div className={styles.socialLoginContainer}>
        <button className={`${styles.socialButton} ${styles.kakaoButton}`}>
            <img src={KakaoIcon} alt="kakao login" className={styles.socialIcon} />
            카카오 로그인
        </button>
        <button className={`${styles.socialButton} ${styles.googleButton}`}>
            <img src={GoogleIcon} alt="google login" className={styles.socialIcon} />
            구글 로그인
        </button>
        <button className={`${styles.socialButton} ${styles.naverButton}`}>
            <img src={NaverIcon} alt="naver login" className={styles.socialIcon} />
            네이버 로그인
        </button>
        </div>

        {/* 하단 링크 영역 */}
        <div className={styles.linksContainer}>
          <Link to="/find-password" className={`${styles.link} ${styles.forgotPasswordLink}`}>
            비밀번호를 잊으셨나요?
          </Link>
          <Link to="/signup" className={`${styles.link} ${styles.signupLink}`}>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;