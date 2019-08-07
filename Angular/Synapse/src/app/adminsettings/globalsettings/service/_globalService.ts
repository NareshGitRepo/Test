import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/operator/map';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { IGlobalGet, IGlobalupdateRes, IGlobalGetRes } from '../Model/_globalModel';

@Injectable({ providedIn: 'root' })
export class GlobalSettingService {

    public component = "Globalsettings";
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


      updateSystemParameterValues(globalGet:IGlobalGetRes): Observable<IGlobalupdateRes> {
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateSystemParameterValues")
        console.log("URL Get from config : =====>  ", _apiurlsdetials);
        if (_apiurlsdetials) {
          console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
          return this.consumer.serviceConsumer<IGlobalupdateRes>(_apiurlsdetials.url, _apiurlsdetials.type, globalGet,'');
        }
        else {
          console.log("URL Get from config : ---->  ", "Url not found..");
          return Observable.throw({ error: { messages: "url not found" } });
        }
      }


}
