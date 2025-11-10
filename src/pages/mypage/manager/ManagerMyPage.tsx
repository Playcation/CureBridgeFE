import React, {useEffect, useState} from 'react';
import {Container, Paper, Typography} from "@mui/material";
import {getManagerInfo} from "../../../api/Api";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../../store/slices/authSlice";

interface ManagerInfo {
    name: string;
    rank: string;
    number: string;
}

function ManagerMyPage() {
    const [managerInfo, setManagerInfo] = useState<ManagerInfo | null>(null);
    const userId = useSelector(selectCurrentUserId);

    useEffect(() => {
        const fetchManagerInfo = async () => {
            if (userId) {
                try {
                    const response = await getManagerInfo(userId);
                    setManagerInfo(response.data);
                } catch (error) {
                    console.error("Failed to fetch manager info:", error);
                }
            }
        };

        fetchManagerInfo();
    }, [userId]);

    return (
        <Container maxWidth="md">
            <div style={{marginTop: '32px', marginBottom: '32px'}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    마이페이지
                </Typography>
                <Paper elevation={3} sx={{p: 4}}>
                    {managerInfo ? (
                        <div>
                            <Typography variant="h6" gutterBottom>
                                이름: {managerInfo.name}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                직급: {managerInfo.rank}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                전화번호: {managerInfo.number}
                            </Typography>
                        </div>
                    ) : (
                        <Typography>
                            직원 정보를 불러오는 중입니다...
                        </Typography>
                    )}
                </Paper>
                                    </div>        </Container>
    );
}

export default ManagerMyPage;