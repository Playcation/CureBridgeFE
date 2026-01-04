import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import {LoginType} from "../common/UserTypes";

// 💡 DTO 및 타입 Import (ESLint import/first 규칙 준수)
import { LoginRequest } from '../types/auth';
import { PagingDto, BoardListItem, BoardDetail, BoardRequest } from '../types/board';




// ------------------- API 기본 설정 -------------------
const BASE_URL = 'http://localhost:8080';
const LOGIN_URL = '/api/core/login';
const NOTICE_API_BASE = '/api/notice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 또는 배포용 주소
  withCredentials: true,
});

let refreshSubscribers: ((token: string) => void)[] = [];

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

      const url = (config.url || '').toLowerCase();

      // 토큰을 붙이지 않을 경로들(로그인, 회원가입, 토큰 리프레시 등)
      const skipAuth = [
        '/users/sign-in',
        '/api/anonymous/user/auth/login',
        '/api/core/users/sign-in',
        '/token/refresh',
        '/refresh',
      ];

      if (skipAuth.some(path => url.endsWith(path))) {
        return config;
      }

      const accessToken = localStorage.getItem('Authorization');
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        let isRefreshing = false;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const response = await axios.post<{ token: string }>(
                '/refresh',
                {},
                {withCredentials: true}
            );
            const newToken = response.data.token;
            localStorage.setItem('Authorization', newToken);
            onRefreshed(newToken);
            isRefreshing = false;
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem('Authorization');
            // useNavigate는 훅이므로 여기에서 직접 호출 불가 → App 단에서 catch 후 redirect 해야 함
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve) => {
          addSubscriber((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      return Promise.reject(error);
    }
);

// ==========================================================
//                 2. 게시판 (CRUD) API
// ==========================================================

/**
 * 2-1. 게시글 다건 조회 (목록) - GET /api/notice
 */
export const fetchBoardList = async (page: number = 0, size: number = 10): Promise<PagingDto<BoardListItem>> => {

  const response = await axiosInstance.get<PagingDto<BoardListItem>>(`/api/notice${NOTICE_API_BASE}`, {
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

export const getOcr = async (id: number) => {
  return await axiosInstance.get(`/api/health-report/user/${id}`);
};

export const getManagerInfo = async () => {
    return await axiosInstance.get(`/api/org-manager/org-manager`);
};

export const getOrganizationInfo = async () => {
    return await axiosInstance.get(`/api/organization/organization`);
};

export const getNews = (page: number, size: number, sort: string, query?: string) => {
  const params: any = {page, size, sort};
  if (query) params.query = query;

  return axiosInstance.get('/anonymous/news', {
    params,
    headers: {Authorization: ''}, // 이 요청에선 강제로 비움
  }).then(res => res.data);
};

export const deleteNews = async (id: number) => {
  return await axiosInstance.delete(`/admin/news/${id}`)
  .then(res => res.data);
};

export const userLogin=async (loginData: LoginType)=>{
  return axiosInstance.post('/api/anonymous/user/auth/login', loginData);
  // return axiosInstance.post('/user/auth/login', loginData);
}

export default axiosInstance;
