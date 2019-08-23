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
import { CdrReport } from "../../beans/reports/cdr";
import * as jwt_decode from "jwt-decode";


@Injectable()
export class CdrDetailService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService,
    private _appConfig: AppConfig, private datePipe: DatePipe) { }

  getCdrDetailReport(): Observable<CdrReport[]> {
    console.log("CdrDetailService:getCdrDetailReport:");
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
      "token": this.authService.token
      // "loginuserid": this.authService.userid
    };

    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    if (jsonObj.role === "admin") {
      console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/cdrs");
      return this.http.get<any>(this._appConfig.getServiceUrl() + "/campaign/cdrs")
        .map((response) => {
          // console.log("DetailedService ::: response ==> ", response);
          return response;
        });
    } else {
      console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/cdrs/"+jsonObj.id);
      return this.http.get<any>(this._appConfig.getServiceUrl() + "/campaign/cdrs/"+jsonObj.id)
        .map((response) => {
          // console.log("DetailedService ::: response ==> ", response);
          return response;
        });
    }

    // console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/cdrs");
    // return this.http.get<any>(this._appConfig.getServiceUrl() + "/campaign/cdrs")
    //   .map((response) => {
    //     console.log("DetailedService ::: response ==> ", response);
    //     return response;
    //   });
  }

  public getDetailedResults(page: Page, smschistory: CdrReport[]): Observable<PagedData<CdrReport>> {
    console.log("CdrDetailService:getHistoryResults:");
    return Observable.of(smschistory).map(data => this.getPagedHistoryData(page, smschistory));
  }

  private getPagedHistoryData(page: Page, smschistory: CdrReport[]): PagedData<CdrReport> {
    console.log("CdrDetailService:getPagedHistoryData:");
    const pagedData = new PagedData<CdrReport>();
    page.totalElements = smschistory.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = smschistory[i];
      // const resObj = new DetailedReport(jsonObj.msisdn, jsonObj.startTime, jsonObj.endTime, jsonObj.callStatus, jsonObj.callDuration, jsonObj.billedAmount, jsonObj.digits, jsonObj.callUuid);
      const resObj = new CdrReport(jsonObj.id, jsonObj.fromNumber, jsonObj.toNumber, jsonObj.campaignId
        , jsonObj.startDate, jsonObj.endDate, jsonObj.billedDuration, jsonObj.status,
        jsonObj.callDuration, jsonObj.totalAmount, jsonObj.digits, jsonObj.callUuid,
        jsonObj.totalRate, jsonObj.insertTime, jsonObj.answerTime, jsonObj.totalCost);

      pagedData.data.push(resObj);
    }
    pagedData.page = page;
    return pagedData;
  }

}
