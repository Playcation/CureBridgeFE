import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// layout 컴포넌트 안에, 헤더 푸터 포함되어있음
import Layout from './component/layout/Layout';

import HealthReportPage from './pages/health-report/HealthReportPage'
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/sign-up/SignUpPage';
import NewsPage from "./pages/board/NewsPage";

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/health-report" element={<HealthReportPage/>}/>
            <Route path="/news" element={<NewsPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;
