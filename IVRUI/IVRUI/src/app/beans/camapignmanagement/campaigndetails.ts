export class CamDetailsInfo {

    id: string;
    campaignFlow: string;
    campaignName: string;
    campaignType: string;
    createdBy: string;
    createdDate: string;
    dnd: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    pattern: string;
    promotionType: string;

    constructor(
        id: string,
        campaignFlow: string,
        campaignName: string,
        campaignType: string,
        createdBy: string,
        createdDate: string,
        dnd: string,
        startDate: string,
        startTime: string,
        endDate: string,
        endTime: string,
        pattern: string,
        promotionType: string) {

        this.id = id;
        this.campaignFlow = campaignFlow;
        this.campaignName = campaignName;
        this.campaignType = campaignType;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.dnd = dnd;
        this.startDate = startDate + " " + startTime;
        this.startTime = startTime;
        this.endDate = endDate + " " + endTime;;
        this.endTime = endTime;
        this.pattern = pattern;
        this.promotionType = promotionType;
    }
}
