import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";


@Injectable({ providedIn: 'root' })
export class ConsumerService {

    tokenInfo: ITokenInfo;
    loginDtos: ILoginDtos;

    constructor(private http: HttpClient, private translate: TranslateService) {
    }

    serviceConsumer<T>(url: string, methodType: string, body: any,
        returnFilter: string = '', Posttype: number = 0): Observable<T> {

        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept-Language": this.translate.currentLang
                // "Authorization": this.tokenInfo.tokenKey,
            })
        };

        console.log("URL :", url,httpOptions);

        if (methodType === 'GET') {
            let optionsdata = {
                params: body,
                headers: httpOptions.headers
            };
            if (returnFilter != "") {
                return this.http.get<T>(url, optionsdata).map((data) => data[returnFilter]);
            }
            else {
                return this.http.get<T>(url, optionsdata).map((data) => data);
            }
        }

        else if (methodType === "PUT") {
            if (Posttype == 0)
                return this.http.put<T>(url, body, httpOptions).map(data => data);
            else {
                if (httpOptions.headers.get('Content-Type') != null)
                    httpOptions.headers = httpOptions.headers.delete("Content-Type");
                return this.http.put<T>(url, body, httpOptions).map(data => data);
            }
        }
        else if (methodType === "POST") {
            if (Posttype == 0)
                return this.http.post<T>(url, body, httpOptions).map(data => data);
               else if (Posttype == 2)
               {
                   console.log("111111111111");
                   
                return this.http.post<T>(url, body);
               }
            else {
                if (httpOptions.headers.get('Content-Type') != null)
                    httpOptions.headers = httpOptions.headers.delete("Content-Type");
                return this.http.post<T>(url, body, httpOptions).map(data => data);
            }
        }
        else if (methodType === "DELETE") {
            let optionsdata = {
                params: body,
                headers: httpOptions.headers
            };
            return this.http.delete<T>(url, optionsdata).map(data => data);
        }

    }
    serviceConsumerWithOptions<T>(url: string, methodType: string, body: any, returnFilter: string, httpOption?: any): Observable<T> {

        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                // "Authorization": this.tokenInfo.tokenKey,
            })
        };
        httpOptions = httpOption ? httpOption : httpOptions;
        url = url.replace('{userid}', 1 + '')

        if (methodType === 'GET') {
            if (returnFilter != "") {
                return this.http.get<T>(url, {
                    params: body,
                    headers: httpOptions.headers
                }).map((data) => data[returnFilter]);
            }
            else {
                return this.http.get<T>(url, {
                    params: body,
                    headers: httpOptions.headers
                }).map((data) => data);
            }
        }
        else if (methodType === "PUT") {
            return this.http.put<T>(url, body, httpOptions).map(data => data);
        }
        else if (methodType === "POST") {
            return this.http.post<T>(url, body, httpOptions).map(data => data);
        }

    }
    serviceConsumerWithObserve<T>(url: string, methodType: string): Observable<HttpResponse<T>> {
        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                // "Authorization": this.tokenInfo.tokenKey,
            })
        };
        url = url.replace('{userid}', 1 + '')

        if (methodType === 'GET') {
            return this.http.get(url, { observe: 'response', headers: httpOptions.headers }).map((res: HttpResponse<T>) => res);
        }
    }
}

export interface Department {
    deptId: number;
    deptName: string;
}

export interface Organization {
    orgId: number;
    organization: string;
}

export interface IUserUpdateDto {
    contactNo: string;
    departments: Department[];
    firstname: string;
    isactive: number;
    lastname: string;
    login: string;
    organizations: Organization[];
    roles: IRole[];
    userId: number;
}
export interface IRole {
    roleDescription: string;
    roleId: number;
    roleName: string;
}
export interface ITokenInfo {
    tokenKey: string;
    tokenInfo: any;
}
export interface ILoginDtos {
    sub: string;
    roleId: number;
    userid: number;
    iat: number;
    hash: string;
    username: string;
}