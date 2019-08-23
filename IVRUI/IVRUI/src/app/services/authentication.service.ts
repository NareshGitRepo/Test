import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
// import { Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { environment } from "../../environments/environment";
import { AppConfig } from "../AppConfig";
import { NgxPermissionsService } from "ngx-permissions";
import { DateInfo } from "../beans/date";

import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthenticationService {

  model: any = {};
  token: string;
  role: string;
  public userid: string;
  public username: string;
  public URL: string;
  // public time: string;
  public time: Date;

  constructor(private http: HttpClient, private _appConfig: AppConfig, private permissionsService: NgxPermissionsService) {

    // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // this.token = currentUser && currentUser.token;
    // this.userid = currentUser && currentUser.userid;
    // this.username = currentUser && currentUser.username;
  }

  login(usernam: string, pwd: string) {
    console.log("AuthenticationService:login:", usernam);
    this.token = null;
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl());
    console.log("Req Timeout from config : ---->  ", this.getReqTimeout());
    // console.log("URL from ENV : ---->  ", environment.serviceUrl);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // timeout: `${this.getReqTimeout()}`
      })
    };
    console.log("Test URL from config : ---->  ", this._appConfig.getServiceUrl() + "/auth/login");

    return this.http.post<any>(this._appConfig.getServiceUrl() + "/auth/login",
      {
        userName: usernam,
        password: pwd,
      },
      httpOptions)
      .map((response) => {
        console.log("Respopnse :::>" + response.authKey);
        // login successful if there's a jwt token in the response
        // let token = response.json() && response.json().token;
        // const token = response.token;
        // const userid = response.userId;
        // const myString  = JSON.stringify(response);
        // const userobject = JSON.parse(myString);
        console.log("Auth service user:[%s], role: [%s] , Token:[%s]", response.usernam, response.role, response.authKey);
        if (response.status) {
          // set token property
          this.token = response.authKey;
          const token = response.authKey;
          const tokenPayload = jwt_decode(token);
          // console.log("User Info :::" + tokenPayload.sub);
          const jsonObj = JSON.parse(tokenPayload.sub);
          const permissions = [jsonObj.role];
          this.role = jsonObj.role;
          // const permissions = ['admin'];
          console.log("App component userrole permission :" + permissions);
          this.permissionsService.loadPermissions(permissions);

          // this.time = new Date();
          this.time = response.time;
          console.log("LoginComponent:login:" + response);

          console.log("Logged DateTime :" + this.time);
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify({
            username: usernam, token: this.token,
            role: response.role, time: this.time
          }));

          sessionStorage.setItem("token", this.token);
          // return true to indicate successful login
          // console.log("Auth service This.user:[%s], This.token:[%s]", usernam, this.token);
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      });

  }

  getDates(): Observable<DateInfo> {
    console.log("AuthenticationService:getDates");
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/auth/time");
    return this.http.get<any>(this._appConfig.getServiceUrl() + "/auth/time")
      .map((response) => {
        console.log("Date Service Response : ", response);
        return response;
      });
  }

  public getToken(): string {
    console.log("AuthenticationService:getToken:");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // console.log("AuthenticationService: AuthToken : ===> ", currentUser && currentUser.token);
    return currentUser && currentUser.token;
  }

  public getUser(): string {
    console.log("AuthenticationService:getUser:");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // console.log("AuthenticationService: UserName : ===> ", currentUser && currentUser.username);
    return currentUser && currentUser.username;
  }

  public getTime(): string {
    console.log("AuthenticationService:getTime:");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // console.log("AuthenticationService: Time : ===> ", currentUser && currentUser.time);
    return currentUser && currentUser.time;
  }

  getReqTimeout(): number {
    console.log("AuthenticationService:getReqTimeout:");
    return this._appConfig.getReqTimeout() || 10000;
  }

  logout(): void {
    console.log("AuthenticationService:logout:");
    // clear token remove user from local storage to log user out
    this.token = null;
    this.userid = null;
    this.time = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("token");
    console.log("Auth Token : ===> ", localStorage.getItem("currentUser"));
  }

}
