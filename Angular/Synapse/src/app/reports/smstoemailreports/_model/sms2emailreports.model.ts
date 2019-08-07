export interface CreditType {
    creditCode: string;
    creditName: string;
    creditTypeId: number;
}

export interface Role {
    roleCode: string;
    roleId: number;
    roleName: string;
}

export interface User {
    firstname: string;
    lastname: string;
    login: string;
    roles: Role[];
    userId: number;
}

export interface Department {
    creditType: CreditType;
    deptId: number;
    deptName: string;
    description: string;
    status: number;
    users: User[];
}
export interface ISMS2EmailReport {
    forwardMailCclist: string;
    forwardMailTolist: string;
    forwardTime: string;
    message: string;
    mobileNo: string;
    reason: string;
    receivedDate: string;
    senderName: string;
    sms2emailReportId: number;
    status: number;
    ccvisibility:boolean;
    tovisibility:boolean;
    messageVisibility:boolean
}
export interface Idate {
    date: string;
    dateTime: string;
    hours: string;
    minutes: string;
    seconds: string;
    time: string;
  }