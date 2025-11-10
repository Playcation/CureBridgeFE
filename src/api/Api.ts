import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

// 💡 DTO 및 타입 Import (ESLint import/first 규칙 준수)
import { LoginRequest } from '../types/auth';
import { PagingDto, BoardListItem, BoardDetail, BoardRequest } from '../types/board';




// ------------------- API 기본 설정 -------------------
const BASE_URL = 'http://localhost:8081';
const LOGIN_URL = '/api/core/login';
const NOTICE_API_BASE = '/api/notice'; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ==========================================================
//                 1. 인증 (Login) API
// ==========================================================

export const fetchLogin = async (request: LoginRequest): Promise<{ token: string; userId: number; userRole: 'ADMIN' | 'USER' }> => {
    

    
    // ------------------ REAL API LOGIN LOGIC ------------------
    try {
        const response = await axiosInstance.post<{ token: string; userId: number; userRole: string }>(LOGIN_URL, request);

        const token = response.data.token;
        const userRole = response.data.userRole as 'ADMIN' | 'USER';
        const userId = response.data.userId;

        localStorage.setItem('Authorization', token);

        return { token, userId, userRole };
    } catch (error) {
        throw error;
    }
};

// ==========================================================
//                 2. 게시판 (CRUD) API
// ==========================================================

/**
 * 2-1. 게시글 다건 조회 (목록) - GET /api/notice
 */
export const fetchBoardList = async (page: number = 0, size: number = 10): Promise<PagingDto<BoardListItem>> => {

    const response = await axiosInstance.get<PagingDto<BoardListItem>>(NOTICE_API_BASE, {
        params: { page, size, sort: 'id,desc' }
    });
    return response.data;
};


/**
 * 2-2. 게시글 단건 조회 (상세) - GET /api/notice/{noticeId}
 */
export const fetchBoardDetail = async (noticeId: number): Promise<BoardDetail> => {

    const response = await axiosInstance.get<BoardDetail>(`${NOTICE_API_BASE}/${noticeId}`); 
    return response.data;
};

/**
 * 2-3. 게시글 생성 (POST /api/notice)
 */
export const createBoard = async (userId: number, data: BoardRequest): Promise<BoardDetail> => {


    // 실제 API
    const response = await axiosInstance.post<BoardDetail>(`${NOTICE_API_BASE}?userId=${userId}`, { json: data });
    return response.data;
};

/**
 * 2-4. 게시글 수정 (PATCH /api/notice/{noticeId})
 */
export const updateBoard = async (noticeId: number, data: BoardRequest): Promise<BoardDetail> => {

    const response = await axiosInstance.patch<BoardDetail>(`${NOTICE_API_BASE}/${noticeId}`, { json: data });
    return response.data;
};

/**
 * 7. 게시글 삭제 (DELETE /api/notice/{noticeId})
 */
export const deleteBoard = async (noticeId: number): Promise<void> => {
    

    
    // API 사용 시:
    await axiosInstance.delete(`${NOTICE_API_BASE}/${noticeId}`);
};

export const getOcr = async (id:number) => {
  return await axiosInstance.get(`/api/health-report/user/${id}`);
};

export const getManagerInfo = async (id: number) => {
    return await axiosInstance.get(`/api/manager/${id}`);
};

export const getOrganizationInfo = async (id: number) => {
    return await axiosInstance.get(`/api/organization/${id}`);
};

export default axiosInstance;