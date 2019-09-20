import { initTransferState } from "@angular/platform-browser/src/browser/transfer_state";

export interface IDoctorAndService {
  doctros: IDoctro[];
  services: IService[];
}

export interface IService {
  serviceArbName: string;
  serviceEngName: string;
  serviceId: number;
  sumOfwaitingTokens: number;
}

export interface IDoctro {
  doctorId: number;
  drName: string;
  sumOfwaitTime: number;
  sumOfwaitingTokens: number;
}

export interface IServingTokens {
  mrnNo: string;
  drName: string;
  doctorId: number;
  nurseId: number;
  serviceArbName: string;
  serviceEngName: string;
  tokenNo: string;
  patientName: string;
  roomNo: string;
  apptDate: string;
  servestattime: string;
  servingTime: number;
  uservingTime?: number;
  ticketId: number;
  roomId: number;
  roomType: number;
}
export interface ITokenAndRooms {
  rooms: IRoom[];
  tokens: IToken[];
}
export interface IToken {
  apptDate: string;
  checkinTime: string;
  deptId: number;
  doctorname: string;
  drId: number;
  floorId: number;
  mrnNo: string;
  orgId: number;
  patientName: string;
  roomId: number;
  roomNo: string;
  roomtype: number;
  serveUserId: number;
  serviceArbName: string;
  serviceEngName: string;
  serviceId: number;
  ticketId: number;
  tokenNo: string;
  tokenStatus: number;
  vitalStatus: number;
  engRoomName: string;
  noshowTime: string;
  waitingTime: number;
  reportId: number;
}

export interface IRoom {
  floorId: number;
  orgId: number;
  roomId: number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string;
  roomType: number;
  roomTypeDsc: string;
}

export interface IResponse {
  id?: number;
  messages: string;
  status: boolean;
}
export interface IResponseForNext {
  data: IServingTokens;
  id: number;
  messages: string;
  status: boolean;
}
export interface IRequestForNext {
  doctorId: number;
  endToken: number;
  orgId: number;
  roomId: number;
  roomNo: string;
  roomtype: number;
  serveUserId: number;
}
export interface ICServices {
  deptId: number;
  deptName: string;
  floorId: number;
  orgId: number;
  serviceArbName: string;
  serviceEngName: string;
  serviceId: number;
  waitingTokens: number;
  watingTime: number;
}
export interface IDeptList {
  deptName: string;
  serviceId: number;
}
// export interface ICTokens {
//   checkinTime: string;
//   deptId: number;
//   deptName: string;
//   floorId: number;
//   orgId: number;
//   serviceArbName: string;
//   serviceEngName: string;
//   serviceId: number;
//   ticketId: number;
//   tokenNo: string;
//   waitingTime: number;
// }
export interface ICTokensAndRooms {
  rooms: ICRoom[];
  tokens: ICToken[];
}

export interface ICToken {
  checkinTime: string;
  deptId: number;
  deptName: string;
  floorId: number;
  orgId: number;
  roomId: number;
  roomNo: string;
  roomtype: number;
  serveUserId: number;
  serviceArbName: string;
  serviceEngName: string;
  serviceId: number;
  ticketId: number;
  tokenNo: string;
  waitingTime: number;
}
export interface ICRoom {
  floorId: number;
  orgId: number;
  roomId: number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string;
  roomType: number;
  roomTypeDsc: string;
}
export interface ICServingToken {
  createdOn: number;
  masterServiceId: number;
  roomId: number;
  roomType: number;
  roonNo: string;
  serviceArbName: string;
  serviceEngName: string;
  serviceId: number;
  servingTime: number;
  uservingTime: number;
  ticketId: number;
  tokeNo: string;
  userId: number;
}
export interface ICResponseForNext {
  data: ICServingToken;
  id: number;
  messages: string;
  status: boolean;
}
export interface ICRequestForNext {
  doctorId: number;
  endToken: number;
  orgId: number;
  roomId: number;
  roomNo: string;
  roomtype: number;
  serveUserId: number;
  serviceId: number;
}

//OLD code----------
export interface IDoctorInfo {
  departments: IDepartment[];
  firstname: string;
  lastname: string;
  rooms: IRoom[];
  userId: number;
}

export interface IRoom1 {
  endTime: string;
  id: number;
  roomNo: string;
  roomType: number;
  startTime: string;
}

export interface IDepartment {
  deptId: number;
  deptName: string;
  status: number;
}


export interface ITokenAServing {
  servingToken: IServingToken;
  tokens: IToken[];
}

export interface ITokenAServingList {
  servingToken: IServingToken[];
  tokens: IToken[];
}

export interface IToken1 {
  apptId: number;
  apptDate: string;
  firstName: string;
  lastName: string;
  createdBy: number;
  noShowCounter: number;
  ticketId: number;
  tokenNo: string;
  tokenStatus: number;
}

export interface IServingToken {
  apptDate: string;
  appId: number;
  firstCallTime: string;
  firstName: string;
  lastName: string;
  id: number;
  nurseCareEnd: string;
  nurseCareStart: string;
  physicianCareEnd: string;
  physicianCareStart: string;
  roomNo: string;
  ticketId: number;
  tokenNo: string;
}

export interface ICallTokenNextData {
  deptId: number;
  orgId: number;
  roomNo: string;
  userId: number;
}

export interface ICallNextData {
  department: string;
  deptId: number;
  doctorFirstName: string;
  doctorLastName: string;
  orgId: number;
  roomNo: string;
  ticketId: number;
  userId: number;
}
export interface IResponse {
  messages: string;
  status: boolean;
}

export interface IDoctorRoom {
  action?: number;
  id?: number;
  endTime: Date;
  firstname?: string;
  roomId?: number;
  roomNumber: string;
  roomType: number;
  startTime: Date;
  userId?: number;
}

export interface ICounterInfo {
  deptId: number;
  deptName: string;
  orgDept: OrgDept;
  queuedeptCollection: QueuedeptCollection[];
  roomCollectionList: RoomCollectionList[];
}

export interface ICallNextvital {
  nurseId: number;
  orgId: number;
  roomNo: string;
  ticketId: number;
}


export interface ITokenAServing {
  servingToken: IServingToken;
  tokens: IToken[];
}

// export interface IServingToken {
//   apptDate: string;
//   firstCallTime: string;
//   firstName: string;
//   lastName: string;
//   id: number;
//   nurseCareEnd: string;
//   nurseCareStart: string;
//   physicianCareEnd: string;
//   physicianCareStart: string;
//   roomNo: string;
//   ticketId: number;
//   tokenNo: string;
// }

export interface RoomCollectionList {
  roomId: number;
  roomNumber: string;
  roomType: number;
}

export interface QueuedeptCollection {
  qId: number;
  status: string;
}

export interface OrgDept {
  orgId: number;
  organization: string;
}



export interface ITokenDepList {
  departments: IDepartments[];
}

export interface IDepartments {
  deptId: number;
  deptName: string;
  orgDept?: OrgDept;
  queuedeptCollection?: QueuedeptCollection[];
}

export interface QueuedeptCollection {
  qId: number;
  qName: string;
}

export interface OrgDept {
  orgId: number;
  organization: string;
}




export interface IForwardResponse {
  id: number;
  messages: string;
  status: boolean;
}

export interface ItokenservingRes {
  id: number;
  messages: string;
  servingTokens?: IServingTokenN[];
  status: boolean;
}
export interface IServingTokenNData {
  deptname: string;
  ServingTokenNData: IServingTokenN[];
}

export interface IServingTokenN {
  apptDate: string;
  deptName: string;
  doctorId: number;
  drName: string;
  mrnNo: string;
  nurseId: number;
  nurseName: string;
  patientName: string;
  roomId: number;
  roomNo: string;
  roomType: number;
  servestattime: string;
  serviceArbName: string;
  serviceEngName: string;
  servingTime: number;
  ticketId: number;
  tokenNo: string;
}

export interface IDoctorData {
  contactNo: string;
  firstname: string;
  isactive: number;
  lastname: string;
  login: string;
  userId: number;
}

export interface IServiceData {
  doctors: IDoctorData[];
  serviceArName: string;
  serviceEngName: string;
  serviceId: number;
  serviceType: number;
}
export interface ITokenJourney {
  apptDate: string;
  arbRoomName: string;
  careEndTime: string;
  careStartTime: string;
  checkinTime: string;
  engRoomName: string;
  mrnNo: string;
  patientName: string;
  roomName: string;
  roomNo: string;
  servedTime: number;
  serviceResourseName: string;
  status: string;
  ticketId: number;
  waitingTime: number;
}

export interface VitalToken{
  aptTime: string;
  chkinTime: string;
  mrnNum: string;
  tknNum: string;
  vtlStat: string;
}


  export interface Iroom {
    allowedToAccess: number;
    floorId: number;
    orgId: number;
    roomId: number;
    roomNameAb: string;
    roomNameEn: string;
    roomNumber: string;
    roomType: number;
    roomTypeDsc: string;
    status: number;
  }

  export interface Itoken {
    apptDate: string;
    checkinTime: string;
    deptId: number;
    doctorname: string;
    drId: number;
    engRoomName: string;
    floorId: number;
    mrnNo: string;
    noshowTime: string;
    orgId: number;
    patientName: string;
    roomId: number;
    roomNo: string;
    roomtype: number;
    serveUserId: number;
    serviceArbName: string;
    serviceEngName: string;
    serviceId: number;
    ticketId: number;
    tokenNo: string;
    tokenStatus: number;
    updateOn: string;
    vitalStatus: number;
    waitingTime: number;
    reportId: number;
  }
  export interface IroomAndtoken {
    doctorRooms: DoctorRoom[];
    tokens: Itoken[];
}
export interface docnurse{
  doctors:number[];
  nurseId:number;
}
export interface DoctorRoom {
  doctorId: number;
  rooms: Iroom[];
}





