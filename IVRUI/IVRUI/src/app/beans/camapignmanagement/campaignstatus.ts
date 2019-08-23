export class CamStausInfo {

    id: number;
    campaignId: string;
    campName: string;
    status: string;
    startTime: string;
    endTime: string;
    updatedBy: string;
    updatedTime: string

    constructor(
        id: number,
        campaignId: string,
        campName: string,
        status: string,
        startTime: string,
        endTime: string,
        updatedBy: string,
        updatedTime: string) {

        this.id = id;
        this.campaignId = campaignId;
        this.campName = campName;
        this.status = status;
        this.startTime = startTime;
        this.endTime = endTime;
        this.updatedBy = updatedBy;
        this.updatedTime = updatedTime;

    }
}
