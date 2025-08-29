import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HealthReportPage from './pages/health-report/HealthReportPage'

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/health-report" element={<HealthReportPage />} />
        </Routes>
      </Router>
  );
}

export default App;
