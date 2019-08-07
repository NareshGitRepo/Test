import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { IKiosk, IkioskResponse, IDisplay, IMenu, IprinterList, ICreateKiosk, IKioskStatus, IDepartements, IDisplayResponse, IPrinter, IPrintersData, IPrinterStatus, IDisplayStatus, Level, Floor, IDisplayBoard } from '../_model/devicesModel';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DevicesService {

  public component = "Devices";

  constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }


  getlevelsDeptSeviceInfo(): Observable<Floor[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFloorsWithDeptsByFacilitateId");
    if (_apiurlsdetials) {
      console.log("DevicesService: getlevelsDeptSeviceInfo: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<Floor[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'floors');
    } else {
      console.log("DevicesService: getlevelsDeptSeviceInfo: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getlevelsInfo(): Observable<Level[]> {
    const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getLevelsByOrgId");
    if (_apiurlsdetials) {
      console.log("DevicesService: getlevelsInfo: ---->  ", _apiurlsdetials);
      return this.consumer.serviceConsumer<Level[]>(_apiurlsdetials.url, _apiurlsdetials.type, null, 'levels');
    } else {
      console.log("DevicesService: getlevelsInfo: ---->  ", "Url not found..");
      return Observable.throw({ error: { message: "url not found" } });
    }
  }

  getAllDisplayBoardsByOrgid(): Observable<IDisplayBoard[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllDisplayBoardsByOrgid")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<IDisplayBoard[]>(_apiurlsdetials.url, _apiurlsdetials.type, '', 'displayBoards');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
  getKioskUrl(kioskid: any) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getKioskUrl")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{kioskid}", kioskid);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiUrl, _apiurlsdetials.type, null);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getDisplayUrl(displayid: any) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDisplayUrl")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{displayid}", displayid);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiUrl, _apiurlsdetials.type, null);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getPrinters(): Observable<IprinterList[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPrintersByDest")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<IprinterList[]>(_apiurlsdetials.url, _apiurlsdetials.type, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validateKioskName(kioskname: string, levelId: string): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateKioskName")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{kioskName}", kioskname).replace("{levelId}", levelId);
      console.log("URL Get from config : =====>  ", _apiUrl);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiUrl, _apiurlsdetials.type, null);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validateKioskIpAddress(kioskIp: any): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateKioskIpAddress")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{kioskIp}", kioskIp);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiUrl, _apiurlsdetials.type, null);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validateDisplayName(displayName: string, levelId: string): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validateDisplayName")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{displayName}", displayName).replace("{levelId}", levelId);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiUrl, _apiurlsdetials.type, null);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  validatePrinterName(printerName: string, levelId: string): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "validatePrinterName")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);
      let _apiUrl = _apiurlsdetials.url.replace("{printerName}", printerName).replace("{levelId}", levelId);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiUrl, _apiurlsdetials.type, null);
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  addKiosk(_addKiosk: ICreateKiosk): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "addKiosk");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _addKiosk);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateKiosk(_editDetails: ICreateKiosk): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateKiosk");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _editDetails);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getPrintersByDest(): Observable<IprinterList[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPrintersByDestModified")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<IprinterList[]>(_apiurlsdetials.url, _apiurlsdetials.type, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getKioskbyOrgid(): Observable<IKiosk[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getKioskbyOrgid")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<IKiosk[]>(_apiurlsdetials.url, _apiurlsdetials.type, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getPrintersbyOrgid(): Observable<IPrinter[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getPrintersByOrgId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<IPrinter[]>(_apiurlsdetials.url, _apiurlsdetials.type, '', 'printers');
      // return this.consumer.serviceConsumer<IPrinter[]>(_apiurlsdetials.url, _apiurlsdetials.type, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getDepartementsInfo(value?: number): Observable<IDepartements[]> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getDepartmentsByFacilitateId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = value ? _apiurlsdetials.url.replace('{clientid}', value + '') : _apiurlsdetials.url;
      console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumer.serviceConsumer<IDepartements[]>(_apiUrl, _apiurlsdetials.type, null, 'departmentGetDto');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  createPrinter(_addPrinter: IPrintersData): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "createPrinter");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _addPrinter);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  UpdatePrinter(_editPrinter: IPrintersData): Observable<IkioskResponse> {
    console.log("Printer ::" + JSON.stringify(_editPrinter));
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "UpdatePrinter");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _editPrinter);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateStatusByKioskId(status: IKioskStatus): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateStatusByKioskId");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, status);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateStatusByDisplayId(display: IDisplayStatus) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateStatusByDisplayId");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = display.displayId ? _apiurlsdetials.url.replace('{dispId}', display.displayId + '') : _apiurlsdetials.url;
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiUrl + "?status=" + display.status, _apiurlsdetials.type, display);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateStatusByPrinterId(printer: IPrinterStatus) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateStatusByPrinterId");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, printer);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  addDisplay(displayDetails: IDisplay): Observable<IkioskResponse> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "addDisplay");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, displayDetails);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  updateDisplay(_editDisplay: IDisplay) {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "updateDisplay");
    console.log("URL Get from config : =====> ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ----> ", _apiurlsdetials.url);
      return this.consumer.serviceConsumer<IkioskResponse>(_apiurlsdetials.url, _apiurlsdetials.type, _editDisplay);
    }
    else {
      console.log("URL Get from config : ----> ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }

  getAllMenus(): Observable<IMenu> {
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getAllMenus")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      return this.consumer.serviceConsumer<IMenu>(_apiurlsdetials.url, _apiurlsdetials.type, '');
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
      return Observable.throw({ error: { messages: "url not found" } });
    }
  }
}