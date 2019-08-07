import { ConsumerService } from '../../_helpers/ConsumerService';
import { IProfileResponse } from '../_model/profile.model';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public component = "Profile";

  constructor( private apiUrls: LoadApiUrls,private consumer: ConsumerService) { }

  updateProfileById(editDetails):Observable<IProfileResponse>{
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
  changePassword(data):Observable<IProfileResponse>{
    console.log("data :: ", data);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "changePassword");
    console.log("URL Get from updatePassword : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from updatePassword : ----> ", _apiurlsdetials.url);
        const url = _apiurlsdetials.url;//.replace("{userid}", data.userId);// +"?oldpswd="+data.oldpswd+"&newpswd="+data.newpswd;
       // const url2 = url.replace("{userid}", data.userId) +"?oldpswd="+data.oldpswd+"&newpswd="+data.newpswd;
       // console.log("url 22222 ::"+url2);
        // { oldpswd : data.oldpswd, newpswd : data.newpswd}
        return this.consumer.serviceConsumer<IProfileResponse>(url, _apiurlsdetials.type, {oldpswd:data.oldpswd,newpswd:data.newpswd},'');
    }
    else {
        console.log("URL Get from updatePassword : ----> ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}
