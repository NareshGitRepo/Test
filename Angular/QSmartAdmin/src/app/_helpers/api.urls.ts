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

  constructor(private http: HttpClient) {
  }

  // public getlanguageInfo() {
  //   return this._languageInfo;
  // }

  // public setSelectedLanguage(_selLanguage: string) {
  //   this._selLanguage = _selLanguage;
  // }

  // public getSelectedLanguage() {
  //   return this._selLanguage;
  // }

  // public getsetTime() {
  //   return 10000;
  // }

  public getApiUrls(): IApiUrls[] {
    return this._apiUrls;
  }
    public getBaseApiUrls(): string {
    return this.serviceUrl;
  }

  getApiServiceUrlByComponentAndMethod(compName: string, methodName: string): IApiMethod {
    let _iapiMethods: IApiMethod[] = <any>_.pick(_.filter(this._apiUrls, { component: compName })[0], ['methods']);
    let _iapiMethod: IApiMethod = <any>_.filter(_iapiMethods['methods'], { name: methodName })[0];
    console.log("_iapiMethod=>", _iapiMethod);
    return _iapiMethod;
  }

  public load() {
    console.log("loading ...");

    let promise = new Promise((resolve, reject) => {
      // const lang = "./assets/config/languageinfo.json";
      // console.log("languagefile path  :", lang);
      // this.http.get(lang).subscribe((envResponse) => {
      //   console.log("Language file subscribe :", envResponse);
      //   this._languageInfo = JSON.parse(JSON.stringify(envResponse));
      // });

      const controlSettings = "./assets/config/ControlSettings.json";
      console.log("ControlSettings :", controlSettings);
      this.http.get(controlSettings)
        .map(res => res)
        .catch((error: any): any => {
          console.log("ControlSettings file could not be read", error);
          reject(true);
          return Observable.throw(error.json().error || "Server error");
        })
        .subscribe((envResponse:IBaseApiUrls) => {
          console.log("ControlSettings file subscribe :", envResponse);
         // this._apiUrls = envResponse.components;
         // let result: IBaseApiUrls = envResponse;
        //  console.log("ControlSettings final :", envResponse);
          resolve(envResponse);
        });
    }
    );

    promise.then((result: IBaseApiUrls) => {
      //let baseUrl=this.appconfig.getServiceUrl();
      this.serviceUrl=result.baseUrl;
      let baseUrl = result.baseUrl;
      _.forEach(result.components, (apiUrls: IApiUrls) => {
        if (apiUrls.apiUrl != "")
          baseUrl = apiUrls.apiUrl;
          else
          baseUrl=this.serviceUrl;
        return _.forEach(apiUrls.methods, (apiMethod: IApiMethod) => {
          apiMethod.url = baseUrl + apiMethod.url;
          return apiMethod
        });
      });
      this._apiUrls = result.components;
      console.log("ControlSettings final =>",  this._apiUrls);
    }).catch(error => {
      console.log("ControlSettings file could not be read", error);
    });
  }
}

export interface IBaseApiUrls {
  baseUrl: string;
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
}