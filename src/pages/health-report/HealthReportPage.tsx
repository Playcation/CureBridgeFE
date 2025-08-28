import React from 'react';
import { Box, Container, Typography, Paper, TextField, Button } from '@mui/material';
import Header from '../../component/layout/Header';
import Sidebar from '../../component/layout/NavBar';
import ReportTable from '../../component/health-report/ReportTable';
import styles from './HealthReportPage.css';

const HealthReportPage = () => {
  return (
    <Box className={styles.pageWrapper}>
      <Header />
      <Sidebar />
      <Box component="main" className={styles.mainContent}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>건강 보고서 조회</Typography>
          <Paper elevation={0} className={styles.searchPaper}>
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
      <Box className={styles.footer}>
        <Typography variant="body2">
          회원 혜택
        </Typography>
      </Box>
    </Box>
  );
};

export default HealthReportPage;
