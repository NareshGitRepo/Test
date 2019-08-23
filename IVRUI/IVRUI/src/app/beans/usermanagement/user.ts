export class User {

    userName: string;
    password: string;
    email: string;
    phoneNumber: string;
    status: string;
    roleId: string;
    role: string;
    id: number;

    constructor(userName: string, password: string, email: string, phoneNumber: string,
        status: string, roleId: string, role: string,id: number) {
        this.userName = userName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.roleId = roleId;
        this.status = status;
        this.role = role;
        this.id = id;
    }
}
