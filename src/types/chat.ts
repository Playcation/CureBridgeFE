
/** ChatMessageDto (메세지 저장, 조회시 사용) */
export interface ChatMessage {
  roomId: number;
  message: string;
  senderEmail: string;
}

// 1. 전체 채팅방 목록 조회 시 사용하는 타입 (ChatMainPage 등)
export interface ChatRoom {
  roomId: number;
  roomName: string;
}

// 2. 내 채팅 목록 조회 시 사용하는 타입 (MyChatListPage 등)
// 백엔드 응답 데이터 구조에 맞춰 unReadCount와 isGroupChat을 포함합니다.
export interface MyChatRoom {
  roomId: number;
  roomName: string;
  unReadCount: number;
  isGroupChat: 'Y' | 'N'; // 혹은 boolean으로 내려온다면 boolean으로 수정
}

// 3. (선택사항) 만약 API 응답이 MyChatList 같은 이름으로 내려올 경우를 대비한 별칭
export type MyChatList = MyChatRoom[];

export interface RoomId {
  roomId: number;
}
