import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoardList } from '../../api/NoticeApi';
import { BoardListItem } from '../../types/board';
import ReusablePagination from '../../component/PagingNation';
import BoardSearch, { SearchParams } from '../../component/BoardSearch/BoardSearch';
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

    useEffect(() => {
        const loadAllNotices = async () => {
            setLoading(true);
            try {
                const response = await fetchBoardList(0, ALL_PAGES);
                const items = (response as any).content ?? (response as any).list ?? [];
                setFullNoticeList(items);
            } catch (err) {
                setError('전체 게시글 목록을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        loadAllNotices();
    }, []);

    const filteredList = useMemo(() => {
        if (!fullNoticeList) return [];
        const { keyword } = searchParams;
        const lowerKeyword = keyword.toLowerCase().trim();
        if (!lowerKeyword) return fullNoticeList;
        return fullNoticeList.filter(post => post.title?.toLowerCase().includes(lowerKeyword));
    }, [fullNoticeList, searchParams]);

    const visibleNoticeList = useMemo(() => {
        if (!filteredList) return [];
        const startIndex = currentPage * pageSize;
        return filteredList.slice(startIndex, startIndex + pageSize);
    }, [filteredList, currentPage, pageSize]);

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

    const handleSearch = useCallback((params: SearchParams) => {
        setSearchParams(params);
        setCurrentPage(0);
    }, []);

    const handlePageChange = useCallback((pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    }, []);

    // loading/error여도 페이지 틀은 항상 보여줌
    return (
        <div className={styles.noticeListContainer}>
            <h2 className={styles.pageMainTitle}>공지사항</h2>

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
                    {/* 로딩 중 */}
                    {loading ? (
                        <tr>
                            <td colSpan={4} className={styles.statusMessage}>
                                게시글을 불러오는 중입니다...
                            </td>
                        </tr>
                    ) : error ? (
                        // 에러
                        <tr>
                            <td colSpan={4} className={styles.statusMessage} style={{ color: 'red' }}>
                                {error}
                            </td>
                        </tr>
                    ) : visibleNoticeList.length === 0 ? (
                        // 데이터 없음
                        <tr>
                            <td colSpan={4} className={styles.statusMessage}>
                                {totalElements > 0 ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
                            </td>
                        </tr>
                    ) : (
                        visibleNoticeList.map((post, index) => {
                            const displayNum = totalElements - currentPage * pageSize - index;
                            return (
                                <tr key={post.noticeId}>
                                    <td>{displayNum}</td>
                                    <td className={styles.titleCell}>
                                        <Link to={`/notice/${post.noticeId}`}>{post.title}</Link>
                                    </td>
                                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td>{post.viewCount}</td>
                                </tr>
                            );
                        })
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
