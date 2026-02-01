import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardDetail, updateBoard } from '../../api/Api'; // API 경로
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../store/slices/authSlice';
import styles from './NoticeEditPage.module.css'; // CSS Modules 임포트

function NoticeEditPage() {
    const { noticeId } = useParams<{ noticeId: string }>();
    const navigate = useNavigate();
    
    // 상태 정의
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true); // 💡 초기 상태: 로딩 중
    const [submitting, setSubmitting] = useState(false); // 제출 중 상태
    const [error, setError] = useState<string | null>(null);
    
    const isAdmin = useSelector(selectIsAdmin);

    // 1. 권한 확인 및 기존 데이터 로드
    useEffect(() => {
        if (!isAdmin) {
            alert("공지사항 수정 권한이 없습니다.");
            navigate('/notices');
            return;
        }

        const loadPost = async () => {
            if (!noticeId) {
                setError("게시글 ID가 없습니다.");
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                // 기존 게시글 데이터를 불러와 폼을 채웁니다.
                const post = await fetchBoardDetail(Number(noticeId));
                setTitle(post.title);
                setContent(post.content);
                setError(null); // 성공 시 오류 초기화
            } catch (err) {
                // 💡 에러 발생 시 처리
                setError("게시글 정보를 불러오는 데 실패했습니다. ID를 확인하세요.");
                console.error("게시글 로드 오류:", err);
            } finally {
                // 💡 로딩 상태는 성공/실패와 관계없이 반드시 해제
                setLoading(false);
            }
        };

        loadPost();
    // 💡 의존성 배열에 navigate와 isAdmin을 추가하여 React 규칙 준수
    }, [noticeId, isAdmin, navigate]); 

    // 2. 수정 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin || !noticeId) return;
        if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해주세요.");

        setSubmitting(true);
        try {
            await updateBoard(Number(noticeId), { title, content });
            alert("게시글이 성공적으로 수정되었습니다.");
            navigate(`/notice/${noticeId}`); // 수정 후 상세 페이지로 이동
        } catch (error) {
            alert("게시글 수정에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    // 3. 로딩 및 오류 시 렌더링 (흰 화면 방지)
    if (!isAdmin) return null; // 권한이 없으면 리다이렉트 중

    // 💡 컨테이너 스타일 정의 (CSS Modules 사용 시)
    const loadingErrorContainerClass = styles.editContainer || "loading-container"; // CSS 모듈 로딩 오류 방지
    
    if (loading) return <div className={loadingErrorContainerClass}>게시글 정보를 불러오는 중입니다...</div>;
    if (error) return <div className={loadingErrorContainerClass} style={{ color: 'red' }}>오류: {error}</div>;

    // 4. 정상 렌더링 (폼 구조)
    return (
        <div className={styles.editContainer}>
            <h2 className={styles.formTitle}>공지사항 수정 (ID: {noticeId})</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">제목:</label>
                    <input 
                        id="title"
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        disabled={submitting}
                        className={styles.inputField} 
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">내용:</label>
                    <textarea 
                        id="content"
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        rows={10}
                        disabled={submitting}
                        className={styles.textareaField}
                    />
                </div>
                <div className={styles.formActions}>
                    <button 
                        type="button" 
                        onClick={() => navigate(`/notices/${noticeId}`)}
                        disabled={submitting}
                        className={`${styles.btnAction} ${styles.btnCancel}`}
                    >
                        취소
                    </button>
                    <button 
                        type="submit" 
                        disabled={submitting} 
                        className={`${styles.btnAction} ${styles.btnPrimary}`}
                    >
                        {submitting ? '수정 중...' : '수정 완료'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NoticeEditPage;