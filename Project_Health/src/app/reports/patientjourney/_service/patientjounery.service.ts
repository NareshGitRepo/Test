
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { ConsumerService } from '../../../_helpers/ConsumerService'
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { IPatienttokenjourney, IToken, IDateInfo } from '../_model/patientjourneymodel';


@Injectable({
  providedIn: 'root'
})

export class PatientJourneyService {
  public component = "Reports";
  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

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

  getPatientJourneyReport(searchData): Observable<IPatienttokenjourney[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPatientJourneyReport")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials);

    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IPatienttokenjourney[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchData, 'patienttokenjourney');
    } else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getTokenTraverse(reportId) : Observable<IToken[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getTokenTraverse")
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{ticketId}", ''+reportId);
      return this.consumer.serviceConsumer<IToken[]>(_apiUrl, _apiurlsdetials.type,null, 'tokens');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }
  
}