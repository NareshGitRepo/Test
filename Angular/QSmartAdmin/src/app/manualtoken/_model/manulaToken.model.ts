export interface IDepartmentList {
    deptArbName: string;
    deptId: number;
    deptName: string;
    deptType: number;
    floorId: number;
    orgId: number;
    services: Service[];
    status: number;
  }
  
  export interface Service {
    deptId: number;
    doctors: Doctor[];
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
  
  export interface Doctor {
    contactNo: string;
    firstname: string;
    isactive: number;
    lastname: string;
    login: string;
    roles: Role[];
    userId: number;
  }
  
  export interface Role {
    roleId: number;
    roleName: string;
  }

  export interface IResponse {
    messages: string;
    status: boolean;
    template: string;
    tokenNo: string;
    tokenId:number;
  }

  export interface ICreateManual {
    deptId: number;
    drFstName: string;
    drId: number;
    drLstName: string;
    floorId: number;
    mrnNo: string;
    orgId: number;
    ptFstName: string;
    ptLstName: string;
    serviceId: number;
    serviceType:number;
  }

  export interface IDeptService {
    departments: Department[];
    userid: number;
  }
  
 export interface Department {
    deptArbName: string;
    deptId: number;
    deptName: string;
    services: Service[];
  }
  
  export interface Service {
    serviceArName: string;
    serviceEngName: string;
    serviceId: number;
    serviceType:number;
  }

  export interface IDoctorList {
    doctors: Doctor[];
  }
  
  export interface Doctor {
    contactNo: string;
    firstname: string;
    isactive: number;
    lastname: string;
    login: string;
    roles: Role[];
    userId: number;
  }
  
  export interface Role {
    roleId: number;
    roleName: string;
  }
  export interface IPrinter {
    destPrinter: string;
    floorId: number;
    floorName: string;
    org: IOrg;
    printId: number;
    printerName: string;
    printerNo: string;
    status: number;
  }
  
  export interface IOrg {
    orgId: number;
    organization: string;
  }