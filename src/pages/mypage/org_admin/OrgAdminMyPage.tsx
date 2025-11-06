import { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {getOrganizationInfo} from "../../../api/Api";
import {selectCurrentUserId} from "../../../store/slices/authSlice";
import {Box, Container, Paper, Typography} from "@mui/material";

interface OrganizationInfo {
  orgName:string;
  orgNumber:string;
  ownerName:string;
  ownerNumber:string;
  orgAddress:string;
}

function OrgAdminMyPage() {
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const userId = useSelector(selectCurrentUserId);

  useEffect(() => {
    const fetchOrganizationInfo = async () => {
      if (userId) {
        try {
          const response = await getOrganizationInfo(userId);
          setOrganizationInfo(response.data);
        } catch (error) {
          console.error("Failed to fetch organization info:", error);
        }
      }
    };

    fetchOrganizationInfo();
  }, [userId]);

  return (
      <Container maxWidth="md">
        <Box sx={{my: 4}}>
          <Typography variant="h4" component="h1" gutterBottom>
            마이페이지
          </Typography>
          <Paper elevation={3} sx={{p: 4}}>
            {organizationInfo ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    회사명: {organizationInfo.orgName}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    회사 전화번호: {organizationInfo.orgNumber}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    대표자명: {organizationInfo.ownerName}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    대표자 연락처: {organizationInfo.ownerNumber}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    주소: {organizationInfo.orgAddress}
                  </Typography>
                </Box>
            ) : (
                <Typography>
                  회사 정보를 불러오는 중입니다...
                </Typography>
            )}
          </Paper>
        </Box>
      </Container>
  );
}

export default OrgAdminMyPage;
