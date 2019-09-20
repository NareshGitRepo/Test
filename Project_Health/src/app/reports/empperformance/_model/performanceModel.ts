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

export interface IEmployeeReport {
  avg_Idle_Time: string;
  avg_Serve_Time: string;
  staff_Name: string;
  total_Serve_Time: string;
  total_Token_Serve: number;
  userId: number;
  loginId:string;
}
export interface IDateInfo {
  date: string;
  dateTime: string;
  hours: string;
  minutes: string;
  seconds: string;
  time: string;
 }
