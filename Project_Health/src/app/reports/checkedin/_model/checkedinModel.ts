export interface ICheckedinKiosk {
    apptDate: string;
    apptType: string;
    checkinTime: string;
    createdBy: number;
    department: string;
    dob: string;
    eventId: string;
    firstName: string;
    floorId:number;
    floorName: string,
    gender: Gender;
    id:number;
    kioskId: number;
    lastName: string;
    mobileNo: string;
    mrnNo: string;
    orgId: number;
    reason: string;
    serviceId: number;
    status: number;
    updatedBy: number;
  }
  export interface Gender {
  }

  export interface IReportData {
    startdate: any;
      enddate: any;
      orgId: number;
  }
  export interface IDateInfo {
    date: string;
    dateTime: string;
    hours: string;
    minutes: string;
    seconds: string;
    time: string;
   }
  