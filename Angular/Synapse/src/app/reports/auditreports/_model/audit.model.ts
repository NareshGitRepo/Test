export interface IAuditReports {
  actionType: string;
  auditId: number;
  createdOn: string;
  moduleId: number;
  modulename: string;
  newValues: string;
  userId: number;
  userName: string;
  sourceIp: string;
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



export interface IglobalUser {
  firstname: string;
  isactive: number;
  lastname: string;
  login: string;
  roles: Role[];
  userId: number;
}


export interface User {
  firstname: string;
  lastname: string;
  login: string;
  roles: Role[];
  userId: number;
}
// export interface AuditLog {
//   actionType: string;
//   auditId: number;
//   createdOn: string;
//   moduleId: number;
//   modulename: string;
//   newValues: string;
//   sourceIp: string;
//   userId: number;
//   userName: string;
// }
export interface Department {
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