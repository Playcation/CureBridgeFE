import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./AdminMainPage.css";
import {fetchOrganizations} from "./AdminMainPage";

interface OrgCreateRequestDto {
    orgName: string;
    orgNumber: string;
    email: string;
    address: string;
    phoneNumber: string;
    ownerName: string;
}

const AdminCompanyCreatePage: () => void= () => {

    const [newOrg, setNewOrg] = useState<OrgCreateRequestDto>({
        orgName: "",
        orgNumber: "",
        email: "",
        address: "",
        phoneNumber: "",
        ownerName: ""
    });

    const createOrganization = async () => {
        try {
            // TODO: 기업 생성 api 연결
            alert("기업이 생성되었습니다.");
            setNewOrg({
                orgName: "",
                orgNumber: "",
                email: "",
                address: "",
                phoneNumber: "",
                ownerName: ""
            });
            fetchOrganizations();
        } catch (err) {
            console.error(err);
        }
    };
};

export default AdminCompanyCreatePage;