export interface Gender {
}

export interface IRegistration {
    age: number;
    createdOn: string;
    firstName: string;
    floorId: number;
    floorName: string;
    gender: Gender;
    id: number;
    kioskId: number;
    kioskRegStatus: number;
    lastName: string;
    mrnNo: string;
    orgId: number;
    reason: string;
    updatedOn: string;
}


export interface FailData {
    startdate: any;
      enddate: any;
      orgId: number;
  }