// // src/pages/NoticeCreatePage.tsx

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createBoard } from '../../api/NoticeApi';
// import { useSelector } from 'react-redux';
// import { selectIsAdmin } from '../../store/slices/authSlice';
// import { selectCurrentUserId } from '../../store/slices/authSlice';
// import './NoticeCreatePage.module.css';

// function NoticeCreatePage() {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [loading, setLoading] = useState(false);
//     const isAdmin = useSelector(selectIsAdmin);
//     const currentUserId = useSelector(selectCurrentUserId); // 작성자 ID
//     const navigate = useNavigate();

//     // 💡 권한 체크: 관리자가 아니면 목록 페이지로 리다이렉트
//     useEffect(() => {
//         if (!isAdmin) {
//             alert("공지사항 작성 권한이 없습니다.");
//             navigate('/notice');
//         }
//     }, [isAdmin, navigate]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!isAdmin || !currentUserId) return alert("권한이 없거나 로그인 정보가 유효하지 않습니다.");

//         if (!title.trim() || !content.trim()) {
//             return alert("제목과 내용을 모두 입력해주세요.");
//         }

//         setLoading(true);
//         try {
//             // 💡 현재 로그인한 User ID와 데이터 전송
//             const newPost = await createBoard(currentUserId, { title, content });
//             alert("게시글이 성공적으로 작성되었습니다.");
//             navigate(`/notice/${newPost.noticeId}`);
//         } catch (error) {
//             alert("게시글 작성에 실패했습니다.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!isAdmin) return null;

//     return (
//         <div className="notice-form-container">
//             <h2 className="form-title">공지사항 작성</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="title">제목:</label>
//                     <input 
//                         id="title"
//                         type="text" 
//                         value={title} 
//                         onChange={(e) => setTitle(e.target.value)} 
//                         disabled={loading}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="content">내용:</label>
//                     <textarea 
//                         id="content"
//                         value={content} 
//                         onChange={(e) => setContent(e.target.value)} 
//                         rows={10}
//                         disabled={loading}
//                     />
//                 </div>
//                 <div className="form-actions">
//                     <button type="button" onClick={() => navigate('/notice')} disabled={loading}>
//                         취소
//                     </button>
//                     <button type="submit" disabled={loading} className="btn-primary">
//                         {loading ? '작성 중...' : '작성 완료'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default NoticeCreatePage;

// src/pages/NoticeCreatePage.tsx (수정 완료)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../../api/NoticeApi'; // API 경로 수정
import { useSelector } from 'react-redux';
import { selectIsAdmin, selectCurrentUserId } from '../../store/slices/authSlice';
import { BoardRequest } from "../../types/board";
import styles from './NoticeCreatePage.module.css';

function NoticeCreatePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const isAdmin = useSelector(selectIsAdmin);
    const currentUserId = useSelector(selectCurrentUserId); // 작성자 ID
    const navigate = useNavigate();

    // 💡 권한 체크
    useEffect(() => {
        if (!isAdmin) {
            alert("공지사항 작성 권한이 없습니다.");
            navigate('/notice');
        }
    }, [isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin || !currentUserId) return alert("권한이 없거나 로그인 정보가 유효하지 않습니다.");

        if (!title.trim() || !content.trim()) {
            return alert("제목과 내용을 모두 입력해주세요.");
        }

        setLoading(true);
        try {
            const newPost = await createBoard({title, content});
            alert("게시글이 성공적으로 작성되었습니다.");
            navigate(`/notice/${newPost.noticeId}`);
        } catch (error) {
            alert("게시글 작성에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className={styles.createContainer}>
            <h1 className={styles.pageTitle}>공지사항</h1> {/* 42px 메인 제목 */}
            
            <h2 className={styles.sectionTitle}>공지사항</h2> {/* 24px 소제목 */}
            
            <form onSubmit={handleSubmit}>
                {/* 1. 제목 입력 */}
                <div className={styles.formRow}>
                    <label htmlFor="title" className={styles.formLabel}>제목</label>
                    <input 
                        id="title"
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        disabled={loading}
                        className={styles.inputField} 
                        placeholder="제목을 입력해주세요. (최대 100자)"
                    />
                </div>
                
                {/* 2. 내용 입력 */}
                <div className={styles.formRow}>
                    <label htmlFor="content" className={styles.formLabel}>문의내용</label>
                    <textarea 
                        id="content"
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        rows={10}
                        disabled={loading}
                        className={styles.textareaField} 
                        placeholder="공지사항 글 작성란"
                    />
                </div>

                {/* 3. 파일 첨부 영역 (와이어프레임 포함) */}
                <div className={styles.formRow} style={{ alignItems: 'center' }}>
                    <label className={styles.formLabel}>파일 첨부</label>
                    <div className={styles.fileAttachGroup}>
                        <button type="button" className={styles.fileAttachButton}>
                            파일 첨부하기
                        </button>
                        <span className={styles.maxSizeText}>(최대 1개, 30MB)</span>
                    </div>
                </div>
                
                {/* 파일 첨부 설명 텍스트 */}
                <div className={styles.formRow} style={{ marginTop: '-15px' }}>
                    <div style={{ width: '75.2px' }} /> {/* 레이블 너비만큼 공백 */}
                    <p className={styles.fileHelpText}>
                        문의 내용과 관련된 파일만 첨부해주세요. (개인정보 접수 불가) <br/>
                        동영상은 zip파일로 첨부하거나 업로드한 동영상 사이트 URL을 기재해주세요.
                    </p>
                </div>


          {/* 4. 최종 액션 버튼 (중앙 정렬) */}
          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? '작성 중...' : '게시물 등록'}
            </button>
          </div>
        </form>
      </div>
  );
}

export default NoticeCreatePage;