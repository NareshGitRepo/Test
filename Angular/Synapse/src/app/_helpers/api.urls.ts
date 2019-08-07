import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import * as _ from 'lodash';


@Injectable()
export class LoadApiUrls {

  private _apiUrls: IApiUrls[] = null;
  serviceUrl: string;
  constructor(private http: HttpClient) {
    //this.serviceUrl = this.appconfig.getServiceUrl() + "/";,private appconfig: AppConfig
  }

  public getApiUrls(): IApiUrls[] {
    return this._apiUrls;
  }
  public getBaseApiUrls(): string {
    return this.serviceUrl;
  }
  getApiServiceUrlByComponentAndMethod(compName: string, methodName: string): IApiMethod {

    let _iapiMethods: IApiMethod[] = <any> _.pick(_.filter(this._apiUrls, { component: compName })[0], ['methods']);
    let _iapiMethod: IApiMethod = <any> _.filter(_iapiMethods['methods'], { name: methodName })[0];
    console.log("_iapiMethod=>", _iapiMethod);
    return _iapiMethod;

  }


  public load() {

    let promise = new Promise((resolve, reject) => {
      const controlSettings = "./assets/config/ControleSettings.json";
      console.log("ControlSettings :", controlSettings);
      this.http.get(controlSettings)
        .map(res => res)
        .catch((error: any): any => {
          console.log("ControlSettings file could not be read", error);
          reject(true);
          return Observable.throw(error.json().error || "Server error");
        })
        .subscribe((envResponse) => {
          console.log("ControlSettings file subscribe :", envResponse);
          //this._apiUrls = JSON.parse(JSON.stringify(envResponse));
          let result: IBaseApiUrls = JSON.parse(JSON.stringify(envResponse));
          console.log("ControlSettings final :", this._apiUrls);
          resolve(result);
        });
    });

    promise.then((result: IBaseApiUrls) => {
      this.serviceUrl=result.baseUrl;
      let baseUrl = result.baseUrl;

      _.forEach(result.components, (apiUrls: IApiUrls) => {
        if (apiUrls.apiUrl != "")
          baseUrl = apiUrls.apiUrl;
          else
          baseUrl = result.baseUrl;
          
        return _.forEach(apiUrls.methods, (apiMethod: IApiMethod) => {
          apiMethod.url = baseUrl + apiMethod.url;
          return apiMethod
        });
      });
      this._apiUrls = result.components;
    }).catch(error => {
      console.log("ControlSettings file could not be read", error);
    })

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