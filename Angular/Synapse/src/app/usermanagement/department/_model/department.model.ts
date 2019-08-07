// export interface IDepartment {
//     departmentId?:number;
//     departmentName: string;
//     departmentDescription: string;
//     creditType: string;
//     status:boolean;
//     createdBy: string;
//     createdDate: string;
//     modifiedBy: string;
//     modifiedDate: string;
//   }

export interface ApiResponse {
  id: number;
  message: string;
  status: boolean;
}
export interface ICreditTypes {
  creditCode?: string;
  creditName?: string;
  creditTypeId: number;
}
//

export interface User {
  firstname: string;
  lastname: string;
  login: string;
  userId: number;
}

export interface IDepartment {
  creditType: ICreditTypes;
  deptId?: number;
  deptName: string;
  description: string;
  status?: number;
  users?: User[];
}

