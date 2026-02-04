import React, { useState } from 'react';
import styles from './BoardSearch.module.css';
import {SearchParams} from "../../types/board";

// 컴포넌트 Props 정의
interface BoardSearchProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const BoardSearch: React.FC<BoardSearchProps> = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<SearchParams['type']>('title');

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, type: searchType });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick(e as unknown as React.FormEvent);
    }
  };

  return (
    // 폼 전체에 CSS Modules 클래스 적용
    <form onSubmit={handleSearchClick} className={styles.searchSection}>
      {/* 검색 타입 드롭다운 */}
      <select 
        value={searchType} 
        onChange={(e) => setSearchType(e.target.value as SearchParams['type'])}
        disabled={isLoading}
        className={styles.searchSelect} // 클래스 적용
      >
        <option value="title">전체</option>
        <option value="all">제목+내용</option>
      </select>

      {/* 키워드 입력 필드 */}
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={styles.searchInput}
      />

      {/* 검색 버튼 */}
      <button type="submit" disabled={isLoading} className={styles.searchButton}>
        검색
      </button>
    </form>
  );
};

export default BoardSearch;