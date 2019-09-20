import { ILevelData, IServiceReport, IDateInfo } from '../_model/appointmentsModel';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  public component = "Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  getFloorsWithDeptsByFacilitateId(): Observable<ILevelData[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFloorsWithDeptsByFacilitateId")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials);

    if (_apiurlsdetials) {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ILevelData[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'floors');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }

  }
  getServiceReport(searchData):Observable<IServiceReport[]>{
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServiceReport")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials);

    if (_apiurlsdetials) {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IServiceReport[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchData, 'serviceReports');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
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
