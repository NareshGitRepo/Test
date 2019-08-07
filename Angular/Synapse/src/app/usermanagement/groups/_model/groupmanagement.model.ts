export interface Group {
  description: string;
  groupId: number;
  groupName: string;
  status: number;
  users: User[];
}
export interface IGroups {
  groups: Group[];
}
export interface IGroupResponse {
  id: number;
  message: string;
  status: boolean;
}
export interface Dept {
  deptId: number;
  deptName: string;
}
export interface Module {
  link: string;
  menuId: number;
  moduleId: number;
  modulename: string;
  viewChecker: number;
}
export interface Role {
  roleId: number;
  roleName: string;
}
export interface IUser {
  apiKey?: string;
  checker?: number;
  depts?: Dept[];
  emailId?: string;
  firstname?: string;
  hashedPassword?: string;
  isactive?: number;
  language?: string;
  lastname?: string;
  login: string;
  mobileNo?: string;
  modules?: Module[];
  roles?: Role[];
  userId: any;
  userType?: number;
}
export interface IGCreate {
  description: string;
  groupName: string;
  users: IUser[];
}

export interface IGUpdate {
  description: string;
  groupId: number;
  groupName: string;
  status: number;
  users: User[];
}
export interface CreditType {
  creditTypeId: number;
  creditName: string;
  creditCode: string;
}
export interface User {
  userId: number;
  login: string;
  firstname: string;
  lastname: string;
  isactive?: number;
}
export interface IDepartment {
  deptId: number;
  deptName: string;
  description: string;
  creditType: CreditType;
  status: number;
  users: User[];
}