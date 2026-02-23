// src/api/mockData.ts

import { BoardListItem, PagingDto, BoardDetail, BoardRequest } from '../types/board';

// 💡 1. const 대신 LET으로 선언하여 Mock 함수 내에서 배열을 수정할 수 있게 합니다.
export let mockAllNotices: BoardListItem[] = Array.from({ length: 25 }, (_, i) => ({
    noticeId: 25 - i,
    userId: (i % 2 === 0 ? 1 : 2), // 1번 (관리자)과 2번 (일반) 사용자가 번갈아 작성했다고 가정
    title: `[공지] ${25 - i}번째 공지사항 제목입니다.`,
    viewCount: 100 - i * 2,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

// Mock API - 목록 조회 (유지)
export const mockFetchBoardList = async (page: number, size: number): Promise<PagingDto<BoardListItem>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const pageContent = mockAllNotices.slice(startIndex, endIndex);
    const totalElements = mockAllNotices.length;
    const totalPages = Math.ceil(totalElements / size);

    return {
        content: pageContent,
        totalElements: totalElements,
        totalPages: totalPages,
        number: page,
        size: size,
        first: page === 0,
        last: page === totalPages - 1,
        empty: pageContent.length === 0,
    };
};

// Mock API - 단건 조회/상세 (조회수 증가 포함)
export const mockFetchBoardDetail = async (noticeId: number): Promise<BoardDetail> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const foundIndex = mockAllNotices.findIndex(n => n.noticeId === noticeId);
    
    if (foundIndex === -1) throw new Error("게시글을 찾을 수 없습니다.");
    
    // 💡 조회수 증가 로직 재할당 대신 직접 수정 (let으로 선언했으므로 안전함)
    mockAllNotices[foundIndex].viewCount += 1;
    const found = mockAllNotices[foundIndex];
    
    return {
        ...found,
        content: `이것은 ${found.noticeId}번 게시글의 상세 내용입니다. **백엔드에서 HTML 형식**으로 전달된다고 가정합니다.`,
        contentImagePaths: [],
        attachedFilePaths: [],
    };
};

// 💡 새 글을 배열에 추가하는 함수 (Create 시 필요)
export const addMockNotice = (newPost: BoardDetail) => {
    // 타입이 BoardDetail이지만, ListItem과 구조가 같으므로 unshift로 추가
    mockAllNotices.unshift(newPost as BoardListItem); 
};


// Mock API - 게시글 삭제 로직 (유지)
export const mockDeleteBoard = (noticeId: number): void => {
    const initialLength = mockAllNotices.length;
    
    // 💡 재할당: let으로 선언했으므로 이제 안전하게 동작합니다.
    mockAllNotices = mockAllNotices.filter(n => n.noticeId !== noticeId);
    
    if (mockAllNotices.length === initialLength) {
        console.warn(`[Mock Delete] ID ${noticeId}를 찾을 수 없습니다.`);
    } else {
        console.log(`[Mock Delete] ID ${noticeId} 삭제 성공. 남은 게시글 수: ${mockAllNotices.length}`);
    }
};