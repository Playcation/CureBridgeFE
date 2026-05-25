// src/pages/mypage/user/UserPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserPassword } from '../../../api/UserApi';
import styles from './UserMyPage.module.css';

const UserPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [currPassword, setCurrPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurr, setShowCurr] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 비밀번호 강도 체크
    const getStrength = (pw: string): { level: number; text: string } => {
        if (!pw) return { level: 0, text: '' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) score++;
        if (/[@$!%*#?&]/.test(pw)) score++;
        const texts = ['', '약함', '보통', '강함'];
        return { level: score, text: texts[score] };
    };

    const strength = getStrength(newPassword);

    const getSegmentClass = (idx: number) => {
        if (strength.level === 0) return '';
        if (strength.level === 1 && idx === 0) return styles.weak;
        if (strength.level === 2 && idx <= 1) return styles.medium;
        if (strength.level === 3) return styles.strong;
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPassword.length < 8) {
            setErrorMsg('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }
        if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(newPassword)) {
            setErrorMsg('비밀번호는 영문, 숫자, 특수문자를 각 1개 이상 포함해야 합니다.');
            return;
        }

        setLoading(true);
        try {
            await updateUserPassword(currPassword, newPassword);
            setSuccessMsg('비밀번호가 성공적으로 변경되었습니다.');
            setCurrPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (e: any) {
            const msg = e.response?.data?.message;
            if (msg) {
                setErrorMsg(msg);
            } else {
                setErrorMsg('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
            }
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
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>비밀번호 변경</h2>
            <p className={styles.cardDesc}>
                현재 비밀번호를 확인 후 새 비밀번호로 변경합니다.
            </p>

            {successMsg && (
                <div className={styles.successMsg} style={{ marginBottom: '20px' }}>
                    ✓ {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className={styles.errorMsg} style={{ marginBottom: '20px' }}>
                    ✕ {errorMsg}
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* 현재 비밀번호 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>현재 비밀번호</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showCurr ? 'text' : 'password'}
                            placeholder="현재 비밀번호를 입력하세요"
                            value={currPassword}
                            onChange={e => setCurrPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowCurr(!showCurr)}
                        >
                            <EyeIcon show={showCurr} />
                        </button>
                    </div>
                </div>

                <hr className={styles.divider} />

                {/* 새 비밀번호 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>새 비밀번호</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showNew ? 'text' : 'password'}
                            placeholder="새 비밀번호를 입력하세요 (영문+숫자+특수문자 8자 이상)"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowNew(!showNew)}
                        >
                            <EyeIcon show={showNew} />
                        </button>
                    </div>
                    {/* 강도 바 */}
                    {newPassword && (
                        <>
                            <div className={styles.strengthBar}>
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className={`${styles.strengthSegment} ${getSegmentClass(i)}`}
                                    />
                                ))}
                            </div>
                            <span className={styles.strengthText}>
                                비밀번호 강도: {strength.text}
                            </span>
                        </>
                    )}
                </div>

                {/* 새 비밀번호 확인 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>새 비밀번호 확인</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="새 비밀번호를 다시 입력하세요"
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
                        <span className={styles.hint} style={{ color: '#f04438' }}>
                            비밀번호가 일치하지 않습니다.
                        </span>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                        <span className={styles.hint} style={{ color: '#12b76a' }}>
                            비밀번호가 일치합니다.
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        type="submit"
                        className={`${styles.btnPrimary} ${styles.btnFull}`}
                        disabled={loading}
                    >
                        {loading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                    <button
                        type="button"
                        className={styles.btnOutline}
                        onClick={() => navigate('/mypage/user/profile')}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserPasswordPage;
