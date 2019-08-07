
 
export interface IGroupList{
  orgId: number;
  organization: string;
  status: number;
}
//
export interface HospitalList {
  address: string;
  emailId: string;
  logoPath: string;
  mobileNo: string;
  orgId: number;
  organization: string;
  status: number;
}

export interface HospitalDropDown {
  hospitals: HospitalList[];
}


export interface GroupInsert {
  facilities: HospitalCollection[];
  organization: string;
  parentId: number;
  id?: number;
  partyId?: number;
  status?: number;
  messages?: string;
}

export interface HospitalCollection {
  orgId: number;
  organization: string;
}

export interface IGroupResponse {
  id: number;
  messages: string;
  status: boolean;
} 
