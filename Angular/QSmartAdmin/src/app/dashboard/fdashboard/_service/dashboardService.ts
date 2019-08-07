import { IDashboardFacility, IFacilityApptsAndCheckin, IFacilityWaiting, IQueues, ITokens, facilityData } from '../_model/dashboardModel';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {

  public component = "DashBoard";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }



  getCurservingTokens(): Observable<ITokens> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCurservingTokens")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url
      return this.consumer.serviceConsumer<ITokens>(_apiUrl, _apiurlsdetials.type, null, '');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}

getQueues(): Observable<IQueues> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getQueues")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        let _apiUrl = _apiurlsdetials.url
        return this.consumer.serviceConsumer<IQueues>(_apiUrl, _apiurlsdetials.type, null, 'queues');
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
  }


  getDashBoardByFacilityId(facilityData:facilityData): Observable<IDashboardFacility> {
    console.log("ReportData==>", facilityData)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashBoardByFacilityId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

      return this.consumer.serviceConsumer<IDashboardFacility>(_apiurlsdetials.url, _apiurlsdetials.type, facilityData, "", 0);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getDashBoardAptsByFacilityId(facilityData: facilityData): Observable<IFacilityApptsAndCheckin> {
    // console.log("ReportData==>", facilityData)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashBoardAptsByFacilityId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

      return this.consumer.serviceConsumer<IFacilityApptsAndCheckin>(_apiurlsdetials.url, _apiurlsdetials.type, facilityData, "", 0);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getDashBoardWaitingByFacilityId(facilityid: number): Observable<IFacilityWaiting> {
    // console.log("ReportData==>", facilityData)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashBoardWaitingByFacilityId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

      return this.consumer.serviceConsumer<IFacilityWaiting>(_apiurlsdetials.url, _apiurlsdetials.type, {facilityId:facilityid}, "", 0);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

}
