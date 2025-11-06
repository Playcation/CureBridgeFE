import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

// 💡 DTO 및 타입 Import (ESLint import/first 규칙 준수)
import { LoginRequest } from '../types/auth';
import { PagingDto, BoardListItem, BoardDetail, BoardRequest } from '../types/board';
import { mockFetchBoardList, mockFetchBoardDetail } from './mockData'; // Mock API 임포트
import { mockDeleteBoard } from './mockData';

// ------------------- MOCK API 설정 -------------------
// 백엔드 서버로 전환할 때 이 값을 'false'로 변경
const USE_MOCK_API = true; 
const MOCK_ADMIN_TOKEN_ID = 1;
const MOCK_USER_ID = 2;
// -----------------------------------------------------

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
    
    if (USE_MOCK_API) {
        // ------------------ MOCK LOGIN LOGIC ------------------
        await new Promise(resolve => setTimeout(resolve, 300));
        let token = "mock_token_abc";
        let userRole: 'ADMIN' | 'USER';
        let userId: number;

        if (request.email === 'admin@test.com') {
            userRole = 'ADMIN';
            userId = MOCK_ADMIN_TOKEN_ID;
        } else if (request.email === 'user@test.com') {
            userRole = 'USER';
            userId = MOCK_USER_ID;
        } else {
            throw new Error("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
        }
        
        localStorage.setItem('Authorization', token);
        return { token, userId, userRole };
    } 
    
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
    if (USE_MOCK_API) {
        return mockFetchBoardList(page, size);
    }
    const response = await axiosInstance.get<PagingDto<BoardListItem>>(NOTICE_API_BASE, {
        params: { page, size, sort: 'id,desc' }
    });
    return response.data;
};


/**
 * 2-2. 게시글 단건 조회 (상세) - GET /api/notice/{noticeId}
 */
export const fetchBoardDetail = async (noticeId: number): Promise<BoardDetail> => {
    if (USE_MOCK_API) {
        return mockFetchBoardDetail(noticeId);
    }
    const response = await axiosInstance.get<BoardDetail>(`${NOTICE_API_BASE}/${noticeId}`); 
    return response.data;
};

/**
 * 2-3. 게시글 생성 (POST /api/notice)
 */
export const createBoard = async (userId: number, data: BoardRequest): Promise<BoardDetail> => {
    // 💡 [Mock API] 정상적인 성공 응답을 반환하도록 로직 수정
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const newId = Math.floor(Math.random() * 1000) + 100;
    
    console.log(`[Mock] User ${userId}가 새로운 글을 작성했습니다. ID: ${newId}`);
    
    // 게시글 생성 성공 후, 백엔드 응답 형태와 유사한 DTO를 반환
    return {
        noticeId: newId, 
        userId: userId, 
        title: data.title,
        content: data.content,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentImagePaths: [],
        attachedFilePaths: [],
    };

    // 실제 API
    const response = await axiosInstance.post<BoardDetail>(`${NOTICE_API_BASE}?userId=${userId}`, { json: data });
    return response.data;
};

/**
 * 2-4. 게시글 수정 (PATCH /api/notice/{noticeId})
 */
export const updateBoard = async (noticeId: number, data: BoardRequest): Promise<BoardDetail> => {
    if (USE_MOCK_API) {
        // Mock에서는 수정 후 상세 정보를 반환한다고 가정
        return mockFetchBoardDetail(noticeId); 
    }
    const response = await axiosInstance.patch<BoardDetail>(`${NOTICE_API_BASE}/${noticeId}`, { json: data });
    return response.data;
};

/**
 * 7. 게시글 삭제 (DELETE /api/notice/{noticeId})
 */
export const deleteBoard = async (noticeId: number): Promise<void> => {
    
    if (USE_MOCK_API) {
        // Mock API 사용: mockAllNotices 배열에서 해당 ID 제거
        mockDeleteBoard(noticeId);
        return;
    }
    
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