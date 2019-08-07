import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { Isender, IsenderRes } from '../model/sender.model';


@Injectable({ providedIn: 'root' })

export class SenderService {
  public component = "Senders";
  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  getsenders(): Observable<Isender[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllSenders");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<Isender[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'senders');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  updateSenderStatus(status: number, senderId: string) {
    console.log('interfaceId=>', senderId, status);

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateSenderStatus");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      let url = _apiurlsdetials.url.replace("{senderId}", senderId + '') + "?status=" + status + '';
      return this.consumer.serviceConsumer<IsenderRes>(url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  // deleteInterface(senderName){
  //   let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteInterfaceInfo")
  //   console.log("URL Get from config : =====>  ", _apiurlsdetials);
  //   if (_apiurlsdetials) {
  //       console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
  //       let _apiUrl = _apiurlsdetials.url.replace("{interfaceid}",interfaceId+'');
  //       return this.consumer.serviceConsumer<IsenderRes>(_apiUrl, _apiurlsdetials.type,null,'');
  //     }
  //   else {
  //       console.log("URL Get from config : ---->  ", "Url not found..");
  //       return Observable.throw({ error: { messages: "url not found" } });
  //   }
  // }
  createSender(senderform: Isender): Observable<IsenderRes> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createSender");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IsenderRes>(_apiurlsdetials.url, _apiurlsdetials.type, senderform, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  UpdateSender(updatesender: Isender) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateSender");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IsenderRes>(_apiurlsdetials.url, _apiurlsdetials.type, updatesender);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validateSenderName(senderName: string) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateSenderName");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      let url = _apiurlsdetials.url + "?senderName=" + senderName + '';
      return this.consumer.serviceConsumer<IsenderRes>(url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validateSenderName1(): Observable<IsenderRes> {
    const observable = Observable.create(function subscribe(observer) {
      observer.next({ status: true, message: '' } as IsenderRes);
      observer.complete();
    });
    return observable;
  }
}


