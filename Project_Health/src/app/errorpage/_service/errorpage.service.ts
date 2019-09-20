import { Injectable } from '@angular/core';
import { IErrorInfo, Level } from '../_model/error.interface';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';
import { ConsumerService } from '../../_helpers/ConsumerService';

@Injectable({ providedIn: 'root' })

export class ErrorpageService {

  public component = "Errors";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  getlevelsInfo(): Observable<Level[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getLevelsByOrgId");
    if (_apiurlsdetials) {
      console.log("ErrorpageService: getlevelsInfo: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<Level[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'levels');
    } else {
      console.log("ErrorpageService: getlevelsInfo: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getAllErrorsByFacilitateIDId(floorid: number): Observable<IErrorInfo[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getErrorsByLevelId");
    const url = _apiurlsdetials.url.replace("{levelid}", "" + floorid);
    if (_apiurlsdetials) {
      console.log("ErrorpageService: getAllErrorsByFacilitateIDId: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<IErrorInfo[]>(url, _apiurlsdetials.type, null, 'errors', 0);
    } else {
      console.log("ErrorpageService: getAllErrorsByFacilitateIDId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  upateErrorInfo(errMsg): Observable<IErrorInfo> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "upateErrorInfo")
    console.log("Edit Errmsg:::::::::::", JSON.stringify(errMsg));

    if (_apiurlsdetials) {
      console.log("ErrorpageService: getAllErrorsByFacilitateIDId: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<IErrorInfo>(_apiurlsdetials.url, _apiurlsdetials.type, errMsg, '', 0);
    } else {
      console.log("ErrorpageService: getAllErrorsByFacilitateIDId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }

  }
}
