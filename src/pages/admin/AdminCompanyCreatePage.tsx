import React, { useState } from 'react';
import axios from "axios";
import "./AdminMainPage.css";
import { useNavigate } from "react-router-dom";

interface OrgCreateRequestDto {
    account: string;
    orgName: string;
    orgNumber: string;
    ownerName: string;
    ownerNumber: string;
    orgAddress: string;
}

const AdminCompanyCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const [newOrg, setNewOrg] = useState<OrgCreateRequestDto>({
        account: "",
        orgName: "",
        orgNumber: "",
        ownerName: "",
        ownerNumber: "",
        orgAddress: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewOrg(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const createOrganization = async () => {
        // 유효성 검사 (필요에 따라 추가)
        if (!newOrg.account || !newOrg.orgName || !newOrg.orgNumber) {
            alert("아이디, 기업명, 사업자번호는 필수 항목입니다.");
            return;
        }

        try {
            await axios.post("/api/organization/create", newOrg, {
                headers: { Authorization: token || "" }
            });

            alert("기업이 성공적으로 생성되었습니다.");
            navigate("/admin/list");
        } catch (err) {
            console.error("기업 생성 실패:", err);
            alert("기업 생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="admin-container">
            <h2 className="title">신규 기업 등록</h2>

            <div className="create-form" style={{ display: 'block', maxWidth: '500px', margin: '0 auto' }}>
                <div className="input-group">
                    <label>기업 계정(ID)</label>
                    <input
                        type="text"
                        name="account"
                        placeholder="로그인에 사용할 계정명"
                        value={newOrg.account}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>기업명</label>
                    <input
                        type="text"
                        name="orgName"
                        placeholder="기업명을 입력하세요"
                        value={newOrg.orgName}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>사업자번호</label>
                    <input
                        type="text"
                        name="orgNumber"
                        placeholder="000-00-00000"
                        value={newOrg.orgNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>대표자명</label>
                    <input
                        type="text"
                        name="ownerName"
                        placeholder="대표자 성함"
                        value={newOrg.ownerName}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>대표자 연락처</label>
                    <input
                        type="text"
                        name="ownerNumber"
                        placeholder="010-0000-0000"
                        value={newOrg.ownerNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>기업 주소</label>
                    <input
                        type="text"
                        name="orgAddress"
                        placeholder="회사 주소"
                        value={newOrg.orgAddress}
                        onChange={handleChange}
                    />
                </div>

                <div className="button-group" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button className="toggle-btn" onClick={createOrganization} style={{ flex: 1 }}>
                        등록하기
                    </button>
                    <button className="delete-btn" onClick={() => navigate(-1)} style={{ flex: 1, backgroundColor: '#ccc' }}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCompanyCreatePage;