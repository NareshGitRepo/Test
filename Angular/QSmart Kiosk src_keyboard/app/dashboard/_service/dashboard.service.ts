import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { Observable } from "rxjs";
import { ConsumerService } from '../../_helpers/ConsumerService';
import { IDashboard } from '../_model/IDashboard';
import { AppConfig } from '../../_helpers/app.config';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    tokenNumber: number = 0;
    public component = "Dashboard";
    
    private _defaultKioskid: string;

    public get defaultKioskid(): string {
        return this._defaultKioskid;
    }
    
    public set defaultKioskid(value: string) {
        this._defaultKioskid = value;
    }

    constructor(private http: HttpClient, private apiUrls: LoadApiUrls, private appConfig:AppConfig,private consumer: ConsumerService) { }

    getMenuInfo(): Observable<IDashboard> {

        const _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getMenusByKioskId");
        //console.log("_apiurlsdetials:" + _apiurlsdetials);
        const url = _apiurlsdetials.url.replace("{kioskid}", this.appConfig.getKiosk());
        if (_apiurlsdetials) {
            console.log("DashboardService: getMenuInfo: ---->  ", url);
            return this.consumer.serviceConsumer<IDashboard>(url, _apiurlsdetials.type, '', '', 0);
        } else {
            console.log("DashboardService: getMenuInfo: ---->  ", "Url not found..");
            return Observable.throw({ error: { message: "url not found" } });
        }

    }

    generateTokenPrinter(name: any, department: any, token: any, menuId: any) {

        console.log("PrinterUrl ::" + this.apiUrls.getPrinterUrl());
        console.log("Printer Status ::" + this.appConfig.getPrinterStatus());
        if (this.apiUrls.getPrinterUrl() && this.apiUrls.getPrinterUrl() != "NA") {
            if (this.appConfig.getPrinterStatus() == "1" && token != 0) {

                const url = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "generateTokenPrinter")
                    .printUrl.replace("{token}", token).replace("{department}", department)
                    .replace("{tokenType}", menuId).replace("{name}", name);
                console.log("url : ---->  ", url);

                return new Promise(resolve => {
                    this.http.get(url).subscribe(data => {
                        resolve(data);
                        console.log("Response : " + JSON.stringify(data));
                    }, error => {
                        console.log("Printer URL Error :: " + JSON.stringify(error));
                    });
                });
            } else {
                console.log("Printer Status is not Valid .......");
            }
        } else {
            console.log("Printer Url is not Exist .......");
        }

    }

    generateTokenPrinterPost(name: string, department: string, token: any, menuId: any, template: string) {

        //const body = { 'template ': 'Successfully sent' };
        //const headers = new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8');

        console.log("PrinterUrl ::" + this.apiUrls.getPrinterUrl());
        console.log("Printer Status ::" + this.appConfig.getPrinterStatus());
      
        if (this.apiUrls.getPrinterUrl() && this.apiUrls.getPrinterUrl() != "NA") {
            if (this.appConfig.getPrinterStatus() == "1" && token != 0) {

                console.log("Template ::" + template);

                const url = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "generateTokenPrinter");
                    // .printUrl.replace("{token}", token).replace("{department}", department)
                    // .replace("{tokenType}", menuId).replace("{name}", name);

                console.log("url : ---->  ", url);

                return new Promise(resolve => {
                    this.http.post<any>(url.printUrl, template).subscribe(data => {
                        resolve(data);
                        console.log("Http post url Response : " + JSON.stringify(data))
                    }, error => {
                        console.log("Printer URL Error :: " + JSON.stringify(error));
                    });
                });

            } else {
                console.log("Printer Status is not Valid .......");
            }
        } else {
            console.log("Printer Url is not Exist .......");
        }
    }

}
