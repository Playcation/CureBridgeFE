// src/pages/news/NewsPage.tsx
import React, {useEffect, useState} from 'react';
import {Container, Typography} from '@mui/material';
import NewsTable from '../../component/board/NewsTable';
import {getNews} from '../../api/Api';

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

  const fetchNews = async (p = 0, size = 10) => {

    try {
      const data = await getNews(p, size, 'id,desc');
      const items = data?.list ?? [];
      setNews(items);
      setTotalElements(data?.count ?? items.length); // ← 추가
    } catch (e) {
      console.error('fetchNews failed', e);
    }
  };

  useEffect(() => {
    fetchNews(page, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
      <Container>
        <Typography variant="h4" gutterBottom>의학 뉴스</Typography>
        <NewsTable
            news={news}
            total={totalElements}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newSize) => {
              setRowsPerPage(newSize);
              setPage(0);
            }}
        />
      </Container>
  );
};

export default NewsPage;