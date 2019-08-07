export interface ApiResponse {
  id?: number;
  message: string;
  status: boolean;
}
export interface IGEmailTemplate {
  emailFormat: number;
  emailMessage: string;
  emailTemplateId?: number;
  status: number;
  templateName: string;
}
export interface IGEmailCreate {
  emailFormat: number;
  emailMessage: string;
  templateName: string;
  emailTemplateId?: number;
}
export interface ISystemParam {
  id: number;
  name: string;
}
export enum emailHtmlType {
  Html = 1,
  PlainText = 2,
}
