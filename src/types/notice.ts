// src/types/notice.ts

/**
 * PagingNoticeResponseDto (목록 조회 시 각 게시글의 요약 정보)
 */
export interface NoticeListItem {
  noticeId: number; // 백엔드는 Long 타입, 프론트는 number로 처리
  userId: number;
  title: string;
  viewCount: number;
  createdAt: string; // 날짜/시간은 문자열로 받습니다.
  updatedAt: string;
  // content는 목록에서는 필요 없지만, DTO에 있다면 포함 가능
}

/**
 * NoticeResponseDto (상세 조회 시 게시글의 전체 정보)
 */
export interface NoticeDetail {
  noticeId: number;
  userId: number;
  title: string;
  content: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  // 파일 정보 (첨부 파일, 본문 이미지)
  contentImagePaths: string[]; // List<String>
  attachedFilePaths: string[]; // List<String>
}

/**
 * PagingDto<T> (목록 조회 시 백엔드의 전체 응답 구조)
 */
export interface PagingDto<T> {
  // 💡 필수 데이터 필드
  content: T[]; // 실제 게시글 리스트 (NoticeListItem[]이 됩니다.)
  totalElements: number; // 전체 게시글 수

  // 💡 페이지네이션 상태 필드
  totalPages: number; // 전체 페이지 수
  number: number; // 현재 페이지 번호 (0부터 시작)
  size: number; // 페이지 당 항목 수 (pageSize)

  // 💡 플래그 필드
  first: boolean; // 현재 페이지가 첫 페이지인지 여부
  last: boolean; // 현재 페이지가 마지막 페이지인지 여부
  empty: boolean; // 결과가 비어 있는지 여부

  // 💡 기타 필드 (옵션)
  numberOfElements: number; // 현재 페이지의 항목 수
}

// export {};