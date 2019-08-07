export interface IAlertDataModel {
  delimiter: string;
  deptId: number;
  filePattern: string;
  filepath: string;
  filetype: string;
  header: string;
  intervalType: IntervalType;
  intervalValue: string;
  message: string;
  messageType: number;
  mobileColumn: string;
  offlineAlertName: string;
  senderId: number;
  serviceId: number;
  movePath: string;
  alertOfflineId?:number;
  status: number
  }

  export interface Isender {
    senderId: string;
    senderName: string;
    status?: number;
    senderType:number
}
export interface IAlertRes {
  id: number;
  message: string;
  status: boolean;
}
export interface ICategory {
  categoryCode?: string;
  categoryDesc?: string;
  categoryId: number;
}

export interface IPriority {
  priorityDesc?: string;
  priorityId: number;
  priorityName?: string;
}

export interface IService {
  msgCategory: ICategory;
  msgPriorityInfo: IPriority;
  msgTempArb: string;
  msgTempEng: string;
  msgType: string;
  serviceCode: string;
  serviceName: string;
  status: number;
  templateId: number;
}

export interface IntervalType {
  intervalName: string;
  intervalTypeId: number;
}
