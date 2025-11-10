import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
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
        <div style={{ boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)' }}>
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
        </div>
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