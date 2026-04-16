/** 게시글 목록 항목 (PagingNoticeResponseDto) */
export interface BoardListItem {
  noticeId: number; // Long -> number
  userId: number;   // Long -> number (작성자 ID)
  writerName?: string;
  title: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 게시글 상세 정보 (NoticeResponseDto) */
export interface BoardDetail extends BoardListItem {
  content: string;
  contentImagePaths: string[]; // List<String>
  attachedFilePaths: string[]; // List<String>
}

/** 백엔드 페이징 응답 구조 (PagingDto<T>) */
export interface PagingDto<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 현재 페이지 번호 (0부터 시작)
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  // Spring Pageable의 추가 필드는 생략
}

/** 게시글 생성/수정 요청 DTO (NoticeRequestDto) */
export interface BoardRequest {
  title: string;
  content: string;
}

// export {};