export class QuickInfo {

    id: string;
    campaignname: string;
    promotiontype: string;
    startdate: string;
    enddate: string;
    createdby: string;
    createddate: string;
    starttime: string;
    dndstatus: string;
    campaigntype: string;

    constructor(
        id: string,
        campaignname: string,
        promotiontype: string,
        startdate: string,
        enddate: string,
        createdby: string,
        createddate: string,
        starttime: string,
        dndstatus: string,
        campaigntype: string) {
            
        this.id = id;
        this.campaignname = campaignname;
        this.promotiontype = promotiontype;
        this.startdate = startdate;
        this.enddate = enddate;
        this.createdby = createdby;
        this.createddate = createddate;
        this.starttime = starttime;
        this.dndstatus = dndstatus;
        this.campaigntype = campaigntype;
    }
}
