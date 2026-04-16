export interface SupportRequest {
  title: string;
  content: string;
  isPrivate: boolean;
}

export interface SupportListItem {
  supportId: number;
  userId: number;
  title: string;
  content?: string;
  isPrivate: boolean;
  isReplied: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportDetail {
  id: number;
  title: string;
  content: string;
  isPrivate: boolean;
  viewCount: number;
  userId: number;
  attachedFilePaths: string[];

  isReplied: boolean;
  replyContent?: string | null;
  repliedAt?: string | null;
}

export interface ReplyRequest {
  supportId: number;
  replyContent: string;
}
