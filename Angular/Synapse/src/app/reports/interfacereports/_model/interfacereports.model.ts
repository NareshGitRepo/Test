export interface IInterfaceReport {
  Date: string;
  Delivered: number;
  Failed: number;
  Interface: string;
  Sent: number;
  Uploaded: number;
  aggInterfaceId: number;
  interfaceCode: number;
}

export interface InterfaceInfo {
  interfaceCode: string;
  interfaceDesc: string;
  interfaceId?: number;
  interfaceName: string;
  status?: number;
}
export interface Idate {
  date: string;
  dateTime: string;
  hours: string;
  minutes: string;
  seconds: string;
  time: string;
}

export enum dateType {
  Today = 0,
  DateRange = 1,
}