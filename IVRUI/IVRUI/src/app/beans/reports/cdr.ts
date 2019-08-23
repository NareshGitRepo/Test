export class CdrReport {

    id: string;
    fromNumber: string;
    toNumber: string;
    campaignId: string;
    startDate: string;
    endDate: string;
    billedDuration: number;
    status: string;
    callDuration: number;
    totalAmount: string;
    digits: number;
    callUuid: number;
    totalRate: number;
    insertTime: string;
    answerTime: string; 
    totalCost:string;   

    constructor(id: string,
        fromNumber: string,
        toNumber: string,
        campaignId: string,
        startDate: string,
        endDate: string,
        billedDuration: number,
        status: string,
        callDuration: number,
        totalAmount: string,
        digits: number,
        callUuid: number,
        totalRate: number,
        insertTime: string,
        answerTime: string,
        totalCost:string) {

        this.id = id;
        this.fromNumber = fromNumber;
        this.toNumber = toNumber;
        this.campaignId = campaignId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.billedDuration = billedDuration;
        this.status = status;
        this.totalAmount = totalAmount;
        this.digits = digits;
        this.callDuration = callDuration;
        this.callUuid = callUuid;
        this.totalRate = totalRate;
        this.insertTime = insertTime;
        this.answerTime = answerTime;
        this.totalCost = totalCost;

    }
}
