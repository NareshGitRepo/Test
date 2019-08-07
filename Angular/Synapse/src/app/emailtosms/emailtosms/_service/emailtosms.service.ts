import { Injectable } from "@angular/core";
import { IDepartment, ISenderData, IEmailTosms, RecipientType, IEmailServerInfo, ApiResponse } from "../_model/emailtosms.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { LoadApiUrls } from "../../../_helpers/api.urls";
import { ConsumerService } from "../../../_helpers/ConsumerService";
import { userType } from "../../../_helpers/app.config";


@Injectable({ providedIn: 'root' })

export class EmailtoSmsService {


    component = "EmailToSmsCampaign";
    constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }
    getEmailToSms(): Observable<IEmailTosms[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getEmailToSms")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IEmailTosms[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'emailTosms');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getAllDepartmentsWithUsers(_roleCode: string): Observable<IDepartment[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, _roleCode == userType.DepartementAdmin ? 'getAllDepartmentsWithUsers' : "getActiveDepartments")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IDepartment[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }
    getRecipientInfo(): Observable<RecipientType[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRecipientInfo")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<RecipientType[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'recipientInfo');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getAllActiveSenders(): Observable<ISenderData[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllActiveSenders")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ISenderData[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'senders');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }
    getEmailServer(): Observable<IEmailServerInfo[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getEmailServer")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IEmailServerInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'emailServer');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    createEmailToSms(createEmailtosmsObj: IEmailTosms): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createEmailToSms")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createEmailtosmsObj, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateEmailToSms(updateEmailtosms: IEmailTosms): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateEmailToSms")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateEmailtosms, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    validateEmailToSmsName(emailtosmsname: string): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateEmailToSmsName")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { emailToSmsName: emailtosmsname }, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateEmailToSmsStatus(emailtosmsid: number, status: number): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateEmailToSmsStatus")
        if (_apiurlsdetials) {
            let url = _apiurlsdetials.url + "?emailToSmsId=" + emailtosmsid + "&status=" + status;
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteEmailToSms(emailtosmsid: number): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteEmailToSms")
        if (_apiurlsdetials) {
            let url = _apiurlsdetials.url.replace("{emailToSmsId}", emailtosmsid + '');
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
}