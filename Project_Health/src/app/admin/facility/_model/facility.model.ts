export interface IFacilityStatus {
    id: number,
    organization: string;
    status: boolean,
}

export interface IFacilityModel {
    id: number;
    orgId: number;
    partyId: number;
    organization: string;
    emailId: string;
    mobileNo: string;
    address: string;
    logoPath: string;
    status: number;
    partyType: number;
    nodalName?: string;
}
export interface IUpdateFacility {
    address: string;
    emailId: string;
    logoPath: string;
    mobileNo: string;
    orgId: number;
    organization: string;
    status: number;
  }


export interface IFacilityListResponse {
    hospitals: IFacilityModel[];
}


export interface IResponse{
    id: number;
        messages: string;
        status: boolean;
}
