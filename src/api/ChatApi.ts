import {MyChatRoom} from '../types/chat';
import axiosInstance from "./Api";

const API_BASE_URL = '/chat/chat';

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // 로그인 시 저장한 키 이름
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getAuthHeader = () => ({
  headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
});

export const chatApi = {


  // 채팅방 생성
  createRoom: async (roomName: string): Promise<void> => {
    await axiosInstance.post(`${API_BASE_URL}/room/group/create?roomName=${roomName}`, null);
  },

  // 채팅방 참여
  joinRoom: async (roomId: number): Promise<void> => {
    await axiosInstance.post(`${API_BASE_URL}/room/group/${roomId}/join`);
  },

  fetchRooms: async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/room/group/list`);
    return response.data;
  },

  fetchMyRooms: async (): Promise<MyChatRoom[]> => { // MyChatList[]가 아니라 MyChatRoom[]
    const response = await axiosInstance.get(`${API_BASE_URL}/my/rooms`, getAuthHeader());
    return response.data; // 서버가 [{}, {}] 형태의 배열을 주는지 확인
  },

  // 채팅방 나가기 (DELETE 방식)
  leaveChatRoom: async (roomId: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE_URL}/room/group/${roomId}/leave`, getAuthHeader());
  },

  getOrCreatePrivateChatRoom: async (otherMemberId: number): Promise<number> => {
    const response = await axiosInstance.post(
        `${API_BASE_URL}/room/private/create?otherUserId=${otherMemberId}`,
        null,
        getAuthHeader()
    );
    return response.data;
  },
};

