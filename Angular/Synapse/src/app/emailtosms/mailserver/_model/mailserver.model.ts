export interface IMailServer{
    serverId?: number;
    serverName:string;
    email:string;
    password:string;
    serverip:string;
    port:number;
    mailtype:string;
    checkedSMTP:boolean;
    checkedPOP:boolean;
    checkedSSL:boolean;
    interval:number;
    status?:number;
   }

   export interface ICreateMailServer{
    emailServerId?: number; 
    emailServerName: string;
    emailFromId:string;
    emailPassword:string;
    serverIp:string;
    serverPort:number;
    emailBoxType:number;
    emailSsl:number;
    checkInterval:number;
    status?:number;
    boxType?:string;
   }   

export interface IResponse {
    id: number;
    message: string;
    status: boolean;
  }
 
  export enum MailBoxTypes {
    SMTP = 1,
    POP3 = 2,
    IMAP = 3,
}
  