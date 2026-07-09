import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchBoardDetail, updateBoard} from '../../api/NoticeApi';
import {useSelector} from 'react-redux';
import {selectIsAdmin} from '../../store/slices/authSlice';
import styles from './NoticeEditPage.module.css';

function NoticeEditPage() {
  const {noticeId} = useParams<{ noticeId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [newAttachedFile, setNewAttachedFile] = useState<File | null>(null);
  const [backupFiles, setBackupFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = useSelector(selectIsAdmin);

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
        const post = await fetchBoardDetail(Number(noticeId));
        setTitle(post.title);
        setContent(post.content);
        if (post.attachedFilePaths) {
          setExistingFiles(post.attachedFilePaths);
          setBackupFiles(post.attachedFilePaths); // 백업 보존
        }
        setError(null);
      } catch (err) {
        setError("게시글 정보를 불러오는 데 실패했습니다. ID를 확인하세요.");
        console.error("게시글 로드 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [noticeId, isAdmin, navigate]);

  // 파일 선택 핸들러 고도화
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 30 * 1024 * 1024) {
        alert("파일 크기는 최대 30MB를 초과할 수 없습니다.");
        return;
      }
      setNewAttachedFile(file);
      setExistingFiles([]);
    }
  };

  // 새 파일 등록 취소(X 버튼) 핸들러
  const handleCancelNewFile = () => {
    setNewAttachedFile(null);
    setExistingFiles(backupFiles);
  };

  const getFileName = (path: string) => {
    return path.substring(path.lastIndexOf('/') + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !noticeId) return;
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해주세요.");

    setSubmitting(true);
    try {
      const fileToSend = newAttachedFile ? [newAttachedFile] : undefined;
      await updateBoard(Number(noticeId), {title, content}, fileToSend);
      alert("게시글이 성공적으로 수정되었습니다.");
      navigate(`/notices/${noticeId}`); // URL 명세 표준화 (/notice -> /notices)
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) return null;

  const loadingErrorContainerClass = styles.editContainer || "loading-container";

  if (loading) return <div className={loadingErrorContainerClass}>게시글 정보를 불러오는 중입니다...</div>;
  if (error) return <div className={loadingErrorContainerClass}
                         style={{color: 'red'}}>오류: {error}</div>;

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

          <div className={styles.formGroup}>
            <label>첨부파일 관리:</label>

            {/* A. 기존 파일 보이기 (새 파일이 없을 때만 청정 노출) */}
            {existingFiles.length > 0 && !newAttachedFile && (
                <div style={{margin: '5px 0 12px 0', fontSize: '14px', color: '#666'}}>
                  <span style={{fontWeight: 'bold'}}>기존 파일:</span> {getFileName(existingFiles[0])}
                  <span style={{marginLeft: '10px', fontSize: '12px', color: '#dc3545'}}>(새 파일 첨부 시 교체됩니다.)</span>
                </div>
            )}

            {/* B. 새 파일 첨부 UI */}
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{display: 'none'}}
                  onClick={(e) => {
                    (e.target as HTMLInputElement).value = '';
                  }}
              />
              <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    backgroundColor: '#e2e8f0',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px'
                  }}
              >
                {backupFiles.length > 0 ? '파일 교체하기' : '파일 첨부하기'}
              </button>

              {newAttachedFile && (
                  <div style={{
                    fontSize: '14px',
                    color: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>📎 {newAttachedFile.name} (교체 예정)</span>
                    <button type="button" onClick={handleCancelNewFile} style={{
                      color: 'red',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}>X
                    </button>
                  </div>
              )}
            </div>
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
