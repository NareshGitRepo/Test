// export interface IAuditReports {
//     user: string;
//     fromDate: Date;
//     toDate: Date;
//     module: string;
//     activity: string;
//     activityInfo: string;
//     activityDate: Date;
//     sourceIP: string;
//   }


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

export interface IDepartment {
  creditType: CreditType;
  deptId: number;
  deptName: string;
  description: string;
  status: number;
  users: User[];
}

export interface DeptInfo {
  actionDoneByUser: string;
  creditAuditLogId: number;
  creditMode: number;
  creditType: number;
  deptId: number;
  newValue: number;
  oldValue: number;
  transactionType: number;
  creditName: string;
  deptName: string;
  transactionName: string;
  updatedOn: string;
}
export interface Idate {
  date: string;
  dateTime: string;
  hours: string;
  minutes: string;
  seconds: string;
  time: string;
}

export interface ICreditReportInfo {
  actionDoneByUser: string;
  creditAuditLogId: number;
  creditMode: number;
  creditName: string;
  creditType: number;
  deptId?: number;
  deptName?: string;
  newValue: number;
  oldValue: number;
  transactionName: string;
  transactionType: number;
  userId?: number;
  userName?: string;
  updatedOn: string;
}

export enum creditmanageType {
  Departmentwise = 0,
  UserWise = 1,
  PlatformWise = 2
}

export interface GlobalAuditLogInfo {
  actionDoneByUser: string;
  creditAuditLogId: number;
  creditMode: number;
  creditName: string;
  creditType: number;
  newValue: number;
  oldValue: number;
  transactionName: string;
  transactionType: number;
  updatedOn: string;
}

