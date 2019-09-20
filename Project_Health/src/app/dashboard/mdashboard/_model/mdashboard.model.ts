


  export interface IDrilldownInfo {
    buildArbName: string;
    buildEngName: string;
    buildId: number;
    deptArbName: string;
    deptEngName: string;
    deptId: number;
    floorArbName: string;
    floorEngName: string;
    floorId: number;
    orgId: number;
    patientsCheckedIn: number;
    patientsServed: number;
    patientsWaiting: number;
    submitdate: Date;
    totalAppointments: number;
    waitingTime: number;
}
export interface IServicesInfo {
  submitdate: number;
  deptId: number;
  deptArbName: string;
  deptEngName: string;
  serviceId: number;
  serviceArbName: string;
  serviceEngName: string;
  drId: number;
  login: string;
  totalAppointments: number;
  patientsCheckedIn: number;
  patientsWaiting: number;
  waitingTime: number;
  patientsServed: number;
}


export interface ITokens {
  department: string;
  firstName: string;
  tokenNo: string;
}

export interface IAlert{
  buildArbName: string;
  buildEngName: string;
  buildId: number;
  deptArbName: string;
  deptEngName: string;
  deptId: number;
  floorArbName: string;
  floorEngName: string;
  floorId: number;
  id: number;
  orgId: number;
  serviceArbName: string;
  serviceEngName: string;
  serviceId: number;
  status: boolean;
  type: number;
  waitingTime: number;
}
export interface IAlertRes{
  
    messages: string,
    status: boolean
  
}
export enum IypeData {
  building = 1,
  level = 2,
  department = 3,
  service = 4,
  resource = 5
}

export interface IFilterTable {
  Id: number;
  previousId?: number;
  name: string;
  type: string;
  totalAppointments: number;
  patientsCheckedIn: number;
  waitingTime: number;
  patientsServed: number;
  patientsWaiting: number;
}
export interface INavigationModel {
  id: number;
  previousId?:number;
  name: string;
  type: number;
  indexPostion: number;
}
export interface IFilterKeyModel {
  filterString: string;
  filterType: number;
  filterId: string;
  filterName: string;
}