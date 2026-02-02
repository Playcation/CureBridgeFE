import axiosInstance from './Api';
import { PagingDto, BoardListItem, BoardDetail, BoardRequest } from '../types/board';


const API_BASE_URL = '/content/notice';

// 1. 다건 조회 (목록) - Mock 사용
export const fetchBoardList = async (page: number = 0, size: number = 10): Promise<PagingDto<BoardListItem>> => {
    const response = await axiosInstance.get<PagingDto<BoardListItem>>(API_BASE_URL, { params: { page, size, sort: 'id,desc' } });
    return response.data;
};

// 2. 단건 조회 (상세)
export const fetchBoardDetail = async (noticeId: number): Promise<BoardDetail> => {
    const response = await axiosInstance.get<BoardDetail>(`${API_BASE_URL}/${noticeId}`);
    return response.data;
};

// 3. 게시글 생성 (POST /api/notice)
export const createBoard = async (
    data: BoardRequest,
    attachedFiles?: File[],
    contentImages?: File[]
): Promise<BoardDetail> => {
    const formData = new FormData();

    formData.append(
        "json",
        new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    // 파일 파트 추가
    if (attachedFiles) {
        attachedFiles.forEach(file => formData.append("attachedFile", file));
    }
    if (contentImages) {
        contentImages.forEach(file => formData.append("contentImage", file));
    }

    const response = await axiosInstance.post<BoardDetail>(
        `${API_BASE_URL}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


// 4. 게시글 수정 (PATCH /api/notice/{noticeId})
export const updateBoard = async (noticeId: number, data: BoardRequest): Promise<BoardDetail> => {
    const response = await axiosInstance.patch<BoardDetail>(`${API_BASE_URL}/${noticeId}`, { json: data });
    return response.data;
};

// 5. 게시글 삭제 (DELETE /api/notice/{noticeId}) - Mock 사용
export const deleteBoard = async (noticeId: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE_URL}/${noticeId}`);
};