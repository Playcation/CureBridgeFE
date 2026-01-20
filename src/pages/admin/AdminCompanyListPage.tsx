import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./AdminMainPage.css";
import {fetchOrganizations} from "./AdminMainPage";

interface OrgResponseDto {
    id: number;
    orgName: string;
    orgNumber: string;
    ownerName: string;
    email: string;
    address: string;
    phoneNumber: string;
}

const AdminCompanyListPage: React.FC= () => {
    const [organizations, setOrganizations] = useState<OrgResponseDto[]>([]);
    const [searchTitle, setSearchTitle] = useState("");

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const deleteOrganization = async (id: number) => {
        try {
            // TODO: 기업 삭제 api 연결
            alert("기업이 삭제되었습니다.");
            fetchOrganizations();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="admin-container">
                <h1>기업 목록 조회</h1>
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
                                <td>{org.email}</td>
                                <td>{org.address}</td>
                                <td>{org.phoneNumber}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteOrganization(org.id)}>
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCompanyListPage;
