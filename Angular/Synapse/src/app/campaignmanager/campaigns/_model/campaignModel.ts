export interface Isender {
    senderId: string;
    senderName: string;
    status?: number;
    senderType: number
}
export interface IGroupUser {
    contactUsers: IContactUser[];
    groupName: string;
    groupType: number;
    groupUserId: number;
}

export interface IContactUser {
    address: string;
    cntUserId: number;
    emailId: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
    userId: number;
}

export interface IDeptGroup {
    contactDepts: IContactDept[];
    deptId: number;
    groupDeptId: number;
    groupName: string;
    groupType: number;
}

export interface IContactDept {
    address: string;
    cntDeptId: number;
    deptId: number;
    emailId: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
}

export interface IGlobalGroups {
    cntGroupId: number;
    cntGroupName: string;
    contactGlobals: IContactGlobal[];
    groupType: number;
}

export interface IContactGlobal {
    address: string;
    cntGlobalId: number;
    emailId: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
}

export interface ICampaignDataModel {
    actualStarttime?: string;
    actualfilename?: string;
    campId?: number;
    campDesc: string;
    campMode: number;
    campName: string;
    campStartTime: string;
    startTime?: string;
    campType: number;
    campaignInfo: ICampaignInfo;
    charCount: number;
    credits: number;
    dndStatus: number;
    language: number;
    message: string;
    priority: number;
    scheduleType: number;
    senderId: number;
    sourceType: number;
    status?: number;
    timeDiff?: number;
}

export interface ICampaignInfo {
    id?: number;
    customMessage: string,
    deptGroups: string;
    fileType: string;
    filename: string;
    globalGroups: string;
    header: number;
    headerColumn: string;
    invalidcount: number;
    mobilenoColumn: string;
    sheetname: string;
    userGroups: string;
    validcount: number;
}

export interface IResponse {
    id: number;
    message: string;
    status: boolean;
}
export interface Sheet {
    value: any;
    viewValue: string;
}
export enum ECampInputType {
    File = '1',
    Address = '2',
    Segement = '3',
}

export interface ISmsTemplate {
    description: string;
    language: string;
    message: string;
    params: string;
    smsTemplateId: number;
    templateName: string;
    templateType: number;
    status?: number;
}
export interface IGlobalGetRes {
    systemParameter: IGlobalGet[];
}

export interface IGlobalGet {
    parameterId: number;
    parameterName: string;
    parameterType: string,
    value: string;
}

export interface Idate {
    date: string;
    dateTime: string;
    hours: string;
    minutes: string;
    seconds: string;
    time: string;

}