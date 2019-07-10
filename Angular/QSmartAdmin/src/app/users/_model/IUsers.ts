export interface DepartmentCollection {
  deptId: number;
}
export interface IClients {
  address: string;
  emailId: string;
  logoPath: string;
  mobileNo: string;
  organization: string;
  partyId: number;
  status: number;
}
export interface IGroups {
  id?: number;
  organization: string;
  orgId: number;
  status: number;
}
export interface IHospitals {
  hospitals: Hospital[];
}
export interface Hospital {
  address: string;
  emailId: string;
  id: number;
  logoPath: string;
  mobileNo: string;
  nodalName: string;
  organization: string;
  partyId: number;
  partyType: number;
  status: number;
}
export interface IDepartements {
  departmentGetDto: DepartmentGetDto[];
}
export interface DepartmentGetDto {
  deptId: number;
  deptName: string;
  deptPrefix: string;
  earlyCheckin: number;
  lateCheckin: number;
  orgDept: OrgDept;
  roomCollectionList: RoomCollectionList[];
  status: number;
}
export interface RoomCollectionList {
  roomNumber: string;
  roomType: number;
}
export interface OrgDept {
  id: number;
  organization: string;
}
export interface IRoles {
  roleDescription?: string;
  roleId?: number;
  roleName: string;
}
export interface IUserResponse {
  id?: number;
  messages: string;
  status: boolean;
}
export interface Department {
  deptId: number;
  deptName?: string;
}
export interface Organization {
  orgId: number;
  organization?: string;
}
export interface IGetUser {
  contactNo: string;
  emailId: string;
  depts: Dept[];
  doctors: Doctor[];
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
  services: IGService[];
  startTime: string;
  userId: number;
  userType: string;
  drSegmentId?: string;
}
export interface ActiveUser {
  email: string;
  firstName: string;
  lastName: string;
  loginId: string;
  phoneNumber: string;
}
export interface IGService {
  serviceArName: string;
  serviceEngName: string;
  serviceId: number;
}
export interface Dept {
  deptId: number;
  deptName: string;
}
export interface IMapNurse {
  doctors: Doctor[];
  userId: number;
}
export interface ICreateUsers {
  contactNo: string;
  emailId: string;
  depts: number[];
  doctors: number[];
  firstname: string;
  hashedPassword: string;
  lastname: string;
  levelId: number;
  login: string;
  orgId: number;
  roles: IRole[];
  services: number[];
  isactive?: number;
  userId: number;
  userType: string;
  drSegmentId?: string;
}
export interface IRole {
  roleId: number;
  roleName: string;
}

export interface IDoctors {
  users: IUser[];
}
export interface IUser {
  contactNo: string;
  departments: Department[];
  doctors: Doctor[];
  firstname: string;
  isactive: number;
  lastname: string;
  login: string;
  organizations: Organization[];
  roles: IRoles[];
  userId: number;
}
export interface Doctor {
  firstname: string;
  userId: number;
}
export interface IDeptData {
  deparements: number[];
}
//
//Added by  mounika.p
export interface IService {
  deptId: number;
  deptName: string;
  floorId: number;
  floorName: string;
  npEarlyCheckin: number;
  npLateCheckin: number;
  orgId: number;
  serviceArName: string;
  serviceEngName: string;
  serviceId: number;
  servicePrefix: string;
  status: number;
}
export interface IDepartment {
  deptId: number;
  deptName: string;
  deptType: number;
  floorId: number;
  orgId: number;
  services: IService[];
  status: number;
}
export interface Floor {
  departments: IDepartment[];
  floorId: number;
  floorName: string;
  orgId: number;
}
export interface FloorResponse {
  floors: Floor[];
}
export interface IRoomManagementList {
  floorId: number;
  orgId: number;
  roomId: number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string;
  roomType: number;
  roomTypeDsc: string;
}
export interface IDoctorList {
  contactNo: string;
  firstname: string;
  isactive: number;
  lastname: string;
  login: string;
  roles: IDLRole[];
  userId: number;
}
export interface IDLRole {
  roleId: number;
  roleName: string;
}
export interface IMService {
  serviceArName?: string;
  serviceEngName?: string;
  serviceId: number;
  serviceType?: number;
}
export interface IMDepartment {
  deptArbName?: string;
  deptId: number;
  deptName?: string;
  services: IMService[];
}
export interface IMDepartments {
  departments: IMDepartment[];
  userid: number;
}
export interface ICreateDepartment {
  deptArbName?: string;
  deptId: number;
  deptName?: string;
}
export interface ICreateDepartments {
  departments: ICreateDepartment[];
  services: IMService[];
  userid: number;
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
