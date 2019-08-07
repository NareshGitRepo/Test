import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Router } from '@angular/router';
import { AppConfig } from '../../../_helpers/app.config';
import { IDepartment, IUpdateCredit, IResponse, CreditType } from '../_model/departmentquota.model';

@Injectable({ providedIn: 'root' })

export class CreditManagementService {

  public component = "departmentsQuota";

  constructor(private apiUrls: LoadApiUrls, private router: Router, private appConfig: AppConfig,
    private consumer: ConsumerService) {
  }

  getDepartmentsWithCredit(): Observable<IDepartment[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDepartmentsWithCredit")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IDepartment[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
    } else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateDeptCredit(updateData: IUpdateCredit): Observable<IResponse> {
    console.log("Service ===> ", JSON.stringify(updateData));
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDeptCredit");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateData, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getCreditTypes(): Observable<CreditType[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllCreditTypes")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<CreditType[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'creditTypes');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateDeptCreditNew(updateData: IUpdateCredit): Observable<IResponse> {
    console.log("Service1===>", JSON.stringify(updateData));
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDeptCreditNew");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateData, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}