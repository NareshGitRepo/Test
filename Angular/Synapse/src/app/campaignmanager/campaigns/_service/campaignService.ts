import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/operator/map';

import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Isender, IGlobalGroups, IDeptGroup, IGroupUser, IResponse, ICampaignDataModel, ISmsTemplate, IGlobalGetRes, Idate } from '../_model/campaignModel';
import { userType } from '../../../_helpers/app.config';


@Injectable({ providedIn: 'root' })
export class CampaignService {

    public component = "CampaignManager";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
    }
    getAllSystemParameter(): Observable<IGlobalGetRes> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllSystemParameters")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
          console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
          return this.consumer.serviceConsumer<IGlobalGetRes>(_apiurlsdetials.url, _apiurlsdetials.type, null,'');
        }
        else {
          console.log("URL Get from config : ---->  ", "Url not found..");
          return Observable.throw({ error: { messages: "url not found" } });
        }
      }
    getsenders(): Observable<Isender[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllSenders");
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<Isender[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'senders');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getAllGroupsWithContactsGlobal(): Observable<IGlobalGroups[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllGroupsWithContacts")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<IGlobalGroups[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'groupsWithContacts');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getGroupsWithContactsByDeptId(): Observable<IDeptGroup[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsWithContactsByDeptId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);

            return this.consumer.serviceConsumer<IDeptGroup[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'groups');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getGroupsWithContactsUser(): Observable<IGroupUser[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getGroupsWithContactsuser")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials);
            return this.consumer.serviceConsumer<IGroupUser[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'contactGroupUser');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    createCampaign(formData: FormData): Observable<IResponse> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createCampaign")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, formData, '', 1);
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getCurrentDate(): Observable<Idate> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCurrentDate")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<Idate>(_apiurlsdetials.url, _apiurlsdetials.type, null,'');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }
    updateCampaign(formData: FormData): Observable<IResponse> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateCampaign")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, formData, '', 1);
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getAllCampaigns(_roleCode: string): Observable<ICampaignDataModel[]> {

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, userType.NormalUser == _roleCode ? 'getAllCampaignsByUserId' : (userType.DepartementAdmin == _roleCode ? 'getAllCampaignsByDeptId' : "getAllCampaigns"))
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ICampaignDataModel[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'campaigns');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    validateCampName(campname: string): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateCampName")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            // let url = _apiurlsdetials.url.replace("{SmsTemplatename}", departName + '')
            return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { campname: campname }, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getSmsTemplates(): Observable<ISmsTemplate[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getSmsTemplates")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ISmsTemplate[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'smsTemplates');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }
    updateCampaignStatus(campid: number, status: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateCampaignStatus")
        if (_apiurlsdetials) {
            let url = _apiurlsdetials.url.replace('{campid}', campid + '') + '?status=' + status;
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }

    }

}
