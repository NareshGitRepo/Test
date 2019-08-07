export interface ICGlobalGroup {
  cntGroupName: string;
  groupType: number;
}

export interface ICDeptGroup {
  deptId: number;
  groupName: string;
  groupType: number;
}

export interface ISmartResponse {
  id: number;
  message: string;
  status: boolean;
}
export enum userType {
  SuperAdmin = "SA",
  PlatFormAdmin = "PA",
  DepartementAdmin = "DA",
  NormalUser = "NA"
}
export enum selectType {
  Global = "global",
  Departement = "department",
  NormalUser = "users"
}

export interface IUserType {
  groupName: string;
  groupType: number;
}



//contacts

export interface IContactGlobal {
  address: string;
  emailId: string;
  firstName: string;
  globelGroupIds?: number[];
  lastName: string;
  mobileNo: string;
}



export interface IContactDept {
  address: string;
  deptId: number;
  emailId: string;
  firstName: string;
  groups?: number[];
  lastName: string;
  mobileNo: string;
}


export interface IContactUser {
  address: string;
  contactgroups?: number[];
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  userId: number;
}

//Get Groups Global

export interface GroupsWithContactGlobal {
  cntGroupId: number;
  cntGroupName: string;
  contactGlobals?: ContactGlobal[];
  groupType: number;
}

export interface ContactGlobal {
  address: string;
  cntGlobalId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
}


// Get Groups Dept

export interface GroupDept {
  contactDepts?: ContactDept[];
  deptId: number;
  groupDeptId: number;
  groupName: string;
  groupType: number;
}

export interface ContactDept {
  address: string;
  cntDeptId: number;
  deptId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
}



export interface ContactGroupUser {
  contactUsers: ContactUser[];
  groupName: string;
  groupType: number;
  groupUserId: number;
}

export interface ContactUser {
  address: string;
  cntUserId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  userId: number;
}

//DepartementsBy loginid

export interface CreditType {
  creditTypeId: number;
  creditName: string;
  creditCode: string;
}

export interface User {
  userId: number;
  login: string;
  firstname: string;
  roles: Role[];
  lastname: string;
}
export interface Role {
  roleCode: string;
  roleId: number;
  roleName: string;
}
export interface IDepartment {
  deptId: number;
  deptName: string;
  description: string;
  creditType: CreditType;
  status: number;
  users: User[];
}

export interface editList {
  data: any;
  type: string
}

// userdata

export interface IUsersList {
  contactUsers: ContactUserL[];
  groupName: string;
  groupType: number;
  groupUserId: number;
}

export interface ContactUserL {
  address: string;
  cntUserId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  userId: number;
}

//   departementsAll



export interface Department {
  creditType: CreditType;
  deptId: number;
  deptName: string;
  description: string;
  status: number;
  users: User[];
}

export interface User {
  firstname: string;
  lastname: string;
  login: string;
  userId: number;
}

export interface CreditType {
  creditCode: string;
  creditName: string;
  creditTypeId: number;
}

// updateGlobalGroup

export interface IUpdateGlobalGroup {
  cntGroupId: number;
  cntGroupName: string;
  groupType: number;
}

// update DeptGroup

export interface IUDeptGroup {
  deptId: number;
  groupDeptId: number;
  groupName: string;
  groupType: number;
}

// update userGroup
export interface IuserGroup {
  groupName: string;
  groupType: number;
  groupUserId: number;
}

// update Globalcontact

export interface IUpdateGlobalContact {
  address: string;
  cntGlobalId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
}

// update DeptContact
export interface IUDeptContact {
  address: string;
  cntDeptId: number;
  deptId: number;
  emailId: string;
  firstName: string;
  globelGroupIds?: number[];
  lastName: string;
  mobileNo: string;
}

// update userContact
export interface IuserContact {
  address: string;
  cntUserId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  userId: number;
}
export interface ISimpleSmsData {
  sendBaseType: number;
  groupId: number;
  groupName: string;
  contactNo: string;
}
export enum ISendBaseType {
  global = 1,
  department = 2,
  users = 3,
  recepients = 4
}

export interface IBulkContact {
  addressColumn: string;
  deptId: number;
  emailIdColumn: string;
  fileType: string;
  firstNameColumn: string;
  groupIds: number[];
  groupType: number;
  header: boolean;
  headers: string;
  lastNameColumn: string;
  mobileColumn: string;
  sheetName: string;
  userId: number;
}