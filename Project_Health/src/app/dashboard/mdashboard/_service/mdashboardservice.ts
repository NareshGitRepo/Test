
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';
import { IDrilldownInfo, IServicesInfo, IAlert, IAlertRes } from '../_model/mdashboard.model';

@Injectable({
  providedIn: 'root'
})
export class MDashBoardService {

  public component = "DashBoard"; 


  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }



  getVvDashboardNew(): Observable<IDrilldownInfo[]> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getVvDashboardNew")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url
      return this.consumer.serviceConsumer<IDrilldownInfo[]>(_apiUrl, _apiurlsdetials.type, null, 'dashboard');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}
getVvDashboardServices(deptId:number): Observable<IServicesInfo[]> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getVvDashboardServices")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace('{deptId}',''+deptId);
      return this.consumer.serviceConsumer<IServicesInfo[]>(_apiUrl, _apiurlsdetials.type, null, 'services');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}
getAlertsByOrgId(): Observable<IAlert[]> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAlertsByOrgId")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url
      return this.consumer.serviceConsumer<IAlert[]>(_apiUrl, _apiurlsdetials.type, null, 'alerts');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}


updateAlertInDB(alertId: number) {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateAlertInDB")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{alertId}", ''+alertId);
      return this.consumer.serviceConsumer<IAlertRes>(_apiUrl, _apiurlsdetials.type, null);
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}


}
