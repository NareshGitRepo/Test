import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/operator/map';

import { IAllModules, IUser, IDepartment, IUserRole, IResponse, ICreateUser, IResActiveUser, ICreditType } from '../_model/usermodel';
import { Router } from '@angular/router';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { AppConfig } from '../../../_helpers/app.config';
import { ConsumerService } from '../../../_helpers/ConsumerService';


@Injectable({ providedIn: 'root' })
export class UserService {

  moduleId: number;

  public component = "Users";

  constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private router: Router, private appConfig: AppConfig,
    private consumer: ConsumerService) {
    this.moduleId = this.appConfig.getModuleId(this.router.url);
  }

  getAllModules(): Observable<IAllModules> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllModules")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumer.serviceConsumer<IAllModules>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
    } else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getAllModulesByRoleId(roleid: number): Observable<IAllModules> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllModulesByRoleId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      //console.log("URL Get from config : ---->  ", _apiUrl);
      let url = _apiurlsdetials.url.replace('{roleId}', roleid + '');
      return this.consumer.serviceConsumer<IAllModules>(url, _apiurlsdetials.type, null, '');
    } else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getCreditTypes(): Observable<ICreditType[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllCreditTypes")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ICreditType[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'creditTypes');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getAllUsers(): Observable<IUser[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllUsers")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumer.serviceConsumer<IUser[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'users');
    } else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  deleteUserStatus(userid: number): Observable<IResponse> {
    console.log(userid, status);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteUserStatus");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      const url = _apiurlsdetials.url.replace("{userid}", "" + userid);
      return this.consumer.serviceConsumer<IResponse>(url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getActiveDepartments(): Observable<IDepartment[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getActiveDepartments")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumer.serviceConsumer<IDepartment[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
    } else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getRolesByUserRoleId(): Observable<IUserRole[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRolesByUserRoleId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumer.serviceConsumer<IUserRole[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'userRoles');
    } else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  createUser(_addDetails: ICreateUser): Observable<IResponse> {
    console.log("updateDept:::", _addDetails);

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createUser")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _addDetails, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  resetPwdUser(userId): Observable<IResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "resetPassword");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      let url = _apiurlsdetials.url.replace('{userid}', userId);
      console.log("URL Get from config : ----> ", url);
      return this.consumer.serviceConsumer<IResponse>(url, _apiurlsdetials.type, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateUser(_updateDetails: ICreateUser): Observable<IResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateUser");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _updateDetails, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateUserStatus(userid: number, status: number): Observable<IResponse> {
    console.log(userid, status);

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateUserStatus");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      const url = _apiurlsdetials.url.replace("{userid}", "" + userid) + '?status=' + status;
      return this.consumer.serviceConsumer<IResponse>(url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }


  validateUserName(username: string): Observable<IResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateUserName");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { username: username }, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getUsersFromDirectory(username: string): Observable<IResActiveUser> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getUsersFromDirectoryByName")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{username}", username);
      return this.consumer.serviceConsumer<IResActiveUser>(_apiUrl, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}
