// src/pages/main/MainPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";

function MainPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.pageWrapper}>

            {/* ── HERO ── */}
            <section className={styles.heroSection}>
                <div className={styles.heroLeft}>
                    <div className={styles.heroHighlight}>AI 기반 개인 맞춤 건강 관리</div>

                    <h1 className={styles.heroTitle}>
                        진단서부터 보험까지,
                        <br />
                        내 건강 정보를 한 번에 확인하세요.
                    </h1>

                    <p className={styles.heroSub}>
                        병원 진단서 OCR, 건강 분석 리포트, 국민건강보험 적용 여부를
                        한 곳에서 조회할 수 있는 병원 포털입니다.
                    </p>
                </div>

                <div className={styles.ctaColumn}>
                    <button
                        className={`${styles.ctaButton} ${styles.ctaPurple}`}
                        onClick={() => navigate("/health-report")}
                    >
                        <span>건강 분석 리포트 조회하기</span>
                        <span className={styles.ctaIcon}>➜</span>
                    </button>

                    <button
                        className={`${styles.ctaButton} ${styles.ctaOrange}`}
                        onClick={() => navigate("/support")}
                    >
                        <span>궁금한 점이 있으신가요?</span>
                        <span className={styles.ctaIcon}>➜</span>
                    </button>
                </div>
            </section>

            {/* ── 주요 기능 카드 ── */}
            <section className={styles.featuresSection}>
                <div className={styles.featuresHeader}>
                    <h2 className={styles.featuresTitle}>주요 기능</h2>
                    <p className={styles.featuresSub}>
                        자주 사용하는 기능을 한 곳에서 빠르게 이용할 수 있어요.
                    </p>
                </div>

                <div className={styles.cardsRow}>
                    <button className={styles.card} onClick={() => navigate("/health-report")}>
                        <div className={styles.cardTop}>
                            <span className={styles.cardTitle}>
                                진단서 OCR 업로드 및
                                <br />
                                결과 조회하기
                            </span>
                            <span className={styles.cardArrowCircle}>➜</span>
                        </div>
                        <p className={styles.cardDesc}>
                            진단서를 업로드하면 AI가 내용을 인식하고,
                            필요한 핵심 정보를 자동으로 정리해 보여줍니다.
                        </p>
                    </button>

                    <button className={styles.card} onClick={() => navigate("/news")}>
                        <div className={styles.cardTop}>
                            <span className={styles.cardTitle}>의학 뉴스 조회하기</span>
                            <span className={styles.cardArrowCircle}>➜</span>
                        </div>
                        <p className={styles.cardDesc}>
                            최신 의학 뉴스와 연구 정보를 모아,
                            내 건강 상태와 연관된 정보를 빠르게 확인할 수 있어요.
                        </p>
                    </button>

                    <button className={styles.card} onClick={() => navigate("/chat/groupchatting/list")}>
                        <div className={styles.cardTop}>
                            <span className={styles.cardTitle}>전문가와 실시간 채팅하기</span>
                            <span className={styles.cardArrowCircle}>➜</span>
                        </div>
                        <p className={styles.cardDesc}>
                            궁금한 점을 전문가에게 실시간으로 질문하고,
                            필요한 경우 상담을 이어갈 수 있습니다.
                        </p>
                    </button>
                </div>
            </section>

            {/* ── 사용 방법 ── */}
            <section className={styles.infoSection}>
                <div className={styles.infoTitleArea}>
                    <h2 className={styles.infoTitle}>MindBridge는 이렇게 사용해요</h2>
                    <p className={styles.infoSub}>
                        진단서 업로드부터 상담 연결까지, 세 단계면 충분해요.
                    </p>
                </div>

                <div className={styles.stepsGrid}>
                    <div className={styles.stepCard}>
                        <span className={styles.stepBadge}>STEP 1</span>
                        <h3 className={styles.stepTitle}>진단서 업로드</h3>
                        <p className={styles.stepDesc}>
                            병원에서 받은 진단서를 사진이나 PDF로 업로드하면
                            OCR이 자동으로 내용을 인식해요.
                        </p>
                    </div>

                    <div className={styles.stepCard}>
                        <span className={styles.stepBadge}>STEP 2</span>
                        <h3 className={styles.stepTitle}>AI 건강 분석 리포트 확인</h3>
                        <p className={styles.stepDesc}>
                            진단 내용과 검사 결과를 바탕으로 현재 상태와
                            주의해야 할 부분을 한눈에 보여드립니다.
                        </p>
                    </div>

                    <div className={styles.stepCard}>
                        <span className={styles.stepBadge}>STEP 3</span>
                        <h3 className={styles.stepTitle}>전문가 상담 연결</h3>
                        <p className={styles.stepDesc}>
                            궁금한 점은 공지사항과 문의하기를 통해 확인하고,
                            전문가와의 실시간 채팅으로 이어갈 수 있어요.
                        </p>
                    </div>
                </div>

                <div className={styles.trustBar}>
                    🔒 개인정보 보호를 위해 업로드된 데이터는 안전하게 처리됩니다.
                </div>
            </section>
        </div>
    );
}

export default MainPage;
