import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 스타일 및 컴포넌트 임포트
import styles from './ChatMainPage.module.css';
import MyChatTable from '../../component/chat/MyChatTable';
import ChatMainTable from '../../component/chat/ChatMainTable';
// import CreateRoomModal from '../../component/chat/CreateRoomModal';

// API 및 타입 임포트
import {
  fetchChatRoomList,
  fetchMyChatList,
  joinChatRoom,
  leaveChatRoom,
  createChatRoom
} from '../../api/ChatApi';
import { MyChatList, ChatRoomList } from '../../types/chat';

const ChatMainPage: React.FC = () => {
  const [myRooms, setMyRooms] = useState<MyChatList[]>([]);
  const [allRooms, setAllRooms] = useState<ChatRoomList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // 1. 초기 데이터 로딩 (Vue의 created 역할)
  const loadAllData = async () => {
    try {
      const [myRes, allRes] = await Promise.all([
        fetchMyChatList(),
        fetchChatRoomList()
      ]);
      setMyRooms(myRes);
      setAllRooms(allRes);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // 2. 핸들러 로직들
  const handleEnter = (roomId: string) => navigate(`/chatpage/${roomId}`);

  const handleJoin = async (roomId: string) => {
    try {
      await joinChatRoom(roomId);
      navigate(`/chatpage/${roomId}`);
    } catch (error) {
      alert("채팅방 참여에 실패했습니다.");
    }
  };

  const handleLeave = async (roomId: string) => {
    if (!window.confirm("정말 이 채팅방을 나가시겠습니까?")) return;
    try {
      await leaveChatRoom(roomId);
      loadAllData(); // 목록 새로고침
    } catch (error) {
      alert("방 나가기 실패");
    }
  };

  const handleCreateRoom = async (roomName: string) => {
    try {
      await createChatRoom(roomName);
      setIsModalOpen(false);
      loadAllData();
    } catch (error) {
      alert("방 생성 실패");
    }
  };

  return (
      <div className={styles.chatContainer}>
        {/* --- 상단 헤더 영역 --- */}
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>채팅 서비스</h1>
          <button
              className={styles.createButton}
              onClick={() => setIsModalOpen(true)}
          >
            + 새 채팅방 생성
          </button>
        </div>

        {/* --- 섹션 1: 내 채팅 목록 --- */}
        <section>
          <div className={styles.sectionTitle}>
            <span>내 채팅 목록</span>
            <small style={{ fontSize: '12px', color: '#737B7D', fontWeight: 'normal' }}>
              참여 중인 대화방 {myRooms.length}개
            </small>
          </div>
          <div className={styles.tableWrapper}>
            <MyChatTable
                chatList={myRooms}
                onEnter={handleEnter}
                onLeave={handleLeave}
            />
          </div>
        </section>

        {/* 섹션 구분선 */}
        <hr className={styles.sectionDivider} />

        {/* --- 섹션 2: 전체 채팅방 목록 --- */}
        <section>
          <div className={styles.sectionTitle}>
            <span>전체 채팅방 목록</span>
          </div>
          <div className={styles.tableWrapper}>
            <ChatMainTable
                rooms={allRooms}
                onJoin={handleJoin}
            />
          </div>
        </section>

        {/* 방 생성 모달 */}
        {/*<CreateRoomModal*/}
        {/*    open={isModalOpen}*/}
        {/*    onClose={() => setIsModalOpen(false)}*/}
        {/*    onCreate={handleCreateRoom}*/}
        {/*/>*/}
      </div>
  );
};

export default ChatMainPage;