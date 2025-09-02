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
import styles from "./ReportTable";

interface OcrResult {
  reportId: string;
  reportTitle: string;
  patientName: string;
  diagnosis: string;
  reportDate: string;
  createdAt: string;
}

interface Report {
  id: string;
  title: string;
  count: number;
  reportDate: string;
  ocrResults: OcrResult[] | null;
  summery: string;
  rate: number;
}

const ReportTable = ({ reports }: { reports: Report[] }) => {
  return (
      <>
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow className="tableHeader">
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell>보고서 번호</TableCell>
                <TableCell>보고서 이름</TableCell>
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
            count={reports.length} // 데이터 길이에 따라 동적으로 변경
            page={0}
            rowsPerPage={10}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
        />
      </>
  );
};

export default ReportTable;