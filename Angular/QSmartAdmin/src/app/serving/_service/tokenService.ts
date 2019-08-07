import { ICRequestForNext, ICResponseForNext, ICServices, ICServingToken, ICToken, ICTokensAndRooms, ICallNextData, ICallNextvital, ICallTokenNextData, ICounterInfo, IDepartment, IDepartments, IDeptList, IDoctorAndService, IDoctorInfo, IDoctorRoom, IForwardResponse, IRequestForNext, IResponse, IResponseForNext, IServiceData, IServingTokenN, IServingTokens, IToken, ITokenAServing, ITokenAServingList, ITokenAndRooms, ITokenDepList, ITokenJourney, ItokenservingRes } from "../_model/tokenmodel";

import { ConsumerService } from "../../_helpers/ConsumerService";
import { Injectable } from "@angular/core";
import { LoadApiUrls } from "../../_helpers/api.urls";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    public component = "TokenService";
    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    getDoctroAndServiceInfo(): Observable<IDoctorAndService> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDoctroAndServiceInfo")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IDoctorAndService>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getServingTokenByNurseId(): Observable<IServingTokens[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServingTokenByNurseId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IServingTokens[]>(_apiUrl, _apiurlsdetials.type, null, 'servingTokens');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getServingTokensOtherResource(): Observable<IServingTokenN[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServingTokensOtherResource")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IServingTokenN[]>(_apiUrl, _apiurlsdetials.type, null, 'servingTokens');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getServingTokenByDoctorId(): Observable<IServingTokens[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServingTokenByDoctorId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IServingTokens[]>(_apiUrl, _apiurlsdetials.type, null, 'servingTokens');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getTokenAndRoomsInfoByDoctor(doctorId:number): Observable<ITokenAndRooms> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getTokenAndRoomsInfoByDoctor")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{doctorid}',doctorId+'');
            return this.consumer.serviceConsumer<ITokenAndRooms>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    callTokenForServing(tokenInfo:IToken): Observable<ItokenservingRes> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "callTokenForServing")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<ItokenservingRes>(_apiUrl, _apiurlsdetials.type, tokenInfo, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    servingEndTokenOtherResource(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "servingEndTokenOtherResource")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');

            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    recycleTokenOtherResource(tokenId:number): Observable<ItokenservingRes> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "recycleTokenOtherResource")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<ItokenservingRes>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    endTokenInfo(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "endTokenInfo")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    recycleToken(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "recycleToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    reCallNurseToken(tokenId:number): Observable<IResponseForNext> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "reCallNurseToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponseForNext>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    reCallDoctorToken(tokenId:number): Observable<IResponseForNext> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "reCallDoctorToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponseForNext>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    noShowToken(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "noShowToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    servingEndToken(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "servingEndToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    callNextServingTOken(tokenServe:IRequestForNext): Observable<IResponseForNext> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "callNextServingTOken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IResponseForNext>(_apiUrl, _apiurlsdetials.type, tokenServe, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    callDoctorNextServingTOken(tokenServe:IRequestForNext): Observable<IResponseForNext> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "callDoctorNextServingTOken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IResponseForNext>(_apiUrl, _apiurlsdetials.type, tokenServe, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getServiceInfByDoctorId(): Observable<IDoctorAndService> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServiceInfByDoctorId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IDoctorAndService>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getTransferServicesByFloorId(floorId:number): Observable<IDeptList[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getTransferServicesByFloorId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{floorId}',floorId+'');
            return this.consumer.serviceConsumer<IDeptList[]>(_apiUrl, _apiurlsdetials.type, null, 'services');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    transferedToken(ticketId:number,serviceId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "transferedToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',ticketId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, {serviceid:serviceId}, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getServicesInfo(): Observable<ICServices[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServicesInfo")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<ICServices[]>(_apiUrl, _apiurlsdetials.type, null, 'services');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getWaitingTokens(serviceId:number): Observable<ICTokensAndRooms> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getWaitingTokens")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{serviceid}',serviceId+'');
            return this.consumer.serviceConsumer<ICTokensAndRooms>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getServingTokensByUserId(): Observable<ICServingToken[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServingTokensByUserId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<ICServingToken[]>(_apiUrl, _apiurlsdetials.type, null, 'tokens');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    CcallTokenForServing(tokenInfo:ICToken): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "CcallTokenForServing")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, tokenInfo, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    CservingEndToken(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "CservingEndToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    CnoShowToken(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "CnoShowToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    CendTokenInfo(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "CendTokenInfo")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    CrecycleToken(tokenId:number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "CrecycleToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    Crecall(tokenId:number): Observable<ICResponseForNext> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "Crecall")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{tokenId}',tokenId+'');
            return this.consumer.serviceConsumer<ICResponseForNext>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    CcallNextServingTOken(tokenServe:ICRequestForNext): Observable<ICResponseForNext> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "CcallNextServingTOken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<ICResponseForNext>(_apiUrl, _apiurlsdetials.type, tokenServe, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }







    //Old Code-------------------
    getDoctorInfo(): Observable<IDoctorInfo[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getMappedDoctorsByNurseId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IDoctorInfo[]>(_apiUrl, _apiurlsdetials.type, null, 'doctors');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getForwardDepartments(): Observable<IDepartments[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getForwardDepartments")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<IDepartments[]>(_apiUrl, _apiurlsdetials.type, null, 'departments');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    tokenForwardD(tokenForwardData:IDepartments,ticketId:number): Observable<IResponse>{
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "tokenForwardD")
        console.log("URL Get from config : =====>  ", tokenForwardData);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, tokenForwardData, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getTokenAndServingInfo(doctorId: number, doctorFName: string, doctorLName: string, departmentName: string, orgId: number): Observable<ITokenAServing> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getTokensByDtrId")
        console.log("URL Get from config : =====>  321", _apiurlsdetials,{ orgid: orgId, doctorLastname: doctorLName, doctorFirstname: doctorFName, department: departmentName },JSON.stringify({ orgid: orgId, doctorLastname: doctorLName, doctorFirstname: doctorFName, department: departmentName }));
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{doctorid}', doctorId + '');
            return this.consumer.serviceConsumer<ITokenAServing>(_apiUrl, _apiurlsdetials.type, { orgid: orgId, doctorLastname: doctorLName, doctorFirstname: doctorFName, department: departmentName }, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    callNextToken(callNextData: ICallNextData): Observable<ITokenAServing> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "callNextToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<ITokenAServing>(_apiUrl, _apiurlsdetials.type, callNextData, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    tokenServed(ticketId: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "tokenServed")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    markAsUnServed(ticketId: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "markAsUnServed")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getMappedRoomsByDoctor(doctorId): Observable<IDoctorRoom[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getMappedRoomsByDoctor")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace("{doctorId}", doctorId)
            return this.consumer.serviceConsumer<IDoctorRoom[]>(_apiUrl, _apiurlsdetials.type, null, 'roomswithdoctros');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
    getCounterInfo(): Observable<ICounterInfo> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCountersByDeptId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<ICounterInfo>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    getTokenAndServingInfoOnts(queueid: number, orgId: number, deptId: number): Observable<ITokenAServingList> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getRegistrationTokens")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{queueid}', queueid + '');
            return this.consumer.serviceConsumer<ITokenAServingList>(_apiUrl, _apiurlsdetials.type, { orgid: orgId, deptid: deptId }, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    // callNextTokenOnts(callNextData:ICallTokenNextData,queueId:number): Observable<ITokenAServingList> {
    //     let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "callNextRegistrationToken")
    //     console.log("URL Get from config : =====>  ", _apiurlsdetials);
    //     if (_apiurlsdetials) {
    //         console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
    //         let _apiUrl = _apiurlsdetials.url.replace('{queueid}',queueId+'');
    //         return this.consumer.serviceConsumer<ITokenAServingList>(_apiUrl, _apiurlsdetials.type, callNextData, '');
    //     }
    //     else {
    //         console.log("URL Get from config : ---->  ", "Url not found..");
    //         return Observable.throw({ error: { messages: "url not found" } });
    //     }
    // }

    callNextTokenOnts(callNextData: ICallTokenNextData, queueId: number, ticketid: string): Observable<ITokenAServingList> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "callDiretRegistrationToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{queueid}', queueId + '').replace('{ticketid}', ticketid + '');
            return this.consumer.serviceConsumer<ITokenAServingList>(_apiUrl, _apiurlsdetials.type, callNextData, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    tokenUnServedOnts(ticketId: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "tokenUnServed")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    tokenServedOnts(ticketId: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "tokenServedOnts")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    getVitalTokenAndServingInfo(): Observable<ITokenAServing> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getVitalTokensByDtrId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url
            return this.consumer.serviceConsumer<ITokenAServing>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    vitalgetRoomsByNurseId(): Observable<IDoctorInfo[]> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "vitalgetRoomsByNurseId")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

            return this.consumer.serviceConsumer<IDoctorInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'doctors');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    vitalcallNextToken(callNextData: ICallNextvital): Observable<ITokenAServing> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "vitalcallNextToken")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url;
            return this.consumer.serviceConsumer<ITokenAServing>(_apiUrl, _apiurlsdetials.type, callNextData, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    vitaltokenServed(ticketId: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "vitaltokenServed")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }
    vitalmarkAsUnServed(ticketId: number): Observable<IResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "markTicketAsUnServed")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ---->  ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }


    ForwardDepartments(ticketId : number): Observable<IForwardResponse> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "tokenForwardc")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            let _apiUrl = _apiurlsdetials.url.replace('{ticketid}', ticketId + '');
            return this.consumer.serviceConsumer<IForwardResponse>(_apiUrl, _apiurlsdetials.type, null, '');
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
    getServicesAndDoctors(ticketId : number): Observable<IServiceData[]> {
      let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getServicesAndDoctors")
      console.log("URL Get from config : =====> ", _apiurlsdetials);
      if (_apiurlsdetials) {
          console.log("URL Get from config : ----> ", _apiurlsdetials.url);
          let _apiUrl = _apiurlsdetials.url.replace("{ticketId}", ''+ticketId);
          return this.consumer.serviceConsumer<IServiceData[]>(_apiUrl, _apiurlsdetials.type, null, 'services');
      }
      else {
          console.log("URL Get from config : ----> ", "Url not found..");
          return Observable.throw({ error: { message: "url not found" } });
      }
  }
  transferedService(ticketId:number,serviceId:number,doctorId:number): Observable<IResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "transferedService")
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ----> ", _apiurlsdetials.url);
        let _apiUrl = _apiurlsdetials.url.replace("{tokenId}", ''+ticketId);
        return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type,{serviceid:serviceId, doctorId:doctorId}, '');
    }
    else {
        console.log("URL Get from config : ----> ", "Url not found..");
        return Observable.throw({ error: { message: "url not found" } });
    }
}
getTokenTraverse(ticketId:number): Observable<ITokenJourney[]> {
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getTokenTraverse")
  console.log("URL Get from config : =====> ", _apiurlsdetials);
  if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{ticketId}", ''+ticketId);
      return this.consumer.serviceConsumer<ITokenJourney[]>(_apiUrl, _apiurlsdetials.type,null, 'tokens');
  }
  else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
  }
}
}
