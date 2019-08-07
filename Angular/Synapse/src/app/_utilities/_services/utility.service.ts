import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { LoadApiUrls } from "../../_helpers/api.urls";
import { ISender, IGlobalGroup, IDeptGroup, IUserGroup, ISmsCreate, ISmsResponse } from "../_models/sms.model";
import { ConsumerService } from "../../_helpers/ConsumerService";


@Injectable({ providedIn: 'root' })
export class UtilityService {

  componentSender: string = "Senders";

  constructor(private _ApiUrls: LoadApiUrls, private consumerService: ConsumerService) {
  }
  
  createSimpleSms(sms: ISmsCreate): Observable<ISmsResponse> {

    let _apiurlsdetials = this._ApiUrls.getApiServiceUrlByComponentAndMethod('Senders', "createSimpleSms")
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        return this.consumerService.serviceConsumer<ISmsResponse>(_apiurlsdetials.url, _apiurlsdetials.type, sms, '');
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

  getSenderInfo(): Observable<ISender[]> {
    let _apiurlsdetials = this._ApiUrls.getApiServiceUrlByComponentAndMethod('Senders', "SenderDetails")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumerService.serviceConsumer<ISender[]>(_apiUrl, _apiurlsdetials.type, null, 'senders');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getAllSenders(): Observable<ISender[]> {
    let _apiurlsdetials = this._ApiUrls.getApiServiceUrlByComponentAndMethod('Senders', "getAllSenders")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumerService.serviceConsumer<ISender[]>(_apiUrl, _apiurlsdetials.type, null, 'senders');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getAllGroupsWithContacts(): Observable<IGlobalGroup[]> {
    let _apiurlsdetials = this._ApiUrls.getApiServiceUrlByComponentAndMethod('simplesms', "getAllGroupsWithContacts")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumerService.serviceConsumer<IGlobalGroup[]>(_apiUrl, _apiurlsdetials.type, null, 'groupsWithContacts');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getGroupsWithContactsByDeptId(): Observable<IDeptGroup[]> {
    let _apiurlsdetials = this._ApiUrls.getApiServiceUrlByComponentAndMethod('simplesms', "getGroupsWithContactsByDeptId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumerService.serviceConsumer<IDeptGroup[]>(_apiUrl, _apiurlsdetials.type, null, 'groups');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }
  getGroupsWithContacts(): Observable<IUserGroup[]> {
    let _apiurlsdetials = this._ApiUrls.getApiServiceUrlByComponentAndMethod('simplesms', "getGroupsWithContacts");
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      //console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumerService.serviceConsumer<IUserGroup[]>(_apiUrl, _apiurlsdetials.type, null, 'contactGroupUser');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

}