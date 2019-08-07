export interface IPlatformCredit {
    availableBalance: number;
    creditType: number;
    credits: number;
    expiryDate: string;
    hasExpiryDate: number;
    platformCreditId: number;
    modifiedCredits?:number;
    transactionType?:number
  }

  export interface ICreditTypes {
    creditCode: string;
    creditName: string;
    creditTypeId: number;
  }
  
  export interface IResponse{
    id: number;
    message: string;
    status: boolean;
  }

  export interface Idate {
    date: string;
    dateTime: string;
    hours: string;
    minutes: string;
    seconds: string;
    time: string;
  }