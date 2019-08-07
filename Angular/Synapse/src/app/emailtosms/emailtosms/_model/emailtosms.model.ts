

  export interface IDepartment {
    creditType: CreditType;
    deptId: number;
    deptName: string;
    description: string;
    status: number;
    users: User[];
  }
  
 export interface User {
    firstname: string;
    lastname: string;
    login: string;
    roles: Role[];
    userId: number;
  }
  
 export interface Role {
    roleCode: string;
    roleId: number;
    roleName: string;
  }
  
 export interface CreditType {
    creditCode: string;
    creditName: string;
    creditTypeId: number;
  }

  export interface ISenderData {
    senderId: number;
    senderName: string;
    senderType: number;
    status?: number;
  }

  export interface IEmailTosms {
    deptId: number;
    domain: string;
    email2smsId?: number;
    emailServer: EmailServer;
    endTag: string;
    name: string;
    recipientType: RecipientType;
    senderInfo: SenderInfo;
    startTag: string;
    status?: number;
    userId: number;
    whitelistType: number;
  }
  
  export interface SenderInfo {
    senderId: number;
    senderName: string;
    senderType: number;
  }
  
  export interface RecipientType {
    recepientName: string;
    recipientTypeId: number;
  }
  
  export interface EmailServer {
    emailServerId: number;
    emailServerName: string;
  }
  export interface IEmailServerInfo {
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
  export interface ApiResponse {
    id: number;
    message: string;
    status: boolean;
  }

  //
 


