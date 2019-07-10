import { INotEligibleKiosk, IReportData } from '../_model/notEligiblekiosk.model';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotEligibleService {

  public component = "Reports";

  constructor(private http: HttpClient,private apiUrls: LoadApiUrls,private datePipe: DatePipe,private consumer: ConsumerService) { }

  getFailedCheckins(reportData : IReportData): Observable<INotEligibleKiosk[]>{


    console.log("ReportData==>", reportData)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFailedCheckins")
    console.log("URL Get from config :getFailedCheckins  =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : getFailedCheckins ---->  ", _apiurlsdetials.url);

      return this.consumer.serviceConsumer<INotEligibleKiosk[]>(_apiurlsdetials.url, _apiurlsdetials.type, reportData, "appoinments", 0);
    }
    else {
      console.log("URL Get from config :getFailedCheckins  ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }


}
