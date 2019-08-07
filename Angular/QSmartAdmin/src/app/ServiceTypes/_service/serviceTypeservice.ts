import { ICreateService, ILevel, ILevelData, IServiceType } from '../_model/serviceModel';

import { ConsumerService } from '../../_helpers/ConsumerService';
import { IServiceResponse } from '../../services/_model/serviceModel';
import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {

  public component = "ServiceType";

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




  getAllFloorServiceTypeByOrgId(): Observable<ILevel[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllFloorServiceTypeByOrgId")
    console.log("URL for Group by Parent Id::::::::", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<ILevel[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'levels');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }

  }


  addService(serviceForm: ICreateService): Observable<IServiceResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "addService");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, serviceForm);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }


  updateServiceTypeInfo(updateService: IServiceType): Observable<IServiceResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateServiceTypeInfo");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateService);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  addServiceNew(serviceForm: ICreateService): Observable<IServiceResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "addServiceNew");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, serviceForm);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  updateServiceTypeInfoNew(updateService: IServiceType): Observable<IServiceResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateServiceTypeInfoNew");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IServiceResponse>(_apiurlsdetials.url, _apiurlsdetials.type, updateService);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}


