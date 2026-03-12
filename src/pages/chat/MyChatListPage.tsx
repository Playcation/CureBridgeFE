import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardHeader } from '@mui/material';
import * as chatApi from '../../api/ChatApi';
import { MyChatRoom } from '../../types/chat';
import MyChatTable from '../../component/chat/MyChatTable';

const MyChatListPage = () => {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState<MyChatRoom[]>([]);

  const loadMyRooms = async () => {
    try {
      const data = await chatApi.fetchMyRooms();
      setChatList(data);
    } catch (error) {
      console.error("Failed to fetch my rooms:", error);
    }
  };

  useEffect(() => {
    loadMyRooms();
  }, []);

  const handleEnter = (roomId: number) => {
    navigate(`/chat/chatPage/${roomId}`);
  };

  const handleLeave = async (roomId: number) => {
    if (!window.confirm("정말 이 채팅방을 나가시겠습니까?")) return;

    try {
      await chatApi.leaveChatRoom(roomId);
      // 성공 시 상태 업데이트 (UI에서 제거)
      setChatList(prev => prev.filter(chat => chat.roomId !== roomId));
    } catch (error) {
      console.error("Failed to leave room:", error);
      alert("방 나가기에 실패했습니다.");
    }
  };

  return (
      <Container sx={{ mt: 4 }}>
        <Card>
          <CardHeader
              title="내 채팅목록"
              titleTypographyProps={{ align: 'center', variant: 'h5' }}
          />
          <CardContent>
            <MyChatTable
                chatList={chatList}
                onEnter={handleEnter}
                onLeave={handleLeave}
            />
          </CardContent>
        </Card>
      </Container>
  );
};

export default MyChatListPage;