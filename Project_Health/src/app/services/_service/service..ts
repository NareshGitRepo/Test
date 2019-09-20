import { Floor, IRoom, IRoomTypeInfo, IService, IServiceMapping, IServiceResponse, IServiceType, ServiceType, Services } from "../_model/serviceModel";

import { ConsumerService } from "../../_helpers/ConsumerService";
import { Injectable } from "@angular/core";
import { LoadApiUrls } from "../../_helpers/api.urls";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class Service {

    public component = "Service";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    validServiceName(servicename: string): Observable<IServiceResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateServiceName")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { servicename: servicename });
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validServicePrefix(serviceprefix: string, levelId?: string): Observable<IServiceResponse> {
        console.log("levelID==>", levelId)
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateServicePrefix")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{levelId}', levelId);
            return this.consumer.serviceConsumer<IServiceResponse>(_apiUrl, _apiurlsdetials.type, { serviceprefix: serviceprefix });
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createService(serviceForm): Observable<IServiceResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "addService");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, serviceForm);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    // getRoomsByFloorId(floorid): Observable<IRoom[]> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRoomsByFloorId")
    //     console.log("URL Get from config :  in getRoomsByFloorId() =====>  ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         let _apiUrl = _apiurlsdetials.url.replace('{floorid}', floorid);
    //         return this.consumer.serviceConsumer<IRoom[]>(_apiUrl, _apiurlsdetials.type, null, 'rooms');
    //     }
    //     else {
    //         console.log("URL Get from config : in getRoomsByFloorId() ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }
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

    mapServiceWithRooms(body): Observable<IServiceResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "mapServiceWithRooms")
        console.log("URL Get from config :  in getallRoomsByRoomType() =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IServiceResponse>(_apiUrl, _apiurlsdetials.type, body, '');
        }
        else {
            console.log("URL Get from config : in getallRoomsByRoomType() ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getAllService(): Observable<Services[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServicesByFacilitateId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<Services[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, "services");
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getLevel(): Observable<Floor[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFloorsWithDeptsByFacilitateId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<Floor[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'floors');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updateStatus(status, serviceId: number): Observable<IServiceResponse> {
        console.log(status)
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateServiceStatus");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            let _apiUrl = _apiurlsdetials.url.replace("{serviceId}", "" + serviceId) + '?status=' + status;
            // console.log("URL Get from config : ---->  ", _apiUrl);
            // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IServiceResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    updateServiceInfo(serviceForm): Observable<IServiceResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateServiceInfo");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, serviceForm);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getRoomsByServiceId(serviceid): Observable<IRoom[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRoomsByServiceId")
        console.log("URL Get from config :  in getallRoomsByRoomType() =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{serviceid}', serviceid);

            return this.consumer.serviceConsumer<IRoom[]>(_apiUrl, _apiurlsdetials.type, '', 'rooms');
        }
        else {
            console.log("URL Get from config : in getallRoomsByRoomType() ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getServiceType(serviceId: string): Observable<ServiceType[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServiceTypesByServiceid");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{serviceId}', serviceId);
            return this.consumer.serviceConsumer<ServiceType[]>(_apiUrl, _apiurlsdetials.type, null, 'serviceType');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    unMapServiceType(levelId?: string): Observable<ServiceType[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServiceTypeByLevelId");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{levelId}', levelId);
            return this.consumer.serviceConsumer<ServiceType[]>(_apiUrl, _apiurlsdetials.type, null, 'serviceType');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    mapServiceWithServiceType(assignService: IServiceMapping): Observable<IServiceResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "mapServiceWithServiceType");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, assignService);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
}
