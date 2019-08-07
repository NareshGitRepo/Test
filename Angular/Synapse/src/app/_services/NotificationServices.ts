import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class NotificationServices {


    constructor(private http: HttpClient) {
       
    }


    getNotifications() {
        console.log("UserService:getNotifications:");
        return this.http.get<any>("http://202.65.158.172:9093/v1/api/notifcations/1/all")
            .map((response) => {
                console.log("User getNotifications Response : ", response);
                return response;
            });
    }






}
