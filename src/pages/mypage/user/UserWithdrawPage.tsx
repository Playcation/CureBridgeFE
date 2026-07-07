// src/pages/mypage/user/UserWithdrawPage.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/slices/authSlice';
import { checkUserPassword, deleteUserAccount } from '../../../api/UserApi';
import styles from './UserMyPage.module.css';

type Step = 'confirm' | 'verify' | 'done';

const UserWithdrawPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState<Step>('confirm');
    const [agreed, setAgreed] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 1단계: 안내 확인 후 비밀번호 인증 단계로
    const handleProceed = () => {
        if (!agreed) return;
        setStep('verify');
    };

    // 2단계: 비밀번호 확인 후 탈퇴 처리
    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            // 비밀번호 확인
            await checkUserPassword(password);
            // 탈퇴 처리
            await deleteUserAccount();
            // 로그아웃 처리
            dispatch(logout());
            setStep('done');
        } catch (e: any) {
            const msg = e.response?.data?.message;
            setErrorMsg(msg || '탈퇴 처리에 실패했습니다. 비밀번호를 확인해주세요.');
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

    // ── 완료 화면 ──
    if (step === 'done') {
        return (
            <div className={styles.card} style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                <h2 className={styles.cardTitle} style={{ marginBottom: '8px' }}>
                    탈퇴가 완료되었습니다
                </h2>
                <p style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    color: '#667085',
                    marginBottom: '32px',
                    lineHeight: '1.6',
                }}>
                    그동안 이용해주셔서 감사합니다.<br />
                    30일 후 계정이 완전히 삭제됩니다.
                </p>
                <button
                    className={styles.btnPrimary}
                    onClick={() => navigate('/')}
                >
                    홈으로 이동
                </button>
            </div>
        );
    }

    // ── 1단계: 안내 확인 ──
    if (step === 'confirm') {
        return (
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>회원 탈퇴</h2>
                <p className={styles.cardDesc}>탈퇴 전 반드시 아래 내용을 확인해주세요.</p>

                <div className={styles.warningBox}>
                    <h3>⚠️ 탈퇴 시 주의사항</h3>
                    <ul>
                        <li>탈퇴 신청 후 30일 뒤 계정이 완전히 삭제됩니다.</li>
                        <li>작성한 게시물 및 댓글은 삭제되지 않습니다.</li>
                        <li>탈퇴 후 동일한 이메일로 재가입이 가능합니다.</li>
                        <li>진행 중인 서비스가 있는 경우 이용에 제한이 생길 수 있습니다.</li>
                    </ul>
                    <div className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            id="agree-withdraw"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="agree-withdraw">
                            위 내용을 모두 확인했으며, 탈퇴에 동의합니다.
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={styles.btnDanger}
                        onClick={handleProceed}
                        disabled={!agreed}
                        style={{ opacity: agreed ? 1 : 0.4 }}
                    >
                        탈퇴 진행하기
                    </button>
                    <button
                        className={styles.btnOutline}
                        onClick={() => navigate('/mypage/user/profile')}
                    >
                        취소
                    </button>
                </div>
            </div>
        );
    }

    // ── 2단계: 비밀번호 인증 ──
    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>본인 확인</h2>
            <p className={styles.cardDesc}>
                회원 탈퇴를 위해 현재 비밀번호를 입력해주세요.
            </p>

            {errorMsg && (
                <div className={styles.errorMsg} style={{ marginBottom: '20px' }}>
                    ✕ {errorMsg}
                </div>
            )}

            <form className={styles.form} onSubmit={handleWithdraw}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>현재 비밀번호</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <EyeIcon show={showPassword} />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        type="submit"
                        className={styles.btnDanger}
                        disabled={loading || !password}
                        style={{ opacity: password ? 1 : 0.4 }}
                    >
                        {loading ? '처리 중...' : '탈퇴 확인'}
                    </button>
                    <button
                        type="button"
                        className={styles.btnOutline}
                        onClick={() => setStep('confirm')}
                    >
                        이전으로
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserWithdrawPage;
