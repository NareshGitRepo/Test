export interface ApiResponse {
    id?: number;
    message: string;
    status: boolean;
   }
    
   export interface IAlertDetail {
    emailId: string;
    mobileNo: string;
    name: string;
   }
   export interface IupdateColumnData {
    id: number;
    emailId: string;
    mobileNo: string;
    name: string;
  }
   export interface ISenderList{
    senderId: number;
    senderName: string;
    senderType: number;
    status: number;
   }
   export interface IPlatformAlert {
    alertDetails: IAlertDetail[];
    alertsName: string;
    channels: string;
    creditsBelow: number;
    creditsMessage: string;
    expiringInDays: number;
    expiringMessage: string;
    platformAlertsId?: number;
    senderId: number;
    status?: number;
   }
