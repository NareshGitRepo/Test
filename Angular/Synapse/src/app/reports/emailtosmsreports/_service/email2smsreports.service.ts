import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Department, IEmail2SMSReport, Idate } from '../_model/email2smsreports.model';

@Injectable({ providedIn: 'root' })

export class Email2SmsService {
  component = "Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
  }
  getEmail2SmsReports(searchData)
    : Observable<IEmail2SMSReport[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getEmail2SmsReport")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<IEmail2SMSReport[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchData, 'email2SmsReports');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
    // return this.AuditReports;
  }
  getDepartmentswithUser(): Observable<Department[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllDepartments")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<Department[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
    }
    else {
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