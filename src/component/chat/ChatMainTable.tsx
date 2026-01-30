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
import { MyChatRoom } from '../../types/chat';

interface Props {
  chatList: MyChatRoom[];
  onEnter: (roomId: number) => void;
  onLeave: (roomId: number) => void;
}

const ChatMainTable: React.FC<Props> = ({ chatList, onEnter, onLeave }) => {
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
                      <TableCell sx={{ fontWeight: '500' }}>
                        {chat.roomName}
                      </TableCell>
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
                            disabled={chat.isGroupChat === 'N'}
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

export default ChatMainTable;