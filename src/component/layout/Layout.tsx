// src/component/layout/Layout.tsx

import React from 'react';
import Header from './Header'; // Header 컴포넌트 import
import Footer from './Footer'; // Footer 컴포넌트 import
import styles from './Layout.module.css'; // 방금 만든 Layout 스타일 import

// Layout 컴포넌트가 받을 props의 타입을 정의
// children은 React 컴포넌트가 될 수 있으므로 React.ReactNode 타입을 사용
interface LayoutProps {
  children: React.ReactNode;
}

// Layout 컴포넌트 정의
const Layout = ({ children }: LayoutProps) => {
  return (
    // 전체를 감싸는 div에 Flexbox 스타일을 적용
    <div className={styles.layoutContainer}>
      <Header />

      {/* 페이지의 실제 내용이 들어가는 부분*/}
      <main className={styles.mainContent}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;