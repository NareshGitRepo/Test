import { Floor, IClients, ICreateDepartments, ICreateUsers, IDepartements, IDoctorList, IGetUser, IGroups, IHospitals, IMDepartment, IMapNurse, IResActiveUser, IRoles, IUser, IUserResponse } from '../_model/IUsers';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConsumerService } from '../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    public component = "Users";

    getClientsInfo(): Observable<IClients[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCorporates")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IClients[]>(_apiUrl, _apiurlsdetials.type, null, 'orgs');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getGroupsInfo(): Observable<IGroups[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsByParentId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            return this.consumer.serviceConsumer<IGroups[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'groups');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    // getFloorsWithDeptsAndDoctorsByFacilitateId():Observable<IDLevelList[]>{
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFloorsWithDeptsAndDoctorsByFacilitateId")
    //     console.log("URL Get from config : =====>  ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IDLevelList[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'floors');
    //     }
    //     else {
    //         console.log("URL Get from config : ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }
    getHospitalsInfo(): Observable<IHospitals[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFacilitiesByClientId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IHospitals[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'hospitals');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getDoctorsByMultipleDepartments(deptids):Observable<IDoctorList[]>{
        console.log("depts id array:::::",deptids);

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDoctorsByMultipleDepartments")
        console.log("URL Get from config for doctors list : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IDoctorList[]>(_apiurlsdetials.url, _apiurlsdetials.type, deptids, 'doctors');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
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
    isLogInIdExits(username: string): Observable<IUserResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "isLogInIdExits")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IUserResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { username: username });
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getDepartementsInfo(value?:number): Observable<IDepartements[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDepartmentsByFacilitateId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            let _apiUrl =value ? _apiurlsdetials.url.replace('{clientid}',value+''):_apiurlsdetials.url;
            console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<IDepartements[]>(_apiUrl, _apiurlsdetials.type, null, 'departmentGetDto');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getRolesByUserRoleId(): Observable<IRoles[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRolesByUserRoleId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url
            return this.consumer.serviceConsumer<IRoles[]>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getDoctorsByDeptId(deptData:string): Observable<IUser[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllDoctorsByDepts")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config for doctorslist: ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace("{deptid}",deptData)
            return this.consumer.serviceConsumer<IUser[]>(_apiUrl, _apiurlsdetials.type, null, 'doctors');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createUser(addDetails: ICreateUsers): Observable<IUserResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createUser");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IUserResponse>(_apiurlsdetials.url, _apiurlsdetials.type, addDetails);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getFloorsInfo():Observable<Floor[]>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFloorsWithDeptsByFacilitateId")
        console.log("URL Get from config for levels : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config for levels: ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<Floor[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'floors');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateUser(editDetails: ICreateUsers): Observable<IUserResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateUser");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IUserResponse>(_apiurlsdetials.url, _apiurlsdetials.type, editDetails);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateUserStatus(userId:number,status:number): Observable<IUserResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateUserStatus");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            let url=_apiurlsdetials.url.replace("{userId}",userId+'').replace("{status}",status+'');
            console.log("URL Get from config : ----> ", url);
            return this.consumer.serviceConsumer<IUserResponse>(url, _apiurlsdetials.type,null, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    mapNurseDoctors(mapDetails: IMapNurse): Observable<IUserResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "mapNurseDoctors");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IUserResponse>(_apiurlsdetials.url, _apiurlsdetials.type, mapDetails);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    resetPassword(userid:number): Observable<IUserResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "resetPassword");
        console.log("URL Get from config : =====> ", _apiurlsdetials);

        if (_apiurlsdetials) {
            let _apiUrl = _apiurlsdetials.url.replace('{userid}',userid+'');
            console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<IUserResponse>(_apiUrl, _apiurlsdetials.type, null);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


getUsersById():Observable<IGetUser[]>{
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllUsers")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        let _apiUrl = _apiurlsdetials.url

        return this.consumer.serviceConsumer<IGetUser[]>(_apiUrl, _apiurlsdetials.type, null, 'users');
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

deleteUserByid(deleteid: any) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteUser")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        let _apiUrl = _apiurlsdetials.url.replace("{delete-userid}",deleteid);
        return this.consumer.serviceConsumer<IUserResponse>(_apiUrl, _apiurlsdetials.type, null);
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

// getRoomsByFloorId(floorId): Observable<IRoomManagementList[]> {
//     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRoomsByFloorId")
//     console.log("URL Get from config : =====>  ", _apiurlsdetials);
//     if (_apiurlsdetials) {
//         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
//         let _apiUrl = _apiurlsdetials.url.replace("{floorid}", floorId);
//         return this.consumer.serviceConsumer<IRoomManagementList[]>(_apiUrl, _apiurlsdetials.type, null, 'rooms');
//     }
//     else {
//         console.log("URL Get from config : ---->  ", "Url not found..");
//         return Observable.throw({ error: { messages: "url not found" } });
//     }
// }
getlevelsDeptSeviceInfo(): Observable<Floor[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFloorsWithDeptsByFacilitateId");
    if (_apiurlsdetials) {
        console.log("DevicesService: getlevelsDeptSeviceInfo: ---->  ", _apiurlsdetials);
        return this.consumer.serviceConsumer<Floor[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'floors');
    } else {
        console.log("DevicesService: getlevelsDeptSeviceInfo: ---->  ", "Url not found..");
        return Observable.throw({ error: { message: "url not found" } });
    }
}
getDeptSeviceInfo(userId): Observable<IMDepartment[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDeptAndServicesByUserId");
    if (_apiurlsdetials) {
        console.log("DevicesService: getlevelsDeptSeviceInfo: ---->  ", _apiurlsdetials);
        let _apiUrl = _apiurlsdetials.url.replace("{userid}", userId);
        return this.consumer.serviceConsumer<IMDepartment[]>(_apiUrl, _apiurlsdetials.type, null, 'departments');
    } else {
        console.log("DevicesService: getlevelsDeptSeviceInfo: ---->  ", "Url not found..");
        return Observable.throw({ error: { message: "url not found" } });
    }
}
CreateManualDepartment(deptData: ICreateDepartments): Observable<IUserResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "manualDeptAndServiceMap")
    console.log("URL Get from config for doctors list : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        return this.consumer.serviceConsumer<IUserResponse>(_apiurlsdetials.url, _apiurlsdetials.type, deptData);
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

validateDoctorSegment(drSegmentId: string): Observable<IUserResponse> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateDoctorSegment")
  console.log("URL Get from config for doctors list : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IUserResponse>(_apiurlsdetials.url, _apiurlsdetials.type, {drSegmentId:drSegmentId}, '');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}
isRoleEditable(loginid): Observable<IUserResponse> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "isRoleEditable")
  console.log("URL Get from config for doctors list : =====>  ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{loginId}", loginid);
      return this.consumer.serviceConsumer<IUserResponse>(_apiUrl, _apiurlsdetials.type, null, '');
  }
  else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
  }
}
}
