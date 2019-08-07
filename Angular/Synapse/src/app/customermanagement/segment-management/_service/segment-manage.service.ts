import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from "@angular/core";
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from "rxjs";
import { SegementCustomerData, ApiResponse, ChannelsInfo } from '../_model/segement-manage.model';

@Injectable({
    providedIn: 'root'
})

export class SegmentManageService {

    public component = "Customer-Profiling";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }


    getSegmentwithCustomers(): Observable<SegementCustomerData[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllSegmentWithCustomerData")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<SegementCustomerData[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'segementCustomerData');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateSegmentStatus(segmentId: number, status: number): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateSegmentStatus")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let url = _apiurlsdetials.url.replace("{segmentId}", segmentId + '').replace("{status}", status + '');
            console.log("url ::::", url);

            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createSegmentMaster(createSeg: SegementCustomerData): Observable<ApiResponse> {
        console.log("createSeg::::", createSeg);
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createSegmentMaster")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createSeg, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    deleteSegment(segmentId: number): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteSegment")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let url = _apiurlsdetials.url.replace("{segmentid}", segmentId + '')
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateSegmentMasterInfo(updateSeg: SegementCustomerData): Observable<ApiResponse> {
        console.log("updateDept:::", updateSeg);

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateSegmentMasterInfo")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateSeg, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getChannelsInfo(): Observable<ChannelsInfo[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllMasterChannels")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ChannelsInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'channelMaster');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validateCustomerName(customerName: string): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateCustomerName")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            let url = _apiurlsdetials.url + "?customerName=" + customerName;
            console.log("url : ", url);
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createCustomer(data): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createCustomer")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, data, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    updateCustomerInfo(data): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateCustomerInfo")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, data, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getAllSegments(): Observable<SegementCustomerData[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllSegments")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            //console.log("URL Get from config : ---->  ", _apiUrl);
            return this.consumer.serviceConsumer<SegementCustomerData[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'segments');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

}
