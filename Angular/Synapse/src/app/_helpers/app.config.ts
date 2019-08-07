import { Injectable, APP_INITIALIZER } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import * as CryptoJS from 'crypto-js';
import * as jwt_decode from "jwt-decode";
import * as _ from "lodash";



@Injectable()
export class AppConfig {

  private settings: Settings = null;
  private routeLoad: boolean = false;
  private routeConfig: any;
  private allowCredits: boolean = true;
  menuItems: MainMenu[];
  _tokenInfo: ITokenInfo;

  constructor(private http: HttpClient) {
    console.log('AppConfig constructor ');

  }

  private getSettings(): Settings {
    return this.settings;
  }
  getSessionName(): string {
    return this.settings.sessionName;
  }
  getEncryptSecretKey(): string {
    return this.settings.encryptSecretKey;
  }
  getnotificationInterval(): number {
    return this.settings.notificationInterval;
  }
  getcreditsInterval(): number {
    return this.settings.creditsInterval;
  }
  getServiceUrl(): string {
    return "";
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
  getAllowcredits(): boolean {
    return this.allowCredits;
  }
  setallowCredits(value: boolean) {
    this.allowCredits = value;
  }

  getMenuLoadItems(): MainMenu[] {
    return this.menuItems;
  }
  getModuleId(currenturl: string): number {
    // console.log("URL=>", currenturl, this.menuItems);
    if (!this.menuItems)
      return 0;
    let menuIndex = this.menuItems.findIndex(s => '/' + s.link == currenturl || s.submenu.findIndex(y => '/' + s.link + '/' + y.link == currenturl) != -1 || s.submenu.findIndex(y => '/' + y.link == currenturl) != -1);
    if (menuIndex != -1) {
      let menuIndexS = this.menuItems[menuIndex].submenu.findIndex(x => '/' + x.link == currenturl);
      if (menuIndexS != -1)
        return this.menuItems[menuIndex].submenu[menuIndexS].moduleId;
      else
        return 0;
    }
    return 0;
  }
  setMenuLoadItems(value: MainMenu[]) {
    this.menuItems = value;
  }
  getTokenInfo(): ITokenInfo {
    return this._tokenInfo;
  }
  clearTokenInfo() {
    let retuTokenInfo: ITokenInfo;
    this._tokenInfo = retuTokenInfo;
  }
  setTokenInfo(value: string) {

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

    return new Promise((resolve, reject) => {
      const configFilePath = "./assets/config/appsettings.json";
      console.log("ConfigFilePath :", configFilePath);
      this.http.get(configFilePath)
        .map(res => res)
        .catch((error: any): any => {
          console.log("Configuration file could not be read", error);
          resolve(true);
          return Observable.throw(error.json().error || "Server error");
        }).subscribe((envResponse) => {
          console.log("Configuration file subscribe :", envResponse);
          this.settings = JSON.parse(JSON.stringify(envResponse));
          console.log("Settings :", this.settings);
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

export interface Settings {
  DynamicOption;
  encryptSecretKey;
  sessionName;
  notificationInterval;
  creditsInterval;
}
export interface MainMenu {
  modulename: string;
  link: string;
  moduleId: string;
  icon: string;
  submenu: SubMenu[];
}
export interface SubMenu {
  modulename: string;
  link: string;
  moduleId: number;
}
export interface ITokenInfo {
  tokenKey: string;
  tokenInfo: ILoginDtos;
  tokenSub: IUserUpdateDto;
}
export interface ILoginDtos {
  sub: string;
  userid: number;
  iat: number;
  hash: string;
  username: string;
  roleId: number;
}



export interface IUserUpdateDto {
  apiKey: string;
  checker: number;
  depts: Dept[];
  emailId: string;
  firstname: string;
  hashedPassword: string;
  lastname: string;
  login: string;
  mobileNo: string;
  modules: Module[];
  roles: Role[];
  userId: number;
  userType: number;
  language: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  roleCode: string;
}

export interface Module {
  link: string;
  menuId: number;
  moduleId: number;
  modulename: string;
  viewChecker: number;
}

export interface Dept {
  deptId: number;
  deptName: string;
  status: number;
}

export enum userType {
  SuperAdmin = "SA",
  PlatFormAdmin = "PA",
  DepartementAdmin = "DA",
  NormalUser = "NA"
}

export enum DomainName {
  Mail = "1",
  Domain = "2"
}

export enum AppyFilter {
  Active = "1",
  InActive = "0"
}

export interface CreditType {
  creditCode: string;
  creditName: string;
  creditTypeId: number;
}


export interface UserCredit {
  availableCredit: number;
  creditTypeId: number;
  deptId: number;
  thresoldLimit: number;
  userCreditId: number;
}

export interface ICredit {
  creditType: CreditType;
  firstname: string;
  isactive: number;
  lastname: string;
  login: string;
  roles: Role[];
  userCredit: UserCredit;
  userId: number;
}