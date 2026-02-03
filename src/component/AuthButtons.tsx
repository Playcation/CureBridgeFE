// src/components/common/AuthButtons.tsx (최종 기능 버전)

import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteBoard } from '../api/ContentApi';
import { selectIsAdmin, selectCurrentUserId } from '../store/slices/authSlice'; 
import { RootState } from '../store/store'; 

interface AuthButtonsProps {
  boardId: number;       
  postUserId: number;    
  isNoticeBoard: boolean;
  // 💡 CSS 클래스 Props는 그대로 유지하여, DetailPage와의 Props 구조를 맞춥니다.
  modifyClass: string;   
  deleteClass: string;   
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
    boardId, 
    postUserId, 
    isNoticeBoard,
    modifyClass, 
    deleteClass 
}) => {
  const navigate = useNavigate();
  const isAdmin = useSelector((state: RootState) => selectIsAdmin(state));
  const currentUserId = useSelector((state: RootState) => selectCurrentUserId(state));
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // 💡 권한 확인 로직 (유지)
  let canModify = false;
  if (isNoticeBoard) {
    canModify = isAdmin;
  } else {
    canModify = isAdmin || (isAuthenticated && currentUserId === postUserId);
  }
  
  // 💡 삭제 핸들러 (유지)
  const handleDelete = useCallback(async () => {
    if (!canModify) return alert("삭제 권한이 없습니다.");
    if (!window.confirm(`게 게시글 ID ${boardId}를 정말 삭제하시겠습니까?`)) return;
    
    try {
      await deleteBoard(boardId);
      alert("게시글이 삭제되었습니다.");
      navigate('/notice'); 
    } catch (error) {
      alert("삭제할 권한이 없거나 서버 오류가 발생했습니다.");
    }
  }, [canModify, boardId, navigate]);

  if (!canModify) {
    return null;
  }

  return (
    // 💡 1. styles.actionButtonGroup 대신, 기본 Flexbox 인라인 스타일 적용
    <div style={{ display: 'flex', gap: '10px' }}> 
      <Link to={`/notice/edit/${boardId}`} className={modifyClass}>
        수정
      </Link>
      <button onClick={handleDelete} className={deleteClass}>
        삭제
      </button>
    </div>
  );
};

export default AuthButtons;