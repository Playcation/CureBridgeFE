// src/pages/login/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchLogin } from '../../api/Api'; // 💡 api.ts 파일에서 fetchLogin만 임포트
import { login as loginAction } from '../../store/slices/authSlice'; // Redux login 액션
import styles from './Login.module.css';

// asset 폴더에 아이콘 (경로는 필요에 따라 수정하세요)
import EyeIcon from '../../asset/eye-icon.png';
// ... (KakaoIcon, GoogleIcon, NaverIcon 등 유지) ...

const LoginPage: React.FC = () => {
    // 💡 테스트 계정으로 기본값 설정
    const [email, setEmail] = useState('admin@test.com'); 
    const [password, setPassword] = useState('12345678!');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 💡 로그인 처리 및 Redux 상태 업데이트 함수
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        setError(null);

        try {
            // 1. API 호출: fetchLogin이 토큰, ID, Role을 모두 반환합니다.
            const { token, userId, userRole } = await fetchLogin({ email, password });

            // 2. Redux 상태 업데이트: 3가지 정보를 바로 전달하여 로그인 상태와 권한을 설정
            dispatch(loginAction({ token, userId, userRole }));

            // 3. 성공 알림 및 공지사항 목록으로 이동
            alert(`로그인 성공! (${userRole} 권한으로 접속)`);
            navigate('/notice'); 

        } catch (err: any) {
            console.error("로그인 중 오류 발생:", err);
            // API가 반환한 오류 메시지를 사용자에게 표시
            const errorMessage = err.message || "로그인 요청 처리 중 오류가 발생했습니다. 서버 상태를 확인하세요.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginForm}>
                <h1 className={styles.title}>로그인</h1>
                
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

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
                            disabled={loading}
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
                                disabled={loading}
                            />
                            <img
                                src={EyeIcon}
                                alt="show password"
                                className={styles.eyeIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                {/* ... (소셜 로그인 및 하단 링크 영역 유지) ... */}
                <div className={styles.linksContainer}>
                    <Link to="/find-password" className={styles.link}>비밀번호를 잊으셨나요?</Link>
                    <Link to="/signup" className={styles.link}>회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;