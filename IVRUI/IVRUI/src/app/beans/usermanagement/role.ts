export class Role {

    roleId: number;
    roleName: string;
    createdBy: string;
    updatedBy: string;
    
    constructor(roleId: number, roleName: string, createdBy: string, updatedBy: string) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }
}

// import { Role2 } from "./role2";

// export class Role {

//     status: boolean;
//     rolesList: Role2[] = []
    
//     constructor(status: boolean, rolesList: Role2[] ) {
//         this.status = status;
//         this.rolesList = rolesList;
      
//     }
// }
