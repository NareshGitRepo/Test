export interface IFloor{
    floorId:string;
    floorName:string;
    department:IDepartment[];
}

export interface IDepartment{
    deptId:string;
    deptName:string;
    service:IService[];
}

export interface IService{
    serviceId:string;
    serviceName:string;
}

export interface ITokenReport{
    tokenNo:string;
    mrnNo:string;
    patientName:string;
    appointmentTime:string;
    checkinTime:string;
    checkinMode:string;
    department:string;
    service:string;
}