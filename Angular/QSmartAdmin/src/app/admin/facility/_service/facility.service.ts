import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Response } from '@angular/http';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { IFacilityModel, IUpdateFacility, IResponse } from '../_model/facility.model';

@Injectable({
  providedIn: 'root'
})

export class FacilityService {

  public component = "Facility";
  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }
  changedStatus: any;


  getFacilityByClientId() {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFacilitiesByClientId");
    if (_apiurlsdetials) {
      console.log("FacilityService: getFacilitiesByClientId: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<IFacilityModel[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'hospitals', 0);
    }
    else {
      console.log("FacilityService: getFacilitiesByClientId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  updateFacility(updateDetails: IUpdateFacility): Observable<IResponse> {
    console.log("FacilityService ::  updateFacility :: ", updateDetails);
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateFacilityInfo");
    if (_apiurlsdetials) {
      console.log("FacilityService ::  updateFacility---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateDetails);
    }
    else {
      console.log("FacilityService: updateFacility: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  statusUpdate(row: IFacilityModel) {
    console.log("FacilityService ::  statusUpdate ::::", row);
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateFacilityStatus");
    const url = _apiurlsdetials.url.replace("{clientid}", "" + row.orgId) + '?satus=' + row.status;
    if (_apiurlsdetials) {
      console.log("FacilityService ::  statusUpdate---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<any>(url, _apiurlsdetials.type, '', '', 0);
    } else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  private(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('FacilityService: extractData: ' + res.status);
    }
    let body = res.json();
    return body.data || {};
  }

}



