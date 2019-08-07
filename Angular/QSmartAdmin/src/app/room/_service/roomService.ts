import { ICreateRoom, IDeleteData, IRoom, IRoomManagementList, IRoomResponse, IRoomTypeInfo, IRoomsList, IUpdateRooms, Level, RoomType } from '../_model/roomModel';

import { ConsumerService } from '../../_helpers/ConsumerService';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    public component = "RoomManagement";
    constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    updateRooms(roomDetails: IUpdateRooms): Observable<IRoomResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateRooms");
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
   
    getRoomsByFloorId(floorId): Observable<IRoomTypeInfo[]> {
      let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRoomsByFloorId")
      console.log("URL Get from config : =====>  ", _apiurlsdetials);
      if (_apiurlsdetials) {
          console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
          let _apiUrl = _apiurlsdetials.url.replace("{floorid}", floorId);
          return this.consumer.serviceConsumer<IRoomTypeInfo[]>(_apiUrl, _apiurlsdetials.type, null, 'roomsInfo');
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
