export interface ApiResponse {
  id: number;
  message: string;
  status: boolean;
}

export interface ISmsTemplate {
  description: string;
  language: string;
  message: string;
  params: string;
  smsTemplateId: number;
  templateName: string;
  templateType: number;
  status?: number;
}


export interface ISmsUpdate {
  description: string;
  language: string;
  message: string;
  params: string;
  smsTemplateId: number;
  status: number;
  templateName: string;
  templateType: number;
}
