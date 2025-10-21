// src/component/board/NewsTable.tsx
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

interface News {
  id: number;
  title: string;
  link?: string;
  publishedAt?: string;
}

interface Props {
  news: News[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
}

const NewsTable: React.FC<Props> = ({
                                      news,
                                      total,
                                      page,
                                      rowsPerPage,
                                      onPageChange,
                                      onRowsPerPageChange
                                    }) => {
  return (
      <>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>기사 제목</TableCell>
                <TableCell>게시일자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>{n.id}</TableCell>
                    <TableCell>{n.title}</TableCell>
                    <TableCell>{n.publishedAt ?? '-'}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt((e.target as HTMLInputElement).value, 10))}
        />
      </>
  );
};

export default NewsTable;