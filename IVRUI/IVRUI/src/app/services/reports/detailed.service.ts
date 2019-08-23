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
import { DetailedReport } from "../../beans/reports/detailed";

@Injectable()
export class DetailedService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService,
    private _appConfig: AppConfig, private datePipe: DatePipe) { }

  getDetailedReport(): Observable<DetailedReport[]> {
    console.log("DetailedService:getEsmeHistory:");
    // console.log("DetailedService: TOKEN: ----->>> ", this.authService.token)
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // timeout: `${this.authService.getReqTimeout()}`
        // "Authorization": "Bearer " + this.authService.token
        //  Authorization: this.authService.token
      })
    };
    const body = {
      "loginuserid": this.authService.userid
    };
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() +"/campaign/campagins");
    return this.http.get<any>(this._appConfig.getServiceUrl() +"/campaign/campagins")
      .map((response) => {
        console.log("DetailedService ::: response ==> ", response);
        return response;
      });
  }

  public getDetailedResults(page: Page, smschistory: DetailedReport[]): Observable<PagedData<DetailedReport>> {
    console.log("DetailedService:getHistoryResults:");
    return Observable.of(smschistory).map(data => this.getPagedHistoryData(page, smschistory));
  }

  private getPagedHistoryData(page: Page, smschistory: DetailedReport[]): PagedData<DetailedReport> {
    console.log("DetailedService:getPagedHistoryData:");
    const pagedData = new PagedData<DetailedReport>();
    page.totalElements = smschistory.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = smschistory[i];
      // const resObj = new DetailedReport(jsonObj.msisdn, jsonObj.startTime, jsonObj.endTime, jsonObj.callStatus, jsonObj.callDuration, jsonObj.billedAmount, jsonObj.digits, jsonObj.callUuid);
      const resObj = new DetailedReport(jsonObj.msisdn, jsonObj.startTime, jsonObj.endTime, jsonObj.callStatus, jsonObj.callDuration, jsonObj.billedAmount, jsonObj.digits, jsonObj.callUuid);
     
      pagedData.data.push(resObj);
    }
    pagedData.page = page;
    return pagedData;
  }

}
