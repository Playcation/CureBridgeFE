import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import { Link } from 'react-router-dom';
import { fetchBoardList } from '../../api/ContentApi';
import { BoardListItem, PagingDto } from '../../types/board'; 
import ReusablePagination from '../../component/PagingNation'; 
import BoardSearch from '../../component/BoardSearch/BoardSearch'
import { SearchParams } from '../../types/board';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../store/slices/authSlice';
import styles from './NoticeListPage.module.css'; 

const ALL_PAGES = 999; 

function NoticeListPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0); 
    const [pageSize] = useState(10); 
    
    const [totalElements, setTotalElements] = useState(0); 
    const [totalPages, setTotalPages] = useState(0); 

    const [fullNoticeList, setFullNoticeList] = useState<BoardListItem[]>([]);
    const [searchParams, setSearchParams] = useState<SearchParams>({ keyword: '', type: 'title' });
    const isAdmin = useSelector(selectIsAdmin);

    // 1. 전체 목록을 불러오는 useEffect (로직 유지)
    useEffect(() => {
        const loadAllNotices = async () => {
            setLoading(true);
            try {
                const response: PagingDto<BoardListItem> = await fetchBoardList(0, ALL_PAGES); 
                setFullNoticeList(response.content);
            } catch (err) {
                setError("전체 게시글 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadAllNotices();
    }, []);

    // 2. 검색 필터링 로직 (useMemo 유지)
    const filteredList = useMemo(() => {
        let list = fullNoticeList;
        const { keyword, type } = searchParams;
        const lowerKeyword = keyword.toLowerCase().trim();

        if (lowerKeyword) {
            list = fullNoticeList.filter(post => {
                const titleMatch = post.title.toLowerCase().includes(lowerKeyword);
                return titleMatch; 
            });
        }
        return list; 
    }, [fullNoticeList, searchParams]);
    
    
    // 3. 페이지네이션 상태 업데이트 (useEffect 유지)
    useEffect(() => {
        const newTotalElements = filteredList.length;
        const newTotalPages = Math.ceil(newTotalElements / pageSize);

        setTotalElements(newTotalElements);
        setTotalPages(newTotalPages);

        if (currentPage >= newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages - 1);
        } else if (newTotalPages === 0) {
             setCurrentPage(0);
        }
    }, [filteredList, pageSize, currentPage]); 

    // 4. 현재 페이지에 보여줄 목록 계산 (useMemo 유지)
    const visibleNoticeList = useMemo(() => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        
        return filteredList.slice(startIndex, endIndex);
    }, [filteredList, currentPage, pageSize]);
    
    // 6. 검색 핸들러 (useCallback 유지)
    const handleSearch = useCallback((params: SearchParams) => {
        setSearchParams(params); 
        setCurrentPage(0); 
    }, []);

    // 7. 페이지 변경 핸들러 (useCallback 유지)
    const handlePageChange = useCallback((pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); 
    }, []);


    // 렌더링 부분
    if (loading) return <div className={styles.statusMessage}>전체 게시글 목록을 불러오는 중입니다...</div>;
    if (error) return <div className={styles.statusMessage} style={{ color: 'red' }}>오류: {error}</div>;

    return (
        <div className={styles.noticeListContainer}>
            <h2 className={styles.pageMainTitle}>공지사항</h2>
            
            {/* BoardSearch 컴포넌트는 내부적으로 CSS Modules을 사용하도록 가정 */}
            <BoardSearch onSearch={handleSearch} isLoading={loading} />

            <div className={styles.listHeader}>
                <div>총 {totalElements}개의 게시글</div>
                {isAdmin && ( 
                    <Link to="/notice/create" className={styles.writeButtonLink}>
                        글쓰기
                    </Link>
                )}
            </div>
            
            <table className={styles.noticeTable}>
                <thead>
                    <tr>
                        <th style={{ width: '14%' }}>번호</th> 
                        <th className={styles.titleCell} style={{ width: '57%' }}>제목</th>
                        <th style={{ width: '14%' }}>작성일</th>
                        <th style={{ width: '14%' }}>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleNoticeList.length === 0 && totalElements > 0 ? (
                        <tr><td colSpan={4} className={styles.statusMessage}>검색 결과가 없습니다.</td></tr>
                    ) : visibleNoticeList.length === 0 && totalElements === 0 ? (
                        <tr><td colSpan={4} className={styles.statusMessage}>등록된 게시글이 없습니다.</td></tr>
                    ) : (
                        // 작성일, 조회수 컬럼 위치 교정 (post.viewCount, post.createdAt 순서로 되어있음)
                        visibleNoticeList.map((post) => (
                            <tr key={post.noticeId}>
                                <td>{post.noticeId}</td>
                                <td className={styles.titleCell}>
                                    <Link to={`/notice/${post.noticeId}`}>{post.title}</Link>
                                </td>
                                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td>{post.viewCount}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default NoticeListPage;