import axios from 'axios';
import { PagingDto, BoardListItem, BoardDetail, BoardRequest } from '../types/board';


const API_BASE_URL = 'http://localhost:8081/api/notices';

// 1. 다건 조회 (목록) - Mock 사용
export const fetchBoardList = async (page: number = 0, size: number = 10): Promise<PagingDto<BoardListItem>> => {
    const response = await axios.get<PagingDto<BoardListItem>>(API_BASE_URL, { params: { page, size, sort: 'id,desc' } });
    return response.data;
};

// 2. 단건 조회 (상세) - Mock 사용
export const fetchBoardDetail = async (noticeId: number): Promise<BoardDetail> => {
    const response = await axios.get<BoardDetail>(`${API_BASE_URL}/${noticeId}`); 
    return response.data;
};

// 3. 게시글 생성 (POST /api/notice) - Mock 사용
export const createBoard = async (userId: number, data: BoardRequest): Promise<BoardDetail> => {
    const response = await axios.post<BoardDetail>(`${API_BASE_URL}?userId=${userId}`, { json: data });
    return response.data;
};

// 4. 게시글 수정 (PATCH /api/notice/{noticeId}) - Mock 사용
export const updateBoard = async (noticeId: number, data: BoardRequest): Promise<BoardDetail> => {
    const response = await axios.patch<BoardDetail>(`${API_BASE_URL}/${noticeId}`, { json: data });
    return response.data;
};

// 5. 게시글 삭제 (DELETE /api/notice/{noticeId}) - Mock 사용
export const deleteBoard = async (noticeId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${noticeId}`);
};