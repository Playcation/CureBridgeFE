// src/component/board/NewsTable.tsx
import React from 'react';
import {
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
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
                    <TableCell>
                      {n.link ? (
                          <MuiLink
                              href={n.link}
                              target="_blank" // 새 탭에서 열기
                              rel="noopener noreferrer" // 보안을 위해 추가
                              style={{cursor: 'pointer'}} // 클릭 가능한 모양으로
                          >
                            {n.title}
                          </MuiLink>
                      ) : (
                          n.title
                      )}
                    </TableCell>
                    <TableCell>{n.publishedAt ? n.publishedAt.replace('T', ' ') : '-'}</TableCell>
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