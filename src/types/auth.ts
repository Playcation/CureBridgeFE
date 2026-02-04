/** 백엔드 User Role ENUM */
export type UserRole = 'ADMIN' | 'USER' | 'ORG_MANAGER' | 'ORG_ADMIN';

/** 백엔드 경로와 UserRole 매핑 **/
const rolePathMap: Record<UserRole, string> = {
  ADMIN: 'admin',
  USER: 'user',
  ORG_MANAGER: 'org-manager',
  ORG_ADMIN: 'org-admin'
}

/**
 * {@link UserRole}을 path 형식에 맞게 변경. (ORG_ADMIN -> org-admin)
 *
 * @param role {@link UserRole}
 */
export const toPath = (role:UserRole) => rolePathMap[role];

/** 회원가입 요청 DTO **/
export interface SignUpRequestDto {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  birthDate?: Date;   // "YYYY-MM-DD" 형식
}

/** 로그인 요청 DTO */
export interface LoginRequest {
  email: String
  password: String
  role: String
}

/** 로그인 성공 시 Redux에 저장할 Payload */
export interface AuthPayload {
  token: string;
  userId: number; // User 엔티티의 id (Long -> number)
  userRole: UserRole;
}

export {};