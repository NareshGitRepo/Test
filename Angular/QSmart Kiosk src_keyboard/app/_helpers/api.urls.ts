import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import * as _ from 'lodash';

@Injectable()
export class LoadApiUrls {

  private _apiUrls: IApiUrls[] = null;
  serviceUrl: string;
  //_languageInfo;//= require('../../assets/data/languageinfo.json');
  //_selLanguage: string;


  _setPrinterUrl: string;
  apiTempUrl: string;

  constructor(private http: HttpClient) {
  }

  getApiServiceUrlByComponentAndMethod(compName: string, methodName: string): IApiMethod {
    let _iapiMethods: IApiMethod[] = <any>_.pick(_.filter(this._apiUrls, { component: compName })[0], ['methods']);
    let _iapiMethod: IApiMethod = <any>_.filter(_iapiMethods['methods'], { name: methodName })[0];
    //console.log("_iapiMethod=>", _iapiMethod);
    return _iapiMethod;
  }

  public load() {
    console.log("loading ...");

    let promise = new Promise((resolve, reject) => {
      let optionsdata = {
        params: {currentHash:(new Date().getTime())+''}
    };
      const controlSettings = "./assets/config/ControlSettings.json";
      console.log("ControlSettings :", controlSettings,optionsdata);
      this.http.get(controlSettings,optionsdata)
        .map(res => res)
        .catch((error: any): any => {
          console.log("ControlSettings file could not be read", error);
          reject(true);
          return Observable.throw(error.json().error || "Server error");
        })
        .subscribe((envResponse:IBaseApiUrls) => {
          console.log("ControlSettings file subscribe :", envResponse);
          resolve(envResponse);
        });
    }
    );

    promise.then((result: IBaseApiUrls) => {
      let baseUrl = result.baseUrl;
      let baseUrl1 = result.baseUrl;
      this._setPrinterUrl = result.printerUrl;

          console.log("baseUrl:::" + result.baseUrl);
          console.log("printerUrl:::" + result.printerUrl);

      _.forEach(result.components, (apiUrls: IApiUrls) => {
        baseUrl = baseUrl1;
        if (apiUrls.apiUrl != "")
          baseUrl = apiUrls.apiUrl;
        return _.forEach(apiUrls.methods, (apiMethod: IApiMethod) => {
          this.apiTempUrl = apiMethod.url;
          apiMethod.url = baseUrl + apiMethod.url;
          apiMethod.printUrl = this._setPrinterUrl + this.apiTempUrl;
          return apiMethod;
        });
      });
      console.log("_apiUrls=>", this._apiUrls);

      this._apiUrls = result.components;
    }).catch(error => {
      console.log("ControlSettings file could not be read", error);
    })
  }

  public getPrinterUrl() {
    return this._setPrinterUrl;
  }

  public getApiUrls(): IApiUrls[] {
    return this._apiUrls;
  }

}

export interface IBaseApiUrls {
  baseUrl: string;
  printerUrl: string;
  setTimeoutforToken: number;
  setTimeoutforCheckIn: number;
  setTimeoutforCheckInRegistration: number;
  setTimeoutforCheckInOTPFirstTime: number;
  setTimeoutforCheckInOTPNextTime: number;
  components: IApiUrls[];
}

export interface IApiUrls {
  apiUrl: string
  component: string;
  methods: IApiMethod[];
}

export interface IApiMethod {
  name: string;
  type: string;
  url: string;
  printUrl: string;
}

export interface ApiResponse {
  id?: number;
  messages: string;
  status: boolean;
} 