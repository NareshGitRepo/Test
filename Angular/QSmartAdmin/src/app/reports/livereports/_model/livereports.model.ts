export interface Gender {
}

export interface ILiveReports {
  apptDate: string;
  apptId: string;
  apptType: string;
  department: string;
  dob: Date;
  doctorName: string;
  elgStatus: string;
  facility: string;
  firstName: string;
  gender: Gender;
  id: number;
  lastName: string;
  mobileNo: string;
  mrnNo: string;
  msgType: string;
  nationalId: string;
  patStatus: string;
  printerNo: string;
  regStatus: string;
  updatedOn: Date;
  reason: string;
}

export interface IReportData {
  startdate: any;
  enddate: any;
}
