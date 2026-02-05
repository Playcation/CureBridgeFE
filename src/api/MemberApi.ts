import axiosInstance from './Api';

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

export const signup = async (data: FormData): Promise<any> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/user/signup`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const inviteUser = async (data: Object): Promise<any> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/org-manager/invite`, data)
    return response.data;
};

export const getOrgUser = async ():Promise<any>=>{
    return await axiosInstance.get(`${API_BASE_URL}/org-manager/list`);
}

export const getAllOrganization = async ()=>{
    return await axiosInstance.get(`${API_BASE_URL}/organization/all`)
}

export const getMember = async ()=>{
    return await axiosInstance.get(`${API_BASE_URL}/user`)
}

/**
 * 특정 유저의 상세 정보(이름 등) 조회
 * @param userId 조회할 유저의 ID
 */
export const getUserInfoById = async (userId: number): Promise<any> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};