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
import { QuickInfo } from "../../beans/camapignmanagement/quick";
import { SummaryReport } from "../../beans/reports/summary";

@Injectable()
export class SummaryService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService,
    private _appConfig: AppConfig, private datePipe: DatePipe) { }

  getSummaryReport(): Observable<SummaryReport[]> {
    console.log("SummaryService:getEsmeHistory:");
    // console.log("SummaryService: TOKEN: ----->>> ", this.authService.token)
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
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/esme/history");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/esme/history", body, httpOptions)
      .map((response) => {
        console.log("SummaryService ::: response ==> ", response);
        return response;
      });
  }

  public getSummaryResults(page: Page, smschistory: SummaryReport[]): Observable<PagedData<SummaryReport>> {
    console.log("SummaryService:getHistoryResults:");
    return Observable.of(smschistory).map(data => this.getPagedHistoryData(page, smschistory));
  }

  private getPagedHistoryData(page: Page, smschistory: SummaryReport[]): PagedData<SummaryReport> {
    console.log("SummaryService:getPagedHistoryData:");
    const pagedData = new PagedData<SummaryReport>();
    page.totalElements = smschistory.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = smschistory[i];
      const resObj = new SummaryReport(jsonObj.campaignName, jsonObj.uploadeBase, jsonObj.dnd, jsonObj.finalBase,
        jsonObj.dailledBase, jsonObj.successBase, jsonObj.failedBase);
      pagedData.data.push(resObj);
    }
    pagedData.page = page;
    return pagedData;
  }

}
