import { Injectable } from "@angular/core";
import { ApiResponse, IGEmailTemplate, IGEmailCreate, ISystemParam } from "../_model/emailtemplate.model";
import { Observable } from "rxjs";
import { LoadApiUrls } from "../../../_helpers/api.urls";
import { ConsumerService } from "../../../_helpers/ConsumerService";

@Injectable({ providedIn: 'root' })

export class EmailTemplateService {

    public component = "EmailTemplate";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    getAllEmailTemp(): Observable<IGEmailTemplate[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getEmailTemplate")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<IGEmailTemplate[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'emailTemplate');
        } else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getAllSystemParams(): Observable<ISystemParam[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getEmailTemplateSystemParams")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<ISystemParam[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'systemParams');
        } else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    createEmailTemplate(emailCreate: IGEmailCreate): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createEmailtemplate");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, emailCreate, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateEmailTemplate(emailTemplateForm): Observable<ApiResponse> {
        console.log("update==>", emailTemplateForm);
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateEmailTemplate");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, emailTemplateForm, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateEmailStatus(templateId: any, status: number): Observable<ApiResponse> {
        console.log("status==>", templateId, status);
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateEmailTemplateStatus");
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.concat("?templateId=", "" + templateId) + '&status=' + status;
            console.log("url : =====> ", url);
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteEmailTemplate(templateId: number) {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteEmailTemplate")
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
    validateTemplateName(templateName: string): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateEmailTemplateName")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { templateName: templateName });
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
}