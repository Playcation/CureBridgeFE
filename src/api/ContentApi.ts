import axiosInstance from './Api';
import {CreateScheduleRequestDto, ScheduleResponseDto} from "../types/contentTypes";
import {BoardDetail, BoardListItem, BoardRequest, PagingDto} from '../types/board';

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
  const params: any = {page, size, sort: 'publishedAt,desc'};
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

export const searchNewsByTitle = (params: {
  page: number;
  size: number;
  sort?: string;
  keyword: string;
}) => {
  return axiosInstance.get(`${API_BASE_URL}/news/search-title`, {
    params: {
      ...params,
      sort: params.sort || 'publishedAt,desc'
    },
  }).then(res => res.data);
};

// ------------------------ HealthReport 페이지
/**
 * Report 단건 조회
 *
 * @param id Ocr 아이디
 */
export const getHealthReportsByUserId = async (id: number) => {
  return await axiosInstance.get(`${API_BASE_URL}/health-report/user/${id}`);
};

// ---------------------- Schedule 페이지

export const getMonthlySchedules = async (date: string): Promise<ScheduleResponseDto[]> => {
  const response = await axiosInstance.get<ScheduleResponseDto[]>(`${API_BASE_URL}/user/calendar/monthly`, {
    params: {date}
  });
  return response.data;
};

export const createSchedule = async (data: CreateScheduleRequestDto): Promise<ScheduleResponseDto> => {
  const response = await axiosInstance.post<any>(`${API_BASE_URL}/user/calendar`, data);
  return response.data;
};

// ==========================================================
//                 2. 게시판 (CRUD) API
// ==========================================================

/**
 * 2-1. 게시글 다건 조회 (목록) - GET /api/notice
 */
export const fetchBoardList = async (page: number = 0, size: number = 10): Promise<PagingDto<BoardListItem>> => {

  const response = await axiosInstance.get<PagingDto<BoardListItem>>(`${API_BASE_URL}/api/notice/notice`, {
    params: {page, size, sort: 'id,desc'}
  });
  return response.data;
};


/**
 * 2-2. 게시글 단건 조회 (상세) - GET /api/notice/{noticeId}
 */
export const fetchBoardDetail = async (noticeId: number): Promise<BoardDetail> => {

  const response = await axiosInstance.get<BoardDetail>(`${API_BASE_URL}/notice/${noticeId}`);
  return response.data;
};

/**
 * 2-3. 게시글 생성 (POST /api/notice)
 */
export const createBoard = async (userId: number, data: BoardRequest): Promise<BoardDetail> => {


  // 실제 API
  const response = await axiosInstance.post<BoardDetail>(`${API_BASE_URL}/notice?userId=${userId}`, {json: data});
  return response.data;
};

/**
 * 2-4. 게시글 수정 (PATCH /api/notice/{noticeId})
 */
export const updateBoard = async (noticeId: number, data: BoardRequest): Promise<BoardDetail> => {

  const response = await axiosInstance.patch<BoardDetail>(`${API_BASE_URL}/notice/${noticeId}`, {json: data});
  return response.data;
};

/**
 * 7. 게시글 삭제 (DELETE /api/notice/{noticeId})
 */
export const deleteBoard = async (noticeId: number): Promise<void> => {
  // API 사용 시:
  await axiosInstance.delete(`${API_BASE_URL}/notice/${noticeId}`);
};