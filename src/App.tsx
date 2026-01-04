// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// ✅ 추가: Redux Provider와 PersistGate
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

// layout 컴포넌트 안에, 헤더 푸터 포함되어있음
import Layout from './component/layout/Layout';

import HealthReportPage from './pages/health-report/HealthReportPage'
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/sign-up/SignUpPage';
import NoticeDetailPage from './pages/notice/NoticeDetailPage';
import NoticeListPage from './pages/notice/NoticeListPage';
import NoticeCreatePage from './pages/notice/NoticeCreatePage';
import NoticeEditPage from './pages/notice/NoticeEditPage';
import ManagerMyPage from './pages/mypage/manager/ManagerMyPage';
import OrgAdminMyPage from './pages/mypage/org_admin/OrgAdminMyPage';
import Calendar from './pages/calendar/Calendar';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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

            {/* 캘린더 */}
            <Route path="/calendar" element={<Calendar />} />

            {/* 마이페이지 */}
            <Route path="/mypage/manager" element={<ManagerMyPage />} />
            <Route path="/mypage/org_admin" element={<OrgAdminMyPage />} />
          </Routes>
        </Layout>
      </PersistGate>
    </Provider>
  );
}

export default App;