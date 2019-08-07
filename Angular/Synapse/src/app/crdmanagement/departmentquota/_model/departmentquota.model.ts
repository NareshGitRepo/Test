export interface IDepartmentQuota{

platformCredits:number;
department:string;
adjustmentType?:string;
availableBalance?:number;
accountType:string;
expiryDate:string;
credits?:number;
currentThresholdLimit?:string;

}

export interface IHistory{
    txnDateTime:string;
    department:string;
    platformCredits:number;
    accountType:string;
    availableBalance:number;
    adjustmentType:string;
    credits:number;
    expirtDate:string;
}