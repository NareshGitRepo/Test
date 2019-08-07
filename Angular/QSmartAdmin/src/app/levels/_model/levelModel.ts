  export interface IDeptResponse {
    id: number;
    messages: string;
    status: boolean;
  }
  
  export interface ILevelResponse {
    id: number;
    messages: string;
    status: boolean;
}
export interface ILevelCreate {
  floorArbName: string;
  floorId: number;
  floorName: string;
  orgId: number;
  status: number;
}
export interface ILevelList {
  floorId: number;
  floorName: string;
  status: number;
}

export interface IcreateDept {
  deptName: string;
  deptArbName : string;
  dept_Multiple_Token:number;
  floorId: number;
  orgId: number;
  deptId?:number;
}

export interface ILevelData {
  departments: IDepartment[];
  floorArbName: string;
  floorId: number;
  floorName: string;
  orgId: number;
}

export interface IDepartment {
  deptArbName: string;
  deptId: number;
  deptName: string;
  dept_Multiple_Token:number;
  deptType: number;
  doctors: IDoctor[];
  floorId: number;
  orgId: number;
  services: IService[];
  status: number;
}

export interface IService {
  deptId: number;
  deptName: string;
  endToken: number;
  floorId: number;
  floorName: string;
  npEarlyCheckin: number;
  npLateCheckin: number;
  orgId: number;
  serviceArName: string;
  serviceEngName: string;
  serviceId: number;
  servicePrefix: string;
  serviceType: number;
  startToken: number;
  status: number;
}

export interface IDoctor {
  contactNo: string;
  firstname: string;
  isactive: number;
  lastname: string;
  login: string;
  roles: IRole[];
  userId: number;
}

export interface IRole {
  roleId: number;
  roleName: string;
}
export interface ILevelRes{
  id: number;
  messages: string;
  status: boolean;
}
