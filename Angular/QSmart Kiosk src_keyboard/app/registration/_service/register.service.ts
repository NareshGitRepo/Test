import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from "rxjs";
import { ConsumerService } from '../../_helpers/ConsumerService';
import { IRegistration } from '../_model/IRegistration';
import { AppConfig, menuType } from '../../_helpers/app.config';

@Injectable()
export class RegisterService {

    public component = "Register";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService,private appconfig:AppConfig) { }

    getRegisterToken(): Observable<IRegistration> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCommonToken");
        console.log("RegisterService: getRegisterToken: ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}",  this.appconfig.getKioskId()).replace("{menuid}", ''+menuType.RG);
            console.log("RegisterService: getRegisterToken: ---->  ", url);
            return this.consumer.serviceConsumer<IRegistration>(url, _apiurlsdetials.type, '', '', 0);
        } else {
            console.log("RegisterService: getRegisterToken: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }

}
