import { Injectable } from "@angular/core";
import { LoadApiUrls } from "../../../_helpers/api.urls";
import { ConsumerService } from "../../../_helpers/ConsumerService";
import { Observable } from "rxjs";
import { Filterkeyword, ApiResponse } from "../_model/filterkey.model";



@Injectable({ providedIn: 'root' })

export class FilterkeyService {
    component = "filterkey";
    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    getFilterKeywords(): Observable<Filterkeyword[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllFilterKeyword")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<Filterkeyword[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'filterkeywords');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    createFilterKeyword(keywordData: Filterkeyword): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createFilterKeyword")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, keywordData, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validateKeywordName(KeywordName: string): Observable<ApiResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateKeywordName")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            // let url = _apiurlsdetials.url.replace("{departmentname}", departName + '')
            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { keywordName: KeywordName }, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    validateKeywordName1(): Observable<ApiResponse> {
        const observable = Observable.create(function subscribe(observer) {
            observer.next({ status: true, message: '' } as ApiResponse);
            observer.complete();
        });
        return observable;
    }

    updateKeyword(keywordData: Filterkeyword): Observable<ApiResponse> {
        console.log("keywordData::::", keywordData);

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateFilterKeyword")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

            return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, keywordData, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    updatekeywordstatus(keywordid: number, status: number) {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateFilterKeywordStatus")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let url = _apiurlsdetials.url.replace("{keywordId}", keywordid + '').replace("{status}", status + '');
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    deleteKeyword(keywordId: number): Observable<ApiResponse> {
        console.log("keywordId::::", keywordId);

        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteFilterKeywordById")
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let url = _apiurlsdetials.url.replace("{keywordid}", keywordId + '');
            return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
}