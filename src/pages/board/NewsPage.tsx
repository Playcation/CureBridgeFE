import React, {useEffect, useState} from 'react';
import {Box, Button, Chip, Container, Divider, Paper, Typography} from '@mui/material';
import NewsTable from '../../component/board/NewsTable';
import {deleteNews, getNews, getTopKeywords, searchNewsByTitle} from '../../api/ContentApi';
import './NewsPage.css';

type NewsItem = {
  id: number;
  title: string;
  link?: string;
  publishedAt?: string;
};

type TopKeywordDto = {
  keyword: string;
  count: number;
};

const NewsPage = () => {
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [topKeywords, setTopKeywords] = useState<{ keyword: string; count: number }[]>([]);
  const [keywords, setKeywords] = useState<TopKeywordDto[]>([]);
  const [isKeywordLoading, setIsKeywordLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async (p = 0, size = 10, query?: string) => {
    try {

      const effectiveQuery = query !== undefined ? query : searchQuery;

      const data = effectiveQuery
          ? await searchNewsByTitle({
            page: p,
            size,
            sort: 'publishedAt,desc',
            keyword: effectiveQuery
          })
          : await getNews(p, size, 'publishedAt,desc');

      const items = data?.content ?? data?.list ?? [];
      const total = data?.totalElements ?? data?.count ?? items.length;

      setNews(items);
      setTotalElements(total);
      setSelectedIds([]);
    } catch (e) {
      console.error('fetchNews failed', e);
    }
  };
// 키워드 데이터 호출 로직
  const fetchKeywords = async () => {
    setIsKeywordLoading(true);
    try {
      const data = await getTopKeywords(undefined, undefined, 10);
      setKeywords(data);
    } catch (e) {
      console.error('fetchKeywords failed', e);
      setKeywords([]);
    } finally {
      setIsKeywordLoading(false);
    }
  };
  useEffect(() => {
    fetchNews(page, rowsPerPage, searchQuery);
    fetchKeywords();
  }, [page, rowsPerPage, searchQuery]);

  const handleSearch = async () => {
    setPage(0);
    setSearchQuery(searchInput); // 상태 업데이트 (비동기)

    await fetchNews(0, rowsPerPage, searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleSelect = (id: number, isSelected: boolean) => {
    if (isSelected) {
      //  (수정) 이미 목록에 ID가 없으면 추가합니다. (중복 방지)
      setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      // ID를 목록에서 제거합니다.
      setSelectedIds((prev) => prev.filter((_id) => _id !== id));
    }
  };
  const handleSelectAll = (isSelected: boolean) => {
    const currentNewsIds = news.map(n => n.id);
    if (isSelected) {
      const newSelected = Array.from(new Set([...selectedIds, ...currentNewsIds]));
      setSelectedIds(newSelected);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !currentNewsIds.includes(id)));
    }
  };

  // 기존 handleDelete 함수는 더 이상 사용되지 않습니다.
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm(`${selectedIds.length}개의 뉴스를 삭제하시겠습니까?`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        await deleteNews(id);
        successCount++;
      } catch (e) {
        console.error(`deleteNews for ID ${id} failed`, e);
        failCount++;
      }
    }

    if (failCount > 0) {
      alert(`일괄 삭제 완료. ${successCount}개 성공, ${failCount}개 실패했습니다.`);
    } else {
      alert(`게시물 ${successCount}개가 성공적으로 삭제되었습니다.`);
    }

    fetchNews(page, rowsPerPage, searchQuery);
  };

  return (

      <Container className="news-page-container">
        <h2 className="news-page-title">의학 뉴스</h2>

        {/* 💡 Notice의 검색부 스타일로 변경 (옵션 제외) */}
        <form
            className="news-search-section"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
        >
          <input
              type="text"
              placeholder="뉴스 제목을 검색하세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="news-search-input-field"
          />
          <button
              type="submit"
              className="news-search-submit-button"
          >
            검색
          </button>
        </form>

        {searchQuery && (
            <Typography variant="body2" sx={{mb: 2, textAlign: 'center', color: '#666'}}>
              "{searchQuery}" 검색 결과 (총 {totalElements}건)
            </Typography>
        )}
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
        {/* 뉴스 리스트 하단 인기 키워드 섹션 추가 */}
        <Box sx={{mt: 6}}>
          <Divider sx={{mb: 3}}/>
          <Typography variant="h6" gutterBottom
                      sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            ✨ 최근 주요 의학 키워드
          </Typography>
          <Paper elevation={0} sx={{p: 2, bgcolor: '#f8f9fa', borderRadius: 2}}>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
              {keywords.length > 0 ? (
                  keywords.map((kw, index) => (
                      <Chip
                          key={index}
                          label={`#${kw.keyword} (${kw.count})`}
                      />
                  ))
              ) : (
                  <Typography variant="body2" color="textSecondary">
                    {isKeywordLoading ? "키워드 데이터를 분석 중입니다..." : "분석된 키워드가 없습니다."}
                  </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default NewsPage;