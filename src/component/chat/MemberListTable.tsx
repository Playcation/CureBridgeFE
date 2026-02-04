import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../../api/ChatApi'; // 💡 만든 API 컴포넌트 임포트
import './MemberListPage.css';

interface Member {
  id: number;
  name: string;
  email: string;
}

const MemberListPage: React.FC = () => {
  const [memberList, setMemberList] = useState<Member[]>([]);
  const navigate = useNavigate();

  // 회원 목록 조회 (유저 서버 8081)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/user/list`);
        setMemberList(response.data);
      } catch (error) {
        console.error("회원 목록 로드 실패:", error);
      }
    };
    fetchMembers();
  }, []);

  // 채팅 시작 버튼 핸들러
  const startChat = async (otherMemberId: number) => {
    try {
      // 💡 chatApi 컴포넌트의 함수를 호출하여 roomId를 받아옴
      const roomId = await chatApi.getOrCreatePrivateChatRoom(otherMemberId);

      if (roomId) {
        navigate(`/chatpage/${roomId}`); // 성공 시 채팅방으로 이동
      }
    } catch (error) {
      console.error("채팅방 연결 실패:", error);
      alert("채팅방을 생성하거나 불러올 수 없습니다.");
    }
  };

  return (
      <Container maxWidth="md" className="member-list-container">
        <Paper elevation={3} className="member-paper">
          <Typography variant="h5" className="member-title">회원 목록</Typography>
          <TableContainer>
            <Table>
              <TableHead className="member-table-head">
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell align="center">채팅</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberList.map((member) => (
                    <TableRow key={member.id} className="member-row">
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell align="center">
                        <Button
                            variant="contained"
                            className="chat-button"
                            onClick={() => startChat(member.id)}
                        >
                          채팅하기
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
  );
};

export default MemberListPage;