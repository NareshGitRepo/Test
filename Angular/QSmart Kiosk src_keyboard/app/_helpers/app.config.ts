import { Injectable, APP_INITIALIZER } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Menu } from "../dashboard/_model/IDashboard";

@Injectable()
export class AppConfig {

  // setTimeout: any;
  private settings: Settings = null;
  _setTimeoutforToken: any;
  _setTimeoutforCheckIn: any;
  _setTimeoutforCheckInRegistration: any;
  _setTimeoutforPharmacy: any;
  _setTimeoutforCheckInOTPFirstTime: any;
  _setTimeoutforCheckInOTPNextTime: any;
  kiosk: string;
  kioskId: string;
  printerStatus: string;
  menuInfo: Menu[];
  _timer: any;
  _recallCurrentDateAPIInterval: any;
  transactionId: number;

  constructor(private http: HttpClient) {
    console.log('AppConfig constructor ');
  }

  private getSettings(): Settings {
    return this.settings;
  }
 
  public getKiosk(): string {
    return this.kiosk;
  }
  public setKiosk(value: string) {
    this.kiosk = value.trim();
  }
  public getKioskId(): string {
    return this.kioskId;
  }
  public setKioskId(value: string) {
    this.kioskId = value;
  }
  public getPHTransactionId(): number {
    return this.transactionId;
  }
  public setPHTransactionId(value: number) {
    this.transactionId = value;
  }
  public getPrinterStatus(): string {
    return this.printerStatus;
  }

  public setPrinterStatus(value: string) {
    this.printerStatus = value.trim();
  }
  
  public setMenus(menus:Menu[]){
    console.log("setMenus");
    this.menuInfo=menus;
  }
  public getMenus(){
    return this.menuInfo;
  }
  public getsnackbarDuration(): number {
    return this.settings.snackbarDuration;
  }
  public getRecallCurrentDateAPIInterval() {
    return this._recallCurrentDateAPIInterval;
  }

  getServiceUrl(): string {
    return this.settings.serviceUrl;
  }
  public getTimeoutforToken() {
    return this._setTimeoutforToken;
  }

  public getTimeoutforcheckIn() {
    return this._setTimeoutforCheckIn;
  }

  public getTimeoutforcheckInRegistration() {
    return this._setTimeoutforCheckInRegistration;
  }
public gettimer()
{
  return this._timer;
}
public settimer(_timer:number)
{
  this._timer= _timer;
}
  public getTimeoutforPharmacy() {
    return this._setTimeoutforPharmacy;
  }
  public getTimeoutforCheckInOTPFirstTime() {
    return this._setTimeoutforCheckInOTPFirstTime;
  }

  public getTimeoutforCheckInOTPNextTime() {
    return this._setTimeoutforCheckInOTPNextTime;
  }

  // public setPageTimeout() {
  //   setTimeout(function () {
  //     this.router.navigate(['/'], { queryParams: { kioskid: localStorage.getItem("kioskid") } });
  //   }.bind(this), this.setTimeout = this.getTimeoutforToken());
  // }
  public load() {

    return new Promise((resolve, reject) => {
      const configFilePath = "./assets/config/appsettings.json";
      let optionsdata = {
        params: {currentHash:(new Date().getTime())+''}
    };

      console.log("ConfigFilePath :", configFilePath,optionsdata);
      this.http.get(configFilePath,optionsdata)
        .map(res => res)
        .catch((error: any): any => {
          console.log("Configuration file could not be read", error);
          resolve(true);
          return Observable.throw(error.json().error || "Server error");
        }).subscribe((envResponse) => {
          console.log("Configuration file subscribe :", envResponse);
          this.settings = JSON.parse(JSON.stringify(envResponse));




          this._setTimeoutforToken =  this.settings.setTimeoutforToken;
          this._setTimeoutforCheckIn =  this.settings.setTimeoutforCheckIn;
          this._setTimeoutforPharmacy = this.settings.setTimeoutforPharmacy;
          this._setTimeoutforCheckInRegistration =  this.settings.setTimeoutforCheckInRegistration;
          this._setTimeoutforCheckInOTPFirstTime =  this.settings.setTimeoutforCheckInOTPFirstTime;
          this._setTimeoutforCheckInOTPNextTime =  this.settings.setTimeoutforCheckInOTPNextTime;
          this._recallCurrentDateAPIInterval = this.settings.recallCurrentDateAPIInterval;

          console.log("TimeoutforToken:::" +  this.settings.setTimeoutforToken);
          console.log("TimeoutforCheckIn:::" +  this.settings.setTimeoutforCheckIn);
          console.log("TimeoutforCheckInRegistration:::" +  this.settings.setTimeoutforCheckInRegistration);
          console.log("TimeoutforCheckInOTPFirstTime:::" +  this.settings.setTimeoutforCheckInOTPFirstTime);
          console.log("TimeoutforCheckInOTPNextTime:::" +  this.settings.setTimeoutforCheckInOTPNextTime);

          console.log("Settings :", this.settings);
          resolve(true);
        });
    });

  }

}

export interface Settings {
  serviceUrl;
  setTimeoutforToken;
  setTimeoutforCheckIn;
  setTimeoutforCheckInOTPFirstTime;
  setTimeoutforCheckInOTPNextTime;
  setTimeoutforCheckInRegistration;
  setTimeoutforPharmacy;
  snackbarDuration;
  recallCurrentDateAPIInterval;
}
export enum menuType{
  RG = 1,
  CK = 2,
  PH = 3,
  LB = 4,
  FB = 5
}