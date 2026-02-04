/**
 * 뉴스 항목 정보 (NewsResponseDto 대응)
 */
export interface NewsItem {
  id: number;          // 뉴스 ID (Long -> number)
  title: string;       // 뉴스 제목
  link: string;        // 뉴스 원문 링크
  publishedAt: string; // 뉴스 발행일 (LocalDateTime -> ISO String)
}

/**
 * 인기 키워드 집계 정보 (StringTermsBucket 대응)
 */
export interface TopKeywordDto {
  keyword: string;     // 키워드 (bucket key)
  count: number;       // 해당 키워드 노출 횟수 (doc_count)
}