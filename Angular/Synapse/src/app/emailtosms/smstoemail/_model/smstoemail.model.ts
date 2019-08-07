export interface IEmailServer {
  emailServerId: number;
  emailServerName: string;
}

export interface ISenderInfo {
  senderId: number;
  senderName: string;
  senderType: number;
  status?:number
}
export interface IEmailTemplate {
  emailFormat: number;
  emailMessage: string;
  emailTemplateId: number;
  status: number;
  templateName: string;
}
export interface ISmsToEmail {
  ccEmail: string;
  emailServer: IEmailServer;
  emailTemplate: number;
  emailTemplateData?: string;
  senderInfo: ISenderInfo;
  sms2emailId: number;
  smsToEmailName: string;
  subject: string;
  toEmail: string;
  status?: number;
}
export interface ApiResponse {
  id: number;
  message: string;
  status: boolean;
}
export interface IEmailServer {
  checkInterval: number;
  emailBoxType: number;
  emailFromId: string;
  emailPassword: string;
  emailServerId: number;
  emailServerName: string;
  emailSsl: number;
  serverIp: string;
  serverPort: number;
  status: number;
}
