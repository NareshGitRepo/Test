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
import { CamDetailsInfo } from "../../beans/camapignmanagement/campaigndetails";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class CampaignDetailsService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService,
    private _appConfig: AppConfig, private datePipe: DatePipe) { }

  getDetailedReport(): Observable<CamDetailsInfo[]> {
    console.log("CampaignDetailsService:getCampaignStatus:");

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
      console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/campagins");
      return this.http.get<any>(this._appConfig.getServiceUrl() + "/campaign/campagins")
        .map((response) => {
          // console.log("CampaignDetailsService ::: response ==> ", response);
          return response;
        });
    } else {
      console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/campagins/"+jsonObj.id);
      return this.http.get<any>(this._appConfig.getServiceUrl() + "/campaign/campagins/"+jsonObj.id)
        .map((response) => {
          // console.log("CampaignDetailsService ::: response ==> ", response);
          return response;
        });
    }
  }

  public getDetailedResults(page: Page, smschistory: CamDetailsInfo[]): Observable<PagedData<CamDetailsInfo>> {
    console.log("CampaignDetailsService:getHistoryResults:");
    return Observable.of(smschistory).map(data => this.getPagedHistoryData(page, smschistory));
  }

  private getPagedHistoryData(page: Page, smschistory: CamDetailsInfo[]): PagedData<CamDetailsInfo> {
    console.log("CampaignDetailsService:getPagedHistoryData:");
    const pagedData = new PagedData<CamDetailsInfo>();
    page.totalElements = smschistory.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = smschistory[i];
      const resObj = new CamDetailsInfo(jsonObj.id, jsonObj.campaignFlow, jsonObj.campaignName, jsonObj.campaignType,
        jsonObj.createdBy, jsonObj.createdDate, jsonObj.dnd, jsonObj.startDate, jsonObj.startTime,
        jsonObj.endDate, jsonObj.endTime, jsonObj.pattern, jsonObj.promotionType);
      pagedData.data.push(resObj);
    }
    pagedData.page = page;
    return pagedData;
  }
}
