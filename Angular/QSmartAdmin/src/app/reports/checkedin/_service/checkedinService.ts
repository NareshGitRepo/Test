import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { ICheckedinKiosk, IReportData } from '../_model/checkedinModel';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CheckedinService {

  public component = "Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  getSuccessCheckins(reportData: IReportData): Observable<ICheckedinKiosk[]> {
    console.log("ReportData==>", reportData)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getSuccessCheckins")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

      return this.consumer.serviceConsumer<ICheckedinKiosk[]>(_apiurlsdetials.url, _apiurlsdetials.type, reportData, "appoinments", 0);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

}