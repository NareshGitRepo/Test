export class Role2 {

    id: number;
    roleName: string;
    createdBy: string;
    updatedBy: string;
    
    constructor(id: number, roleName: string, createdBy: string, updatedBy: string) {
        this.id = id;
        this.roleName = roleName;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }
}
