// src/App.tsx

import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

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
// import Calendar from './pages/calendar/Calendar';

import ChatMainPage from "./pages/chat/ChatMainPage";
import MyChatListPage from "./pages/chat/MyChatListPage";
import ChatPage from "./pages/chat/ChatPage";
import MemberListPage from "./pages/chat/MemberListPage";
import NewsPage from "./pages/board/NewsPage";
import MainPage from "./pages/main/MainPage";
import SupportListPage from "./pages/support/SupportListPage";
import SupportDetailPage from "./pages/support/SupportDetailPage";
import SupportCreatePage from "./pages/support/SupportCreatePage";
import SupportEditPage from "./pages/support/SupportEditPage";
import ErrorPage from "./pages/error/ErrorPage";


function App() {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Layout>
              <Routes>
                <Route path="/health-report" element={<HealthReportPage />} />
                <Route path="/" element={<MainPage />} />

                {/* 로그인 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* 공지사항 목록,상세,등록,수정 페이지 */}
                <Route path="/notice" element={<NoticeListPage />} />
                <Route path="/notice/:noticeId" element={<NoticeDetailPage />} />
                <Route path="/notice/create" element={<NoticeCreatePage />} />
                <Route path="/notice/edit/:noticeId" element={<NoticeEditPage />} />

              <Route path="/news" element={<NewsPage/>}/>

              {/* 마이페이지 */}
              <Route path="/mypage/manager" element={<ManagerMyPage/>}/>
              <Route path="/mypage/org_admin" element={<OrgAdminMyPage/>}/>

                {/* 채팅 */}
                <Route path="/chat/groupchatting/list" element={<ChatMainPage />} />
                <Route path="/chat/my/rooms" element={<MyChatListPage />} />
                <Route path="/chat/chatPage/:roomId" element={<ChatPage />} />
                <Route path="/chat/member/list" element={<MemberListPage />} />

                  {/* 문의하기 */}
                <Route path="/support" element={<SupportListPage />} />
                <Route path="/support/:supportId" element={<SupportDetailPage />} />
                <Route path="/support/create" element={<SupportCreatePage />} />
                <Route path="/support/edit/:supportId" element={<SupportEditPage />} />

                {/* 에러 */}
                <Route path="/error" element={<ErrorPage />} />

                {/* 등록되지 않은 url 관리 */}
                <Route
                  path="*"
                  element={<Navigate to="/error?status=404&msg=존재하지 않는 페이지입니다." replace />}
                />

              </Routes>
            </Layout>
        </PersistGate>
      </Provider>
  );
}

export default App;