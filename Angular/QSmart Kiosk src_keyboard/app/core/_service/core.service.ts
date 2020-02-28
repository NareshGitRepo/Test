
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDateInfo, IPResponse } from '../_model/core.model';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { AppConfig } from '../../_helpers/app.config';


@Injectable({ providedIn: 'root' })
export class coreService
 {
    public component = "Auth";
    constructor(private apiUrls:LoadApiUrls ,private appconfig:AppConfig,private consumer:ConsumerService) {}
    
        getCurrentDate(): Observable<IDateInfo> {
            let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCurrentDate")
            console.log("URL Get from config : =====>  ", _apiurlsdetials);
            if (_apiurlsdetials) {
                console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
                return this.consumer.serviceConsumer<IDateInfo>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
            }
            else {
                console.log("URL Get from config : ---->  ", "Url not found..");
                return Observable.throw({ error: { messages: "url not found" } });
            }
          } 
          updatePharmaMasterStatusAndReason(masterSno: number,status:number,reason:string) {
            let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod("Pharmacy", "updatePharmaMasterStatusAndReason");
            console.log("updatePharmaMasterStatusAndReason =====> ", _apiurlsdetials);
            if (_apiurlsdetials) {
              const url = _apiurlsdetials.url.replace("{kioskid}", this.appconfig.getKioskId()).replace("{masterSno}",
              '' + masterSno).replace("{status}",''+status).replace("{reason}",''+reason)
                console.log("updatePharmaMasterStatusAndReason: Response---->  ", url);
                return this.consumer.serviceConsumer<IPResponse>(url, _apiurlsdetials.type, '','');
            }
            else {
                console.log("updatePharmaMasterStatusAndReason: ----> ", "Url not found..");
                return Observable.throw({ error: { messages: "url not found" } });
        
          }
    
        }
    } 
