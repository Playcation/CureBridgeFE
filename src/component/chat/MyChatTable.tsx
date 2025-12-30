import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip
} from '@mui/material';
import { MyChatList } from '../../types/chat';

interface Props {
  chatList: MyChatList[];     // 서버에서 받아온 내 채팅방 목록
  onEnter: (roomId: string) => void;  // 입장 버튼 클릭 시 부모(Page)에서 처리할 함수
  onLeave: (roomId: string) => void;  // 나가기 버튼 클릭 시 부모(Page)에서 처리할 함수
}

const MyChatTable: React.FC<Props> = ({ chatList, onEnter, onLeave }) => {
  return (
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell>채팅방 이름</TableCell>
              <TableCell align="center">읽지 않은 메시지</TableCell>
              <TableCell align="center">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chatList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    참여 중인 채팅방이 없습니다.
                  </TableCell>
                </TableRow>
            ) : (
                chatList.map((chat) => (
                    <TableRow key={chat.roomId} hover>
                      {/* 1. 채팅방 이름 */}
                      <TableCell sx={{ fontWeight: '500' }}>
                        {chat.roomName}
                      </TableCell>

                      {/* 2. 읽지 않은 메시지 수 (0보다 크면 강조) */}
                      <TableCell align="center">
                        {chat.unReadCount > 0 ? (
                            <Chip
                                label={chat.unReadCount}
                                color="error"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">0</Typography>
                        )}
                      </TableCell>

                      {/* 3. 액션 버튼 (입장, 나가기) */}
                      <TableCell align="center">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => onEnter(chat.roomId)}
                            sx={{ mr: 1 }}
                        >
                          입장
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            // Vue 코드의 :disabled="chat.isGroupChat === 'N'" 반영
                            // DTO에서 boolean으로 정의했다면 !chat.isGroupChat 사용
                            disabled={chat.isGroupChat === false}
                            onClick={() => onLeave(chat.roomId)}
                        >
                          나가기
                        </Button>
                      </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
  );
};

export default MyChatTable;