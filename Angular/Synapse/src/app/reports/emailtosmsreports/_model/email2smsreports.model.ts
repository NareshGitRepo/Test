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
export interface IEmail2SMSReport {
    campaignId: number;
    email2smsReportId: number;
    firstName: string;
    formatType: number;
    fromEmail: string;
    lastName: string;
    message: string;
    mobileNumberCount: string;
    reason: string;
    receivedTime: string;
    senderId: number;
    senderName: string;
    status: number;
    submitTime: string;
    userId: number;
    campaignName: string;
    visible?:boolean,
    userName : string,
    formatName: string
}
export interface Idate {
    date: string;
    dateTime: string;
    hours: string;
    minutes: string;
    seconds: string;
    time: string;
  }