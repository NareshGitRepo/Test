import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import readXlsxFile from 'read-excel-file';
import * as XLSX from 'xlsx';
import { Papa } from 'ngx-papaparse';

interface FileList {
  readonly length: number;
  item(index: number): File | null;
  [index: number]: File;
}

declare var FileList: {
  prototype: FileList;
  new(): FileList;
};
type AOA = Array<Array<any>>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UploadFiles';
  readMode = true;
  hideButton = true;
  fileList: FileList;
  fileList1:FileList;
  validFile: boolean = false;
  inValidFile: boolean = false;
  sheet:any=['Name','Job','Sal'];
  arrayBuffer:any;
  file:File;
  _excelSheetNames: string[] = [];
  excelSheetData = [];
   headersArr=[];
   columndata = [];
   selectedFile: File;
   fileText:any;
   header:any;
  constructor(private snackbar:MatSnackBar, private papa: Papa){ }

  opensnackbar(message:string, action:string){
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  FileUpload(event) {
   
    this.fileList = event.target.files;
    console.log("frmData=>1", event.target.files, this.fileList[0],event);
    console.log('In Lincense upload event.target.files[0] :: ', JSON.stringify(event.target));

    if (this.fileList.length > 0) {
      const file: File = this.fileList[0];
      const extension = (file.name as string).split('.').pop();
        if (extension == 'xlsx' || extension == 'xls') {
          const reader: FileReader = new FileReader();
          reader.onload = (e: any) => {
            const arrayBuffer = e.target.result,
              data = new Uint8Array(arrayBuffer),
              arr = new Array();
            for (let i = 0; i !== data.length; ++i) {
              arr[i] = String.fromCharCode(data[i]);
            }    
            //read work book
          const bstr: string = arr.join('');
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          wb.SheetNames.forEach(element => {
            this._excelSheetNames.push(element);
            console.log('excelsheet',this._excelSheetNames);
            let wsname: string = element;
            let ws: XLSX.WorkSheet = wb.Sheets[wsname];
            let data1 = (<AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 })));
            console.log('data1',data1);
            this.excelSheetData.push({ value: data1, viewValue: wsname });
            console.log(this.excelSheetData);
            this.headersArr=data1[0];
          });
          console.log("", this.headersArr);
          console.log('excelSheetData=>',this.excelSheetData);
        };
         reader.readAsArrayBuffer(file);
          this.opensnackbar('File Upload','Success');
        } else {
          // this.imageSrc = event.target.result;
         
          this.opensnackbar('File Upload','Failed');
        }
    }
   } //fileupload

   getHeaders(sheetName){console.log('sheetname=>',sheetName);
    this.columndata = this.excelSheetData.filter(x => x.viewValue == sheetName)[0].value[0];  
    console.log('columndata',this.columndata);
   }

   FileUpload1(event){
    this.fileList = event.target.files;
    console.log("frmData=>1", event.target.files, this.fileList[0],event);
    console.log('In Lincense upload event.target.files[0] :: ', JSON.stringify(event.target));

    if (this.fileList.length > 0) {
      const file: File = this.fileList[0];
      let extension = (file.name as string).split('.').pop();
      if (extension == "txt" || extension == "csv") {
      this.selectedFile = this.fileList[0];
      console.log('selectedFile',this.selectedFile);
      
      this.papa.parse(file, { 
        delimiter: ',', header: false, newline: '\r\n',
        beforeFirstChunk: (chunk: string) => {
          return chunk
        },
        complete: (results) => {
          console.log("results=>", results);
          if (results.data.length > 0) {
            this.fileText = results.data;
            console.log('fileText',this.fileText);
            this.header=this.fileText[0];
            console.log('fileText',this.fileText[0]); 
            console.log("columns=>", this.fileText[0].filter(x => (x + '').trim() != '')); 
            this.opensnackbar('File Upload','Success');
          }  
          else{  this.opensnackbar('File Upload','Failed');}
        }  
      });
    } //if
    else{  this.opensnackbar('File Upload Only Text ','Retry'); }
   } //if
  } //fileupload1
  getData(value){
    console.log('value',value);
    
    
  }
}