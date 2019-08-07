import { Injectable } from '@angular/core';
import * as XLSX from "xlsx";
import { Observable } from 'rxjs';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { LoadApiUrls } from '../../_helpers/api.urls';

import { IPrintTokenData, ITokens, IPrintResponse, IPrinter, IResponse } from '../_model/printtoken.model';


const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: 'root'
})
export class PrintTokenService {


  public component = "PrintTokens";

  constructor(private consumer: ConsumerService, private apiUrls: LoadApiUrls) { }


  getAllTokensInfo(mrnno: string): Observable<ITokens[]> {
    console.log(status)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllTokensInfo");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url.replace("{mrnno}", "" + mrnno);
      console.log("URL Get from config : ----> ", _apiUrl);
      // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<ITokens[]>(_apiUrl, _apiurlsdetials.type, null, 'tokens');
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
  getPrintingTokenData(printTokenData: IPrintTokenData): Observable<IPrintResponse> {
    console.log(status)
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPrintingTokenData");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      // console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IPrintResponse>(_apiurlsdetials.url, _apiurlsdetials.type, printTokenData);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}