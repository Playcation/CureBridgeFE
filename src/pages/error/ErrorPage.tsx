import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../main/MainPage.module.css'; // 기존 스타일 재활용

function ErrorPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const status = searchParams.get('status') || 'Error';
    const message = searchParams.get('msg') || '알 수 없는 오류가 발생했습니다.';

    return (
        <div className={styles.pageWrapper} style={{ height: '80vh', justifyContent: 'center' }}>
            <div className={styles.heroLeft} style={{ alignItems: 'center', textAlign: 'center' }}>
                <div className={styles.heroHighlight}>{status} Error</div>
                <h1 className={styles.heroTitle}>문제가 발생했습니다</h1>
                <p className={styles.heroSub}>
                    {/*요청하신 처리를 완료하지 못했습니다. <br />
                    지속적으로 발생할 경우 관리자에게 문의해주세요.*/}
                    {message}
                </p>

                <div className={styles.ctaColumn} style={{ marginTop: '24px' }}>
                    <button
                        className={`${styles.ctaButton} ${styles.ctaBlue}`}
                        onClick={() => navigate('/')}
                    >
                        <span>메인으로 돌아가기</span>
                        <span className={styles.ctaIcon}>🏠</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;