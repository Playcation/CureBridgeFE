import axiosInstance from './Api';
import axios from "axios";

// /api/{모듈}/{권한}
const API_BASE_URL = '/member';

// ------------------------ Admin 마이페이지
export const getOrganizationInfo = async () => {
    return await axiosInstance.get(`${API_BASE_URL}/organization`);
};

// ------------------------ Org_Manager 마이페이지
/**
 * 매니저 단건 조회
 *
 * @param role 현재 유저 권한
 */
export const getManagerInfo = async () => {
    return await axiosInstance.get(`${API_BASE_URL}/org-manager`);
};

// ------------------------ MemberListPage
export const fetchMembers = async () => {
    // 회원 목록은 별도의 axiosInstance가 있다면 그것을 사용해도 좋습니다.
    const response = await axiosInstance.get(`${API_BASE_URL}/list`);
    return response.data;
};