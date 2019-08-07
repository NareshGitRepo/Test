import { Injectable } from "@angular/core";
import { IDepartment, IUpdateCredit, IUserResponse, UserGet } from "../_model/userquota.model";
import { LoadApiUrls } from "../../../_helpers/api.urls";
import { ConsumerService } from "../../../_helpers/ConsumerService";
import { Observable } from "rxjs";
import { userType } from "../../../_helpers/app.config";

@Injectable({ providedIn: 'root' })

export class UserQuotaService {

  public component = "UserQuota"

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  getAllDepartmentsWithUsers(_roleCode: string): Observable<IDepartment[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, _roleCode == userType.DepartementAdmin ? 'getAllDepartmentsWithUsers' : "getActiveDepartments")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<IDepartment[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
    }
  }
  getAllCredits(_roleCode: string): Observable<UserGet[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, _roleCode == userType.DepartementAdmin ? 'getAllUserCreditsbydeptid' : "getAllUserCredits")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<UserGet[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'users');
    } else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  updateUserCredit(updateData: IUpdateCredit): Observable<IUserResponse> {
    console.log("Service ===> ", JSON.stringify(updateData));
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateUserCredit");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IUserResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateData, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getAllUserCreditsByRoleId(): Observable<UserGet[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, 'getAllUserCreditsByRoleId')
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config1: ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<UserGet[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'users');
    } else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}