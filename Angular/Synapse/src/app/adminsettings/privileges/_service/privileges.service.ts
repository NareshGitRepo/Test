import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { ModulesInfo, IResponse, ModuleData } from '../_model/priviligesModel';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {

  public component = "Priviliges";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
  }

  getAllModulesInfo(): Observable<ModulesInfo[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getModuleInfoByViewCheckerStatus")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<ModulesInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'modulesInfo');
    }
  }

  updateModuleCheckerStatus(_updateModuleinfo: ModuleData): Observable<IResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateCheckerStatus");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _updateModuleinfo, '');
    } else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

}
