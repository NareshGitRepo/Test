import { IAlertDataModel, IAlertRes, IService, IntervalType, Isender } from '../_model/offlineModel';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';
import { userType } from '../../../_helpers/app.config';

@Injectable({ providedIn: 'root' })
export class OfflineService {

    public component = "OfflineAlerts";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
    }
    getsenders(): Observable<Isender[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllSenders");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<Isender[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'senders');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

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

    getIntervalType(): Observable<IntervalType[]> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getIntervalType")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IntervalType[]>(_apiurlsdetials.url, _apiurlsdetials.type, "", "intervalTypes", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    validateAlertName(alertName): Observable<IAlertRes> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateAlertName")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            let url = _apiurlsdetials.url.replace('{alertname}', alertName);
            return this.consumer.serviceConsumer<IAlertRes>(url, _apiurlsdetials.type, "", "", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createOfflineAlert(alertData): Observable<IAlertRes> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createOfflineAlert")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IAlertRes>(_apiurlsdetials.url, _apiurlsdetials.type, alertData, "", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateOfflineAlert(alertData): Observable<IAlertRes> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateOfflineAlert")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IAlertRes>(_apiurlsdetials.url, _apiurlsdetials.type, alertData, "", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getAllOfflineAlerts(_roleCode: string): Observable<IAlertDataModel[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, userType.NormalUser == _roleCode ? 'getAllOfflineAlertsByUserId' : (userType.DepartementAdmin == _roleCode) ? 'getAllOfflineAlertsByDeptId' : "getAllOfflineAlerts");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IAlertDataModel[]>(_apiurlsdetials.url, _apiurlsdetials.type, "", "offlineAlerts", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updateOfflineAlertStatus(alertid:number,status:number):Observable<IAlertRes>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateOfflineAlertStatus")
          console.log("URL Get from config : =====>  ", _apiurlsdetials);
          if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            let url=_apiurlsdetials.url.replace('{alertid}',''+alertid).replace('{status}',''+status)
            return this.consumer.serviceConsumer<IAlertRes>(url, _apiurlsdetials.type, null, '');
          }
          else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
          }
        }
}
