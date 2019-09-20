export interface Gender {
}

export interface ILiveReports {
  apptDate: string;
  apptType: string;
  createdOn: string;
  dob: string;
  drFstName: string;
  drLstName: string;
  elgStatus: string;
  eventId: string;
  gender: Gender;
  id: number;
  iqamaId: string;
  mobileNo: string;
  mrnNo: string;
  msgType: string;
  nationalId: string;
  patStatus: string;
  printerNo: string;
  ptFstName: string;
  ptLstName: string;
  reason: string;
  reasonToVisit: string;
  regStatus: string;
  serviceLocation: string;
  serviceName: string;     
}

export interface IReportData {
  startdate: any;
  enddate: any;
}
export interface IDateInfo {
  date: string;
  dateTime: string;
  hours: string;
  minutes: string;
  seconds: string;
  time: string;
 }
