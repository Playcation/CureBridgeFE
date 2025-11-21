import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import ReportTable from '../../component/health-report/ReportTable';
import { getOcr } from '../../api/Api'; // 이 API 함수가 실제로는 getHealthReports를 호출한다고 가정합니다.

const HealthReportPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // API 응답 데이터가 HealthReportResponseDto[] 형태라고 가정합니다.
        const response = await getOcr(1);
        if (response && response.data) {
          // response.data 배열을 직접 매핑합니다.
          const processedReports = response.data.map((report: any) => ({
            id: report.id,
            title: report.title, // 'type' -> 'title'
            reportDate: report.reportDate, // 'date' -> 'reportDate'
            summery: report.summery,
            rate: report.rate, // 'rating' -> 'rate'
            ocrResults: report.ocrResults, // 'details' -> 'ocrResults'
          }));
          setReports(processedReports);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
      <div className="pageWrapper">
        <main className="pageWrapper">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h4 style={{ marginBottom: '0.35em' }}>건강 보고서 조회</h4>
            <div className="pageWrapper">
              <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  defaultValue="2025-08-20"
              />
              <Button variant="contained">검색</Button>
            </div>
            <ReportTable reports={reports} />
          </div>
        </main>
      </div>
  );
};

export default HealthReportPage;
