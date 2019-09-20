export interface IRoles {
    roleDescription: string;
    roleId: number;
    roleName: string;
}


export enum roleType{
    SuperAdmin="SuperAdmin",
    ClientAdmin="ClientAdmin",
    GroupAdmin="GroupAdmin",
    FacilityAdmin="FacilityAdmin"
  }
  