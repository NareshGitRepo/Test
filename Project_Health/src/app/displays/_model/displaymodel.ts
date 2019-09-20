export interface IDisplayBoard {
  boardType: string;
  messages: string;
  receptionDisplay: ReceptionDisplay;
  status: boolean;
  waitingDisplay: WaitingDisplay;
}

export interface WaitingDisplay {
  services: ServiceW[];
}

export interface ServiceW {
  serviceArbName: string;
  serviceEngName: string;
  serviceColor:string;
  serviceId: number;
  tokens: Token[];
}

export interface Token {
  roomNumber: string;
  engRoomName:string;
  arbRoomName:string;
  serviceColor:string;
  status: string;
  token: string;
  ticketId:number;
}

export interface ReceptionDisplay {
  departments: DepartmentR[];
  tokens: string[];
}

export interface DepartmentR {
  deptName: string;
  displayId: number;
  doctors: Doctor[];
  orgId: number;
}

export interface Doctor {
  doctorName: string;
}

export interface IDateInfo {
  date: string;
  dateTime: string;
  hours: string;
  minutes: string;
  seconds: string;
  time: string;
}
