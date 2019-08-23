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
import { User } from "../../beans/usermanagement/user";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class UserService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService, private _appConfig: AppConfig) { }


  getUserName(userName: string) {
    console.log("UserService:getUserName : ", userName);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "text/plain",
      })
    };
   
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/validateusername");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/validateusername", userName, httpOptions)
      .map((response) => {
        console.log("Service Response : ", response);
        return response;
      });
  }
  
  getUsersInfo(userName: string): Observable<User[]> {
    console.log("UserService:getUsersInfo");
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //     timeout: `${this.authService.getReqTimeout()}`
    //     // "Authorization": "Bearer " + this.authService.token
    //   })
    // };
    // const body = {
    //   "rolename": rolename
    // };
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/users");
    return this.http.get<any>(this._appConfig.getServiceUrl() + "/users")
      .map((response) => {
        console.log("User Response : ", response);
        return response;
      });
  }

  public getResults(page: Page, blockmessages: User[]): Observable<PagedData<User>> {
    console.log("UserService:getResults:");
    return Observable.of(blockmessages).map(data => this.getPagedData(page, blockmessages));
  }

  private getPagedData(page: Page, blockmessages: User[]): PagedData<User> {
    console.log("UserService:getPagedData:");
    const pagedData = new PagedData<User>();
    page.totalElements = blockmessages.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = blockmessages[i];
      const inQInfo = new User(jsonObj.userName, jsonObj.password, jsonObj.email, jsonObj.phoneNumber,
        jsonObj.status, jsonObj.roleId, jsonObj.role, jsonObj.id)
      pagedData.data.push(inQInfo);
    }
    pagedData.page = page;
    return pagedData;
  }

  addRemoveService(userName: string, password: string, role: string, email: string, phoneNumber: string, status: string, action: string) {
    console.log("UserService:addRemoveService:");
    console.log("Username : ", userName, " && Action : ", action);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // timeout: `${this.authService.getReqTimeout()}`,
        // "Authorization": "Bearer " + this.authService.token
      })
    };

    // console.log("UserService:addRemoveService: Token: >>> ", sessionStorage.getItem('token'));
    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    const userobj = {
      "userName": userName,
      "password": password,
      "roleId": role,
      "email": email,
      "phoneNumber": phoneNumber,
      "status": status,
      "createdBy": jsonObj.id,
    };
    const body = {
      "actionType": action,
      "user": userobj
    };
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/updateuser");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/updateuser", body, httpOptions)
      .map((response) => {
        console.log("UserService ::: response ==> ", response);
        return response;
      });
  }

  updateService(id: string, userName: string, password: string, role: string, email: string, phoneNumber: string, status: string, action: string) {
    console.log("UserService:updateService:");
    console.log("UserInfo : ", userName, password, role, email, phoneNumber, status, " && Action : ", action);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // timeout: `${this.authService.getReqTimeout()}`,
        // "Authorization": "Bearer " + this.authService.token
      })
    };

    // console.log("UserService:updateService: Token: >>> ", sessionStorage.getItem('token'));
    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    const userobj = {
      "id": id,
      "userName": userName,
      "password": password,
      "roleId": role,
      "email": email,
      "phoneNumber": phoneNumber,
      "status": status,
      "updateddBy": jsonObj.id,
    };
    const body = {
      "actionType": action,
      "user": userobj
    };
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/updateuser");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/updateuser", body, httpOptions)
      .map((response) => {
        // console.log("UserService ::: response ==> ", response);
        return response;
      });
  }
}
