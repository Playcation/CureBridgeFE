// /src/memberType

export interface OrganizationInfo {
  orgName:string;
  orgNumber:string;
  ownerName:string;
  ownerNumber:string;
  orgAddress:string;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
}

// ----------------------- Admin
export interface OrgCreateRequestDto {
  account: string;
  orgName: string;
  orgNumber: string;
  ownerName: string;
  ownerNumber: string;
  orgAddress: string;
}

export interface OrgResponseDto {
  id: number;
  account: string;
  orgName: string;
  orgNumber: string;
  ownerName: string;
  ownerNumber: string;
  orgAddress: string;
}

export interface OrgResponseDto {
  id: number;
  orgName: string;
  orgNumber: string;
  ownerName: string;
  email: string;
  address: string;
  phoneNumber: string;
}