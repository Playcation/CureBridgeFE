import React, {useEffect, useState} from 'react';

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
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{marginTop: '32px', marginBottom: '32px'}}>
                <h1 style={{ marginBottom: '0.35em' }}>
                    마이페이지
                </h1>
                <div style={{ padding: '32px', boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)' }}>
                    {managerInfo ? (
                        <div>
                            <h6 style={{ marginBottom: '0.35em' }}>
                                이름: {managerInfo.name}
                            </h6>
                            <h6 style={{ marginBottom: '0.35em' }}>
                                직급: {managerInfo.rank}
                            </h6>
                            <h6 style={{ marginBottom: '0.35em' }}>
                                전화번호: {managerInfo.number}
                            </h6>
                        </div>
                    ) : (
                        <p>
                            직원 정보를 불러오는 중입니다...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManagerMyPage;