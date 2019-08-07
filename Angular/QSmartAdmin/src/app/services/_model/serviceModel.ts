export interface IServiceResponse {
  id?: number;
  messages: string;
  status: boolean;
}

export interface IServiceCreate {
  deptId: number;
  endToken: number;
  floorId: number;
  npEarlyCheckin: number;
  npLateCheckin: number;
  orgId: number;
  patientEarlyCheckin?: number;
  patientLateCheckin?: number;
  serviceArName: string;
  serviceColor: string;
  serviceEngName: string;
  servicePrefix: string;
  startToken: number;
  serviceId?: number;
}

export interface Department {
  deptId: number;
  deptName: string;
  floorId: number;
  orgId: number;
  services: IServiceCreate[];
  status: number;
}

export interface Floor {
  departments: Department[];
  floorId: number;
  floorName: string;
  orgId: number;
}

export interface IFloor {
  floors: Floor[];
}


export interface Services {
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
  serviceType:number;
  status: number;
}

export interface IService {
  services: Services[];
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

export interface IRooms {
  roomType: number;
  rooms?: IRoom[];
}

export interface ICreateRoom {
  serviceId: number;
  rooms: IRooms[];
}

export interface ServiceType {
  floorId: number;
  orgId: number;
  srTypeId: number;
  srTypeLocation: string;
  srTypeName: string;
  svcSegmentId?:string;
  medicalService?:string;

}



export interface IServiceType {
  svcSegmentId?: string;
  srTypeLocation: string;
  srTypeName: string;
  medicalService?:string;
}

export interface IServiceMapping {
  serviceId: number;
  serviceTypes: IServiceType[];
}


///

export interface IRoom1 {
  allowedToAccess: number;
  floorId: number;
  orgId: number;
  roomId: number;
  roomNumber: string;
  status: number;
}

export interface IRoomGroup {
  roomNameAb: string;
  roomNameEn: string;
  rooms: IRoom1[];
}

export interface IRoomTypeInfo {
  roomGroups: IRoomGroup[];
  roomType: number;
  roomTypeDsc: string;
}
///
