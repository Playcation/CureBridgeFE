// src/pages/login/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../../store/slices/authSlice';
import styles from './Login.module.css';

// asset 폴더에 아이콘
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
  const [userType, setUserType] = useState<'USER' | 'ORG_MANAGER' | 'ORG_ADMIN'>('USER');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // role을 명시적으로 포함
    const loginData: LoginType = {
      email,
      password,
      role: userType  // USER, ORG_MANAGER, ORG_ADMIN 중 하나
    };

    console.log('로그인 요청 데이터:', loginData); // 디버깅용

    try {
      const response = await userLogin(loginData);

      console.log('로그인 응답:', response.data); // 디버깅용
      console.log('로그인 전체 응답:', response);
      console.log('로그인 응답 data:', response.data);
      console.log('로그인 응답 data 타입:', typeof response.data);
      console.log('로그인 응답 data keys:', Object.keys(response.data)); // 👈 어떤 키들이 있는지 확인

      const { accessToken, userId, userRole } = response.data;

      if (accessToken && userId) {
        // localStorage에 저장
        localStorage.setItem('Authorization', accessToken);

        // Redux 상태 업데이트
        dispatch(loginAction({
          token: accessToken,
          userId: userId,
          userRole: userRole as any
        }));

        alert(`로그인 성공! (${userRole} 권한)`);
        navigate('/');
      } else {
        throw new Error('로그인에 성공했으나 필요한 정보를 받지 못했습니다.');
      }

    } catch (error: any) {
      console.error('로그인 실패:', error);
      console.error('에러 응답:', error.response?.data); // 백엔드 에러 메시지 확인
      alert('로그인에 실패했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
      <div className={styles.pageContainer}>
        <div className={styles.loginForm}>
          <h1 className={styles.title}>로그인</h1>

          <div className={styles.togleContainer}>
            <input
                type="radio"
                value="USER"
                name="login"
                id="userLogin"
                checked={userType === 'USER'}
                onChange={(e) => setUserType(e.target.value as 'USER')}
            />
            <label htmlFor="userLogin">사용자</label>

            <input
                type="radio"
                value="ORG_MANAGER"
                name="login"
                id="managerLogin"
                checked={userType === 'ORG_MANAGER'}
                onChange={(e) => setUserType(e.target.value as 'ORG_MANAGER')}
            />
            <label htmlFor="managerLogin">직원</label>

            <input
                type="radio"
                value="ORG_ADMIN"
                name="login"
                id="companyLogin"
                checked={userType === 'ORG_ADMIN'}
                onChange={(e) => setUserType(e.target.value as 'ORG_ADMIN')}
            />
            <label htmlFor="companyLogin">기업</label>
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
                    type={showPassword ? 'text' : 'password'}
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
                    onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <button type="submit" className={styles.loginButton}>로그인</button>
          </form>

          {/* 소셜 로그인 버튼 영역 */}

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