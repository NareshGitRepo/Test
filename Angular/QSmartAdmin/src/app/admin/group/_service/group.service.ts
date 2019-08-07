import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGroupResponse, GroupInsert, IGroupList, HospitalList, } from '../_model/group.model';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { HttpClient } from '@angular/common/http';
import { ConsumerService } from '../../../_helpers/ConsumerService';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  public component = "Group";

  constructor(private apiUrls: LoadApiUrls, private http: HttpClient, private consumer: ConsumerService) { }

  getGroupsByParentId(): Observable<IGroupList[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsByParentId")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials.url);

    if (_apiurlsdetials) {
      console.log("GroupService: getGroupsByParentId: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<IGroupList[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'groups', 0);
    } else {
      console.log("GroupService: getGroupsByParentId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }

  }

  getFacilitiesByClientId() {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFacilitiesByClientId");
    console.log("GroupService: getFacilitiesByClientId ::::::::", _apiurlsdetials);

    if (_apiurlsdetials) {
      console.log("GroupService URl:: getFacilitiesByClientId: ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<any>(_apiurlsdetials.url, _apiurlsdetials.type, null, '', 0);
    } else {
      console.log("GroupService:: getFacilitiesByClientId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getFacilitiesByGroupId(groupid) {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFacilitiesByGroupId");

    if (_apiurlsdetials) {
      console.log("GroupService:: getFacilitiesByGroupId: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<any>(_apiurlsdetials.url.replace("{groupid}", groupid), _apiurlsdetials.type, null, '', 0);
    } else {
      console.log("GroupService:: getFacilitiesByGroupId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }

  }

  createGroup(group): Observable<IGroupResponse> {

    console.log("group =>", JSON.stringify(group));
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createGroup")
    if (_apiurlsdetials) {
      console.log("GroupService:: createGroup ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IGroupResponse>(_apiurlsdetials.url, _apiurlsdetials.type, group);
    } else {
      console.log("GroupService:: createGroup  ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }

  }

  updateGroup(group): Observable<IGroupResponse> {
    console.log("group =>", JSON.stringify(group));
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateGroup")
    if (_apiurlsdetials) {
      console.log("GroupService:: updateGroup : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<any>(_apiurlsdetials.url, _apiurlsdetials.type, group);
    } else {
      console.log("GroupService:: updateGroup : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }

  }
  statusUpdate(group) {

    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateGroupStatus");
    let url = _apiurlsdetials.url;
    url = url.replace("{groupid}", group.orgId) + "?satus=" + group.status;


    if (url) {
      console.log("URL Get from config : ---->  ", url);
      return this.consumer.serviceConsumer<any>(url, _apiurlsdetials.type, group);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  validateGroupName(groupName: string): Observable<IGroupResponse> {

    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateGroupName");
    if (_apiurlsdetials) {
      console.log("GroupService:: validateGroupName: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<any>(_apiurlsdetials.url.replace("{groupName}", groupName), _apiurlsdetials.type, null, '', 0);
    } else {
      console.log("GroupService:: validateGroupName: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }

  }
}
