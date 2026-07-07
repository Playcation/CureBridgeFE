// src/pages/health-report/HealthReportPage.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReportTable from '../../component/health-report/ReportTable';
import { getHealthReportsByUserId } from '../../api/ContentApi';
import { selectCurrentUserId } from '../../store/slices/authSlice';
import styles from './HealthReportPage.module.css';

const HealthReportPage = () => {
    const userId = useSelector(selectCurrentUserId);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState('');

    const fetchReports = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getHealthReportsByUserId(userId);
            if (response && response.data) {
                const processedReports = response.data.map((report: any) => ({
                    id: report.id,
                    title: report.title,
                    reportDate: report.reportDate,
                    summery: report.summery,
                    rate: report.rate,
                    ocrResults: report.ocrResults,
                }));
                setReports(processedReports);
            }
        } catch (error) {
            setError('건강 보고서를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [userId]);

    return (
        <div className={styles.container}>
            <h2 className={styles.pageMainTitle}>건강 보고서 조회</h2>

            {/* 날짜 검색 */}
            <div className={styles.searchRow}>
                <input
                    type="date"
                    className={styles.dateInput}
                    value={searchDate}
                    onChange={e => setSearchDate(e.target.value)}
                />
                <button className={styles.searchButton} onClick={fetchReports}>
                    검색
                </button>
            </div>

            {/* 결과 */}
            {loading ? (
                <div className={styles.statusMessage}>불러오는 중...</div>
            ) : error ? (
                <div className={styles.statusMessage} style={{ color: 'red' }}>{error}</div>
            ) : (
                <ReportTable reports={reports} />
            )}
        </div>
    );
};

export default HealthReportPage;
