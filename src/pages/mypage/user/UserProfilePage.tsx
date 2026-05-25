// src/pages/mypage/user/UserProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store/store';
import { getUserInfo } from '../../../api/UserApi';
import styles from './UserMyPage.module.css';

interface UserInfo {
    id: number;
    name: string;
    email: string;
    birthDate: string | null;
    phoneNumber: string | null;
    createdAt: string;
}

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.userId);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) return;
        const fetch = async () => {
            try {
                const data = await getUserInfo(userId);
                setUserInfo(data);
            } catch (e) {
                setError('회원정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [userId]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    const formatJoinDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    if (loading) return <div className={styles.loading}>불러오는 중...</div>;
    if (error) return <div className={styles.errorMsg}>{error}</div>;
    if (!userInfo) return null;

    // 이름 첫글자로 아바타
    const initial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?';

    return (
        <div className={styles.card}>
            {/* 프로필 상단 */}
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>{initial}</div>
                <div className={styles.profileInfo}>
                    <h2>{userInfo.name}</h2>
                    <p>{userInfo.email}</p>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* 정보 그리드 */}
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>이름</span>
                    <span className={styles.infoValue}>{userInfo.name}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>이메일 (아이디)</span>
                    <span className={styles.infoValue}>{userInfo.email}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>전화번호</span>
                    <span className={styles.infoValue}>{userInfo.phoneNumber || '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>생년월일</span>
                    <span className={styles.infoValue}>{formatDate(userInfo.birthDate)}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>가입일</span>
                    <span className={styles.infoValue}>{formatJoinDate(userInfo.createdAt)}</span>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* 바로가기 버튼들 */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    className={styles.btnPrimary}
                    onClick={() => navigate('/mypage/user/profile-edit')}
                >
                    회원정보 수정
                </button>
                <button
                    className={styles.btnOutline}
                    onClick={() => navigate('/mypage/user/password')}
                >
                    비밀번호 변경
                </button>
                <button
                    className={styles.btnDanger}
                    onClick={() => navigate('/mypage/user/withdraw')}
                    style={{ marginLeft: 'auto' }}
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    );
};

export default UserProfilePage;
