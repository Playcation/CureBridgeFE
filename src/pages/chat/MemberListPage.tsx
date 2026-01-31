import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../../api/ChatApi'; // 💡 이미 가지고 계신 ChatApi 적용
import './MemberListPage.css';

interface Member {
  id: number;
  name: string;
  email: string;
}

const MemberListPage: React.FC = () => {
  const [memberList, setMemberList] = useState<Member[]>([]);
  const navigate = useNavigate();

  // 1. 회원 목록 조회 (유저 관리 서버 8081)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // 회원 목록은 별도의 axiosInstance가 있다면 그것을 사용해도 좋습니다.
        const response = await axios.get(`http://localhost:8081/user/list`);
        setMemberList(response.data);
      } catch (error) {
        console.error("회원 목록 로드 실패:", error);
      }
    };
    fetchMembers();
  }, []);

  // 2. 채팅 시작하기 버튼 핸들러
  const startChat = async (otherMemberId: number) => {
    try {
      console.log(`채팅 요청 유저 ID: ${otherMemberId}`);

      // 💡 [컴포넌트 적용] ChatApi에 정의된 함수 호출
      // 서버에서 전달받은 roomId(number)를 변수에 저장합니다.
      const roomId = await chatApi.getOrCreatePrivateChatRoom(otherMemberId);

      if (roomId) {
        console.log(`생성/연결된 채팅방 번호: ${roomId}`);
        // 획득한 roomId를 사용하여 ChatPage로 이동
        navigate(`/chatpage/${roomId}`);
      }
    } catch (error) {
      console.error("채팅방 연결 실패:", error);
      alert("상대방과 채팅방을 연결하는 중에 오류가 발생했습니다.");
    }
  };

  return (
      <Container maxWidth="md" className="member-list-container">
        <Paper elevation={3} className="member-paper">
          <Typography variant="h5" className="member-title">
            회원 목록
          </Typography>

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
                            color="primary"
                            className="chat-button"
                            onClick={() => startChat(member.id)}
                        >
                          채팅하기
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
                {memberList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="empty-row-text">
                        표시할 회원이 없습니다.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
  );
};

export default MemberListPage;