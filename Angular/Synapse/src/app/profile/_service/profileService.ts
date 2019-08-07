import { Injectable } from '@angular/core';
import { IProfileResponse, IChangePassword } from '../_model/profileModel';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ProfileService {

  public component = "Profile";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  updateProfileById(editDetails): Observable<IProfileResponse> {
    console.log("editDetails :: ", editDetails);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateProfileById");
    console.log("URL Get from updateProfile : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from updateProfile : ----> ", _apiurlsdetials.url);

      const url = _apiurlsdetials.url.replace("{userid}", "" + editDetails.userId);
      return this.consumer.serviceConsumer<IProfileResponse>(url, _apiurlsdetials.type, editDetails);
    }
    else {
      console.log("URL Get from updateProfile : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  changePassword(cPassword: IChangePassword): Observable<IProfileResponse> {

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "changePassword");
    console.log("URL Get from updatePassword : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from updatePassword : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IProfileResponse>(_apiurlsdetials.url, _apiurlsdetials.type, cPassword, '');
    }
    else {
      console.log("URL Get from updatePassword : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateUserApiKey(): Observable<IProfileResponse> {

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateUserApiKeyInDb");
    console.log("URL Get from updatePassword : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from updatePassword : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IProfileResponse>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from updatePassword : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}