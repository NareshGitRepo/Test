import { Injectable } from '@angular/core';
import { Group, IDepartment, IGUpdate, IGCreate, IGroupResponse } from '../_model/groupmanagement.model';
import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';

@Injectable({ providedIn: 'root' })

export class GroupManagementService {

    public component = "GroupManagement";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
    }

    getAllGroups(): Observable<Group[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllGroups")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<Group[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'groups');
        } else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getActiveDepartments(): Observable<IDepartment[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllDepartments")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<IDepartment[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
        } else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getAllUsers(): Observable<any> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllUsers")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<any>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'users');
        } else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createGroup(groupData: IGCreate): Observable<IGroupResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createGroup")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<IGroupResponse>(_apiurlsdetials.url, _apiurlsdetials.type, groupData, '');
        } else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updateGroup(groupsForm): Observable<IGroupResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateGroup");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IGroupResponse>(_apiurlsdetials.url, _apiurlsdetials.type, groupsForm, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validateGroupName(groupName: string): Observable<IGroupResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateGroupName")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IGroupResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { groupName: groupName });
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updateStatus(status, groupid: number): Observable<IGroupResponse> {
        console.log("Status==>", status, groupid)
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateGroupStatus");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            let url = _apiurlsdetials.url + '?groupid=' + groupid + '&status=' + status;
            return this.consumer.serviceConsumer<IGroupResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteGroupStatus(groupid: number): Observable<IGroupResponse> {
        console.log(groupid, status);
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteGroup");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            const url = _apiurlsdetials.url.replace("{groupid}", "" + groupid);
            return this.consumer.serviceConsumer<IGroupResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
}