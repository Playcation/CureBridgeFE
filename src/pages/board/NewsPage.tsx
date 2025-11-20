// src/pages/news/NewsPage.tsx
import React, {useEffect, useState} from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import NewsTable from '../../component/board/NewsTable';
import {deleteNews, getNews} from '../../api/Api';

type NewsItem = {
  id: number;
  title: string;
  link?: string;
  publishedAt?: string;
};

const NewsPage = () => {
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchNews = async (p = 0, size = 10) => {

    try {
      const data = await getNews(p, size, 'id,desc');
      const items = data?.list ?? [];
      setNews(items);
      setTotalElements(data?.count ?? items.length); // ← 추가
      setSelectedIds([]);
    } catch (e) {
      console.error('fetchNews failed', e);
    }
  };

  useEffect(() => {
    fetchNews(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleSelect = (id: number, isSelected: boolean) => {
    if (isSelected) {
      // 💡 (수정) 이미 목록에 ID가 없으면 추가합니다. (중복 방지)
      setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      // ID를 목록에서 제거합니다.
      setSelectedIds((prev) => prev.filter((_id) => _id !== id));
    }
  };
  const handleSelectAll = (isSelected: boolean) => {
    const currentNewsIds = news.map(n => n.id);
    if (isSelected) {
      // 기존 선택 ID와 현재 페이지 ID를 합치고 중복 제거
      const newSelected = [...new Set([...selectedIds, ...currentNewsIds])];
      setSelectedIds(newSelected);
    } else {
      // 현재 페이지 ID만 제외
      setSelectedIds((prev) => prev.filter((id) => !currentNewsIds.includes(id)));
    }
  };
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm(`${selectedIds.length}개의 뉴스를 삭제하시겠습니까?`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        await deleteNews(id); // 단건 삭제 API 반복 호출
        successCount++;
      } catch (e) {
        console.error(`deleteNews for ID ${id} failed`, e);
        failCount++;
      }
    }

    if (failCount > 0) {
      alert(`일괄 삭제 완료. ${successCount}개 성공, ${failCount}개 실패했습니다. (관리자 권한 확인 필요)`);
    } else {
      alert(`게시물 ${successCount}개가 성공적으로 삭제되었습니다.`);
    }

    // 삭제 후 목록 새로고침 및 선택 항목 초기화
    fetchNews(page, rowsPerPage);
  }

  // 기존 handleDelete 함수는 더 이상 사용되지 않습니다.
  const handleDelete = (id: number) => {
    console.warn("handleDelete is no longer used for single delete.");
  }

  return (
      <Container>
        <Typography variant="h4" gutterBottom>의학 뉴스</Typography>
        <NewsTable
            news={news}
            total={totalElements}
            page={page}
            rowsPerPage={rowsPerPage}
            isAdmin={isAdmin}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newSize) => {
              setRowsPerPage(newSize);
              setPage(0);
            }}
        />
        {isAdmin && selectedIds.length > 0 && (
            <Box sx={{marginTop: 2, display: 'flex', justifyContent: 'flex-end'}}>
              <Button
                  variant="contained"
                  color="error"
                  onClick={handleBatchDelete}
                  disabled={selectedIds.length === 0}
              >
                선택 항목 ({selectedIds.length}) 일괄 삭제
              </Button>
            </Box>
        )}
      </Container>
  );
};

export default NewsPage;