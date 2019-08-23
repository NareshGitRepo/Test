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
import { CamStausInfo } from "../../beans/camapignmanagement/campaignstatus";

import * as jwt_decode from "jwt-decode";

@Injectable()
export class CampaignStatusService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService,
    private _appConfig: AppConfig, private datePipe: DatePipe) { }

  getCampaignStatus(): Observable<CamStausInfo[]> {
    console.log("CampaignStatusService:getCampaignStatus:");
    // console.log("CampaignStatusService: TOKEN: ----->>> ", this.authService.token);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // timeout: `${this.authService.getReqTimeout()}`
        // "Authorization": "Bearer " + this.authService.token
        //  Authorization: this.authService.token
      })
    };
    // const body = {
    //   "loginuserid": this.authService.userid
    // };

    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    if (jsonObj.role === "admin") {
      console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/activecampagins");
      return this.http.get<any>(this._appConfig.getServiceUrl() + "/campaign/activecampagins")
        .map((response) => {
          // console.log("CampaignStatusService ::: response ==> ", response);
          return response;
        });
    } else {
      console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/activecampagins/" + jsonObj.id);
      return this.http.get<any>(this._appConfig.getServiceUrl() + "/campaign/activecampagins/" + jsonObj.id)
        .map((response) => {
          // console.log("CampaignStatusService ::: response ==> ", response);
          return response;
        });
    }
  }

  public getCampaignStatusResults(page: Page, camStausInfo: CamStausInfo[]): Observable<PagedData<CamStausInfo>> {
    console.log("CampaignStatusService:getCampaignStatusResults:");
    return Observable.of(camStausInfo).map(data => this.getPagedHistoryData(page, camStausInfo));
  }

  private getPagedHistoryData(page: Page, camStausInfo: CamStausInfo[]): PagedData<CamStausInfo> {
    console.log("CampaignStatusService:getPagedHistoryData:");
    const pagedData = new PagedData<CamStausInfo>();
    page.totalElements = camStausInfo.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = camStausInfo[i];
      const resObj = new CamStausInfo(jsonObj.id, jsonObj.campaignId,jsonObj.campName, jsonObj.status, jsonObj.startTime,
        jsonObj.endTime, jsonObj.updatedBy, jsonObj.updatedTime);
      pagedData.data.push(resObj);
    }
    pagedData.page = page;
    return pagedData;
  }
}
