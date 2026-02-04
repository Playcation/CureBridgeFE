import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBoardDetail } from '../../api/NoticeApi';
import { BoardDetail } from '../../types/board'; 
import AuthButtons from '../../component/AuthButtons'; 
import styles from './NoticeDetailPage.module.css'; // 💡 CSS Modules 임포트

function NoticeDetailPage() {
    const { noticeId } = useParams<{ noticeId: string }>(); 
    const navigate = useNavigate();
    const [post, setPost] = useState<BoardDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            if (!noticeId) return;
            setLoading(true);
            try {
                const data = await fetchBoardDetail(Number(noticeId));
                setPost(data);
            } catch (err) {
                setError("게시글 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [noticeId]); 

    const containerStyle = { maxWidth: '1000px', margin: '0 auto' }; 
    if (loading) return <div style={containerStyle}>게시글을 불러오는 중입니다...</div>;
    if (error) return <div style={{...containerStyle, color: 'red'}}>오류: {error}</div>;
    if (!post) return <div style={containerStyle}>게시글을 찾을 수 없습니다.</div>;

    const formattedDate = new Date(post.createdAt).toLocaleDateString();

    return (
        <div className={styles.detailContainer}>
            <div className={styles.boardWrapper}>
                
                <h1 className={styles.pageTitle}>공지사항</h1>
                
                {/* 1. 제목 영역 및 밑줄 */}
                <div className={styles.postTitleArea}>
                    <h2 className={styles.postTitleText}>
                        <span>{post.title}</span>
                        <span className={styles.titleDate}>{formattedDate}</span>
                    </h2>
                    
                    {/* 2. 게시글 정보 (작성자 + 조회수) */}
                    <div className={styles.postMeta}>
                        <span className={styles.postAuthor}>작성자 : <strong>{post.userId}</strong></span>
                        <span className={styles.viewCount}>조회수 : <strong>{post.viewCount}</strong></span>
                    </div>
                </div>
                
                {/* 3. 본문 내용 (사각형 테두리 적용) */}
                <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* 4. 액션 바 */}
                <div className={styles.actionBar}>
                    {/* 목록으로 버튼 (좌측) */}
                    <Link to="/notices">
                        <button className={styles.btnList}>목록으로</button>
                    </Link>

                    {/* 수정/삭제 버튼 그룹 (우측) */}
                    <div className={styles.actionButtonGroup}>
                        <AuthButtons 
                          boardId={post.noticeId} 
                          postUserId={post.userId} 
                          isNoticeBoard={true} 
                          // AuthButtons.module.css의 클래스를 전달
                          modifyClass={styles.btnModify}
                          deleteClass={styles.btnDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoticeDetailPage;