import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { ICGlobalGroup, ISmartResponse, ICDeptGroup, IUserType, IContactGlobal, IContactDept, IContactUser, GroupsWithContactGlobal, GroupDept, ContactGroupUser, IDepartment, IUsersList, Department, IUpdateGlobalGroup, IUDeptGroup, IuserGroup, IUpdateGlobalContact, IUDeptContact, IuserContact } from '../_model/smartdirectort';
import { userType } from '../../../_helpers/app.config';


@Injectable({ providedIn: 'root' })

export class SmartDirectoryService {

    public component = "SmartDirectory";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
    }

    createContactGroupGlobal(globalgroup: ICGlobalGroup): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createContactGroupGlobal")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, globalgroup, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createContactGroupDept(deptgroup: ICDeptGroup): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createContactGroupDept")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, deptgroup, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createContactGroup(usergroup: IUserType): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createContactGroup")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, usergroup, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createContactGlobal(globalcontact: IContactGlobal): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createContactGlobal")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, globalcontact, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    createDepartmentContact(deptcontact: IContactDept): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createDepartmentContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, deptcontact, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createContactUser(globaluser: IContactUser): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createContactUser")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, globaluser, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    updateContactGroupGlobal(globaluserUpdate: IUpdateGlobalGroup): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateContactGroupGlobal")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, globaluserUpdate, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateContactGroupDept(deptuserUpdate: IUDeptGroup): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateContactGroupDept")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, deptuserUpdate, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateContactGroupUserInfo(globaluserUpdate: IuserGroup): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateContactGroupUserInfo")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, globaluserUpdate, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updateContactGlobal(globaluserUpdate: IUpdateGlobalContact): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateContactGlobal")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, globaluserUpdate, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateDepartmentContact(deptuserUpdate: IUDeptContact): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDepartmentContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, deptuserUpdate, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateContactUser(globaluserUpdate: IuserContact): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateContactUser")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, globaluserUpdate, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getActiveDepartments(): Observable<IDepartment[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getActiveDepartments")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<IDepartment[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getGroupsWithContactsByUserId(userid: number): Observable<IUsersList[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsWithContactsByUserId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{userid}", "" + userid);
            return this.consumer.serviceConsumer<IUsersList[]>(url, _apiurlsdetials.type, null, 'contactGroupUser');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getAllDepartmentsWithUsers(_roleCode: string): Observable<Department[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, _roleCode == userType.DepartementAdmin ? 'getAllDepartmentsWithUsers' : "getActiveDepartments")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<Department[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getAllGroupsWithContactsGlobal(): Observable<GroupsWithContactGlobal[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllGroupsWithContacts")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<GroupsWithContactGlobal[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'groupsWithContacts');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getAllGroupsWithContactsDept(deptid: number): Observable<GroupDept[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsWithContactsByDeptId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{deptid}", "" + deptid);
            return this.consumer.serviceConsumer<GroupDept[]>(url, _apiurlsdetials.type, null, 'groups');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getGroupsWithContactsUser(userid: number): Observable<ContactGroupUser[]> {
        // let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsWithContacts"); commented by jagan
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsWithContactsByUserId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{userid}", "" + userid);
            return this.consumer.serviceConsumer<ContactGroupUser[]>(url, _apiurlsdetials.type, null, 'contactGroupUser');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    deleteGlobalGroupWithContact(groupid: number):Observable<ISmartResponse>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteGlobalGroupWithContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{groupid}", "" + groupid);
            return this.consumer.serviceConsumer<ISmartResponse>(url, _apiurlsdetials.type, null,'' );
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteGobalContact(contactid: number): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteGobalContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{contactid}", "" + contactid);
            return this.consumer.serviceConsumer<ISmartResponse>(url, _apiurlsdetials.type, null, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteDeptGroupWithContact(groupid: number): Observable<ISmartResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteDeptGroupWithContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{groupid}", "" + groupid);
            return this.consumer.serviceConsumer<ISmartResponse>(url, _apiurlsdetials.type, null, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteDeptContact(contactid: number){
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteDeptContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{contactid}", "" + contactid);
            return this.consumer.serviceConsumer<ISmartResponse>(url, _apiurlsdetials.type, null, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteUserGroupWithContact(groupid: number):Observable<ISmartResponse>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteUserGroupWithContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{groupid}", "" + groupid);
            return this.consumer.serviceConsumer<ISmartResponse>(url, _apiurlsdetials.type, null, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        } 
    }

    deleteUserContact(contactid: number){
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteUserContact")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            const url = _apiurlsdetials.url.replace("{contactid}", "" + contactid);
            return this.consumer.serviceConsumer<ISmartResponse>(url, _apiurlsdetials.type, null, '');
        } else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createBulkContact(formData: FormData): Observable<ISmartResponse> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createBulkContacts")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ISmartResponse>(_apiurlsdetials.url, _apiurlsdetials.type, formData, '', 1);
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    // updateGroup(groupsForm): Observable<IGroupResponse> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateGroup");
    //     console.log("URL Get from config : =====> ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ----> ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IGroupResponse>(_apiurlsdetials.url, _apiurlsdetials.type, groupsForm, '');
    //     }
    //     else {
    //         console.log("URL Get from config : ----> ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }

    // validateGroupName(groupName: string): Observable<IGroupResponse> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateGroupName")
    //     console.log("URL Get from config : =====>  ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IGroupResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { groupName: groupName });
    //     }
    //     else {
    //         console.log("URL Get from config : ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }

}