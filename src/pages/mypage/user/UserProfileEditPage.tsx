// src/pages/mypage/user/UserProfileEditPage.tsx
// TODO: 백엔드 회원정보 수정 API 완성 후 연결 필요
// 백엔드 UpdateUserRequestDto: { phoneNumber, birth, password }
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store/store';
import { getUserInfo } from '../../../api/UserApi';
import styles from './UserMyPage.module.css';

const UserProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.userId);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!userId) return;
        const fetch = async () => {
            try {
                const data = await getUserInfo(userId);
                setName(data.name || '');
                setEmail(data.email || '');
                setPhoneNumber(data.phoneNumber || '');
                if (data.birthDate) {
                    // Date -> YYYY-MM-DD 형식으로 변환
                    const d = new Date(data.birthDate);
                    const formatted = d.toISOString().split('T')[0];
                    setBirthDate(formatted);
                }
            } catch (e) {
                setErrorMsg('회원정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            // TODO: 회원정보 수정 API 연결
            // await updateUserInfo({ phoneNumber, birth: new Date(birthDate) });
            // 임시: 백엔드 API 완성 후 연결
            await new Promise(res => setTimeout(res, 600)); // 임시 딜레이
            setSuccessMsg('회원정보가 수정되었습니다. (백엔드 연결 후 실제 저장됩니다)');
        } catch (e: any) {
            setErrorMsg(e.response?.data?.message || '수정에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loading}>불러오는 중...</div>;

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>회원정보 수정</h2>
            <p className={styles.cardDesc}>변경할 정보를 입력해주세요.</p>

            {successMsg && <div className={styles.successMsg}>✓ {successMsg}</div>}
            {errorMsg && <div className={styles.errorMsg}>✕ {errorMsg}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* 이름 (수정 불가) */}
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>이름</label>
                        <input
                            className={styles.input}
                            value={name}
                            disabled
                        />
                        <span className={styles.hint}>이름은 변경할 수 없습니다.</span>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>이메일 (아이디)</label>
                        <input
                            className={styles.input}
                            value={email}
                            disabled
                        />
                        <span className={styles.hint}>이메일은 변경할 수 없습니다.</span>
                    </div>
                </div>

                {/* 전화번호 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>전화번호</label>
                    <div className={styles.inputWithBtn}>
                        <input
                            className={styles.input}
                            type="tel"
                            placeholder="010-0000-0000"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                        {/* TODO: 인증 기능 추가 */}
                        <button type="button" className={styles.btnPrimary}>
                            인증하기
                        </button>
                    </div>
                </div>

                {/* 생년월일 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>생년월일</label>
                    <input
                        className={styles.input}
                        type="date"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                    />
                </div>

                <hr className={styles.divider} />

                {/* 버튼 */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        type="submit"
                        className={`${styles.btnPrimary} ${styles.btnFull}`}
                        disabled={saving}
                    >
                        {saving ? '저장 중...' : '변경사항 저장'}
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

export default UserProfileEditPage;
