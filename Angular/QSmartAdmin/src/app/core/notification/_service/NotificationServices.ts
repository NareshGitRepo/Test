import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { INotification, IResponse } from "../_model/notification";

import { ConsumerService } from "../../../_helpers/ConsumerService";
import { Injectable } from '@angular/core';
import { LoadApiUrls } from "../../../_helpers/api.urls";

@Injectable({ providedIn: 'root' })
export class NotificationServices {
  component:string = "Notifications";

    constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private consumer: ConsumerService) {

    }


    getNotifications():Observable<INotification[]> {
      let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getNotifications")
      console.log("URL Get from config : =====>  ", _apiurlsdetials);
      if (_apiurlsdetials) {
          console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
          return this.consumer.serviceConsumer<INotification[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'notifications');
      }
      else {
          console.log("URL Get from config : ---->  ", "Url not found..");
          return Observable.throw({ error: { messages: "url not found" } });
      }
    }

    updateAllNotifications(inputData):Observable<IResponse> {
      let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateNotificationList")
      console.log("URL Get from config : =====>  ", _apiurlsdetials);
      if (_apiurlsdetials) {
          console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
          return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, inputData, '');
      }
      else {
          console.log("URL Get from config : ---->  ", "Url not found..");

    }

  }


}
