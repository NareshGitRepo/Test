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


export interface IResponse{
  id:number,
  status:boolean;
  message:string;
}


export interface IMsgCategory {
  categoryCode: string;
  categoryDesc: string;
  categoryId: number;
  msgPriorities: IPriority[];
}
