import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// layout 컴포넌트 안에, 헤더 푸터 포함되어있음
import Layout from './component/layout/Layout'; 

import HealthReportPage from './pages/health-report/HealthReportPage'
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/sign-up/SignUpPage';
import NoticeDetailPage from './pages/notice/NoticeDetailPage'; 
import NoticeListPage from './pages/notice/NoticeListPage';
import NoticeCreatePage from './pages/notice/NoticeCreatePage'; 
import NoticeEditPage from './pages/notice/NoticeEditPage'; 

function App() {
  return (
        <Layout> 
            <Routes>
                <Route path="/health-report" element={<HealthReportPage />} />

                {/* 로그인 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* 공지사항 목록,상세,등록,수정 페이지 */}
                <Route path="/notice" element={<NoticeListPage />} /> 
                <Route path="/notice/:noticeId" element={<NoticeDetailPage />} /> 
                <Route path="/notice/create" element={<NoticeCreatePage />} />
                <Route path="/notice/edit/:noticeId" element={<NoticeEditPage />} />


            </Routes>
        </Layout>
  );
}

export default App;
