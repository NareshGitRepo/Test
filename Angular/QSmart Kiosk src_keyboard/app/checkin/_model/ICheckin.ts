export interface Appointment {
        apptDate: string;
        apptType: string;
        checkInStatus: number;
        createdOn: Date;
        deptId: number,
        deptName: string,
        dob: Date;
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
        updatedOn: Date;
}
export interface Gender {
}
export interface IGetappoinmentRequest{
    mrnNumber:string;
    nationalId:string;
}
export interface ICheckin {
    status: boolean;
    messages: string;
    appointments: Appointment[];
    
}

export interface ICheckinRes {
    messages: string;
    status: boolean;
    template: string;
    token: string;
}
