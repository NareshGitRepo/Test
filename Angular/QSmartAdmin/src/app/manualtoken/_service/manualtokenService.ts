import { Injectable } from '@angular/core';
import * as XLSX from "xlsx";
import { Observable } from 'rxjs';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { IDepartmentList, IResponse, ICreateManual, IDeptService, Doctor, Department, IPrinter } from '../_model/manulaToken.model';



const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: 'root'
})
export class ManualTokenService {


  public component = "ManualTokens";

  constructor(private consumer: ConsumerService, private apiUrls: LoadApiUrls) { }

  getDeptAndServicesByUserId(): Observable<Department[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDeptAndServicesByUserId");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<Department[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'departments');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getAllDoctorsByServiceId(serviceid): Observable<Doctor[]> {
    console.log('serviceid', serviceid);

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllDoctorsByServiceId");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url.replace("{serviceid}", "" + serviceid);
      console.log("URL Get from config : ----> ", _apiUrl);
      // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<Doctor[]>(_apiUrl, _apiurlsdetials.type, null, 'doctors');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getPrintersByFloorId(): Observable<IPrinter[]> {

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPrintersByFloorId");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;
      console.log("URL Get from config : ----> ", _apiUrl);
      // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IPrinter[]>(_apiUrl, _apiurlsdetials.type, null, 'printers');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  printToken(printId:number,ticketId:number): Observable<IResponse> {

    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "printToken");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url.replace("{printerid}", "" + printId).replace("{tokenid}", "" + ticketId);;
      console.log("URL Get from config : ----> ", _apiUrl);
      // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiUrl, _apiurlsdetials.type, null, '');
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }




  generateManualToken(manualTokenData: ICreateManual): Observable<IResponse> {
    console.log(status)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "generateManualToken");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IResponse>(_apiurlsdetials.url, _apiurlsdetials.type, manualTokenData);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

}