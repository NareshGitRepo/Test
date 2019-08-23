import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Settings } from "./Settings";


@Injectable()
export class AppConfig {

  private settings: Settings = null;

  constructor(private http: HttpClient) { }

  private getSettings(): Settings {
    return this.settings;
  }

  getServiceUrl(): string {
    return this.settings.serviceUrl;
  }

  getReqTimeout(): number {
    return this.settings.reqTimeout;
  }

  getQueuesReloadTimeInterval(): number {
    return this.settings.queuesReloadTimeInterval;
  }

  getUsersList(): any {
    return this.settings.userslist;
  }

  /**
   * This method:
   *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
   *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
   */
  public load() {    

    return new Promise((resolve, reject) => {
      const configFilePath = "./assets/config/appsettings.json";
      console.log("AppConfig File Path :", __dirname);
      console.log(" configFilePath :", configFilePath);
      this.http.get(configFilePath)
        .map(res => res)
        .catch((error: any): any => {
          console.log("Configuration file could not be read", error);
          resolve(true);
          return Observable.throw(error.json().error || "Server error");
        }).subscribe((envResponse) => {
          console.log("Configuration file subscribe :", envResponse);
          this.settings = JSON.parse(JSON.stringify(envResponse));
          console.log("settings :", this.settings);
          resolve(true);
        });
    });
  }
}
