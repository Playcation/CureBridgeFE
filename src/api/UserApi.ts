// src/api/UserApi.ts
import axiosInstance from './Api';

const API_BASE_URL = '/member/user';

/**
 * 현재 로그인한 유저 정보 조회
 * GET /user?id={userId}
 */
export const getUserInfo = async (userId: number): Promise<any> => {
    const response = await axiosInstance.get(`${API_BASE_URL}`, { params: { id: userId } });
    return response.data;
};

/**
 * 비밀번호 확인 (본인인증용)
 * GET /user/check + body { password }
 */
export const checkUserPassword = async (password: string): Promise<any> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/check`, {
        data: { password },
    });
    return response.data;
};

/**
 * 비밀번호 변경
 * PATCH /user/password + body { currPassword, newPassword }
 */
export const updateUserPassword = async (
    currPassword: string,
    newPassword: string
): Promise<any> => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/password`, {
        currPassword,
        newPassword,
    });
    return response.data;
};

/**
 * 회원 탈퇴
 * DELETE /user
 * !! 호출 전 반드시 비밀번호 인증 거치기 !!
 */
export const deleteUserAccount = async (): Promise<any> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}`);
    return response.data;
};
