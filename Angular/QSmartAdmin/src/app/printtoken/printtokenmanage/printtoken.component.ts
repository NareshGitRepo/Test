import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PrintTokenService } from '../_service/printtokenService';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ITokens, IPrintTokenData, IPrintResponse, IPrinter, IResponse } from '../_model/printtoken.model';
import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-printtoken',
  templateUrl: './printtoken.component.html',
  styleUrls: ['./printtoken.component.scss']
})
export class PrinttokenManageComponent implements OnInit {

  printTokenForm: FormGroup;
  loading: boolean = false;
  dataFlag: boolean = false;
  dataSourceList: boolean = false;
  [x: string]: any;
  displayedColumns: string[] = ['mrnNo', 'tokenNo', 'apptDate', 'doctorname', 'patientName', 'serviceEngName', 'action'];
  tokensList: ITokens[];
  filterToken: ITokens[];
  initPage = 0;
  pageSize = environment.pageSize;
  PrinterData: IPrinter[] = [];
  PrinterId: number = 0;
  dataSource;
  constructor(private printTokenService: PrintTokenService, private fb: FormBuilder,
    private datePipe: DatePipe, private translate: TranslateService, private router: Router,
    private alertMessage: AlertMessageService) {

  }

  ngOnInit() {
    this.printTokenForm = this.fb.group({
      mrnNumber: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
    });
    this.getPrintersByFloorId();
  }
  getPrintersByFloorId() {
    this.loading = true;
    this.printTokenService.getPrintersByFloorId().subscribe((response: IPrinter[]) => {
      this.PrinterData = response;
      console.log('response=>', response)
      this.loading = false;
    }, err => {
      this.PrinterData = [];
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.loading = false;
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
    });
  }
  getprintTokens() {
    this.loading = true;

    // this.printTokenForm.get('mrNumber').setValue(mrNumber);
    if (this.printTokenForm.value.mrnNumber)

      this.printTokenService.getAllTokensInfo((this.printTokenForm.value.mrnNumber as string).trim()).subscribe((result: ITokens[]) => {
        console.log("Result from Server::::::::", result);
        if (result != null && result.length > 0) {
          this.tokensList = result;
          this.geListData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.dataSource = new MatTableDataSource(this.filterToken);
          this.dataFlag = false;
          this.loading = false;
          this.dataSourceList = true;
        }
        else {
          this.dataFlag = true;
          this.loading = false;
          this.dataSourceList = false;
        }
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }
  clearTokens() {
    this.tokensList = [];
    this.dataSource = [];
    this.dataSourceList = false;
  }
  geListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.tokensList=>", this.tokensList);

    this.filterToken = this.tokensList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterToken);
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  print(tokenData: ITokens): void {
    console.log('TokenData=>', tokenData);
    if (tokenData != null) {
      if (this.PrinterId == 0) {
        let printTokenData = {
          apptDate: tokenData.apptDate,
          deptEngName: tokenData.deptEngName,
          floorEngName: tokenData.floorEngName,
          mrnNo: tokenData.mrnNo,
          serviceArbName: tokenData.serviceArbName,
          serviceEngName: tokenData.serviceEngName,
          tokenNo: tokenData.tokenNo,
        } as IPrintTokenData;
        console.log("Result from Server::::::::", printTokenData);
        this.printTokenService.getPrintingTokenData(printTokenData).subscribe((result: IPrintResponse) => {
          console.log("Result from Server::::::::", result);
          if (result.status) {
            let printContents, popupWin;
            printContents = result.template;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
            );
            popupWin.document.close();
            this.loading = false;
          }
          else {
            if (!result.status) {
              let message = result.messages as string
              this.showAlert(message, ActionType.FAILED);
              this.loading = false;
            }
          }
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
      }
      else {
        this.loading = true;
  
          this.printTokenService.printToken(this.PrinterId, tokenData.ticketId).subscribe((response: IResponse) => {
            if (response.status)
            this.showAlert(response.messages, ActionType.SUCCESS);
            else
            this.showAlert(response.messages, ActionType.ERROR);
            this.loading = false;
          }, err => {
            let message = err.error.messages as string
            let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
            console.log("Failed :: ", JSON.stringify(err));
            this.showAlert(errorMessage, ActionType.ERROR, err.status);
            this.loading = false;
          });
      }
    }
  }
}

