import axios from 'axios';
import { ChatRoomList, MyChatList } from '../types/chat';

const API_BASE_URL = 'http://localhost:8085/chat';

// 1. 전체 그룹 채팅방 목록 조회 (GET /chat/room/group/list)
export const fetchChatRoomList = async (): Promise<ChatRoomList[]> => {
  const response = await axios.get<ChatRoomList[]>(`${API_BASE_URL}/room/group/list`);
  return response.data;
};

// 2. 내가 속한 채팅방 목록 조회 (GET /chat/my/rooms)
export const fetchMyChatList = async (): Promise<MyChatList[]> => {
  const response = await axios.get<MyChatList[]>(`${API_BASE_URL}/my/rooms`);
  return response.data;
};

// 3. 채팅방 생성 (POST /chat/room/group/create?roomName=...)
export const createChatRoom = async (roomName: string): Promise<void> => {
  // Vue 코드의 방식대로 Query Parameter로 roomName을 전달합니다.
  await axios.post(`${API_BASE_URL}/room/group/create`, null, {
    params: { roomName }
  });
};

// 4. 채팅방 참여 (POST /chat/room/group/{roomId}/join)
export const joinChatRoom = async (roomId: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/room/group/${roomId}/join`);
};

// 5. 채팅방 나가기 (DELETE /chat/room/group/{roomId}/leave)
export const leaveChatRoom = async (roomId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/room/group/${roomId}/leave`);
};

/**
 * 3. 채팅방 상세 정보
 * GET http://localhost:8085/chat/room/{roomId}
 */

export const fetchChatRoomDetail = async (roomId: string) => {
  return await axios.get(`/chat/room/${roomId}`);
};