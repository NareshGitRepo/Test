import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../adminsettings/spam/_model/filterkey.model';
import { ISenderList } from '../../../alertsmanager/onlinealerts/_model/onlinealerts.model';
import { IPlatformAlert } from '../_model/setnotification.model';

 @Injectable({ providedIn: 'root' })

export class SetNotificationService {
  public component = "SetnotificationQuota";
 
  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
  }
  validatePlatformAlertName(alertName: string): Observable<ApiResponse> {
    console.log("alertName==>",alertName);
    
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validatePlatformAlertName")
  if (_apiurlsdetials) {
  console.log("URL Get from config : ----> ", _apiurlsdetials.url);
  // let url = _apiurlsdetials.url.replace("{departmentname}", departName + '')
  return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { alertname: alertName }, '');
  }
  else {
  console.log("URL Get from config : ----> ", "Url not found..");
  return Observable.throw({ error: { messages: "url not found" } });
  }
  }
  
  createPlatformAlert(createPlatformAlert: IPlatformAlert): Observable<ApiResponse> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, 'createPlatformAlert');
  console.log("URL Get from config : =====> ", _apiurlsdetials);
  if (_apiurlsdetials) {
  console.log("URL Get from config : ----> ", _apiurlsdetials.url);
  return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createPlatformAlert, '');
  }
  else {
  console.log("URL Get from config : ----> ", "Url not found..");
  return Observable.throw({ error: { messages: "url not found" } });
  }
 }
 updatePlatformAlertStatus(obj):Observable<ApiResponse> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updatePlatformAlertStatus")
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
       return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, obj, '');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}
 getAllActiveSenders(): Observable<ISenderList[]> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllActiveSenders")
  console.log("URL Get from config : =====> ", _apiurlsdetials);
  if (_apiurlsdetials) {
  console.log("URL Get from config : ----> ", _apiurlsdetials);
  
  return this.consumer.serviceConsumer<ISenderList[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'senders');
  }
  else {
  console.log("URL Get from config : ----> ", "Url not found..");
  return Observable.throw({ error: { messages: "url not found" } });
  }
 }
  updatePlatformAlert(createObj:IPlatformAlert):Observable<ApiResponse>{
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updatePlatformAlert")
  console.log("URL Get from config : =====> ", _apiurlsdetials);
  if (_apiurlsdetials) {
  console.log("URL Get from config : ----> ", _apiurlsdetials);
  
  return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createObj, '');
  }
  else {
  console.log("URL Get from config : ----> ", "Url not found..");
  return Observable.throw({ error: { messages: "url not found" } });
  }
 }
 getPlatformAlerts(): Observable<IPlatformAlert[]> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPlatformAlerts")
  console.log("URL Get from config : =====> ", _apiurlsdetials);
  if (_apiurlsdetials) {
  console.log("URL Get from config : ----> ", _apiurlsdetials.url);
  return this.consumer.serviceConsumer<IPlatformAlert[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'platformAlerts');
  } else {
  console.log("URL Get from config : ----> ", "Url not found..");
  return Observable.throw({ error: { messages: "url not found" } });
  }
  }
}