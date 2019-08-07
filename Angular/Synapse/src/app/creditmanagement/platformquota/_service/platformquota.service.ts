import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Router } from '@angular/router';
import { AppConfig } from '../../../_helpers/app.config';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { IDepartment } from '../../../alertsmanager/onlinealerts/_model/onlinealerts.model';
import { IPlatformCredit, ICreditTypes, IResponse, Idate } from '../_model/platformquota.model';

 @Injectable({ providedIn: 'root' })

export class PlatformquotaService {
    public component = "PlatformQuota";
    constructor(private apiUrls: LoadApiUrls, private router: Router, private appConfig: AppConfig,
        private consumer: ConsumerService){}

    getPlatformCreditsDetails(): Observable<IPlatformCredit[]>{
      let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPlatformCreditsDetails")
      console.log("URL Get from config : =====>  ", _apiurlsdetials);
      if (_apiurlsdetials) {
        console.log("URL Get from config : ----> ", _apiurlsdetials.url);
        return this.consumer.serviceConsumer<IPlatformCredit[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'platformCredits');
      } else {
        console.log("URL Get from config : ----> ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
      }
  }
    updatePlatformCredits(updateData:IPlatformCredit):Observable<IResponse>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updatePlatformCredits")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
          console.log("URL Get from config : ----> ", _apiurlsdetials.url);
          return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateData, '');
        } else {
          console.log("URL Get from config : ----> ", "Url not found..");
          return Observable.throw({ error: { messages: "url not found" } });
        }  
    }
    getAllCreditTypes():Observable<ICreditTypes[]>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllCreditTypes")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
          console.log("URL Get from config : ----> ", _apiurlsdetials.url);
          return this.consumer.serviceConsumer<ICreditTypes[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'creditTypes');
        } else {
          console.log("URL Get from config : ----> ", "Url not found..");
          return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getCurrentDate(): Observable<Idate> {
      let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCurrentDate")
      if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        return this.consumer.serviceConsumer<Idate>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
      }
      else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
      }
    }
}