import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { IDepartment, DeptInfo, Idate, ICreditReportInfo, GlobalAuditLogInfo } from '../_model/usercredit.model';

@Injectable({ providedIn: 'root' })

export class UserCreditReportService {
  
  public component ="Reports";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) {}


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

  getDepartmentswithAudit(deptid,fromDate,toDate): Observable<DeptInfo[]> {
    console.log("deptId==>",deptid,fromDate,toDate);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCreditAuditLogByDeptId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);
      const url = _apiurlsdetials.url.replace("{deptid}", "" + deptid) + '?startdate=' + fromDate +'&enddate=' +toDate;
      return this.consumer.serviceConsumer<DeptInfo[]>(url, _apiurlsdetials.type, null, 'deptInfo');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getCreditAuditLogMutlitReport(type:number,searchdata):Observable<ICreditReportInfo[]>{
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, (type==0 ?"getCreditAuditLogByDeptIdMultiReport":"getCreditAuditLogByUserIdMutlitReport") )
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);
       return this.consumer.serviceConsumer<ICreditReportInfo[]>(_apiurlsdetials.url, _apiurlsdetials.type, searchdata, (type==0 ?'deptInfo':'usersAuditLogInfo'));
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getCreditAuditLogForGlobalUsers(fromDate, toDate): Observable<GlobalAuditLogInfo[]> {
    console.log("platformCredit==>", fromDate, toDate);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCreditAuditLogForGlobalUsers")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials);
      const url = _apiurlsdetials.url + '?startdate=' + fromDate + '&enddate=' + toDate;
      // console.log("URL1: ---->  ", _apiurlsdetials,url);
      return this.consumer.serviceConsumer<GlobalAuditLogInfo[]>(url, _apiurlsdetials.type, null, 'globalAuditLogInfo');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
 
  getCurrentDate(): Observable<Idate> {

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getCurrentDate")
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<Idate>(_apiurlsdetials.url, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}