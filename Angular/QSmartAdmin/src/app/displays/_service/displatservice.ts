import { IDateInfo, IDisplayBoard } from '../_model/displaymodel';

import { ConsumerService } from '../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  public component = "Display";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }



  getDisplayInfo(displayId:string): Observable<IDisplayBoard> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDisplayInfo")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{displayId}", displayId);
      console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumer.serviceConsumerWithOutTokenHeader<IDisplayBoard>(_apiUrl, _apiurlsdetials.type, null, '');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}

getCurrentDate(): Observable<IDateInfo> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCurrentDate")
  console.log("URL Get from config : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumerWithOutTokenHeader<IDateInfo>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}

}
