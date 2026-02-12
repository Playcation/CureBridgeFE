import axiosInstance from './Api';

const API_BASE_URL = "/content"


// ------------------------ News 페이지

/**
 * 뉴스 다건 조회, 페이징 및 검색
 * * @param page 읽을 페이지 번호
 * @param size 전체 게시물 수
 * @param sort 정렬 방식
 * @param query 검색어 (선택 사항)
 */
export const getNews = async (page: number, size: number, sort: string, query?: string) => {
  const params: any = {page, size, sort};
  if (query) params.query = query; // 검색어 추가

  // Api.ts의 로직을 유지하여 /api/anonymous/content/news 경로 사용
  const res = await axiosInstance.get(`${API_BASE_URL}/news`, {params});
  return res.data;
};

/**
 * 뉴스 게시글 삭제 (관리자 전용)
 * * @param id 뉴스 아이디
 */
export const deleteNews = async (id: number) => {
  return await axiosInstance.delete(`${API_BASE_URL}/news/${id}`)
  .then(res => res.data);
};

/**
 * 인기 키워드 조회 (Aggregation)
 * * @param gte 시작 날짜 (ISO String)
 * @param lt 종료 날짜 (ISO String)
 * @param size 가져올 키워드 개수
 */
export type TopKeywordDto = { keyword: string; count: number };
export const getTopKeywords = (gte?: string, lt?: string, size: number = 10) => {
  return axiosInstance.get(`${API_BASE_URL}/news/top-keywords`, {
    params: {gte, lt, size},
  }).then(res => res.data); // [{ keyword: "의료", count: 123 }, ...]
};
// ------------------------ HealthReport 페이지
/**
 * Ocr 단건 조회
 *
 * @param id Ocr 아이디
 */
export const getOcr = async (id: number) => {
  return await axiosInstance.get(`${API_BASE_URL}/health-report/${id}`);
};

