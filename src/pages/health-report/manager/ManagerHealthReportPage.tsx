import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Paper, Typography, Box
} from '@mui/material';
import HealthReportPage from '../../health-report/HealthReportPage';
import InviteModal from "../../../component/invite-modal/InviteModal";
import {getOrgUser} from "../../../api/MemberApi"; // 기존 컴포넌트 활용 (userId props 추가 필요)
import {UserSummary} from "../../../types/memberTypes";

const ManagerHealthReportPage = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getOrgUser();
        // API 응답 구조에 따라 response.data 또는 response 확인 필요
        setUsers(response.data);
      } catch (error) {
        console.error("유저 목록 로드 실패:", error);
      }
    };

    fetchUsers();
  }, []);

  // 목록으로 돌아가기
  const handleBackToList = () => setSelectedUserId(null);

  if (selectedUserId) {
    return (
        <div style={{ padding: '24px' }}>
          <Button variant="outlined" onClick={handleBackToList} style={{ marginBottom: '20px' }}>
            ← 사용자 목록으로 돌아가기
          </Button>
          <Typography variant="h5" gutterBottom>
            {users.find(u => u.id === selectedUserId)?.name} 님의 건강 보고서
          </Typography>
          {/* 기존 HealthReportPage에 userId를 넘겨 해당 유저 데이터만 필터링하도록 수정 필요 */}
          <HealthReportPage userId={selectedUserId} />
        </div>
    );
  }

  return (
      <Box className="mainContent">
        <Typography variant="h4" gutterBottom>전체 사용자 건강 보고서 관리</Typography>
        <Box p={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">환자 목록</Typography>
            <Box display="flex" gap={1}>
              <Button
                  variant="contained"
                  sx={{ bgcolor: '#6366f1' }}
                  onClick={() => setIsModalOpen(true)}
              >
                환자 초대
              </Button>
              <Button variant="contained" sx={{ bgcolor: '#6366f1' }}>
                환자 삭제
              </Button>
            </Box>
          </Box>
        <Paper elevation={3}>
          <Table>
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>사용자 ID</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>전화번호</TableCell>
                <TableCell>생일</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell><strong>{user.name}</strong></TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>
                      {user.birthDate.split("T")[0].split("-")[0].substring(2)}년
                      {user.birthDate.split("T")[0].split("-")[1]}월
                      {user.birthDate.split("T")[0].split("-")[2]}일
                    </TableCell>
                    <TableCell align="center">
                      <Button
                          variant="contained"
                          size="small"
                          onClick={() => setSelectedUserId(user.id)}
                      >
                        상세 보기
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
          {/* 초대 모달 연결 */}
          <InviteModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
          />
        </Box>
      </Box>
  );
};

export default ManagerHealthReportPage;