
export interface ILevelData {
    departments: Department[];
    floorId: number;
    floorName: string;
    orgId: number;
    status?:number;
  }

  export interface Department {
    deptId: number;
    deptName: string;
    floorId: number;
    orgId: number;
    services: ILevelService[];
    status: number;
  }
  export interface IServiceResponse {
    id?: number;
    messages: string;
    status: boolean;
  }

export interface ILevelService {
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

export interface ICreateService {
  floorId: number;
  orgId: number;
  srTypeLocation: string;
  srTypeName: string;
  medicalService: string;
  svcSegmentId: string;
}

export interface IServiceType {
  floorId: number;
  orgId: number;
  srTypeId: number;
  srTypeLocation: string;
  srTypeName: string;
  medicalService: string;
  svcSegmentId: string;
}


export interface ILevel {
  floorArbName: string;
  floorId: number;
  floorName: string;
  serviceTpes: IServiceType[];
  status: number;
}

