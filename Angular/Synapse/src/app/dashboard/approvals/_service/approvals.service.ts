import { Injectable } from '@angular/core';
import { CheckerData, ApiResponse, ApproveData, ModulesInfo, ICheckerData } from '../_model/approvals.model';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { userType } from '../../../_helpers/app.config';

@Injectable({ providedIn: 'root' })

export class ApprovalsService {
    public component: string = "CheckerData";
    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    getAllCheckerDataByRoleId(): Observable<CheckerData[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllCheckerDataByRoleId")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<CheckerData[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'checkerData');
        } else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getApprovals(_roleCode:string): Observable<CheckerData[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, userType.NormalUser == _roleCode ? 'getAllCheckerDataByRoleId' : (userType.DepartementAdmin == _roleCode ? 'getAllCheckerDataByRoleId' : "getAllCheckerData"));
           
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<CheckerData[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'checkerData');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getApprovalsInfo(checkdata: CheckerData): Observable<ICheckerData> {
        console.log("Checked Data Service ", JSON.stringify(checkdata));
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCheckerDataInfo")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let modifiedurl = _apiurlsdetials.url.replace('{moduleid}', "" + checkdata.moduleId).replace('{checkerid}', "" + checkdata.checkId);
            console.log("URL Get from config : ---->  ", modifiedurl);
            return this.consumer.serviceConsumer<ICheckerData>(modifiedurl, _apiurlsdetials.type, null, 'data');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }

    approveData(approveData: ApproveData): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateCheckerDataStatus")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, approveData, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getModules(): Observable<ModulesInfo[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getModuleInfoByViewCheckerStatus")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ModulesInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'modulesInfo');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

}

