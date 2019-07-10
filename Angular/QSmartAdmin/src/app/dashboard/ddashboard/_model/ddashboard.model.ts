export interface IDashboardInfo {
  avgWaiting: number;
  patientswaiting?: number;
  totalAppts: number;
  totalCheckin: number;
  totalServed: number;
  totalServing: number;
}
export interface IUserDashboardInfo {
  served: number;
  serving: number;
  userId: number;
}
export enum userType {
  ClientAdmin = "ClientAdmin",
  GroupAdmin = "GroupAdmin",
  FacilityAdmin = "FacilityAdmin",
  SuperAdmin = "SuperAdmin",
  Pharmacist = "Pharmacist",
  LabTechnician = "LabTechnician",
  Clerk = "Clerk",
  Resource = "Resource",
  ServiceResource = "ServiceResource",
  Nurse = "Nurse",
  Doctor = "Doctor"
}
export interface IDoctorApptsAndCheckin {
  doctorId?: number;
  totalAppts: number;
  totalCheckin: number;
  facilityId?: number;
  floorId?: number;
  nurseId?: number;
}
export interface IDoctorWaiting {
  nurseId?:number;
  waitingTime: number;
  waitingtokens: number;
}



