import { IResponse, IService, IMsgCategory } from '../_model/servicemanagement.model';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from "@angular/core";
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class ServiceManagementService {
    public component = "Service";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    getAllServiceInfo(): Observable<IService[]> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllServiceInfo")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IService[]>(_apiurlsdetials.url, _apiurlsdetials.type, "", "serviceInfo", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    validateServiceName(servicename: string): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateServiceName")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            // let url = _apiurlsdetials.url.replace("{SmsTemplatename}", departName + '')
            return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { servicename: servicename }, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validateServiceName1():Observable<IResponse>{
        const observable = Observable.create(function subscribe(observer) {
        observer.next({status:true,message:''} as IResponse);
        observer.complete();
        });
        return observable;
        }


    createServiceInfo(data): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createServiceInfo")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, data, "", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updateServiceInfo(data): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateServiceInfo")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, data, "", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateServiceInfoStatus(id, status): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateServiceInfoStatus")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);

            let url = _apiurlsdetials.url.replace('{serviceid}', id).replace('{status}', status);
            return this.consumer.serviceConsumer<IResponse>(url, _apiurlsdetials.type, "", "", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    deleteService(serviceId: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteServiceInfo")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let url = _apiurlsdetials.url.replace("{serviceid}", serviceId + '')
            return this.consumer.serviceConsumer<IResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getMsgCategories(): Observable<IMsgCategory[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getMsgCategories")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IMsgCategory[]>(_apiurlsdetials.url, _apiurlsdetials.type, "", "msgCategories", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


}
