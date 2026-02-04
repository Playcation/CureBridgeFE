import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import { MyChatRoom } from '../../types/chat';

interface Props {
  chatList: MyChatRoom[];
  onEnter: (roomId: number) => void;
  onLeave: (roomId: number) => void;
}

const MyChatTable = ({ chatList, onEnter, onLeave }: Props) => {
  // @ts-ignore
  return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>채팅방 이름</TableCell>
              <TableCell align="center">읽지 않은 메시지</TableCell>
              <TableCell align="right">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chatList.map((chat) => (
                <TableRow key={chat.roomId}>
                  <TableCell>{chat.roomName}</TableCell>
                  <TableCell align="center">{chat.unReadCount}</TableCell>
                  <TableCell align="right">
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => onEnter(chat.roomId)}
                    >
                      입장
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={chat.isGroupChat === 'N'}
                        onClick={() => onLeave(chat.roomId)}
                    >
                      나가기
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
};

export default MyChatTable;