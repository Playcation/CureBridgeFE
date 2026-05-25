// src/App.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

import Layout from './component/layout/Layout';
import MyPageLayout from './component/layout/MyPageLayout';
import PrivateRoute from './component/PrivateRoute';

import MainPage from './pages/main/MainPage';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/sign-up/SignUpPage';
import FindPasswordPage from './pages/find-password/FindPasswordPage';
import NewsPage from './pages/board/NewsPage';
import HealthReportPage from './pages/health-report/HealthReportPage';

import NoticeListPage from './pages/notice/NoticeListPage';
import NoticeDetailPage from './pages/notice/NoticeDetailPage';
import NoticeCreatePage from './pages/notice/NoticeCreatePage';
import NoticeEditPage from './pages/notice/NoticeEditPage';

import SupportListPage from './pages/support/SupportListPage';
import SupportDetailPage from './pages/support/SupportDetailPage';
import SupportCreatePage from './pages/support/SupportCreatePage';
import SupportEditPage from './pages/support/SupportEditPage';

import MyPageRedirect from './pages/mypage/MyPageRedirect';
import UserProfilePage from './pages/mypage/user/UserProfilePage';
import UserProfileEditPage from './pages/mypage/user/UserProfileEditPage';
import UserPasswordPage from './pages/mypage/user/UserPasswordPage';
import UserWithdrawPage from './pages/mypage/user/UserWithdrawPage';
import ManagerMyPage from './pages/mypage/manager/ManagerMyPage';
import OrgAdminMyPage from './pages/mypage/org_admin/OrgAdminMyPage';

import ChatMainPage from './pages/chat/ChatMainPage';
import MyChatListPage from './pages/chat/MyChatListPage';
import ChatPage from './pages/chat/ChatPage';
import MemberListPage from './pages/chat/MemberListPage';

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Layout>
                    <Routes>
                        {/* ── 공개 라우트 ── */}
                        <Route path="/" element={<MainPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/news" element={<NewsPage />} />
                        <Route path="/notice" element={<NoticeListPage />} />
                        <Route path="/notice/:noticeId" element={<NoticeDetailPage />} />
                        <Route path="/support" element={<SupportListPage />} />
                        <Route path="/find-password" element={<FindPasswordPage />} />
                        <Route path="/support/:supportId" element={<SupportDetailPage />} />

                        {/* ── 로그인 필요 라우트 ── */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/health-report" element={<HealthReportPage />} />
                            <Route path="/notice/create" element={<NoticeCreatePage />} />
                            <Route path="/notice/edit/:noticeId" element={<NoticeEditPage />} />
                            <Route path="/support/create" element={<SupportCreatePage />} />
                            <Route path="/support/edit/:supportId" element={<SupportEditPage />} />

                            {/* 마이페이지 */}
                            <Route path="/mypage" element={<MyPageRedirect />} />
                            <Route path="/mypage/user" element={<MyPageLayout />}>
                                <Route path="profile" element={<UserProfilePage />} />
                                <Route path="profile-edit" element={<UserProfileEditPage />} />
                                <Route path="password" element={<UserPasswordPage />} />
                                <Route path="withdraw" element={<UserWithdrawPage />} />
                            </Route>
                            <Route path="/mypage/manager" element={<MyPageLayout />}>
                                <Route index element={<ManagerMyPage />} />
                            </Route>
                            <Route path="/mypage/org_admin" element={<MyPageLayout />}>
                                <Route index element={<OrgAdminMyPage />} />
                            </Route>

                            {/* 채팅 */}
                            <Route path="/chat/groupchatting/list" element={<ChatMainPage />} />
                            <Route path="/chat/my/rooms" element={<MyChatListPage />} />
                            <Route path="/chat/chatPage/:roomId" element={<ChatPage />} />
                            <Route path="/chat/member/list" element={<MemberListPage />} />
                        </Route>
                    </Routes>
                </Layout>
            </PersistGate>
        </Provider>
    );
}

export default App;
