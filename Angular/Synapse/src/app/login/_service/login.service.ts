import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { ILogIn, logoutResponse, IChangePassword, IChangeResponse } from '../_models/login';
import { userType, ICredit } from '../../_helpers/app.config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private http: HttpClient, private loadApiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  login(login: ILogIn): Observable<HttpResponse<any>> {

    console.log("LogIn Data=>", this.loadApiUrls.getBaseApiUrls() + '/auth/login', JSON.stringify(login));

    return this.http.post(this.loadApiUrls.getBaseApiUrls() + '/auth/login', login, { observe: 'response' }).timeout(60000).map((res: HttpResponse<any>) => res);
  }

  logout(): Observable<logoutResponse> {
    let _apiurlsdetials = this.loadApiUrls.getApiServiceUrlByComponentAndMethod('Auth', "authLogOut")
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);

      return this.consumer.serviceConsumer<logoutResponse>(_apiurlsdetials.url, _apiurlsdetials.type, null, "");
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getApprovals(_rolecode: string): Observable<any> {
    let _apiurlsdetials = this.loadApiUrls.getApiServiceUrlByComponentAndMethod('CheckerData', userType.NormalUser == _rolecode ? 'getAllCheckerDataByRoleId' : (userType.DepartementAdmin == _rolecode ? 'getAllCheckerDataByRoleId' : "getAllCheckerData"))
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<any>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'checkerData');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  changePassword(cPassword: IChangePassword): Observable<IChangeResponse> {

    let _apiurlsdetials = this.loadApiUrls.getApiServiceUrlByComponentAndMethod('Auth', "updateUserPassword");
    console.log("URL Get from updatePassword : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from updatePassword : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IChangeResponse>(_apiurlsdetials.url, _apiurlsdetials.type, cPassword, '');
    }
    else {
      console.log("URL Get from updatePassword : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getCreditCount(): Observable<ICredit> {
    let _apiurlsdetials = this.loadApiUrls.getApiServiceUrlByComponentAndMethod('Profile', "getUserCreditsByUserId")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ICredit>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}

