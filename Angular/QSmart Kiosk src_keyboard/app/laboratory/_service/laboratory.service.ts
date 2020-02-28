import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';
import { ILaboratory } from '../_model/ILaboratory';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { AppConfig, menuType } from '../../_helpers/app.config';

@Injectable()
export class LaboratoryService {

    public component = "Laboratory";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService, private appConfig:AppConfig) { }

    getLaboratoryToken(): Observable<ILaboratory> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCommonToken");
        console.log("LaboratoryService: getLaboratoryToken: ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appConfig.getKioskId()).replace("{menuid}",''+menuType.LB);
            console.log("LaboratoryService: getLaboratoryToken: ---->  ", url);
            return this.consumer.serviceConsumer<ILaboratory>(url, _apiurlsdetials.type, '', '', 0);
        } else {
            console.log("LaboratoryService: getLaboratoryToken: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }

}

