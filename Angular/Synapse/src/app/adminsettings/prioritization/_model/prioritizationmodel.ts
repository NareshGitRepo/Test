
export interface IMsgCategory {
  categoryCode: string;
  categoryDesc: string;
  categoryId: number;
}

export interface IMsgPriorityInfo {
  msgCategory: IMsgCategory;
  priorityDesc: string;
  priorityId: number;
  priorityName: string;
  visible?:boolean
}
export interface IResponse{
  id:number,
  status:boolean;
  message:string;
}
export interface ServiceList {
  serviceCode: string;
  serviceName: string;
  status: number;
  templateId: number;
}
