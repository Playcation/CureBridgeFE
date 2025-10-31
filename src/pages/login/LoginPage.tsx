// src/pages/login/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

// asset 폴더에 아이콘
import KakaoIcon from '../../asset/kakao.png';
import GoogleIcon from '../../asset/google.png';
import NaverIcon from '../../asset/naver.png';
import EyeIcon from '../../asset/eye-icon.png';
import {LoginType} from "../../common/UserTypes";

// api
import {userLogin} from "../../api/Api"

const LoginPage: React.FC = () => {
  // 이메일과 비밀번호 입력을 관리하기 위한 state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 비밀번호 보이기/숨기기 토글을 위한 state
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('user');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`이메일: ${email}, 비밀번호: ${password}`);

    const loginData: LoginType = { email, password, role:userType.toString() };

    try {
      const response = await userLogin(loginData);

      const accessToken = response.data.accessToken;

      if (accessToken) {
        localStorage.setItem('Authorization', accessToken);

        alert('로그인되었습니다.');
        window.location.href = '/';
      } else {
        throw new Error('로그인에 성공했으나 토큰을 받지 못했습니다.');
      }

    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

    return (
        <div className={styles.pageContainer}>
          <div className={styles.loginForm}>
            <h1 className={styles.title}>로그인</h1>

            <div className={styles.togleContainer}>
              <label></label>
              <input
                  type={"radio"}
                  value={"USER"}
                  name={"login"}
                  defaultChecked={true}
                  onChange={(e) => setUserType(e.target.value)}
                      />
              <label>사용자</label>
              <input
                  type={"radio"}
                  id={"managerLogin"}
                  value={"ORG_MANAGER"}
                  name={"login"}
                  onChange={(e) => setUserType(e.target.value)}
                      />
              <label>직원</label>
              <input
                  type={"radio"}
                  id={"companyLogin"}
                  value={"ORG_ADMIN"}
                  name={"login"}
                  onChange={(e) => setUserType(e.target.value)}
                      />
              <label>기업</label>
            </div>

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
                <img src={KakaoIcon} alt="kakao login" className={styles.socialIcon}/>
                카카오 로그인
              </button>
              <button className={`${styles.socialButton} ${styles.googleButton}`}>
                <img src={GoogleIcon} alt="google login" className={styles.socialIcon}/>
                구글 로그인
              </button>
              <button className={`${styles.socialButton} ${styles.naverButton}`}>
                <img src={NaverIcon} alt="naver login" className={styles.socialIcon}/>
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