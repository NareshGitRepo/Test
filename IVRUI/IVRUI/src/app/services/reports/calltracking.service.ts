import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import * as _ from "underscore";

import { PagedData } from "../../beans/paged-data";
import { Page } from "../../beans/page";

import { AuthenticationService } from "../authentication.service";
import { environment } from "../../../environments/environment";
import { AppConfig } from "../../AppConfig";
import { DatePipe } from "@angular/common";
import { DateInfo } from "../../beans/date";
import { CallTrackingReport } from "../../beans/reports/calltracking";

@Injectable()
export class CallTrackingService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService,
    private _appConfig: AppConfig, private datePipe: DatePipe) { }

  getCallTrackingReport(): Observable<CallTrackingReport[]> {
    console.log("CallTrackingService:getEsmeHistory:");
    // console.log("CallTrackingService: TOKEN: ----->>> ", this.authService.token);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        timeout: `${this.authService.getReqTimeout()}`
        // "Authorization": "Bearer " + this.authService.token
        //  Authorization: this.authService.token
      })
    };
    const body = {
      "loginuserid": this.authService.userid
    };
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() +"/history");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/history", body, httpOptions)
      .map((response) => {
        console.log("CallTrackingService ::: response ==> ", response);
        return response;
      });
  }

  public getCallTrackingResults(page: Page, smschistory: CallTrackingReport[]): Observable<PagedData<CallTrackingReport>> {
    console.log("CallTrackingService:getHistoryResults:");
    return Observable.of(smschistory).map(data => this.getPagedHistoryData(page, smschistory));
  }

  private getPagedHistoryData(page: Page, smschistory: CallTrackingReport[]): PagedData<CallTrackingReport> {
    console.log("CallTrackingService:getPagedHistoryData:");
    const pagedData = new PagedData<CallTrackingReport>();
    page.totalElements = smschistory.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = smschistory[i];
      const resObj = new CallTrackingReport(jsonObj.msisdn,jsonObj.startTime,jsonObj.endTime,jsonObj.callStatus,jsonObj.callDuration,jsonObj.billedAmount,jsonObj.digits,jsonObj.callUuid);
      pagedData.data.push(resObj);
    }
    pagedData.page = page;
    return pagedData;
  }

}
