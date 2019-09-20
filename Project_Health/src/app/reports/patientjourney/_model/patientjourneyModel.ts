export interface IPatienttokenjourney {
  careEndTime: string;
  careStartTime: string;
  date: string;
  mrnNo: string;
  patientName: string;
  reportId: number;
  tokenNo: string;
  waititme: string;
  status?: string;
}

export interface IToken {
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



export interface IDateInfo {
  date: string;
  dateTime: string;
  hours: string;
  minutes: string;
  seconds: string;
  time: string;
}