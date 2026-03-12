import {RoomId, MyChatRoom} from '../types/chat';
import axiosInstance from "./Api";

const API_BASE_URL = '/chat/chat';

export const fetchHistory = async (roomId: string) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/history/${roomId}`);
  return response.data;
};

// 채팅방 생성
export const createRoom = async (roomName: string): Promise<void> => {
  const response = await axiosInstance.post(`${API_BASE_URL}/room/group/create?roomName=${roomName}`, null);
  return response.data;
}

// 채팅방 참여
export const joinRoom = async (roomId: number): Promise<void> => {
  const response = await axiosInstance.post(`${API_BASE_URL}/room/group/${roomId}/join`);
  return response.data;
}

export const fetchRooms = async () => {
  const response = await axiosInstance.get(`${API_BASE_URL}/room/group/list`);
  return response.data;
}

export const fetchMyRooms = async (): Promise<MyChatRoom[]> => { // MyChatList[]가 아니라 MyChatRoom[]
  const response = await axiosInstance.get(`${API_BASE_URL}/my/rooms`);
  return response.data; // 서버가 [{}, {}] 형태의 배열을 주는지 확인
}

// 채팅방 나가기 (DELETE 방식)
export const leaveChatRoom = async (roomId: number): Promise<void> => {
  await axiosInstance.delete(`${API_BASE_URL}/room/group/${roomId}/leave`);
}

export const getOrCreatePrivateChatRoom = async (otherMemberId: number): Promise<number> => {
  const response = await axiosInstance.post(
      `${API_BASE_URL}/room/private/create?otherUserId=${otherMemberId}`,
      null
  );
  return response.data;
}

