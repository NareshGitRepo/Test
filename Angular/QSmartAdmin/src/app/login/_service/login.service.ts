import { HttpClient, HttpResponse } from '@angular/common/http';
import { ILogIn, logoutResponse } from '../_model/login';

import { ConsumerService } from '../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  Success:any;
  Failed:any;
  constructor(private http: HttpClient, private loadApiUrls: LoadApiUrls,private consumer: ConsumerService ) { }

  login(login: ILogIn): Observable<HttpResponse<any>> {

    console.log("LogIn Data=>" , this.loadApiUrls.getBaseApiUrls(),JSON.stringify(login));

      return this.http.post(this.loadApiUrls.getBaseApiUrls() + '/auth/login', login,{ observe: 'response' }).timeout(60000).map((res: HttpResponse<any>) =>res);
}
autologin(login: ILogIn): Observable<HttpResponse<any>> {

  console.log("LogIn Data=>" , this.loadApiUrls.getBaseApiUrls(),JSON.stringify(login));

    return this.http.post(this.loadApiUrls.getBaseApiUrls() + '/auth/icislogin', {login:login.login},{ observe: 'response' }).timeout(60000).map((res: HttpResponse<any>) =>res);
}
logout():Observable<logoutResponse> {
  let _apiurlsdetials = this.loadApiUrls.getApiServiceUrlByComponentAndMethod('Auth', "authLogOut")
  console.log("URL Get from config : =====> ", _apiurlsdetials);
  if (_apiurlsdetials) {
  console.log("URL Get from config : ----> ", _apiurlsdetials.url);

  return this.consumer.serviceConsumer<logoutResponse>(_apiurlsdetials.url, _apiurlsdetials.type, null, "");
  }
  else {
  console.log("URL Get from config : ----> ", "Url not found..");
  return Observable.throw({ error: { messages: "url not found" } });
  }
  }
// login1(): Observable<HttpResponse<any>> {
//         let url='http://192.168.7.65:2323/printer?tokenType=99&tokenid=34&name=testing&department=department';
//   console.log("LogIn Data=>" , url);

//     return this.http.get(url,{ observe: 'response', }).timeout(10000).map((res: HttpResponse<any>) =>res);
// }
}
