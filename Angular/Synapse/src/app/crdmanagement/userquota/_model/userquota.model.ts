export interface IUserQuota {
    userName:string;
    availableBalance?: number;
    accountType:string;
    deptName: string;
    adjustmentType:string;
    departmentCredit?: number;
    platformCredits?:number;
    currentThresholdLimit?: string;
    expiryDate:string;
  }