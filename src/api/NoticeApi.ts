import axiosInstance from './Api';
import {BoardDetail, BoardRequest} from '../types/board';


const API_BASE_URL = '/content/notice';

// 1. 다건 조회 (목록)
export const fetchBoardList = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_BASE_URL, {
    params: {page, size, sort: 'id,desc'},
  });
  return response.data;
};
// 2. 단건 조회 (상세)
export const fetchBoardDetail = async (noticeId: number): Promise<BoardDetail> => {
  const response = await axiosInstance.get<BoardDetail>(`${API_BASE_URL}/${noticeId}`);
  return response.data;
};

// 게시글 생성 (백엔드 멀티파트 수신 키값과 완전 일치화)
export const createBoard = async (
    data: BoardRequest,
    attachedFiles?: File[],
    contentImages?: File[]
): Promise<BoardDetail> => {
  const formData = new FormData();

  formData.append(
      "json",
      new Blob([JSON.stringify(data)], {type: "application/json"})
  );

  if (attachedFiles) {
    attachedFiles.forEach(file => formData.append("attachedFile", file));
  }

  // 본문 내 삽입 이미지 바인딩 필요 시
  if (contentImages) {
    contentImages.forEach(file => formData.append("contentImage", file));
  }

  const response = await axiosInstance.post<BoardDetail>(
      API_BASE_URL, // 게이트웨이가 주소를 붙여주므로 /admin... 경로만 명시
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data" // 💡 멀티파트 전송임을 명시
        }
      }
  );

  return response.data;
};


// 4. 게시글 수정 (PATCH /api/notice/{noticeId})
export const updateBoard = async (
    noticeId: number,
    data: BoardRequest,
    attachedFiles?: File[]
): Promise<BoardDetail> => {
  const formData = new FormData();
  formData.append(
      'json',
      new Blob([JSON.stringify({
        title: data.title,
        content: data.content
      })], {type: 'application/json'})
  );
  if (attachedFiles) {
    attachedFiles.forEach(file => formData.append("attachedFile", file));
  }

  const response = await axiosInstance.patch<BoardDetail>(
      `${API_BASE_URL}/${noticeId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
  );
  return response.data;
};

// 5. 게시글 삭제 (DELETE /api/notice/{noticeId})
export const deleteBoard = async (noticeId: number): Promise<void> => {
  await axiosInstance.delete(`${API_BASE_URL}/${noticeId}`);
};