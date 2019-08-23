import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEvent, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import "rxjs/add/operator/map";
import * as _ from "underscore";
import * as jwt_decode from "jwt-decode";

// Services
import { AuthenticationService } from "../authentication.service";
import { environment } from "../../../environments/environment";
import { AppConfig } from "../../AppConfig";

@Injectable()
export class FileService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService, private _appConfig: AppConfig) {
  }

  mobileNumber: any;
  waves: any;

  upload(formModel, file) {
    console.log("FileService:upload:");
    console.log("Form Model : ", formModel);
    console.log("File =========>   : ", file);
    // add authorization header with jwt token
    const httpOptions = {
      headers: new HttpHeaders({
        "enctype": "multipart/form-data",
        // "Authorization": "Bearer " + this.authService.token
      })
    };
    console.log("Sending POST Request ...");
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/upload");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/upload", file, httpOptions)
      .map((response) => {
        console.log("response ==> ", response);
        return response;
      });
  }

  pushFileToHttpReq(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    const header: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      // "Authorization": "Bearer " + this.authService.token
    });

    formdata.append("file", file);
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/ops/upload");
    // const req = new HttpRequest("POST", "http://192.168.7.121:8090/api/upload", formdata, {
    const req = new HttpRequest("POST", this._appConfig.getServiceUrl() + "/ops/upload", formdata, {
      headers: header,
      reportProgress: true,
      responseType: "text"
      // responseType: "json"
    });
    return this.http.request(req);
  }

  fileToHttpReq(campaignName: string, welcomeFile: File, finalFile: File, promoType: string,
    validDigits: string, startDate: string, endDate: string, startTime: string,
    dnd: boolean, mobileNumber: string): Observable<HttpEvent<{}>> {

    console.log("FileService:fileToHttpReq:");
    this.mobileNumber = [mobileNumber];
    const formdata: any = new FormData();
    formdata.append("infoFile", welcomeFile);

    if (promoType === "Promo") {
      formdata.append("promoFile", finalFile);
    }

    // console.log("FileService:fileToHttpReq: Token: >>> ", sessionStorage.getItem('token'));
    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    const params = new HttpParams()
      .set("promotionType", promoType)
      .set("validDigits", validDigits)
      .set("createdBy", jsonObj.id)
      .set("campaignName", campaignName)
      .set("startDate", startDate)
      .set("startTime", startTime)
      .set("endDate", endDate)
      .set("dnd", "" + dnd)
      .set("mobilenumbers", this.mobileNumber);

    const header: HttpHeaders = new HttpHeaders({
      // "Authorization": "Bearer " + this.authService.token
    });

    console.log("params ==>", params);
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/quickCampaign");
    // const req = new HttpRequest("POST", this._appConfig.getServiceUrl() + "/ops/upload", formdata, {
    const req = new HttpRequest("POST", this._appConfig.getServiceUrl() + "/campaign/quickCampaign", formdata, {
      // headers: header, 
      reportProgress: true,
      responseType: "text",
      params: params,
    });
    return this.http.request(req);
  }

  BulkUploadfile(finalFile: File): Observable<HttpEvent<{}>> {

    console.log("FileService:BulkfileToHttpReq:");
    const formdata: any = new FormData();
    formdata.append("textFile", finalFile);

    // console.log("FileService:BulkfileToHttpReq: Token: >>> ", sessionStorage.getItem('token'));
    // const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    // const jsonObj = JSON.parse(tokenPayload.sub);

    // const params = new HttpParams()
    //   .set("promotionType", promoType)
    //   .set("validDigits", validDigits)
    //   // .set("userid", jsonObj.id)
    //   .set("createdBy", jsonObj.id)
    //   .set("campaignName", campaignName)
    //   .set("startDate", startDate)
    //   .set("startTime", startTime)
    //   .set("endDate", endDate)
    //   .set("dnd", "" + dnd);

    const header: HttpHeaders = new HttpHeaders({
      // "Authorization": "Bearer " + this.authService.token
    });

    // console.log("params ==>", params);
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/uploadtextfile");
    // const req = new HttpRequest("POST", this._appConfig.getServiceUrl() + "/ops/upload", formdata, {
    const req = new HttpRequest("POST", this._appConfig.getServiceUrl() + "/campaign/uploadtextfile", formdata, {
      // headers: header, 
      reportProgress: true,
      responseType: "text",
      // params: params,
    });
    return this.http.request(req);
  }

  BulkfileToHttpReq(campaignName: string, welcomeFile: File, finalFile: File, file: File, promoType: string,
    validDigits: string, startDate: string, endDate: string, startTime: string, dnd:
      boolean, filePath: string): Observable<HttpEvent<{}>> {

    console.log("FileService:BulkfileToHttpReq:");
    const formdata: any = new FormData();
    
    formdata.append("infoFile", welcomeFile);

    if (promoType === "Promo") {
      formdata.append("promoFile", finalFile);
    }
    // formdata.append("waves", file);

    // console.log("FileService:BulkfileToHttpReq: Token: >>> ", sessionStorage.getItem('token'));
    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    const params = new HttpParams()
      .set("promotionType", promoType)
      .set("validDigits", validDigits)
      // .set("userid", jsonObj.id)
      .set("createdBy", jsonObj.id)
      .set("textFilePath", filePath)
      .set("campaignName", campaignName)
      .set("startDate", startDate)
      .set("startTime", startTime)
      .set("endDate", endDate)
      .set("dnd", "" + dnd);

    const header: HttpHeaders = new HttpHeaders({
      // "Authorization": "Bearer " + this.authService.token
    });

    console.log("params ==>", params);
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/bulkCampaign");
    // const req = new HttpRequest("POST", this._appConfig.getServiceUrl() + "/ops/upload", formdata, {
    const req = new HttpRequest("POST", this._appConfig.getServiceUrl() + "/campaign/bulkCampaign", formdata, {
      // headers: header, 
      reportProgress: true,
      responseType: "text",
      params: params,
    });
    return this.http.request(req);
  }


  getCampaignName(campaignName: string) {
    console.log("FileService:getCampaignName : ", campaignName);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "text/plain",
        // "Authorization": "Bearer " + this.authService.token
      })
    };
    // const body = {
    //   "campaignName": campaignName,
    // };

    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/campaign/validatecampaignname");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/campaign/validatecampaignname", campaignName, httpOptions)
      .map((response) => {
        console.log("Service Response : ", response);
        return response;
      });
  }
}
