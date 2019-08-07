import { Injectable } from "@angular/core";
import { ISenderList, IServiceInfo, IIntervalType, ApiResponse, DataByQuery, ISystemParams, ITableAndColumnData, OnlineAlert, ICreateAlert, DataType, ICreateProfile, ITestProfile, IGDbProfileInfo, IDepartment } from "../_model/onlinealerts.model";
import { LoadApiUrls } from "../../../_helpers/api.urls";
import { ConsumerService } from "../../../_helpers/ConsumerService";
import { Observable } from "rxjs";
import { userType } from "../../../_helpers/app.config";

@Injectable({ providedIn: 'root' })

export class OnlineAlertsService {
  public component = "AlertManager";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {
  }
  getDepartmentswithUser(): Observable<IDepartment[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllDepartments")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials);

        return this.consumer.serviceConsumer<IDepartment[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
    }
    else {
        console.log("URL Get from config : ----> ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

getAllAlerts(_roleCode: string): Observable<OnlineAlert[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, userType.NormalUser == _roleCode ? 'getAllOnlineAlertsByUserId' : (userType.DepartementAdmin == _roleCode ? 'getAllOnlineAlertsByDeptId' : "getAllOnlineAlerts"));
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials);
        return this.consumer.serviceConsumer<OnlineAlert[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'onlineAlerts');
    } else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

getAllProfiles(_roleCode:string): Observable<IGDbProfileInfo[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component,userType.DepartementAdmin==_roleCode || userType.NormalUser==_roleCode ? 'getAllDbProfileByDeptId': "getAllDbProfile")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials);
        return this.consumer.serviceConsumer<IGDbProfileInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'dbProfileInfo');
    } else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}
getAllDataTypes(): Observable<DataType[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllDataTypes")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials);
        return this.consumer.serviceConsumer<DataType[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'dataTypes');
    } else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}
deleteAlertStatus(alertid: number): Observable<ApiResponse> {
    console.log(alertid, status);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "deleteOnlineAlert");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ----> ", _apiurlsdetials.url);
        const url = _apiurlsdetials.url.replace("{alertid}", "" + alertid);
        return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
    }
    else {
        console.log("URL Get from config : ----> ", "Url not found..");
        return Observable.throw({ error: { message: "url not found" } });
    }
}

testConnection(profileModel: ITestProfile): Observable<ApiResponse> {
    console.log("Prof==>" + JSON.stringify(profileModel));

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, 'validateDBConnectionString');
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, profileModel, '');
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}
profileCreation(createProfile: ICreateProfile): Observable<ApiResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, 'createDbProfileInfo');
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createProfile, '');
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

validateProfileName(profilename: string): Observable<ApiResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateDbProfileName")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
        return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { profilename: profilename });
    }
    else {
        console.log("URL Get from config : ---->  ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

updateProfile(profileForm): Observable<ApiResponse> {
    console.log("update==>", profileForm);

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDbProfileInfo");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
        console.log("URL Get from config : ----> ", _apiurlsdetials.url);
        return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, profileForm, '');
    }
    else {
        console.log("URL Get from config : ----> ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}

updateProfileStatus(dbProfileId: number, status: number): Observable<ApiResponse> {
    console.log(dbProfileId, status);

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDbProfileStatus");

    if (_apiurlsdetials) {
        let url = _apiurlsdetials.url.replace('{profileid}', "" + dbProfileId).replace('{status}', "" + status)
        console.log("url : =====> ", url);
        return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
    }
    else {
        console.log("URL Get from config : ----> ", "Url not found..");
        return Observable.throw({ error: { messages: "url not found" } });
    }
}
 //alerts





  getAllSenders(): Observable<ISenderList[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllSenders")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<ISenderList[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'senders');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getServiceInfo(): Observable<IServiceInfo[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllServiceInfo")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<IServiceInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'serviceInfo');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }


  getIntervals(): Observable<IIntervalType[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getIntervalType")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<IIntervalType[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'intervalTypes');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validateAlertName(alertName: string): Observable<ApiResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateAlertName")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      // let url = _apiurlsdetials.url.replace("{departmentname}", departName + '')
      return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, { alertname: alertName }, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getDataFromQuery(profileId: number, selectedquery: string): Observable<DataByQuery> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDataFromQuery")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let Query = {
        profileId: profileId,
        query: selectedquery
      }
      // let url = _apiurlsdetials.url.replace("{profileid}", ''+Query.profileid)+"?partytype="+Query.query+'';
      return this.consumer.serviceConsumer<DataByQuery>(_apiurlsdetials.url, _apiurlsdetials.type, Query, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getTablesInfoFromQuery(profileId: number, selectedquery: string): Observable<ITableAndColumnData> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getTablesInfoFromQuery")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let Query = {
        profileId: profileId,
        query: selectedquery
      }
      // let url = _apiurlsdetials.url.replace("{profileid}", ''+Query.profileid)+"?partytype="+Query.query+'';
      return this.consumer.serviceConsumer<ITableAndColumnData>(_apiurlsdetials.url, _apiurlsdetials.type, Query, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getSystemParams(): Observable<ISystemParams[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getSystemParams")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<ISystemParams[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'values');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  createAlert(createObj:ICreateAlert):Observable<ApiResponse>{
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createOnlineAlert")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createObj, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  updateAlert(createObj:ICreateAlert):Observable<ApiResponse>{
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateOnlineAlert")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);

      return this.consumer.serviceConsumer<ApiResponse>(_apiurlsdetials.url, _apiurlsdetials.type, createObj, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateOnlineAlertStatus(alertid:number,status:number){
  let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateOnlineAlertStatus")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);
      let url=_apiurlsdetials.url.replace('{alertid}',''+alertid)+"?status="+status;
      return this.consumer.serviceConsumer<ApiResponse>(url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}