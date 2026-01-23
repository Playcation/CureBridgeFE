import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./AdminMainPage.css";

interface OrgResponseDto {
    id: number;
    account: string;
    orgName: string;
    orgNumber: string;
    ownerName: string;
    ownerNumber: string;
    orgAddress: string;
}

const AdminCompanyListPage: React.FC = () => {
    const [organizations, setOrganizations] = useState<OrgResponseDto[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const token = localStorage.getItem("accessToken");

    // 기업 목록 조회
    const getOrganizations = async () => {
        try {
            const response = await axios.get("/api/organization/list", {
                headers: { Authorization: token || "" }
            });
            setOrganizations(response.data);
        } catch (err) {
            console.error("기업 목록 로드 실패:", err);
        }
    };

    useEffect(() => {
        getOrganizations();
    }, []);

    // 기업 삭제
    const deleteOrganization = async (id: number) => {
        if (!window.confirm("정말로 이 기업을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`/api/organization/${id}`, {
                headers: { Authorization: token || "" }
            });
            alert("기업이 삭제되었습니다.");
            getOrganizations();
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="admin-container">
            <h2 className="title">기업 목록 조회</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="기업명 검색"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                <button onClick={getOrganizations}>검색</button>
            </div>

            <table className="org-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>계정(Email)</th>
                    <th>기업명</th>
                    <th>사업자번호</th>
                    <th>대표자명</th>
                    <th>연락처</th>
                    <th>주소</th>
                    <th>관리</th>
                </tr>
                </thead>
                <tbody>
                {organizations
                .filter((org) =>
                    org.orgName.toLowerCase().includes(searchTitle.toLowerCase())
                )
                .map((org) => (
                    <tr key={org.id}>
                        <td>{org.id}</td>
                        <td>{org.account}</td>
                        <td>{org.orgName}</td>
                        <td>{org.orgNumber}</td>
                        <td>{org.ownerName}</td>
                        <td>{org.ownerNumber}</td>
                        <td>{org.orgAddress}</td>
                        <td>
                            <button
                                className="delete-btn"
                                onClick={() => deleteOrganization(org.id)}
                            >
                                삭제
                            </button>
                        </td>
                    </tr>
                ))}
                {organizations.length === 0 && (
                    <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                            등록된 기업이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCompanyListPage;