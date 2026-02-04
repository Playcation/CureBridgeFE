import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, Box
} from '@mui/material';
import { chatApi } from '../../api/ChatApi';
import { ChatRoom } from '../../types/chat';
import CreateRoomModal from '../../component/chat/CreateRoomModal';


const ChatRoomListPage = () => {
  const navigate = useNavigate();
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 채팅방 목록 로드
  const loadChatRooms = async () => {
    try {
      const data = await chatApi.fetchRooms();
      setChatRoomList(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    }
  };

  useEffect(() => {
    loadChatRooms();
  }, []);

  // 채팅방 생성 처리
  const handleCreateRoom = async (title: string) => {
    try {
      await chatApi.createRoom(title);
      setIsModalOpen(false);
      loadChatRooms(); // 목록 새로고침
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  // 채팅방 참여 처리
  const handleJoinRoom = async (roomId: number) => {
    try {
      await chatApi.joinRoom(roomId);
      navigate(`/chat/chatPage/${roomId}`);
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  return (
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'center' }}>
              채팅방 목록
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(true)}>
              채팅방 생성
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>방번호</TableCell>
                  <TableCell>방제목</TableCell>
                  <TableCell align="center">채팅</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chatRoomList.map((chat) => (
                    <TableRow key={chat.roomId}>
                      <TableCell>{chat.roomId}</TableCell>
                      <TableCell>{chat.roomName}</TableCell>
                      <TableCell align="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleJoinRoom(chat.roomId)}
                        >
                          참여하기
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <CreateRoomModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateRoom}
        />
      </Container>
  );
};

export default ChatRoomListPage;