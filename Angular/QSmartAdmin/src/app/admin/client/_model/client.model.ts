export interface IClient {
  orgs: Org[];
  status: number;
  messages?: string;
}

export interface Org {
  address: string;
  emailId: string;
  logoPath: string;
  mobileNo: string;
  organization: string;
  orgId: number;
  status: number;
  messages?: string;
}

export interface Iupdatestatus {
  orgId: number;
  status: number;
  messages?: string;
}

export interface ICreateClient {
  address: string;
  emailId: string;
  licenseId: string;
  licensePath: string;
  logoPath: string;
  mobileNo: string;
  organization: string;
  status: number;
  messages?: string;
}
export interface IHospitals {
  hospitals: Hospital[];
}
export interface Hospital {
  address: string;
  emailId: string;
  id: number;
  logoPath: string;
  mobileNo: string;
  nodalName: string;
  organization: string;
  partyId: number;
  partyType: number;
  status: number;
}
export interface ILicenseData {
  company: string;
  customer: string;
  expire: string;
  generation: string;
  hospitals: ILHospital[];
  hospitalsCount: number;
  licenseId: string;
  licenseMaintainanceExpire: string;
  message: string;
  status: boolean;
}

export interface ILHospital {
  address: string;
  emailId: string;
  facility: string;
  licenseid: string;
  mobileNo: string;
}

export interface ILicense {
  clientId: string;
  licenseFile: string;
  licenseId: string;
}

export interface IResponse {
  id: number;
  messages: string;
  status: boolean;
}

export interface Hospital {
  address: string;
  emailId: string;
  facility: string;
  licenseid: string;
  mobileNo: string;
}

export interface IValidate {
  hospitals: Hospital[];
  hospitalsCount: number;
  licenseFilePath: string;
  licenseId: string;
  message: string;
  validationStatus: string;
}

export interface IUpload {
  filePath: string;
  messages: string;
  status: boolean;
}
