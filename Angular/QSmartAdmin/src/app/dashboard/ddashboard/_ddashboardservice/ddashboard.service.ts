import { IDashboardInfo, IDoctorApptsAndCheckin, IDoctorWaiting, IUserDashboardInfo, userType } from '../_model/ddashboard.model';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DdashboardService {
  public component = "DDashboard";

  constructor(private apiUrls: LoadApiUrls, private http: HttpClient, private consumer: ConsumerService) { }

  getdashboardByDoctId(sdate, did, rolename): Observable<IDashboardInfo> {
    let _apiurlsdetials: any;
    let ddata: any;
    if (rolename == userType.Nurse || rolename == userType.ServiceResource) {
      _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashBoardByNurseId")
      ddata = { submitDate: sdate, nurseid: did }
    }
    else {
      _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getdashboardByDoctId")
      ddata = { submitDate: sdate, doctId: did }
    }
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      return this.consumer.serviceConsumer<IDashboardInfo>(_apiUrl, _apiurlsdetials.type, ddata, '');
    }
    else {
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getUserWiseDashboard(): Observable<IUserDashboardInfo> {
    let _apiurlsdetials: any;
    let ddata: any;

      _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getUserWiseDashboard");
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      return this.consumer.serviceConsumer<IUserDashboardInfo>(_apiUrl, _apiurlsdetials.type, null, '');
    }
    else {
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getDashBoardWaitingByDoctId(did, rolename): Observable<IDoctorWaiting> {
    let _apiurlsdetials: any;
    let ddata: any;
    if (rolename == userType.Nurse || rolename == userType.ServiceResource) {
      _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashBoardWaitingByNurseId")
      ddata = {  nurseid: did }
    }
    else {
      _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashBoardWaitingByDoctId")
      ddata = {  doctId: did }
    }
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      return this.consumer.serviceConsumer<IDoctorWaiting>(_apiUrl, _apiurlsdetials.type, ddata, '');
    }
    else {
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getDashboardAptsByDoctId(sdate, did, rolename): Observable<IDoctorApptsAndCheckin> {
    let _apiurlsdetials: any;
    let ddata: any;
    if (rolename == userType.Nurse || rolename == userType.ServiceResource) {
      _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashBoardAptsByNurseId")
      ddata = { submitDate: sdate, nurseid: did }
    }
    else {
      _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDashboardAptsByDoctId")
      ddata = { submitDate: sdate, doctId: did }
    }
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      return this.consumer.serviceConsumer<IDoctorApptsAndCheckin>(_apiUrl, _apiurlsdetials.type, ddata, '');
    }
    else {
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}
