import { Injectable } from '@angular/core';
import { IAuditReports, Department, Idate,  IglobalUser } from '../_model/audit.model';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';

@Injectable({ providedIn: 'root' })

export class AuditService {
  component = "Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
  }
  getAuditReports(searchData)
    : Observable<IAuditReports[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAuditLogInfoByUserId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<IAuditReports[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchData, 'auditLog');
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
  // getAuditLogInfoByUserId(): Observable<AuditLog[]>
  // {
  //   let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAuditLogInfoByUserId")
  //   if (_apiurlsdetials) {
  //     console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
  //     return this.consumer.serviceConsumer<AuditLog[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'auditLog');
  //   }
  //   else {
  //     console.log("URL Get from config : ---->  ", "Url not found..");
  //     return Observable.throw({ error: { messages: "url not found" } });
  //   }
  // }
  getGlobalUsersByRoleId():Observable<IglobalUser[]>
  {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGlobalUsersByRoleId")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IglobalUser[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'users');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}