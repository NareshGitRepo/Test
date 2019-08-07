export interface ISender {
  senderId: number;
  senderName: string;
  status?: number;
  senderType:number
}
export interface IContactGlobal {
  address: string;
  cntGlobalId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
}

export interface IGlobalGroup {
  cntGroupId: number;
  cntGroupName: string;
  contactGlobals: IContactGlobal[];
  groupType: number;
}

export interface IContactDept {
  address: string;
  cntDeptId: number;
  deptId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
}

export interface IDeptGroup {
  contactDepts: IContactDept[];
  deptId: number;
  groupDeptId: number;
  groupName: string;
  groupType: number;
}

export interface ISmsCreate {
  deptGroupId?: string;
  globalGroupId?: string;
  recipient?: string;
  source?: string;
  userGroupId?: string;
  message?:string;
  senderId?:number
}

export interface ISmsResponse {
  id: number;
  message: string;
  status: boolean;
}



export interface IContactUser {
  address: string;
  cntUserId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  userId: number;
}

export interface IUserGroup {
  contactUsers: IContactUser[];
  groupName: string;
  groupType: number;
  groupUserId: number;
}

export interface ISimpleSmsData
  {
    sendBaseType:number;
    groupId:number;
    groupName:string;
    contactNo:string;
  }
  export enum ISendBaseType{
    global=1,
    department=2,
    users=3,
    recepients=4
  }