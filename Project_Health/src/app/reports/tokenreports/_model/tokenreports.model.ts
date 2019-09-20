
export interface IFloor {
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
    dept_Multiple_Token: number;
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
    serviceColor: string;
    serviceEngName: string;
    serviceId: number;
    servicePrefix: string;
    serviceType: number;
    startToken: number;
    status: number;
}


export interface ITokenReport{
    tokenNo:string;
    mrnNo:string;
    appointmentTime:string;
    checkInTime:string;
    checkInMode:string;
    deptEngName:string;
    serviceEngName:string;
    floorName: string;
    deptArbName: string;
    floorArbName: string;
    patientName: string;
    printedBy: string;
    serviceArbName: string;
    tokenStatus: number;
    vtlStatus: number;
}

export interface IDateInfo {
    date: string;
    dateTime: string;
    hours: string;
    minutes: string;
    seconds: string;
    time: string;
   }
  
  
  