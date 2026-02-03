import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMainPage.css";
import {OrgResponseDto, OrgCreateRequestDto} from "../../types/memberTypes";


export const fetchOrganizations = async () => {
    try {
        // TODO: 기업 조회 api 연결
    } catch (err) {
        console.error(err);
    }
};

const AdminMainPage: React.FC = () => {
    const [organizations, setOrganizations] = useState<OrgResponseDto[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [newOrg, setNewOrg] = useState<OrgCreateRequestDto>({
        account: "",
        orgName: "",
        orgNumber: "",
        orgAddress: "",
        ownerNumber: "",
        ownerName: ""
    });
    const [showCreateForm, setShowCreateForm] = useState(false);

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const createOrganization = async () => {
        try {
            await axios.post("/api/organization/create", newOrg, {
                headers: { Authorization: token || "" }
            });
            alert("기업이 생성되었습니다.");
            setNewOrg({
                account: "",
                orgName: "",
                orgNumber: "",
                ownerName: "",
                ownerNumber: "",
                orgAddress: ""
            });
            setShowCreateForm(false);
            fetchOrganizations();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteOrganization = async (id: number) => {
        try {
            await axios.delete(`/api/organization/${id}`, {
                headers: { Authorization: token || "" }
            });
            alert("기업이 삭제되었습니다.");
            fetchOrganizations();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-container">
            <h2 className="title">기업 관리(Admin)</h2>

            {/* 검색창 */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="기업명 검색"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                <button onClick={fetchOrganizations}>검색</button>
            </div>

            {/* 기업 생성 토글 버튼 */}
            <button
                className="toggle-btn"
                onClick={() => setShowCreateForm(!showCreateForm)}
            >
                {showCreateForm ? "기업 생성 닫기" : "기업 생성 열기"}
            </button>

            {/* 기업 생성 폼 (토글) */}
            {showCreateForm && (
                <div className="create-form">
                    <h3>기업 생성</h3>
                    <input
                        type="text"
                        placeholder="기업명"
                        value={newOrg.orgName}
                        onChange={(e) => setNewOrg({ ...newOrg, orgName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="사업자번호"
                        value={newOrg.orgNumber}
                        onChange={(e) => setNewOrg({ ...newOrg, orgNumber: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="이메일"
                        value={newOrg.account}
                        onChange={(e) => setNewOrg({ ...newOrg, account: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="주소"
                        value={newOrg.orgAddress}
                        onChange={(e) => setNewOrg({ ...newOrg, orgAddress: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="대표자 번호"
                        value={newOrg.ownerNumber}
                        onChange={(e) =>
                            setNewOrg({ ...newOrg, ownerNumber: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="대표자명"
                        value={newOrg.ownerName}
                        onChange={(e) =>
                            setNewOrg({ ...newOrg, ownerName: e.target.value })
                        }
                    />
                    <button onClick={createOrganization}>생성하기</button>
                </div>
            )}

            {/* 기업 목록 테이블 */}
            <table className="org-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>기업명</th>
                    <th>사업자번호</th>
                    <th>대표자명</th>
                    <th>이메일</th>
                    <th>주소</th>
                    <th>전화번호</th>
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
                            <td>{org.orgName}</td>
                            <td>{org.orgNumber}</td>
                            <td>{org.ownerName}</td>
                            <td>{org.account}</td>
                            <td>{org.orgAddress}</td>
                            <td>{org.ownerNumber}</td>
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
                </tbody>
            </table>
        </div>
    );
};

export default AdminMainPage;
