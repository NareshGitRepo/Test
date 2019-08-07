import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Department, ISMS2EmailReport, Idate } from '../_model/sms2emailreports.model';

@Injectable({ providedIn: 'root' })

export class SMS2EmailService {
  component = "Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
  }
  getSMS2EmailReports(searchData)
    : Observable<ISMS2EmailReport[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getSms2EmailReport")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<ISMS2EmailReport[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchData, 'sms2EmailReports');
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