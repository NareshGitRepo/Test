import * as CryptoJS from 'crypto-js';
import * as _ from "lodash";
import * as jwt_decode from "jwt-decode";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";

@Injectable()
export class AppConfig {

  private settings: Settings = null;
  private routeLoad: boolean = false;
  private headerLoad: boolean = true;
  private routeConfig: any;
  private menuItems: MainMenu[];
  _tokenInfo: ITokenInfo;
  private country: string = 'ae';
  constructor(private http: HttpClient) { }

  private getSettings(): Settings {
    return this.settings;
  }
  getLoadingPage(): any {
    return this.settings.lodingPage;
  }
  // getServiceUrl(): string {
  //   return this.settings.serviceUrl;
  // }
  getnotificationInterval(): number {
    return this.settings.notificationInterval;
  }
  getDynamicOption(): boolean {
    console.log("setting=>", this.settings.DynamicOption);

    return this.settings.DynamicOption;
  }
  getEncryptSecretKey(): string {
    return this.settings.encryptSecretKey;
  }
  getDepartementIntervals(): any {
    return this.settings.departementIntervals;
  }
  getDefaultInterval(): number {
    return this.settings.defaultInterval;
  }
  getDisplayInterval(): number {
    return this.settings.displayInterval;
  }
  getReceptionInterval(): number {
    return this.settings.slideingInterval;
  }
  gettokenInterval(): number {
    return this.settings.tokenInterval;
  }
  gettokenPopInterval(): number {
    return this.settings.tokenPopInterval;
  }
  gettokenThemes(): any {
    return this.settings.tokenThemes;
  }
  getaudiofile(): string {
    return this.settings.audiofile;
  }
  getdisplayLang(): number {
    return this.settings.displayLang;
  }
  getdashboardInterval(): number {
    return this.settings.dashboardInterval;
  }
  getRouteConfig(): any {
    // console.log("routeConfig=>", this.routeConfig);
    return this.routeConfig;
  }
  setRouteConfig(value: any) {
    this.routeConfig = value;
  }
  getMenuLoadStatus(): boolean {
    // console.log("getMenuLoadStatus=>", this.routeLoad);
    return this.routeLoad;
  }
  setMenuLoadStatus(value: boolean) {
    this.routeLoad = value;
  }
  getMenuLoadItems(): MainMenu[] {
    return this.menuItems;
  }
  setMenuLoadItems(value: MainMenu[]) {
    this.menuItems = value;
  }
  getHeaderLoads(): boolean {
    return this.headerLoad;
  }
  setHeaderLoad(value: boolean) {
    localStorage.setItem('hl', value ? '1' : '0');
    this.headerLoad = value;
  }
  getCountry(): string {
    return this.country;
  }
  getTokenInfo(): ITokenInfo {
    return this._tokenInfo;
  }
  clearTokenInfo() {
    let retuTokenInfo: ITokenInfo;
    this._tokenInfo = retuTokenInfo;
  }
  setTokenInfo(value:string) {
   // let tokenNo = localStorage.getItem('TokenNo');
    if (value != null) {
      localStorage.setItem(this.settings.sessionName, value);
      this._tokenInfo = this.decryptDataForTokenAndTokenInfo(value);
    }
    else {
      let retuTokenInfo: ITokenInfo;
      this._tokenInfo = retuTokenInfo;
    }
  }

