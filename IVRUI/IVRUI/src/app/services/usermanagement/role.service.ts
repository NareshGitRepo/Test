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
import { Role } from "../../beans/usermanagement/role";

import * as jwt_decode from "jwt-decode";

@Injectable()
export class RoleService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService, private _appConfig: AppConfig) { }

    getRoleName(roleName: string) {
      console.log("RoleService:getRoleName : ", roleName);
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "text/plain",
        })
      };
     
      console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/validaterolename");
      return this.http.post<any>(this._appConfig.getServiceUrl() + "/validaterolename", roleName, httpOptions)
        .map((response) => {
          console.log("Service Response : ", response);
          return response;
        });
    }
 
    getRoleInfo(): Observable<Role[]> {

    console.log("RoleService:getRoleInfo");
    // console.log("RoleService: Token: ----->>> ", this.authService.token);
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //     timeout: `${this.authService.getReqTimeout()}`,
    //     "Authorization": "Bearer " + this.authService.token
    //   })
    // };

    // const body = {
    //   "loginuserid": this.authService.userid
    // };

    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/roles");
    return this.http.get<any>(this._appConfig.getServiceUrl() + "/roles")
      // return this.http.post<any>(this._appConfig.getServiceUrl() + "/ops/role", body, httpOptions)
      .map((response) => {
        console.log("Role Response : ", response);
        return response;
      });
  }

  public getResults(page: Page, role: Role[]): Observable<PagedData<Role>> {
    console.log("RoleService:getResults:");
    return Observable.of(role).map(data => this.getPagedData(page, role));
  }

  private getPagedData(page: Page, role: Role[]): PagedData<Role> {
    console.log("RoleService:getPagedData:");
    const pagedData = new PagedData<Role>();
    page.totalElements = role.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    // console.log("End : ----> ", end);
    // console.log("Page Obj : ----> ", page);
    for (let i = start; i < end; i++) {
      const jsonObj = role[i];
      // const inQInfo = new Role(jsonObj.status, jsonObj.rolesList);
      const inQInfo = new Role(jsonObj.roleId, jsonObj.roleName, jsonObj.createdBy, jsonObj.updatedBy);
      pagedData.data.push(inQInfo);
    }
    pagedData.page = page;
    return pagedData;
  }

  addRemoveService(rolename: string, action: string) {
    console.log("RoleService:addRemoveService:");
    console.log("RoleName : ", rolename, " && Action : ", action);
    // console.log("RoleService: Token: ----->>> ", this.authService.token);
    // console.log("RoleService: Token: >>> ", sessionStorage.getItem('token'));
    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // timeout: `${this.authService.getReqTimeout()}`,
        "Authorization": "Bearer " + this.authService.token
      })
    };
    const roleObj = {
      "roleName": rolename,
      "actionType": action,
      "createdBy": jsonObj.id,
    };

    const body = {
      "actionType": action,
      "role": roleObj
    };

    //console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/role/action");
    //return this.http.post<any>(this._appConfig.getServiceUrl() + "/role/action", body, httpOptions)
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/updaterole");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/updaterole", body, httpOptions)
      .map((response) => {
        console.log("RoleService ::: response ==> ", response);
        return response;
      });
  }


  updateService(id: string, rolename: string, action: string) {
    console.log("RoleService:updateService:");
    console.log("RoleName : ", rolename, " && Action : ", action);
    // console.log("RoleService: Token: >>> ", sessionStorage.getItem('token'));
    const tokenPayload = jwt_decode(sessionStorage.getItem('token'));
    // console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // timeout: `${this.authService.getReqTimeout()}`
        // "Authorization": "Bearer " + this.authService.token
      })
    };
    const roleObj = {
      "roleId": id,
      "roleName": rolename,
      "actionType": action,
      "updatedBy": jsonObj.id
    };

    const body = {
      "actionType": action,
      "role": roleObj
    };

    //console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/role/action");
    //return this.http.post<any>(this._appConfig.getServiceUrl() + "/role/action", body, httpOptions)
    console.log("URL from config : ---->  ", this._appConfig.getServiceUrl() + "/updaterole");
    return this.http.post<any>(this._appConfig.getServiceUrl() + "/updaterole", body, httpOptions)
      .map((response) => {
        console.log("RoleService ::: response ==> ", response);
        return response;
      });
  }

}
