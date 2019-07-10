import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { IRoom, IRoomResponse, ICreateRoom, Level, RoomType, IRoomManagementList, IRoomsList, IUpdateRooms, IDeleteData } from '../_model/roomModel';


@Injectable({
    providedIn: 'root'
})
export class RoomService {

    public component = "RoomManagement";
    constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    // getHospitalsByGroupId(): Observable<IHospital[]> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getHospitalsByGroupId")
    //     console.log("URL Get from config : =====>  ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         let _apiUrl = _apiurlsdetials.url.replace("{loginid}", "1").replace("{groupid}", "54");
    //         return this.consumer.serviceConsumer<IHospital[]>(_apiUrl, _apiurlsdetials.type, { partytype: "3" }, 'hospitals');
    //     }
    //     else {
    //         console.log("URL Get from config : ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }

    // getDepartmentsByOrgId(): Observable<IDepartment[]> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDepartmentsByFacilitateId")
    //     console.log("URL Get from config : =====>  ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         let _apiUrl = _apiurlsdetials.url;
    //         return this.consumer.serviceConsumer<IDepartment[]>(_apiUrl, _apiurlsdetials.type, null, 'departmentGetDto');
    //     }
    //     else {
    //         console.log("URL Get from config : ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }


    // createDepartment(departmentForm): Observable<IDeptResponse> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createDepartment");
    //     console.log("URL Get from config : =====> ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ----> ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IDeptResponse>(_apiurlsdetials.url, _apiurlsdetials.type, departmentForm);
    //     }
    //     else {
    //         console.log("URL Get from config : ----> ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }

    // updateDepartment(departmentForm): Observable<IDeptResponse> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDepartment");
    //     console.log("URL Get from config : =====> ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ----> ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IDeptResponse>(_apiurlsdetials.url, _apiurlsdetials.type, departmentForm);
    //     }
    //     else {
    //         console.log("URL Get from config : ----> ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }

    // updateStatusByDeptId(dept: any): Observable<IDeptResponse> {
    //     console.log('dept=>', dept)
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateStatusByDeptId");
    //     console.log("URL Get from config : =====> ", _apiurlsdetials);
    //     let _apiUrl = _apiurlsdetials.url.replace("{deptid}", dept.deptId).replace("{status}", dept.status);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ----> ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IDeptResponse>(_apiUrl, _apiurlsdetials.type, '');
    //     }
    //     else {
    //         console.log("URL Get from config : ----> ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }

    // }

    // validateDepartmentName(deptname: string) {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateDepartmentName")
    //     console.log("URL Get from config : =====>  ", _apiurlsdetials);
    //     let _apiUrl = _apiurlsdetials.url.replace("{deptName}", deptname);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IDeptResponse>(_apiUrl, _apiurlsdetials.type, null, '');
    //     }
    //     else {
    //         console.log("URL Get from config : ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }

    // validateDeptPrefix(deptprefix: string): Observable<IDeptResponse> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateDeptPrefix")
    //     console.log("URL Get from config : =====>  ", _apiurlsdetials);
    //     let _apiUrl = _apiurlsdetials.url.replace("{deptPrefix}", deptprefix);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         return this.consumer.serviceConsumer<IDeptResponse>(_apiUrl, _apiurlsdetials.type, null, '');
    //     }
    //     else {
    //         console.log("URL Get from config : ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }



    updateRooms(roomDetails: IUpdateRooms): Observable<IRoomResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateRoomsAllow");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IRoomResponse>(_apiurlsdetials.url, _apiurlsdetials.type, roomDetails);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getLevelsByOrgId(): Observable<Level[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getLevelsByOrgId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

            return this.consumer.serviceConsumer<Level[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'levels');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getRoomTypes(): Observable<RoomType[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRoomTypes")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

            return this.consumer.serviceConsumer<RoomType[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'roomType');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getRoomTypesByLevelId(levelId): Observable<IRoomsList[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRoomTypesByLevelId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace("{levelId}", levelId);
            return this.consumer.serviceConsumer<IRoomsList[]>(_apiUrl, _apiurlsdetials.type, null, 'rooms');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }
    getRoomsByFloorId(floorId): Observable<IRoomManagementList[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRoomsByFloorId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace("{floorid}", floorId);
            return this.consumer.serviceConsumer<IRoomManagementList[]>(_apiUrl, _apiurlsdetials.type, null, 'rooms');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    createRoom(roomData: ICreateRoom): Observable<IRoomResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createRoomAllow");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IRoomResponse>(_apiurlsdetials.url, _apiurlsdetials.type, roomData);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    validateRoomNameinAb(roomname: string): Observable<IRoomResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateRoomNameinAb")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        let _apiUrl = _apiurlsdetials.url.replace("{roomname}", roomname);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IRoomResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validateRoomNameinEn(roomname: string): Observable<IRoomResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateRoomNameinEn")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        let _apiUrl = _apiurlsdetials.url.replace("{roomname}", roomname);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IRoomResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    deleteRooms(deletedata: IDeleteData): Observable<IRoomResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteRooms")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IRoomResponse>(_apiurlsdetials.url, _apiurlsdetials.type, deletedata, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


}
