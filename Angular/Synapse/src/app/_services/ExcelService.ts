import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';
import * as _ from 'lodash';


export interface DataColumn {
    cloumns: string[];
}
export interface DataRow {
    rows: string[];
}

export interface ExcelData {
    headerNames: string[];
    sheetNames: string[];
    activeSheet: string;
    sampleData: any;
    rowsCount: number;
    status: boolean;
    message: string;
}

export interface ExcelSheet {
    fileName: string;
    sheets: Sheet[];
    status: boolean;
    message: string;
    
}

export interface Sheet {
    sheetName: string;
    isHeaders: Details;
    headers: Details;
    data:any;
}

export interface Details {
    count: number;
    columnNames: string[];
}

export interface Item {
    id: number;
    name: string;
}

export class Excelservice {


public excelSheetData=[];

    static loadFile(file: File, isHeader: boolean, activeSheetName?: string) {

        console.log('isHeader:', isHeader, '-- activeSheetName:', activeSheetName);

        let finalData: ExcelData = {} as any;


        return new Promise((resolve, reject) => {

            const fileReader: FileReader = new FileReader();
            fileReader.onload = (event: any) => {

                const arrayBuffer = event.target.result,
                    data = new Uint8Array(arrayBuffer),
                    arr = new Array();

                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr: string = arr.join('');
                const workBook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
                console.log(' finalData =>', finalData);

                finalData.sheetNames = [];
                workBook.SheetNames.forEach(sheetName => {
                    finalData.sheetNames.push(sheetName);
                });

                if (!activeSheetName) {
                    activeSheetName = workBook.SheetNames[0];
                }

                if (activeSheetName) {
                    const ws: XLSX.WorkSheet = workBook.Sheets[activeSheetName];
                    let excelData: Array<Array<any>> = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: true, defval: 'empty' });
                    let columnSize = excelData[0].length;
                    let totalRows = excelData.length;
                    finalData.sheetNames = workBook.SheetNames;
                    finalData.activeSheet = activeSheetName;

                    let headers: string[] = [];
                    if (!isHeader) {
                        let i = 0;
                        _.times(columnSize, () => headers.push('C' + i++));
                        finalData.rowsCount = totalRows;
                    } else {
                        headers = excelData[0];
                        finalData.rowsCount = totalRows - 1;
                    }

                    console.log('excelData => headers ==>', headers);
                    console.log('excelData =>', excelData.length);
                    finalData.headerNames = headers;
                    finalData.status = true;
                }

            };

            fileReader.onerror = function (event) {
                finalData.message = 'File reading error';
                finalData.status = false;
                reject(finalData);
            };

            fileReader.onloadend = function (event) {
                console.log("File onloadend ", event);
                finalData.status = true;
                resolve(finalData);

            }
            fileReader.readAsArrayBuffer(file);
        });
    }

    static loadFileNew(file: File) {

        console.log('loadFileNew:');

        let excelSheet: ExcelSheet = {} as any;

        return new Promise((resolve, reject) => {

            const fileReader: FileReader = new FileReader();
            fileReader.onload = (event: any) => {
                const arrayBuffer = event.target.result,
                    data = new Uint8Array(arrayBuffer),
                    arr = new Array();
                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr: string = arr.join('');
                const workBook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', sheetRows: 10 });

                excelSheet.sheets = [];
                workBook.SheetNames.forEach(sheetName => {
                    const ws: XLSX.WorkSheet = workBook.Sheets[sheetName];
                    let excelData: Array<Array<any>> = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: true, defval: 'empty' });
                    let totalRows = excelData.length;
                    let isHeadersDetails: Details = {} as any;
                    isHeadersDetails.columnNames = excelData[0];
                    isHeadersDetails.count = totalRows - 1;

                    let headersDetails: Details = {} as any;
                    let headers: string[] = [];
                    let i = 0;
                    _.times(excelData[0].length, () => headers.push('C' + i++));

                    headersDetails.columnNames = headers;
                    headersDetails.count = totalRows;

                    let sheet: Sheet = {} as any;
                    sheet.sheetName = sheetName;
                    sheet.isHeaders = isHeadersDetails;
                    sheet.headers = headersDetails;
                    excelSheet.sheets.push(sheet);
                });
                excelSheet.status = true;
            };

            fileReader.onerror = function (event) {
                excelSheet.message = 'File reading error';
                excelSheet.status = false;
                reject(excelSheet);
            };

            fileReader.onloadend = function (event) {
                console.log("File onloadend ", excelSheet);
                resolve(excelSheet);

            }
            fileReader.readAsArrayBuffer(file);
        });
    }

    static loadFileExcel(file: File) {
        console.log('loadFileNew:');
        let excelSheet: ExcelSheet = {} as any;
        return new Promise((resolve, reject) => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = (event: any) => {
                const arrayBuffer = event.target.result,
                    data = new Uint8Array(arrayBuffer),
                    arr = new Array();
                let excelSheetData = [];
                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr: string = arr.join('');
                const workBook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', sheetRows: 10 });
                excelSheet.sheets = [];
                workBook.SheetNames.forEach(sheetName => {
                    const ws: XLSX.WorkSheet = workBook.Sheets[sheetName];
                    let _workSheetName: string = sheetName;
                    let excelData: Array<Array<any>> = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: true, defval: 'empty' });
                    let totalRows = excelData.length;
                    excelSheetData.push({ value: excelData, viewValue: _workSheetName });
                    let isHeadersDetails: Details = {} as any;
                    isHeadersDetails.columnNames = excelData[0];
                    isHeadersDetails.count = totalRows - 1;
                    let headersDetails: Details = {} as any;
                    let headers: string[] = [];
                    let i = 0;
                    _.times(excelData[0].length, () => headers.push('C' + i++));
                    headersDetails.columnNames = headers;
                    headersDetails.count = totalRows;
                    let sheet: Sheet = {} as any;
                    sheet.sheetName = sheetName;
                    sheet.isHeaders = isHeadersDetails;
                    sheet.headers = headersDetails;
                    sheet.data = excelSheetData;
                    excelSheet.sheets.push(sheet);
                    console.log("excelSheetData" + JSON.stringify(sheet.data ));
                });
                excelSheet.status = true;
                console.log("excelSheetData" + JSON.stringify(excelSheetData));
            };
            fileReader.onerror = function (event) {
                excelSheet.message = 'File reading error';
                excelSheet.status = false;
                reject(excelSheet);
            };
            fileReader.onloadend = function (event) {
                console.log("File onloadend ", excelSheet);
                resolve(excelSheet);
            }
            fileReader.readAsArrayBuffer(file);
        });
    }


}
