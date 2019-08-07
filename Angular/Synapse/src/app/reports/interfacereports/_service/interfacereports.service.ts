import { Injectable } from '@angular/core';
import { IInterfaceReport, InterfaceInfo, Idate } from '../_model/interfacereports.model';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';

@Injectable({ providedIn: 'root' })

export class InterfaceReportsService {
  component = "Reports";
  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
  }


  getInterfaceReports(submitData): Observable<IInterfaceReport[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getInterfaceReport");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IInterfaceReport[]>(_apiurlsdetials.url, _apiurlsdetials.type, submitData, 'interfaceReports');
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
  getCurrentDate(): Observable<Idate> {

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCurrentDate")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<Idate>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}