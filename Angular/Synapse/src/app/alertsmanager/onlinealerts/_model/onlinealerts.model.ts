//Profile
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

export interface DataType {
  dbName: string;
  dbTypeId: number;
}

// export interface DbProfileInfo {
//   dbProfileId: number;
//   profileName: string;
// }



export interface ITestProfile {
  connectionstring: string;
  databaseTypes: DatabaseTypes;
  dbname: string;
  deptId: number;
  deptName: string;
  oraConnectionType: string;
  oraConnectionValue: string;
  password: string;
  port: string;
  profileName: string;
  serverIp: string;
  username: string;
}
export interface DatabaseTypes {
  dbName: string;
  dbTypeId: number;
}

export interface ICreateProfile {
  connectionstring: string;
  databaseTypes: DatabaseTypes;
  dbProfileId?: number;
  dbname: string;
  deptId: number;
  deptName: string;
  oraConnectionType: string;
  oraConnectionValue?: string;
  password: string;
  port: string;
  profileName: string;
  serverIp: string;
  username: string;
}




//mounika

export interface OnlineAlert {
  alertOnlineId: number;
  dbProfileInfo: IProfileInfo;
  alertsRefs: AlertsRef[];
  deptId: number;
  deptName: string;
  intervalType: IIntervalType;
  intervalValue: string;
  message: string;
  messageType: number;
  mobilenoColumn: string;
  onlineAlertName: string;
  selectQuery: string;
  senderId: number;
  serviceId: number;
  tableName: string;
  uniqueColumn: string;
  status: number
}

export interface IProfileInfo {
  dbProfileId: number;
  profileName: string;
}

export interface IIntervalType {
  intervalName: string;
  intervalTypeId: number;
}


export interface ICreateAlert {
  alertOnlineId?: number,
  alertsRefs: AlertsRef[];
  dbProfileInfo: IProfileInfo;
  deptId: number;
  deptName?: string;
  intervalType: IIntervalType;
  intervalValue: string;
  message: string;
  messageType: number;
  mobilenoColumn: string;
  onlineAlertName: string;
  selectQuery: string;
  senderId: number;
  serviceId: number;
  tableName: string;
  uniqueColumn: string;
}

export interface AlertsRef {
  alertsRefId?: number;
  columnName: string;
  type: number;
  value: string;
}

export interface ApiResponse {
  id?: number;
  message: string;
  status: boolean;
}
export interface ISenderList {
  senderId: number;
  senderName: string;
  status: number;
  senderType:number

}

export interface MsgCategory {
  categoryCode: string;
  categoryDesc: string;
  categoryId: number;
}

export interface MsgPriorityInfo {
  priorityDesc: string;
  priorityId: number;
  priorityName: string;
}

export interface IServiceInfo {
  msgCategory: MsgCategory;
  msgPriorityInfo: MsgPriorityInfo;
  msgTempArb: string;
  msgTempEng: string;
  msgType: string;
  serviceCode: string;
  serviceName: string;
  status: number;
  templateId: number;
}

export interface IupdateColumnData {
  id: number;
  columnName: string;
  staticvalue: string;
  UpdateValue: string;
}

export interface DatabaseTypes {
  dbName: string;
  dbTypeId: number;
}

export interface IDbProfileData {
  deptName: string;
  dbProfileInfo: IGDbProfileInfo[];
}
export interface IGDbProfileInfo {
  databaseTypes: DatabaseTypes;
  dbProfileId: number;
  dbname: string;
  deptId: number;
  deptName: string;
  oraConnectionType: string;
  oraConnectionValue: string;
  password: string;
  port: string;
  profileName: string;
  serverIp: string;
  status: number;
  username: string;
}

export interface ColumnsList {
}

export interface DataByQuery {
  columnsList: ColumnsList;
  dataCount: number;
  message: string;
  status: boolean;
}
export interface ISystemParams {
  id: number;
  name: string;
}


export interface ITableAndColumnData {
  message: string;
  status: boolean;
  tables: ITable[];
}

export interface ITable {
  columns: IColumn[];
  tableName: string;
}

export interface IColumn {
  columnName: string;
}
