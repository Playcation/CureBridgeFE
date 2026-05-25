// src/pages/mypage/manager/ManagerMyPage.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getManagerInfo } from '../../../api/MemberApi';
import { selectCurrentUserId } from '../../../store/slices/authSlice';
import styles from './ManagerMyPage.module.css';

interface ManagerInfo {
    name: string;
    rank: string;
    number: string;
}

function ManagerMyPage() {
    const [managerInfo, setManagerInfo] = useState<ManagerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = useSelector(selectCurrentUserId);

    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const response = await getManagerInfo();
                setManagerInfo(response.data);
            } catch (e) {
                setError('직원 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchManagerInfo();
    }, [userId]);

    if (loading) return <div className={styles.loading}>불러오는 중...</div>;
    if (error)   return <div className={styles.errorMsg}>✕ {error}</div>;
    if (!managerInfo) return null;

    const initial = managerInfo.name ? managerInfo.name.charAt(0).toUpperCase() : '?';

    return (
        <div className={styles.card}>
            {/* 프로필 상단 */}
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>{initial}</div>
                <div className={styles.profileInfo}>
                    <h2>{managerInfo.name}</h2>
                    <p>{managerInfo.rank || '직급 미설정'}</p>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* 정보 그리드 */}
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>이름</span>
                    <span className={styles.infoValue}>{managerInfo.name}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>직급</span>
                    <span className={styles.infoValue}>{managerInfo.rank || '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>전화번호</span>
                    <span className={styles.infoValue}>{managerInfo.number || '-'}</span>
                </div>
            </div>
        </div>
    );
}

export default ManagerMyPage;
