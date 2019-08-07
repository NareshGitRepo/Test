import { IEmployeeReport, ILevelData } from '../_model/performanceModel';

import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  public component = "Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

  getFloorsWithDeptsByFacilitateId(): Observable<ILevelData[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFloorsWithDeptsByFacilitateId")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials);

    if (_apiurlsdetials) {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ILevelData[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'floors');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }

  }
  getEmpReport(searchData):Observable<IEmployeeReport[]>{
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getEmpReport")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials);

    if (_apiurlsdetials) {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IEmployeeReport[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchData, 'employeeReports');
    } else {
      console.log("LevelService: getFloorsWithDeptsByFacilitateId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

}
