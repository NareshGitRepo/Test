
export interface IDepartmentReport {
  Date: string;
  Delivered: number;
  Department: string;
  Failed: number;
  Sent: number;
  Uploaded: number;
  aggDeptId: number;
  deptId: number;
}

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

export interface IDepartmentRep {
  creditType: CreditType;
  deptId: number;
  deptName: string;
  description: string;
  status: number;
  users: User[];
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
