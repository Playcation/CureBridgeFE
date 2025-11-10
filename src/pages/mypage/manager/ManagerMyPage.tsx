import React, {useEffect, useState} from 'react';
import "./ManagerMyPage.css";
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
        <div className="manager-container">
            <div className="manager-content">
                <h1 className="manager-title">
                    마이페이지
                </h1>
                <div className="manager-paper">
                    {managerInfo ? (
                        <div>
                            <h6 className="manager-info-item">
                                이름: {managerInfo.name}
                            </h6>
                            <h6 className="manager-info-item">
                                직급: {managerInfo.rank}
                            </h6>
                            <h6 className="manager-info-item">
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