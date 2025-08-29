import React from 'react';
import { Box, Container, Typography, Paper, TextField, Button } from '@mui/material';
import Header from '../../component/layout/Header';
import Sidebar from '../../component/layout/NavBar';
import ReportTable from '../../component/health-report/ReportTable';
import styles from './HealthReportPage';

const HealthReportPage = () => {
  return (
    <Box className="pageWrapper">
      <Header />
      <Sidebar />
      <Box component="main" className="pageWrapper">
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>건강 보고서 조회</Typography>
          <Paper elevation={0} className="pageWrapper">
            <TextField
              type="date"
              variant="outlined"
              size="small"
              defaultValue="2025-08-02"
            />
            <Button variant="contained">검색</Button>
          </Paper>
          <ReportTable />
        </Container>
      </Box>
    </Box>
  );
};

export default HealthReportPage;
