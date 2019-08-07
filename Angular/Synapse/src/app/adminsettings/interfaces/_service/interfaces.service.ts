import { Injectable } from '@angular/core';
import { IInterfaceRes, InterfaceInfo } from '../_model/interfaces.model';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InterfacesService {
  public component = "Interface";
  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  validateInterfaceName(interfaceName: string): Observable<IInterfaceRes> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateInterfaceName")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IInterfaceRes>(_apiurlsdetials.url, _apiurlsdetials.type, { interfaceName: interfaceName });
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }


  createInterface(interfacesForm: InterfaceInfo): Observable<IInterfaceRes> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createInterface");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IInterfaceRes>(_apiurlsdetials.url, _apiurlsdetials.type, interfacesForm, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getInterfaces(): Observable<InterfaceInfo[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllInterfaceInfo");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<InterfaceInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'interfaceInfo');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  UpdateInterface(UpdateInterface: InterfaceInfo): Observable<IInterfaceRes> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateInterfaceInfo");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IInterfaceRes>(_apiurlsdetials.url, _apiurlsdetials.type, UpdateInterface);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  UpdateInterfaceStatus(status: number, interfaceId: number) {
    console.log('interfaceId=>', interfaceId, status);

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateInterfaceInfoStatus");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      let url = _apiurlsdetials.url + '?interfaceId=' + interfaceId + '&status=' + status;
      return this.consumer.serviceConsumer<IInterfaceRes>(url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  deleteInterface(interfaceId: number): Observable<IInterfaceRes> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteInterfaceInfo")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{interfaceid}", interfaceId + '');
      return this.consumer.serviceConsumer<IInterfaceRes>(_apiUrl, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}