import axiosInstance from './Api';
import {LoginRequest, SignUpRequestDto} from "../types/auth";

// /api/{모듈}/{권한}
const API_BASE_URL = '/member/user';

/**
 * 회원가입 요청
 *
 * @param profile 프로필 사진
 * @param data {@link SignUpRequestDto}
 */
export const signUp = async (profile: File, data: SignUpRequestDto) => {
    const formData = new FormData();
    formData.append('profile', profile);
    formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}));
    const response = await axiosInstance.post(`${API_BASE_URL}/signup`, formData, {headers: {'Content-Type': 'multipart/form-data',},});
    return response.data;
};

/**
 * 로그인 요청
 *
 * @param data {@link LoginRequest}
 */
export const userLogin=async (data: LoginRequest)=>{
    return axiosInstance.post(`${API_BASE_URL}/login`, data);
}

/**
 * 로그아웃 요청
 */
export const logout = async () => {
    const response = await axiosInstance.post(`${API_BASE_URL}/logout`);
    return response.data;
}

