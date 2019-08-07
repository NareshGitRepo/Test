

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';
import { IdashBoard } from '../dashboardmodel.ts/dashboardmodel';
import { userType } from '../../../_helpers/app.config';

@Injectable({ providedIn: 'root' })

export class DashBoardService {
    component = "DashBoard";
    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
    }


    getDashboardUser(_roleCode:string): Observable<IdashBoard[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component,userType.NormalUser == _roleCode ? 'getDashboardUser' : (userType.DepartementAdmin == _roleCode ? 'getDashboardDept' : "getDashboardGlobal"))
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);

            return this.consumer.serviceConsumer<IdashBoard[]>(_apiurlsdetials.url, _apiurlsdetials.type, {}, userType.NormalUser == _roleCode ? 'dashboardUserReport' : (userType.DepartementAdmin == _roleCode ? 'dashboardDeptReport' : "dashboardGlobalReport"));
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
}
