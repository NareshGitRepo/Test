export class SummaryReport {

    campaignName: string;
    uploadeBase: number;
    dnd: boolean;
    finalBase: number;
    dailledBase: number;
    successBase: number;
    failedBase: number;

    constructor(campaignName: string, uploadeBase: number, dnd: boolean, finalBase: number,
        dailledBase: number, successBase: number, failedBase: number) {

        this.campaignName = campaignName;
        this.uploadeBase = uploadeBase;
        this.dnd = dnd;
        this.finalBase = finalBase;
        this.dailledBase = dailledBase;
        this.successBase = successBase;
        this.failedBase = failedBase;

    }
}
