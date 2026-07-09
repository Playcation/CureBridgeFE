// src/pages/find-password/FindPasswordPage.tsx
// TODO: 백엔드 비밀번호 찾기 API 구현 후 연결 필요!!!! (아직없음)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './FindPassword.module.css';

type Step = 1 | 2 | 3;

const FindPasswordPage: React.FC = () => {
    const [step, setStep] = useState<Step>(1);

    // 1단계
    const [email, setEmail] = useState('');
    // 2단계
    const [code, setCode] = useState('');
    // 3단계
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // ── 1단계: 이메일로 인증코드 발송 ──
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        try {
            // TODO: 인증코드 발송 API 연결
            // await sendVerificationCode(email);
            await new Promise(res => setTimeout(res, 600)); // 임시
            setStep(2);
        } catch (e: any) {
            setErrorMsg(e.response?.data?.message || '인증코드 발송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // ── 2단계: 인증코드 확인 ──
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        try {
            // TODO: 인증코드 확인 API 연결
            // await verifyCode(email, code);
            await new Promise(res => setTimeout(res, 600)); // 임시
            setStep(3);
        } catch (e: any) {
            setErrorMsg(e.response?.data?.message || '인증코드가 일치하지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    // ── 3단계: 새 비밀번호 설정 ──
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(newPassword)) {
            setErrorMsg('비밀번호는 영문, 숫자, 특수문자를 각 1개 이상 포함해야 합니다.');
            return;
        }

        setLoading(true);
        try {
            // TODO: 비밀번호 재설정 API 연결
            // await resetPassword(email, code, newPassword);
            await new Promise(res => setTimeout(res, 600)); // 임시
            setStep(1); // 완료 후 처리는 done 상태로 변경
            setEmail('');
            setCode('');
            setNewPassword('');
            setConfirmPassword('');
            alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
        } catch (e: any) {
            setErrorMsg(e.response?.data?.message || '비밀번호 변경에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const EyeIcon = ({ show }: { show: boolean }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {show ? (
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </>
            ) : (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            )}
        </svg>
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>

                {/* 타이틀 */}
                <h1 className={styles.title}>비밀번호 찾기</h1>

                {/* 스텝 인디케이터 */}
                <div className={styles.stepIndicator}>
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`${styles.stepDot} ${step >= s ? styles.stepDotActive : ''}`}>
                                {step > s ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    s
                                )}
                            </div>
                            {s < 3 && (
                                <div className={`${styles.stepLine} ${step > s ? styles.stepLineActive : ''}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* 스텝 라벨 */}
                <div className={styles.stepLabels}>
                    <span className={step === 1 ? styles.stepLabelActive : styles.stepLabel}>이메일 입력</span>
                    <span className={step === 2 ? styles.stepLabelActive : styles.stepLabel}>인증코드 확인</span>
                    <span className={step === 3 ? styles.stepLabelActive : styles.stepLabel}>비밀번호 재설정</span>
                </div>

                {/* 에러 메시지 */}
                {errorMsg && (
                    <div className={styles.errorMsg}>✕ {errorMsg}</div>
                )}

                {/* ── 1단계: 이메일 입력 ── */}
                {step === 1 && (
                    <form className={styles.form} onSubmit={handleSendCode}>
                        <p className={styles.desc}>
                            가입하신 이메일 주소를 입력해주세요.<br />
                            인증코드를 발송해드립니다.
                        </p>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이메일</label>
                            <input
                                className={styles.input}
                                type="email"
                                placeholder="이메일을 입력하세요"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? '발송 중...' : '인증코드 발송'}
                        </button>
                    </form>
                )}

                {/* ── 2단계: 인증코드 확인 ── */}
                {step === 2 && (
                    <form className={styles.form} onSubmit={handleVerifyCode}>
                        <p className={styles.desc}>
                            <strong>{email}</strong>로 발송된<br />
                            인증코드 6자리를 입력해주세요.
                        </p>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>인증코드</label>
                            <input
                                className={`${styles.input} ${styles.codeInput}`}
                                type="text"
                                placeholder="인증코드 6자리"
                                value={code}
                                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading || code.length < 6}
                        >
                            {loading ? '확인 중...' : '인증코드 확인'}
                        </button>
                        <button
                            type="button"
                            className={styles.resendButton}
                            onClick={() => setStep(1)}
                        >
                            이메일 다시 입력하기
                        </button>
                    </form>
                )}

                {/* ── 3단계: 새 비밀번호 ── */}
                {step === 3 && (
                    <form className={styles.form} onSubmit={handleResetPassword}>
                        <p className={styles.desc}>
                            새로운 비밀번호를 입력해주세요.<br />
                            영문, 숫자, 특수문자 포함 8자 이상
                        </p>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>새 비밀번호</label>
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    className={styles.passwordInput}
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="새 비밀번호 입력"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowNew(!showNew)}
                                >
                                    <EyeIcon show={showNew} />
                                </button>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>새 비밀번호 확인</label>
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    className={styles.passwordInput}
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="새 비밀번호 재입력"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    <EyeIcon show={showConfirm} />
                                </button>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <span className={styles.hint}>비밀번호가 일치하지 않습니다.</span>
                            )}
                            {confirmPassword && newPassword === confirmPassword && (
                                <span className={styles.hintSuccess}>비밀번호가 일치합니다.</span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading || newPassword !== confirmPassword}
                        >
                            {loading ? '변경 중...' : '비밀번호 변경'}
                        </button>
                    </form>
                )}

                {/* 하단 링크 */}
                <div className={styles.linksContainer}>
                    <Link to="/login" className={`${styles.link} ${styles.loginLink}`}>
                        로그인으로 돌아가기
                    </Link>
                    <Link to="/signup" className={`${styles.link} ${styles.signupLink}`}>
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FindPasswordPage;