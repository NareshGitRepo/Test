export interface IProfileIndo{
contactNo: string;
firstname: string;
isactive: number;
lastname: string;
language:string;
login: string;
roles: IRoles[];
userId: number;
}

export interface IRoles {
  roleDescription?: string;
  roleId?: number;
  roleName: string;
}



export interface IProfileResponse {
  status: boolean;
  messages: string;
}
