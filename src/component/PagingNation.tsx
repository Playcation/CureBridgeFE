// src/components/common/ReusablePagination.tsx

import React from 'react';

// 페이지네이션 컴포넌트가 받게 될 Props의 타입을 정의합니다.
interface PaginationProps {
  currentPage: number;   // 현재 페이지 번호 (0부터 시작, 백엔드의 'number' 필드)
  totalPages: number;    // 전체 페이지 개수
  onPageChange: (page: number) => void; // 페이지 버튼 클릭 시 호출될 함수
}

// 한 블록에 표시할 최대 페이지 번호 개수 (예: 1, 2, 3, 4, 5)
const PAGE_BLOCK_SIZE = 5; 

const ReusablePagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  
  if (totalPages <= 1) {
    // 전체 페이지가 1개 이하라면 페이지네이션 UI를 표시할 필요가 없습니다.
    return null;
  }

  // 1. 현재 페이지 블록의 시작 페이지 번호 (0부터 시작)
  // 예: currentPage가 7이라면 Math.floor(7/5)*5 = 5. startPage는 5
  const startPage = Math.floor(currentPage / PAGE_BLOCK_SIZE) * PAGE_BLOCK_SIZE;
  
  // 2. 현재 페이지 블록의 끝 페이지 번호
  // 끝 페이지는 startPage + PAGE_BLOCK_SIZE 이거나, totalPages 중 더 작은 값입니다.
  const endPage = Math.min(startPage + PAGE_BLOCK_SIZE, totalPages);
  
  // 3. 페이지 번호를 담을 배열 생성
  const pageNumbers: number[] = [];
  for (let i = startPage; i < endPage; i++) {
    pageNumbers.push(i);
  }

  // 4. '이전 블록' 및 '다음 블록' 이동 여부 결정
  const canGoPrevBlock = startPage > 0;
  const canGoNextBlock = endPage < totalPages;
  
  // '이전 블록'으로 이동하는 함수 (예: 6페이지에서 이전 블록 누르면 0페이지로)
  const goToPrevBlock = () => {
    if (canGoPrevBlock) {
      onPageChange(startPage - PAGE_BLOCK_SIZE);
    }
  };

  // '다음 블록'으로 이동하는 함수 (예: 0페이지에서 다음 블록 누르면 5페이지로)
  const goToNextBlock = () => {
    if (canGoNextBlock) {
      onPageChange(endPage);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      {/* 5. 맨 처음 페이지로 이동 버튼 */}
      <button 
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        style={{ marginRight: '10px' }}
      >
        {'<<'}
      </button>
      
      {/* 6. 이전 블록으로 이동 버튼 */}
      <button 
        onClick={goToPrevBlock}
        disabled={!canGoPrevBlock}
        style={{ marginRight: '10px' }}
      >
        {'<'}
      </button>

      {/* 7. 페이지 번호들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          // 현재 페이지는 배경색을 다르게 표시하여 강조
          style={{ 
            margin: '0 5px', 
            fontWeight: page === currentPage ? 'bold' : 'normal',
            backgroundColor: page === currentPage ? '#ddd' : 'white',
            border: page === currentPage ? '1px solid #999' : '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          {page + 1} {/* 사용자에게는 1부터 시작하는 페이지 번호를 보여줍니다. */}
        </button>
      ))}

      {/* 8. 다음 블록으로 이동 버튼 */}
      <button 
        onClick={goToNextBlock}
        disabled={!canGoNextBlock}
        style={{ marginLeft: '10px' }}
      >
        {'>'}
      </button>

      {/* 9. 맨 끝 페이지로 이동 버튼 */}
      <button 
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        style={{ marginLeft: '10px' }}
      >
        {'>>'}
      </button>
    </div>
  );
};

export default ReusablePagination;