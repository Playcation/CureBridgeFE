import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Paper,
  TablePagination,
} from '@mui/material';
import ReportRow from './ReportRow';
import styles from "./ReportTable.css";

const reports = [
  {
    id: '00000003',
    type: '일반 보고서',
    date: '2025-08-02',
    rating: 5,
    details: {
      name: '홍길동',
      gender: '남',
      age: '40대',
      result: '정상',
      opinion: '정상',
    },
  },
  {
    id: '00000002',
    type: '정기 보고서',
    date: '2025-08-02',
    rating: 5,
    details: null, // 확장 내용 없음
  },
  // ... 다른 보고서 데이터
];

const ReportTable = () => {
  return (
    <>
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow className={styles.tableHeader}>
              <TableCell padding="checkbox"><Checkbox /></TableCell>
              <TableCell>보고서 번호</TableCell>
              <TableCell>보고서 종류</TableCell>
              <TableCell>진단일</TableCell>
              <TableCell>결과</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={100} // 예시
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </>
  );
};

export default ReportTable;
