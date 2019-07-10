import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { IDeptResponse, ILevelResponse, ILevelData, ILevelList, ILevelRes, ILevelCreate } from '../_model/levelModel';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  public component = "Levels";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }


  createLevel(levelForm:ILevelCreate): Observable<ILevelResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createLevel");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ILevelResponse>(_apiurlsdetials.url, _apiurlsdetials.type, levelForm);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  updateLevel(editDetails: ILevelCreate): Observable<ILevelRes> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateFloorDataInfo");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ILevelRes>(_apiurlsdetials.url, _apiurlsdetials.type, editDetails);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getLevelsByOrgId(): Observable<ILevelList[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getLevelsByOrgId")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials);

    if (_apiurlsdetials) {
      console.log("LevelService: getLevelsByOrgId: ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ILevelList[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'levels');
    } else {
      console.log("LevelService: getLevelsByOrgId: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }

  }
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


  validateDept(deptname: string, levelId: string) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateDept")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    let _apiUrl = _apiurlsdetials.url.replace("{deptName}", deptname).replace('{levelId}', levelId);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IDeptResponse>(_apiUrl, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  createDepartment(departmentForm): Observable<IDeptResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createDepartment");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IDeptResponse>(_apiurlsdetials.url, _apiurlsdetials.type, departmentForm);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateDepartment(departmentForm): Observable<IDeptResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDepartment");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IDeptResponse>(_apiurlsdetials.url, _apiurlsdetials.type, departmentForm);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }


  updateStatusByDeptId(deptid: number, status: any): Observable<IDeptResponse> {
    console.log(status)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateStatusByDeptId");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url.replace("{deptid}", "" + deptid).replace("{status}", status);
      console.log("URL Get from config : ----> ", _apiUrl);
      // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IDeptResponse>(_apiUrl, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }


}


