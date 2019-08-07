export interface IMessageTracking {
  DeliveredTime: string;
  Message: string;
  MessageId: string;
  MobileNumber: string;
  ReceivedTime: string;
  Sender: string;
  SubmittedTime: string;
  status: string;
  visible?:boolean
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
