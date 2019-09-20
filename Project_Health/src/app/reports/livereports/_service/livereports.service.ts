import { ILiveReports, IReportData, IDateInfo } from '../_model/livereports.model'

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveReportsService {

  public component = "Reports";

  constructor(private http: HttpClient,private apiUrls: LoadApiUrls,private datePipe: DatePipe,private consumer: ConsumerService) { }

  getHl7CdrReportByDate(reportData : IReportData): Observable<ILiveReports[]>{


    console.log("ReportData==>", reportData)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getHl7CdrReportByDate")
    console.log("URL Get from config :getFailedCheckins  =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : getFailedCheckins ---->  ", _apiurlsdetials.url);

      return this.consumer.serviceConsumer<ILiveReports[]>(_apiurlsdetials.url, _apiurlsdetials.type, reportData, "hl7data", 0);
    }
    else {
      console.log("URL Get from config :getFailedCheckins  ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getCurrentDate(): Observable<IDateInfo> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod('Auth', "getCurrentDate")
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
    console.log("URL Get from config : ----> ", _apiurlsdetials.url);
    return this.consumer.serviceConsumerWithOutTokenHeader<IDateInfo>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
    }
    else {
    console.log("URL Get from config : ----> ", "Url not found..");
    return Observable.throw({ error: { messages: "url not found" } });
    }
    }


}
