import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const CreateRoomModal = ({ open, onClose, onCreate }: Props) => {
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    onCreate(title);
    setTitle(''); // 초기화
  };

  return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>채팅방 생성</DialogTitle>
        <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              label="방제목"
              fullWidth
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">취소</Button>
          <Button onClick={handleCreate} color="primary" variant="contained">생성</Button>
        </DialogActions>
      </Dialog>
  );
};

export default CreateRoomModal;