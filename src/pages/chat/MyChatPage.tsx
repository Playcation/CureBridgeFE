import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MyChatTable from '../../component/chat/MyChatTable';
import { fetchMyChatList, leaveChatRoom } from '../../api/ChatApi';
import { MyChatList } from '../../types/chat';

const MyChatListPage: React.FC = () => {
  // 1. 상태 관리 (Vue의 data 역할)
  const [chatList, setChatList] = useState<MyChatList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // 2. 데이터 로드 로직 (Vue의 created 역할)
  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await fetchMyChatList();
      setChatList(data);
    } catch (err) {
      setErrorMsg('채팅방 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // 3. 채팅방 입장 핸들러 (Vue의 enterChatRoom)
  const handleEnter = (roomId: string) => {
    navigate(`/chatpage/${roomId}`);
  };

  // 4. 채팅방 나가기 핸들러 (Vue의 leaveChatRoom)
  const handleLeave = async (roomId: string) => {
    if (!window.confirm("정말 이 채팅방을 나가시겠습니까?")) return;

    try {
      await leaveChatRoom(roomId);
      // 성공 시 UI에서 즉시 제거 (Vue의 filter와 동일한 로직)
      setChatList((prev) => prev.filter((chat) => chat.roomId !== roomId));
    } catch (err) {
      alert('방 나가기에 실패했습니다.');
      console.error(err);
    }
  };

  return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* 페이지 헤더 */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            내 채팅 목록
          </Typography>
          <Typography variant="body1" color="text.secondary">
            참여 중인 대화방을 확인하고 입장할 수 있습니다.
          </Typography>
        </Box>

        {/* 에러 발생 시 알림 */}
        {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
        )}

        {/* 실제 테이블 컴포넌트 호출 */}
        <MyChatTable
            chatList={chatList}
            onEnter={handleEnter}
            onLeave={handleLeave}
        />

        {/* 로딩 중 표시 (간단한 처리) */}
        {!loading && chatList.length === 0 && !errorMsg && (
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Typography color="text.secondary">참여 중인 채팅방이 없습니다.</Typography>
            </Box>
        )}
      </Container>
  );
};

export default MyChatListPage;