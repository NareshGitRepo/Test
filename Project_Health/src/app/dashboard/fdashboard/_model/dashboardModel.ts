export interface IDashboardFacility {
  avgWaiting: number;
  doctorId: number;
  totalAppts: number;
  totalCheckin: number;
  totalServed: number;
  totalServing:number;
}


export interface Queue {
  department: string;
  waitingPatients: number;
  waitingTime: number;
}

export interface IQueues {
  queues: Queue[];
}



export interface ITokens {
  department: string;
  firstName: string;
  tokenNo: string;
}


export interface facilityData {
  submitDate: any;
  facilityId: number;
}
export interface IFacilityApptsAndCheckin {
  doctorId: number;
  totalAppts: number;
  totalCheckin: number;
}

export interface IFacilityWaiting {
  waitingTime: number;
  waitingtokens: number;
}

export interface IFacilityDashboard {
  waitingTime: number;
  waitingtokens: number;
  totalAppts: number;
  totalCheckin: number;
}
