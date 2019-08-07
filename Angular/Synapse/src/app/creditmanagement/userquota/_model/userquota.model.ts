
export interface IUpdateCredit {
  availableCredit: number;
  creditTypeId: number;
  modifiedCredit: number;
  thresoldLimit: number;
  transactionType: number;
  userCreditId: number;
  userId: number;
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

export interface IDepartment {
  creditType: CreditType;
  deptId: number;
  deptName: string;
  description: string;
  status: number;
  users: User[];
}

export interface CreditType {
  creditCode: string;
  creditName: string;
  creditTypeId: number;
}

export interface UserCredit {
  availableCredit: number;
  creditTypeId: number;
  deptId: number;
  thresoldLimit: number;
  userCreditId: number;
}

export interface UserGet {
  creditType: CreditType;
  firstname: string;
  isactive: number;
  lastname: string;
  login: string;
  userCredit: UserCredit;
  userId: number;
  roles: Role[];
}

export interface IUserResponse {
  id: number;
  message: string;
  status: boolean;
}