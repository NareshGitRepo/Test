// export enum EFeedbackStatus {
//     Neutral = '0',
//     Happy = '1',
//     Sad = '2'
// }
export interface IFeedback {
    feedback:string;
    mrnNumber:string;
    technicalPerformance:boolean;
    clarityPerformance:boolean;
    easeofUse:boolean;
    feedbackComments?:string;
    messages?:string;
    status?:boolean
}
export interface IFeedbackIcons {
    feedbackHappy:string;
    feedbackNeutral:string;
    feedbackSad:string
}
export interface IFeedbackStatus {
    happyStatus:string;
    neutralStatus:string;
    sadStatus:string
}
export interface IFeedbackTypes {
    feedbackName:string;
    feedbackType: IFeedbackIcons;
}
export interface IFeedbackData {
    feedbackType: string,
    feedbackValue: string,
}
export interface IFeedbackValues {
    feedback: string;
    tokenNumber:string;
    technicalPerformance:string;
    clarityofPresentation:string;
    easeofUse:string
}


export interface IAppointment {
    apptDate: string;
    apptType: string;
    checkInStatus: number;
    createdOn: Date;
    deptId: number;
    deptName: string;
    dob: string;
    drFstName: string;
    drLstName: string;
    drSegmentId: string;
    elgStatus: string;
    eventId: string;
    gender: Gender;
    iqamaId: string;
    mobileNo: string;
    mrnNo: string;
    msgType: string;
    nationalId: string;
    patStatus: string;
    printerNo: string;
    ptFstName: string;
    ptLstName: string;
    reasonToVisit: string;
    regStatus: string;
    serviceLocation: string;
    serviceName: string;
    sno: number;
    status: number;
    svcSegmentId: string;
    updatedOn: Date
}
export interface Gender{

}
export interface IFeedbackIn{
    appointments: IAppointment[];
    messages: string;
    status: boolean;
}
export interface IAddFeedbackRes {
    messages: string;
    status: boolean;
}






