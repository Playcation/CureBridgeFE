import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createBoard} from '../../api/NoticeApi';
import {useSelector} from 'react-redux';
import {selectCurrentUserId, selectIsAdmin} from '../../store/slices/authSlice';
import styles from './NoticeCreatePage.module.css';

function NoticeCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = useSelector(selectIsAdmin);
  const currentUserId = useSelector(selectCurrentUserId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      alert("공지사항 작성 권한이 없습니다.");
      navigate('/notices');
    }
  }, [isAdmin, navigate]);

  // 파일 선택 완료 시 상태 저장 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 용량 검증 (최대 30MB 사양 적용)
      if (file.size > 30 * 1024 * 1024) {
        alert("파일 크기는 최대 30MB를 초과할 수 없습니다.");
        return;
      }
      setAttachedFile(file);
    }
  };

  // 파일 커스텀 버튼 클릭 시 트리거
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !currentUserId) return alert("권한이 없거나 로그인 정보가 유효하지 않습니다.");

    if (!title.trim() || !content.trim()) {
      return alert("제목과 내용을 모두 입력해주세요.");
    }

    setLoading(true);
    try {
      const filesToSend = attachedFile ? [attachedFile] : undefined;
      const newPost = await createBoard({title, content}, filesToSend);
      alert("게시글이 성공적으로 작성되었습니다.");
      navigate(`/notices/${newPost.noticeId}`);
    } catch (error) {
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
      <div className={styles.createContainer}>
        <h1 className={styles.pageTitle}>공지사항</h1>
        <h2 className={styles.sectionTitle}>공지사항</h2>

        <form onSubmit={handleSubmit}>
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

          {/* 3. 파일 첨부 영역 (물리 인풋 은닉 및 버튼 연동) */}
          <div className={styles.formRow} style={{alignItems: 'center'}}>
            <label className={styles.formLabel}>파일 첨부</label>
            <div className={styles.fileAttachGroup}>

              {/* 투명 인간 인풋 노드 배치 */}
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{display: 'none'}}
              />

              <button
                  type="button"
                  className={styles.fileAttachButton}
                  onClick={handleButtonClick}
                  disabled={loading}
              >
                파일 첨부하기
              </button>
              <span className={styles.maxSizeText}>(최대 1개, 30MB)</span>

              {/* 파일이 정상적으로 등록되었을 때 화면에 파일명 노출 */}
              {attachedFile && (
                  <div style={{
                    marginLeft: '15px',
                    fontSize: '14px',
                    color: '#007bff',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span>📎 {attachedFile.name}</span>
                    <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        style={{
                          marginLeft: '8px',
                          color: '#dc3545',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                    >
                      X
                    </button>
                  </div>
              )}
            </div>
          </div>

          <div className={styles.formRow} style={{marginTop: '-15px'}}>
            <div style={{width: '75.2px'}}/>
            <p className={styles.fileHelpText}>
              공지 내용과 관련된 파일만 첨부해주세요. (개인정보 접수 불가) <br/>
              동영상은 zip파일로 첨부하거나 업로드한 동영상 사이트 URL을 기재해주세요.
            </p>
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? '작성 중...' : '공지 등록'}
            </button>
          </div>
        </form>
      </div>
  );
}

export default NoticeCreatePage;