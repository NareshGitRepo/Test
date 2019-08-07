
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ConsumerService } from '../../../_helpers/ConsumerService';
import { LoadApiUrls } from '../../../_helpers/api.urls';
import { FailData, IRegistration } from '../_model/failedModel';

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
    providedIn: 'root'
})
export class FailedRegistrationService {

    public component = "Reports";

    constructor(private apiUrls: LoadApiUrls, private consumer: ConsumerService) { }

    getFailedRegistration(successData: FailData): Observable<IRegistration[]> {
        console.log("ReportData==>", successData)
        let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod(this.component, "getFailedRegistrations")
        console.log("URL Get from config : =====> ", _apiurlsdetials);
        if (_apiurlsdetials) {
            console.log("URL Get from config : ----> ", _apiurlsdetials.url);
            return this.consumer.serviceConsumer<IRegistration[]>(_apiurlsdetials.url, _apiurlsdetials.type, successData, "registrations", 0);
        }
        else {
            console.log("URL Get from config : ----> ", "Url not found..");
            return Observable.throw({ error: { messages: "url not found" } });
        }
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log("worksheet", worksheet);
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ["data"]
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(
            data,
            fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
    }
}