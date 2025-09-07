// src/component/layout/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

import DecoIcon1 from '../../asset/footer-deco-1.png';
import DecoIcon2 from '../../asset/footer-deco-2.png';
import DecoIcon3 from '../../asset/footer-deco-3.png';
import DecoIcon4 from '../../asset/footer-deco-4.png';

// 웹사이트 이름은 변수로 빼두면 나중에 바꾸기 편함
const SITE_NAME = "MindBridge";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
      {/* 장식용 아이콘들 (배경 역할) */}
      <img src={DecoIcon1} alt="" className={`${styles.decoIcon} ${styles.decoIcon1}`} />
      <img src={DecoIcon2} alt="" className={`${styles.decoIcon} ${styles.decoIcon2}`} />
      <img src={DecoIcon3} alt="" className={`${styles.decoIcon} ${styles.decoIcon3}`} />
      <img src={DecoIcon4} alt="" className={`${styles.decoIcon} ${styles.decoIcon4}`} />

      {/* 실제 콘텐츠 영역 */}
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>
          {SITE_NAME}에 대해 궁금하세요?
        </h2>
        <Link to="/qna" className={styles.qnaButton}>
          문의하기
        </Link>
      </div>
    </footer>
  );
};

export default Footer;