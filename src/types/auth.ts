/** 백엔드 User Role ENUM */
export type UserRole = 'ADMIN' | 'USER' | 'ORG_MANAGER' | 'ORG_ADMIN';


/** 로그인 요청 DTO */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 로그인 성공 시 Redux에 저장할 Payload */
export interface AuthPayload {
  token: string;
  userId: number; // User 엔티티의 id (Long -> number)
  userRole: UserRole;
}

export {};