  decryptDataForTokenAndTokenInfo(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.getEncryptSecretKey());
      if (bytes.toString()) {
        let token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this._tokenInfo = { tokenKey: token, tokenInfo: jwt_decode(token) } as ITokenInfo;
        this._tokenInfo.tokenSub = this._tokenInfo ? JSON.parse((this._tokenInfo.tokenInfo as any).sub) : undefined;
        return this._tokenInfo;
      }
      this._tokenInfo = { tokenKey: data, tokenInfo: jwt_decode(data) } as ITokenInfo;
      this._tokenInfo.tokenSub = this._tokenInfo ? JSON.parse((this._tokenInfo.tokenInfo as any).sub) : undefined;
      return this._tokenInfo;
    } catch (e) {
      console.log('error=>', e);
    }
    let retuTokenInfo: ITokenInfo;
    return retuTokenInfo;
  }
  public load() {
    // try {
    //   let countrydata = new Promise((resolve, reject) => {
    //     const configFilePath = "./assets/data/Countrylist.json";
    //     console.log("ConfigFilePath :", configFilePath);
    //     this.http.get(configFilePath)
    //       .map(res => res)
    //       .catch((error: any): any => {
    //         console.log("Configuration file could not be read", error);
    //         resolve(true);
    //         return Observable.throw(error.json().error || "Server error");
    //       }).subscribe((envResponse: any) => {
    //         const timeZoneOffset: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //         console.log("timeZoneoffset=>", envResponse);
    //         let countrydata = _.filter(envResponse, function (x) {
    //           return x.timezones.indexOf(timeZoneOffset) !== -1;
    //         });
    //         if (countrydata.length > 0) {
    //           this.country = (countrydata[0] as any).id ? (countrydata[0] as any).id.toLowerCase() : this.country;
    //         }
    //         console.log("country=>", this.country);

    //         resolve(true);
    //       });
    //   });
    // } catch (e) {
    //   console.log('error=>', e);
    // }

    return new Promise((resolve, reject) => {
      const configFilePath = "./assets/config/appsettings.json";
      console.log("ConfigFilePath :", configFilePath);
      this.http.get(configFilePath)
        .map(res => res)
        .catch((error: any): any => {
          console.log("Configuration file could not be read", error);
          resolve(true);
          return Observable.throw(error.json().error || "Server error");
        }).subscribe((envResponse:Settings) => {
         // console.log("Configuration file subscribe :", envResponse);
          this.settings =envResponse;
          console.log("Configuration file subscribe =>", this.settings);
          let hlval = localStorage.getItem('hl');
          if (hlval != null)
            this.headerLoad = hlval == '0' ? false : true;
          let tokenNo = localStorage.getItem(this.settings.sessionName);
          if (tokenNo != null) {
            this._tokenInfo = this.decryptDataForTokenAndTokenInfo(tokenNo);
          }
          else {
            let retuTokenInfo: ITokenInfo;
            this._tokenInfo = retuTokenInfo;
          }
          resolve(true);
        });
    });


  }
}

export interface ITokenInfo {
  tokenKey: string;
  tokenInfo: ILoginDtos;
  tokenSub: IUserUpdateDto;
}
export interface ILoginDtos {
  sub: string;
  roleId: number;
  userid: number;
  iat: number;
  hash: string;
  username: string;
}


export interface Organization {
  orgId: number;
  organization: string;
}

// export interface IUserUpdateDto {
//   contactNo: string;
//   language :string;
//   departments: Department[];
//   firstname: string;
//   isactive: number;
//   lastname: string;
//   login: string;
//   organizations: Organization[];
//   roles: IRole[];
//   userId: number;
// }
export interface IUserUpdateDto {
  contactNo: string;
  depts: Department[];
  endTime: string;
  firstname: string;
  hashedPassword: string;
  isactive: number;
  lastname: string;
  levelId: number;
  levelName: string;
  login: string;
  orgId: number;
  orgName: string;
  isManualPage:boolean;
  roles: IRole[];
  startTime: string;
  userId: number;
  language: string;
  userType:string;
}


export interface Department {
  deptId: number;
  deptName: string;
}
export interface IRole {
  roleDescription: string;
  roleId: number;
  roleName: string;
}
export interface Settings {
  DynamicOption;
  encryptSecretKey;
  lodingPage;
  departementIntervals;
  defaultInterval;
  displayInterval;
  slideingInterval;
  tokenInterval;
  audiofile;
  displayLang;
  tokenPopInterval;
  tokenThemes;
  sessionName;
  dashboardInterval;
  notificationInterval;
}
export interface MainMenu {
  name: string;
  link: string;
  id: string;
  icon: string;
  submenu: SubMenu[];
}
export interface SubMenu {
  name: string;
  link: string;
  id: string;
}
export enum userType {
  ClientAdmin = "ClientAdmin",
  GroupAdmin = "GroupAdmin",
  FacilityAdmin = "FacilityAdmin",
  SuperAdmin = "SuperAdmin",
  Pharmacist = "Pharmacist",
  LabTechnician = "LabTechnician",
  Clerk = "Clerk",
  Resource = "Resource",
  ServiceResource = "ServiceResource",
  Nurse = "Nurse",
  Doctor="Doctor"
}
