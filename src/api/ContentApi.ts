import axiosInstance from './Api';

const API_BASE_URL = "/content"


// ------------------------ News 페이지
/**
 * 뉴스 다건 조회, 페이징
 *
 * @param page 읽을 페이지 번호
 * @param size 전체 게시물 수
 * @param sort 정렬 방식
 * @param query
 */
export const getNews = async (page: number, size: number, sort: string, query?: string) => {
    const params: any = {page, size, sort};
    if (query) params.query = query; // 검색어 추가
    const res = await axiosInstance.get(`${API_BASE_URL}/news`, {params});
    return res.data;
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