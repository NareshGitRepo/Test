import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { ConsumerService } from '../../_helpers/ConsumerService';
import {  ICheckin, IGetappoinmentRequest } from '../_model/ICheckin';
import { AppConfig } from '../../_helpers/app.config';

@Injectable()
export class CheckinService {

    public component = "CheckinNew";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService, private appconfig:AppConfig) {
    }

    getAppointments(checkinform: IGetappoinmentRequest): Observable<ICheckin> {
        console.log("checkinform.value::" + JSON.stringify(checkinform));
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAppointments");
        console.log("CheckinService: getAppointments: ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrnnumber}",
            checkinform.mrnNumber).replace("{natid}", checkinform.nationalId);
            console.log("CheckinService: getAppointments: ---->  ", url);
            return this.consumer.serviceConsumer<ICheckin>(url, _apiurlsdetials.type, '', '', 0);
        } else {
            console.log("CheckinService: getAppointments: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }


    generateCheckinToken(id: any): Observable<any> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "generateCheckinToken");
        console.log("CheckinService: generateTokenFromList: ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{id}", id);
            console.log("CheckinService: generateTokenFromList: ---->  ", url);
            return this.consumer.serviceConsumer<any>(url, _apiurlsdetials.type, '', '', 0);
        } else {
            console.log("CheckinService: generateTokenFromList: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }


    

}
