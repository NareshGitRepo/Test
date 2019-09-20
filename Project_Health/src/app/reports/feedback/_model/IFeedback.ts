export interface IFeedback{
   
    clarityPerformance: boolean;
    comment: string;
    createdBy: number;
    createdOn: string;
    easeUse: boolean;
    feedback: string;
    feedbackId: number;
    mrnNo: string;
    techPerformance: boolean;
}


export interface IReportData {
    startdate: any;
      enddate: any;
      orgid: number;
  }
  export interface IDateInfo {
    date: string;
    dateTime: string;
    hours: string;
    minutes: string;
    seconds: string;
    time: string;
   }