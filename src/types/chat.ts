
/** ChatMessageDto (메세지 저장, 조회시 사용) */
export interface ChatMessage {
  roomId: string;
  message: string;
  senderEmail: string;
}

/** ChatRoomListResponseDto (그룹 채팅방을 조회할 때 사용) */
export interface ChatRoomList {
  roomId: string;
  roomName: string;
}

/** MyChatListResDto (내가 속한 채팅방을 조회할 때 사용) */
export interface MyChatList {
  roomId: string;
  roomName: string;
  isGroupChat: boolean;
  unReadCount: number;
}


