// src/components/chat/ChatMain.tsx
import React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from '@mui/material';
import { ChatRoomList } from '../../types/chat';

interface Props {
  rooms: ChatRoomList[];
  onJoin: (roomId: string) => void;
}

const ChatRoomTable: React.FC<Props> = ({ rooms, onJoin }) => {
  return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
              <TableCell>방번호</TableCell>
              <TableCell>방제목</TableCell>
              <TableCell align="center">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
                <TableRow key={room.roomId} hover>
                  <TableCell>{room.roomId}</TableCell>
                  <TableCell>{room.roomName}</TableCell>
                  <TableCell align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onJoin(room.roomId)}
                    >
                      참여하기
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
};

export default ChatRoomTable;