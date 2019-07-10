export interface ILoginResponse {
  messages: string;
  status: boolean;
  usersGDto: IUserUpdateDto;
}

export interface IRole {
  roleDescription: string;
  roleId: number;
  roleName: string;
}
export interface ILogIn {
  login: string,
  password: string
}


export interface Department {
  deptId: number;
  deptName: string;
}

export interface Organization {
  orgId: number;
  organization: string;
}
export interface IUserUpdateDto {
  contactNo: string;
  depts: Department[];
  endTime: string;
  firstname: string;
  hashedPassword: string;
  isactive: number;
  language: string;
  lastname: string;
  levelId: number;
  levelName: string;
  login: string;
  orgId: number;
  orgName: string;
  roles: IRole[];
  startTime: string;
  userId: number;
}


export enum userType {
  ClientAdmin = "ClientAdmin",
  GroupAdmin = "GroupAdmin",
  FacilityAdmin = "FacilityAdmin",
  SuperAdmin = "SuperAdmin",
}
export interface logoutResponse {
  id: number;
  messages: string;
  status: boolean;
  } 

