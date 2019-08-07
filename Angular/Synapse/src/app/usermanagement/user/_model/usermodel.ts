export enum userType {
  SuperAdmin = "SA",
  PlatFormAdmin = "PA",
  DepartementAdmin = "DA",
  NormalUser = "NA"
}

export interface RolesCollection {
  roleId: number;
  roleName: string;
}

export enum UserActions {
  DELETE,
  ACTIVE,
  INACTIVE,
  RESET_PASSWROD
}



export interface ILoginDto {
  userId: number;
  alternateNo: string;
  company: string;
  contactNo: string;
  firstname: string;
  lastname: string;
  login: string;
  roles: RolesCollection[];
  isactive: number;
  makerChecker?: number;
  timeZone?: string;
  noOfCreatedUsers?: number;
}



export interface IAllModules {
  adminModules: AdminModule[];
  userModules: AdminModule[];
}

export interface AdminModule {
  checker: number;
  link: string;
  menuId: number;
  moduleId: number;
  moduleType: number;
  modulename: string;
  viewChecker: number;
  checked?: boolean;
}



export interface IUser {
  apiKey: string;
  checker: number;
  depts: Dept[];
  emailId: string;
  creditType: ICreditType;
  firstname: string;
  hashedPassword: string;
  isactive: number;
  lastname: string;
  login: string;
  mobileNo: string;
  modules: Module[];
  roles: Role[];
  userId: number;
  userType: number;
}

export interface Role {
  roleCode: string;
  roleId: number;
  roleName: string; 

}

export interface Module {
  link?: string;
  menuId?: number;
  moduleId: number;
  modulename?: string;
  viewChecker?: number;
}

export interface Dept {
  deptId: number;
  deptName: string;
}


export interface ICreateUser {
  apiKey?: string;
  userId?: number;
  creditType: ICreditType;
  checker: number;
  depts: Dept[];
  emailId: string;
  isactive?:any;
  firstname: string;
  hashedPassword?: string;
  lastname: string;
  login: string;
  mobileNo: string;
  modules: Module[];
  roles: Role[];
  userType?: number;
}



export interface IDepartment {
  creditType: ICreditType;
  deptId: number;
  deptName: string;
  description: string;
  status: number;
}
export interface ICreditType {
  creditCode: string;
  creditName: string;
  creditTypeId: number;
}
export interface IUserRole {
  roleCode: string;
  roleDescription: string;
  roleId: number;
  roleName: string;
  roleType: number;
  status: number;
}

export interface IResponse {
  id: number;
  message: string;
  status: boolean;
}
export interface IResActiveUser {
  message: string;
  status: boolean;
  users: IActiveUser[];
}

export interface IActiveUser {
  email: string;
  firstName: string;
  lastName: string;
  loginId: string;
  phoneNumber: string;
}
