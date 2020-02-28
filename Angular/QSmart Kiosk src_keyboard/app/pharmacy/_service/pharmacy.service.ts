import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';
// import { IPharmacy, IPResponse } from '../_model/IPharmacy';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { menuType, AppConfig } from '../../_helpers/app.config';
import { IPResponse, ISDCResponse, IPKioskInfo, IDhlCity, IMedicineRespnse, IDhlReqObj } from '../_model/IPharmacy';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PharmacyService {

    public component = "Pharmacy";

    constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private consumer: ConsumerService, private appconfig: AppConfig) { }


    validateMnrAndEmiratesId(mrno: number, ssn: number): Observable<IPResponse> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateMnrAndEmiratesId");
        console.log("PharmacyService: validateMnrAndEmiratesId : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrno}",
                '' + mrno).replace("{ssn}", '' + ssn);
            console.log("PharmacyService: validateMnrAndEmiratesId: ---->  ", url);
            return this.consumer.serviceConsumer<IPResponse>(url, _apiurlsdetials.type, '', '', 0);
        } else {
            console.log("PharmacyService: validateMnrAndEmiratesId: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }

    generateSameDayCheckin(mrno: number, pharmaData: IPKioskInfo): Observable<ISDCResponse> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "generateSameDayCheckin");
        console.log("PharmacyService: generateSameDayCheckin : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrno}",
                '' + mrno);
            console.log("PharmacyService: generateSameDayCheckin: ---->  ", url);
            return this.consumer.serviceConsumer<ISDCResponse>(url, _apiurlsdetials.type, pharmaData, '', 0);
        } else {
            console.log("PharmacyService: generateSameDayCheckin: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }

    generateNextDayCheckin(mrno: number, pharmaData: IPKioskInfo): Observable<ISDCResponse> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "generateNextDayCheckin");
        console.log("PharmacyService: generateNextDayCheckin : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrno}",
                '' + mrno);
            console.log("PharmacyService: generateNextDayCheckin: ---->  ", url);
            return this.consumer.serviceConsumer<ISDCResponse>(url, _apiurlsdetials.type, pharmaData, '', 0);
        } else {
            console.log("PharmacyService: generateNextDayCheckin: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }

    generateEmergencyCheckin(mrno: number, pharmaData: IPKioskInfo): Observable<ISDCResponse> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "generateEmergencyCheckin");
        console.log("PharmacyService: generateEmergencyCheckin : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrno}",
                '' + mrno);
            console.log("PharmacyService: generateEmergencyCheckin: ---->  ", url);
            return this.consumer.serviceConsumer<ISDCResponse>(url, _apiurlsdetials.type, pharmaData, '', 0);
        } else {
            console.log("PharmacyService: validateMnrAndEmiratesId: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
    getDhlCities(): Observable<IDhlCity[]> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDhlCities");
        console.log("PharmacyService: getDhlCities : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId());
            console.log("PharmacyService: getDhlCities: ---->  ", url);
            return this.consumer.serviceConsumer<IDhlCity[]>(url, _apiurlsdetials.type, '', 'dhlCities', 0);
        } else {
            console.log("PharmacyService: getDhlCities: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
    getMedicines(): Observable<IDhlCity[]> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDhlCities");
        console.log("PharmacyService: getDhlCities : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId());
            console.log("PharmacyService: getDhlCities: ---->  ", url);
            return this.consumer.serviceConsumer<IDhlCity[]>(url, _apiurlsdetials.type, '', 'dhlCities', 0);
        } else {
            console.log("PharmacyService: getDhlCities: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
    getDHLMedicines(mrno: number, ssn: number, pharmaData: IPKioskInfo): Observable<IMedicineRespnse> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDHLMedicines");
        console.log("PharmacyService: getDHLMedicines : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrno}",
                '' + mrno).replace("{ssn}", '' + ssn);
            console.log("PharmacyService: getDHLMedicines: ---->  ", url);
            return this.consumer.serviceConsumer<IMedicineRespnse>(url, _apiurlsdetials.type, pharmaData, '', 0);
        } else {
            console.log("PharmacyService: getDHLMedicines: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
    transferToDhlService(mrno: number, ssn: number, reqObjDHL: IDhlReqObj): Observable<IMedicineRespnse> {
        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "transferToDhlService");
        console.log("PharmacyService: transferToDhlService : ---->  ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{mrno}",
                '' + mrno).replace("{ssn}", '' + ssn);
            console.log("PharmacyService: transferToDhlService: ---->  ", url);
            return this.consumer.serviceConsumer<IMedicineRespnse>(url, _apiurlsdetials.type, reqObjDHL, '', 0);
        } else {
            console.log("PharmacyService: transferToDhlService: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }
    }
    updatePharmaMasterStatusAndReason(masterSno: number, status: number, reason: string): Observable<IPResponse>  {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updatePharmaMasterStatusAndReason");
        console.log("PharmacyService:updatePharmaMasterStatusAndReason =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{masterSno}",
                '' + masterSno).replace("{status}", '' + status).replace("{reason}", '' + reason)
            console.log("PharmacyService:updatePharmaMasterStatusAndReason: Response---->  ", url);
            return this.consumer.serviceConsumer<IPResponse>(url, _apiurlsdetials.type, '', '');
        }
        else {
            console.log("PharmacyService:updatePharmaMasterStatusAndReason: ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });

        }

    }
}



