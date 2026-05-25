// src/pages/mypage/org_admin/OrgAdminMyPage.tsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getOrganizationInfo } from '../../../api/MemberApi';
import { selectCurrentUserId } from '../../../store/slices/authSlice';
import styles from './OrgAdminMyPage.module.css';

interface OrganizationInfo {
    orgName: string;
    orgNumber: string;
    ownerName: string;
    ownerNumber: string;
    orgAddress: string;
}

function OrgAdminMyPage() {
    const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = useSelector(selectCurrentUserId);

    useEffect(() => {
        const fetchOrganizationInfo = async () => {
            try {
                const response = await getOrganizationInfo();
                setOrganizationInfo(response.data);
            } catch (e) {
                setError('기관 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrganizationInfo();
    }, [userId]);

    if (loading) return <div className={styles.loading}>불러오는 중...</div>;
    if (error)   return <div className={styles.errorMsg}>✕ {error}</div>;
    if (!organizationInfo) return null;

    const initial = organizationInfo.orgName ? organizationInfo.orgName.charAt(0).toUpperCase() : '?';

    return (
        <div className={styles.card}>
            {/* 프로필 상단 */}
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>{initial}</div>
                <div className={styles.profileInfo}>
                    <h2>{organizationInfo.orgName}</h2>
                    <p>{organizationInfo.orgAddress || '주소 미설정'}</p>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* 정보 그리드 */}
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>회사명</span>
                    <span className={styles.infoValue}>{organizationInfo.orgName}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>회사 전화번호</span>
                    <span className={styles.infoValue}>{organizationInfo.orgNumber || '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>대표자명</span>
                    <span className={styles.infoValue}>{organizationInfo.ownerName || '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>대표자 연락처</span>
                    <span className={styles.infoValue}>{organizationInfo.ownerNumber || '-'}</span>
                </div>
                <div className={`${styles.infoItem} ${styles.full}`}>
                    <span className={styles.infoLabel}>주소</span>
                    <span className={styles.infoValue}>{organizationInfo.orgAddress || '-'}</span>
                </div>
            </div>
        </div>
    );
}

export default OrgAdminMyPage;
