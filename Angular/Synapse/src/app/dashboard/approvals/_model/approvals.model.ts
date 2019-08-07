export interface ApiResponse {
  id: number;
  message: string;
  status: boolean;
}

export interface ApproveData {
  checkId: number;
  reason?: string;
  status: number;
}

export interface ModulesInfo {
  checker: number;
  link: string;
  menuId: number;
  moduleId: number;
  moduleType: number;
  modulename: string;
  viewChecker: number;
  checked: boolean;
}

export interface CreditType {
  creditTypeId: number;
  creditName: string;
  creditCode: string;
}

export interface Module {
  moduleId: number;
  modulename: string;
  link: string;
  viewChecker: number;
}

export interface Dept {
  deptId: number;
  deptName: string;
  status: number;
}

export interface Role {
  roleId: number;
  roleName: string;
  roleCode: string;
}

export interface IntervalType {
  intervalName: string;
  intervalTypeId: number;
}

export interface ICheckerData {
  userId?: number;
  login?: string;
  hashedPassword?: string;
  firstname?: string;
  lastname?: string;
  mobileNo?: string;
  emailId?: string;
  userType?: number;
  checker?: number;
  language?: string;
  apiKey?: string;
  isactive?: number;
  creditType?: CreditType;
  modules: Module[];
  depts?: Dept[];
  roles?: Role[];
  templateId?: string;
  serviceName?: string;
  serviceCode?: string;
  interfaceId?: string;
  interfaceName?: string;
  interfaceDesc?: string;
  interfaceCode?: string;
  groupName?: string;
  description?: string;
  deptName?: string;
  status?: string;
  users?: any,
  segmentName?: string;
  templateName?: string;
  segmentCode?: string;
  segmentDesc?: string;
  segmentPrecedence?: number;
  message?: string;
  senderName?: string;
  campName?: string;
  senderId?: number;
  campStartTime?: string;
  campaignInfo?: ICampaignInfo;
  keywordName?: string;
  alertOfflineId?: number;
  delimiter?: string;
  deptId?: number;
  filePattern?: string;
  filepath?: string;
  filetype?: string;
  header?: string;
  intervalType?: IntervalType;
  intervalValue: string;
  messageType?: number;
  mobileColumn?: string;
  movePath?: string;
  offlineAlertName?: string;
  alertOnlineId?: number;
  mobilenoColumn?: string;
  onlineAlertName?: string;
  selectQuery?: string;
  serviceId?: number;
  tableName?: string;
  uniqueColumn?: string;
  domain?: string;
  emailServer?: EmailServer; 
  name?: string;
  recipientType?: RecipientType;
  senderInfo?: SenderInfo;
  whitelistType?: number;
  ccEmail?: string;
  emailTemplate?: number;
  emailTemplateData?: string;
  sms2emailId?: number;
  smsToEmailName?: string;
  subject?: string;
  toEmail?: string;
  emailFormat?: number;
  emailMessage?: string;
  emailTemplateId?: number;
  emailServerName?:string;
  campMode?: number;
  campType: number;
  emailFromId?:string;
  serverIp?:string;
  serverPort?:number;
  emailBoxType?:number;
  checkInterval?:number;
  emailSsl?:number;
  msgCategory?: ICategory;
  msgPriorityInfo?: IPriority;
  dbProfileInfo?: IProfileInfo;
}

export interface IProfileInfo {
  dbProfileId?: number;
  profileName?: string;
}


export interface ICategory {
  categoryCode?: string;
  categoryDesc?: string;
  categoryId?: number;
}

export interface IPriority {
  priorityDesc?: string;
  priorityId?: number;
  priorityName?: string;
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
export interface ICampaignInfo {
  validcount?: number;
}
export interface CheckerData {
  checkId: number;
  info: string;
  moduleId: number;
  moduleName: string;
  rowId: number;
  status: number;
  userId: number;
  requestTime: string;
}


