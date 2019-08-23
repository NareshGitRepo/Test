export class DetailedReport {

    msisdn: string;
    startTime: string;
    endTime: string;
    callStatus: string;
    callDuration: number;
    billedAmount: number;
    digits: number;
    callUuid: number;

    constructor(msisdn: string,
        startTime: string,
        endTime: string,
        callStatus: string,
        callDuration: number,
        billedAmount: number,
        digits: number,
        callUuid: number) {

        this.msisdn = msisdn;
        this.startTime = startTime;
        this.endTime = endTime;
        this.callStatus = callStatus;
        this.callDuration = callDuration;
        this.billedAmount = billedAmount;
        this.digits = digits;
        this.callUuid = callUuid;

    }
}
