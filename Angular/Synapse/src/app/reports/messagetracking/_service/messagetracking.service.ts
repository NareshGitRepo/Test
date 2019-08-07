import { Injectable } from '@angular/core';
import { IMessageTracking, Idate } from '../_model/messagetracking.model';
import { HttpClient } from '@angular/common/http';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { userType } from '../../../_helpers/app.config';

@Injectable({ providedIn: 'root' })

export class MessageTrackingReportsService {

  component = "Reports";
  constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  getMessageTrackingReports(submitData, _roleCode: string): Observable<IMessageTracking[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, userType.NormalUser == _roleCode ? 'getMessageTrackingByUser' : (userType.DepartementAdmin == _roleCode ? 'getMessageTrackingByDept' : "getMessageGlobal")); //"getMessageTrackingReport")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IMessageTracking[]>(_apiurlsdetials.url, _apiurlsdetials.type, submitData, 'reports');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
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