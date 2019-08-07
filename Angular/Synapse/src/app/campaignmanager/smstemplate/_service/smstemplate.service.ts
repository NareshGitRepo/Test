import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { ISmsTemplate, ApiResponse } from '../_model/smstemplate.model';
import { st } from '@angular/core/src/render3';

@Injectable({ providedIn: 'root' })

export class SmsTemplateService {
    component = "smstemplate";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    getSmsTemplates(): Observable<ISmsTemplate[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getSmsTemplates")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ISmsTemplate[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'smsTemplates');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }

    updateSmsTemplateStatus(smsTemplateId: number, status: number): Observable<ApiResponse> {
        console.log("Temp==>",smsTemplateId,status);
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateSmsTemplatestatus")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            // let url = _apiurlsdetials.url.replace("{templateId}", smsTemplateId + '').replace("{status}", status + '');
            let url = _apiurlsdetials.url + '?templateId=' + smsTemplateId + '&status=' + status;
            console.log("url ::::", url);
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updateSmsTemplate(updateDept: ISmsTemplate): Observable<ApiResponse> {
        
        console.log("updateDept:::", updateDept);
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateSmsTemplate")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateDept, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createSmsTemplate(createDepart: ISmsTemplate): Observable<ApiResponse> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createSmsTemplate")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createDepart, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    
    deleteSmsTemplate(templateId:number):Observable<ApiResponse>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteSmsTemplate")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let url = _apiurlsdetials.url.replace("{templateId}", templateId + '')
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validateSmsTemplateName(templateName:string):Observable<ApiResponse>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateTemplateName")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            // let url = _apiurlsdetials.url.replace("{SmsTemplatename}", departName + '')
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { templateName: templateName }, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

}