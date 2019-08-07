


export interface ILogInResponse {
    message: string;
    status: boolean;
    usersGDto: UsersGDto;
  }
  
  export interface UsersGDto {
    apiKey: string;
    checker: number;
    depts: Dept[];
    emailId: string;
    firstname: string;
    hashedPassword: string;
    lastname: string;
    login: string;
    mobileNo: string;
    modules: Module[];
    roles: Role[];
    userId: number;
    userType: number;
  }
  
  export interface Role {
    roleId: number;
    roleName: string;
  }
  
  export interface Module {
    link: string;
    menuId: number;
    moduleId: number;
    modulename: string;
    viewChecker: number;
  }
  
  export interface Dept {
    deptId: number;
    deptName: string;
  }

export interface ILogIn {
    login: string,
    password: string
}
export interface logoutResponse {
    id: number;
    messages: string;
    status: boolean;
} 
export interface IChangeResponse {
  id: number;
  message: string;
  status: boolean;
} 
export interface IChangePassword {
  password: string;
}
