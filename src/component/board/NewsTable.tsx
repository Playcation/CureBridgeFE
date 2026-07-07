// src/component/board/NewsTable.tsx
import React from 'react';
import {
  Checkbox,
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
  isAdmin: boolean;
  selectedIds: number[];
  onSelect: (id: number, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

const NewsTable: React.FC<Props> = ({
                                      news,
                                      total,
                                      page,
                                      rowsPerPage,
                                      onPageChange,
                                      onRowsPerPageChange,
                                      isAdmin,
                                      selectedIds,
                                      onSelect,
                                      onSelectAll,
                                    }) => {
  const currentNewsIds = news.map(n => n.id);
  const isAllSelected = currentNewsIds.length > 0 && currentNewsIds.every(id => selectedIds.includes(id));
  const isSelectedSome = currentNewsIds.some(id => selectedIds.includes(id)) && !isAllSelected;

  return (
      <>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {isAdmin && (
                    <TableCell padding="checkbox">
                      <Checkbox
                          color="primary"
                          indeterminate={isSelectedSome} // 일부 선택 시
                          checked={isAllSelected} // 전체 선택 시
                          onChange={(e) => onSelectAll(e.target.checked)}
                          inputProps={{'aria-label': 'select all news'}}
                      />
                    </TableCell>
                )}
                <TableCell>번호</TableCell>
                <TableCell>기사 제목</TableCell>
                <TableCell>게시일자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news.map((n, index) => {
                const isItemSelected = selectedIds.includes(n.id);
                const displayNum = total - (page * rowsPerPage) - index;
                return (
                    <TableRow key={n.id}
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              selected={isItemSelected}
                        // 💡 행을 클릭하면 선택/해제되도록 처리
                              onClick={() => isAdmin && onSelect(n.id, !isItemSelected)}
                    >
                      {isAdmin && (
                          <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                // 체크박스 자체를 클릭했을 때는 행 클릭 이벤트가 중복되지 않도록 e.stopPropagation()을 사용할 수도 있습니다.
                                // 여기서는 TableRow의 onClick을 사용했으므로 체크박스의 onChange는 onSelect를 호출합니다.
                                onChange={(e) => onSelect(n.id, e.target.checked)}
                                inputProps={{'aria-labelledby': `news-item-${n.id}`}}
                            />
                          </TableCell>
                      )}
                      <TableCell>{displayNum}</TableCell>
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
                )
              })}
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
  )
      ;
};

export default NewsTable;