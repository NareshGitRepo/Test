

export interface CreditType {
  creditCode: string;
  creditName: string;
  creditTypeId: number;
}

export interface Role {
  roleCode: string;
  roleId: number;
  roleName: string;
}

export interface User {
  firstname: string;
  lastname: string;
  login: string;
  roles: Role[];
  userId: number;
}

export interface Department {
  creditType: CreditType;
  deptId: number;
  deptName: string;
  description: string;
  status: number;
  users: User[];
}

export interface ICampaignReport {
  CampaignId: number;
  CampaignName: string;
  Date: string;
  Delivered: number;
  Department: string;
  Failed: number;
  Id: number;
  Sent: number;
  Uploaded: string;
  UserId: number;
  UserName: string;
}

export interface Idate {
  date: string;
  dateTime: string;
  hours: string;
  minutes: string;
  seconds: string;
  time: string;
}

export enum dateType {
  Today = 0,
  DateRange = 1,
}

export enum usersType{
  Deptusers=0,
  GlobalUsers=1
}
