import * as _ from "lodash";

import { AppConfig, ILoginDtos, ITokenInfo, IUserUpdateDto } from "./app.config";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { _localeFactory } from "@angular/core/src/application_module";

@Injectable({ providedIn: 'root' })
export class ConsumerService {

    tokenInfo: ITokenInfo;
    loginDtos: ILoginDtos;
    loginInfo: IUserUpdateDto

    constructor(private http: HttpClient, private appConfig: AppConfig, private router: Router) {
    }

    serviceConsumer<T>(url: string, methodType: string, body: any,
        returnFilter: string = '', Posttype: number = 0): Observable<T> {
        // if (body != null) {
        //     console.log("badJson=>", _.map(body, function (value) {
        //         if (typeof value === 'string') {
        //             return value.trim();
        //         }
        //         else
        //             return value;
        //     }));
        // }
        console.log('body => ',body);
        if (body != null) {
          body = JSON.parse(JSON.stringify(body).replace(/"\s+|\s+"/g,'"')) ;
          console.log('body after trim =>',body);
        }
        this.tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
        if (this.tokenInfo) {

            console.log("URL Get from config :=>1", url, JSON.parse(this.tokenInfo.tokenInfo.sub));
            let newLoginDtos: ILoginDtos
            this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
            this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
        }
        else {
            this.router.navigate(['401']);
            return Observable.throw({ error: { messages: "you are not authorized to view this page" }, status: 401 });
        }
        if (this.tokenInfo && this.loginDtos && this.loginInfo) {
            const httpOptions = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    "Authorization": this.tokenInfo.tokenKey,
                })
            };
            console.log('role===>', this.loginInfo.roles[0].roleId, this.loginInfo);

            //   url = url.replace('{userid}', this.loginDtos.userid + '').replace('{login-userid}', this.loginDtos.userid + '').replace("{CurrentRoleid}", this.loginDtos.roleId + "")
            let orgId = (this.loginInfo as any).orgId ? (this.loginInfo as any).orgId : 0;
            let deptId = 0;//(this.loginInfo.depts as any).length > 0 ? (this.loginInfo as any).departments[0].deptId : 0;
            let floorId=this.loginInfo.levelId? this.loginInfo.levelId:0;
            url = url.replace('{loginid}', this.loginInfo.userId + '').replace('{roleid}', this.loginInfo.roles[0].roleId + '').replace("{orgid}", orgId + '').replace("{clientid}", orgId + '').replace("{parentid}", orgId + "").replace("{deptid}", deptId + "").replace("{floorId}", floorId+'' );
            if (url.includes('{loginid}'))
                url = url.replace('{loginid}', this.loginInfo.userId + '');
            console.log("URL Get from config :=>123", url, orgId);

            if (methodType === 'GET') {
                let optionsdata = {
                    params: body,
                    headers: httpOptions.headers
                };
                return this.http.get<T>(url, optionsdata).map((data) => returnFilter != '' ? data[returnFilter] : data);
            }

            else if (methodType === "PUT") {
                if (Posttype == 0)
                    return this.http.put<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
                else {
                    if (httpOptions.headers.get('Content-Type') != null)
                        httpOptions.headers = httpOptions.headers.delete("Content-Type");
                    return this.http.put<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
                }
            }
            else if (methodType === "POST") {
                if (Posttype == 0)
                    return this.http.post<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
                else {
                    if (httpOptions.headers.get('Content-Type') != null)
                        httpOptions.headers = httpOptions.headers.delete("Content-Type");
                    return this.http.post<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
                }
            }
            else if (methodType === "DELETE") {
                let optionsdata = {
                    params: body,
                    headers: httpOptions.headers
                };
                return this.http.delete<T>(url, optionsdata).map((data) => returnFilter != '' ? data[returnFilter] : data);
            }
        } else {
            this.router.navigate(['401']);
            return Observable.throw({ error: { messages: "you are not authorized to view this page" }, status: 401 });
        }
    }
    serviceConsumerWithOutTokenHeader<T>(url: string, methodType: string, body: any,
        returnFilter: string = '', Posttype: number = 0): Observable<T> {
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            })
        };
        if (methodType === 'GET') {
            let optionsdata = {
                params: body,
                headers: httpOptions.headers
            };
            return this.http.get<T>(url, optionsdata).map((data) => returnFilter != '' ? data[returnFilter] : data);
        }

        else if (methodType === "PUT") {
            if (Posttype == 0)
                return this.http.put<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
            else {
                if (httpOptions.headers.get('Content-Type') != null)
                    httpOptions.headers = httpOptions.headers.delete("Content-Type");
                return this.http.put<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
            }
        }
        else if (methodType === "POST") {
            if (Posttype == 0)
                return this.http.post<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
            else {
                if (httpOptions.headers.get('Content-Type') != null)
                    httpOptions.headers = httpOptions.headers.delete("Content-Type");
                return this.http.post<T>(url, body, httpOptions).map(data => returnFilter != '' ? data[returnFilter] : data);
            }
        }
        else if (methodType === "DELETE") {
            let optionsdata = {
                params: body,
                headers: httpOptions.headers
            };
            return this.http.delete<T>(url, optionsdata).map((data) => returnFilter != '' ? data[returnFilter] : data);
        }

    }
    serviceConsumerWithOptions<T>(url: string, methodType: string, body: any, returnFilter: string, httpOption?: any): Observable<T> {
        this.tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
        console.log('this.tokenInfo=>', this.tokenInfo);
        if (this.tokenInfo) {

            // console.log("URL Get from config :=>1", url, JSON.parse(this.tokenInfo.tokenInfo.sub));
            let newLoginDtos: ILoginDtos
            this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
            this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
        }
        else {
            this.router.navigate(['401']);
            return Observable.throw({ error: { messages: "you are not authorized to view this page" }, status: 401 });
        }
        if (this.tokenInfo && this.loginDtos && this.loginInfo) {

            let httpOptions = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    "Authorization": this.tokenInfo.tokenKey,
                })
            };
            httpOptions = httpOption ? httpOption : httpOptions;
            let orgId = (this.loginInfo as any).orgId ? (this.loginInfo as any).orgId : 0;
            url = url.replace('{loginid}', this.loginInfo.userId + '').replace('{roleid}', this.loginInfo.roles[0].roleId + '').replace("{orgid}", orgId + '').replace("{clientid}", orgId + '').replace("{parentid}", orgId + "")
            if (url.includes('{loginid}'))
                url = url.replace('{loginid}', this.loginInfo.userId + '');
            if (httpOptions.headers.get('Authorization') == null) {
                httpOptions.headers = httpOptions.headers.append("Authorization", this.tokenInfo.tokenKey);
            }
            console.log("URL Get from config :=>1", url, this.tokenInfo, httpOptions);
            if (methodType === 'GET') {
                return this.http.get<T>(url, {
                    params: body,
                    headers: httpOptions.headers
                }).map((data) => returnFilter != '' ? data[returnFilter] : data);
            }
            else if (methodType === "PUT") {
                return this.http.put<T>(url, body, httpOptions).map((data) => returnFilter != '' ? data[returnFilter] : data);
            }
            else if (methodType === "POST") {
                return this.http.post<T>(url, body, httpOptions).map((data) => returnFilter != '' ? data[returnFilter] : data);
            }
        } else {
            this.router.navigate(['401']);
            return Observable.throw({ error: { messages: "you are not authorized to view this page" }, status: 401 });
        }
    }
    serviceConsumerWithObserve<T>(url: string, methodType: string): Observable<HttpResponse<T>> {
        this.tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
        if (this.tokenInfo) {
            // console.log("URL Get from config :=>1", url, this.tokenInfo);
            let newLoginDtos: ILoginDtos
            this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
            //  console.log("URL Get from config :=>1", url, this.tokenInfo);
        }
        else {
            this.router.navigate(['401']);
            return Observable.throw({ error: { messages: "you are not authorized to view this page" }, status: 401 });
        }
        if (this.tokenInfo && this.loginDtos) {

            let httpOptions = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    "Authorization": this.tokenInfo.tokenKey,
                })
            };
            let orgId = (this.loginInfo as any).orgId ? (this.loginInfo as any).orgId : 0;
            url = url.replace('{loginid}', this.loginInfo.userId + '').replace('{roleid}', this.loginInfo.roles[0].roleId + '').replace("{orgid}", orgId + '').replace("{clientid}", orgId + '').replace("{parentid}", orgId + "")

            if (httpOptions.headers.get('Authorization') == null) {
                httpOptions.headers = httpOptions.headers.append("Authorization", this.tokenInfo.tokenKey);
            }
            //    console.log("URL Get from config :=>1", url, this.tokenInfo,httpOptions);
            if (methodType === 'GET') {
                return this.http.get(url, { observe: 'response', headers: httpOptions.headers }).map((res: HttpResponse<T>) => res);
            }
        } else {
            this.router.navigate(['401']);
            return Observable.throw({ error: { messages: "you are not authorized to view this page" }, status: 401 });
        }
    }

    serviceConsumerWithOutToken<T>(url: string, methodType: string): Observable<HttpResponse<T>> {

        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": this.tokenInfo.tokenKey,
            })
        };
        if (methodType === 'GET') {
            return this.http.get(url, { observe: 'response', headers: httpOptions.headers }).map((res: HttpResponse<T>) => res);
        }

    }
}

// export interface Department {
//     deptId: number;
//     deptName: string;
// }

// export interface Organization {
//     orgId: number;
//     organization: string;
// }

// export interface IUserUpdateDto {
//     contactNo: string;
//     departments: Department[];
//     firstname: string;
//     isactive: number;
//     lastname: string;
//     login: string;
//     organizations: Organization[];
//     roles: IRole[];
//     userId: number;
// }
// export interface IRole {
//     roleDescription: string;
//     roleId: number;
//     roleName: string;
// }
// export interface ITokenInfo {
//     tokenKey: string;
//     tokenInfo: any;
// }
// export interface ILoginDtos {
//     sub: string;
//     roleId: number;
//     userid: number;
//     iat: number;
//     hash: string;
//     username: string;
// }
