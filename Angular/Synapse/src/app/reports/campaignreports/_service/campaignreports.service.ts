import { Department, ICampaignReport, Idate, User, } from '../_model/campaignreports.model';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CampaignReportsService {
  component = "Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
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
  getCampReport(searchData): Observable<ICampaignReport[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCampReport")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<ICampaignReport[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchData, 'campReport');
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
  getGlobalUsersByRoleId():Observable<User[]>{
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGlobalUsersByRoleId")
    if (_apiurlsdetials) {
      console.log("getGlobalUsersByRoleId URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<User[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'users');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}
