import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageTrackingReportsService } from '../_service/messagetracking.service';
import { IMessageTracking, Idate, dateType } from '../_model/messagetracking.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { environment } from '../../../../environments/environment';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { ITokenInfo, AppConfig, IUserUpdateDto } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare var jsPDF: any;
@Component({
  selector: 'app-messagetracking',
  templateUrl: './messagetracking.component.html',
  styleUrls: ['./messagetracking.component.scss']
})

export class MessagetrackingComponent implements OnInit {
  messageTrackingReportsForm: FormGroup;
  msgTrackingList: IMessageTracking[] = [];
  filteredMsgTrackingList: IMessageTracking[] = [];
  filtermsgTrackingList: IMessageTracking[] = [];
  public listPage = 0;
  pageSize = environment.pageSize;
  dataSource: MatTableDataSource<IMessageTracking>;

  displayedColumns = ['MobileNumber', 'Sender', 'Message', 'status', 'DeliveredTime', 'SubmittedTime', 'ReceivedTime', 'MessageId'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }];
  sourceDate: Date = new Date();
  msgTrackFromDate: Date;
  msgTrackToDate: Date;
  TrackType = ["Mobile", "messageId"];
  isMobile: boolean = false;
  selected_flag: boolean = false;
  isToday: boolean = false;
  submittedData: any;
  loading: boolean = false;
  msgTrackingFlag: boolean = false;
  loginInfo: IUserUpdateDto;
  _roleCode: string = '';
  tokenInfo: ITokenInfo;
  currentDateDate: Idate;
  constructor(private msgtrackingService: MessageTrackingReportsService,
    private alertMessage: AlertMessageService, private fb: FormBuilder, private appConfig: AppConfig, private router: Router,
    private datePipe: DatePipe, private translate: TranslateService, private arabicTTF: ArabicTtfValue, ) {
    this.tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
    }
    else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this.messageTrackingReportsForm = this.fb.group({
      dateType: [null, Validators.required],
      msgTrackFromDate: [null, Validators.required],
      msgTrackToDate: [null, Validators.required],
      msgTrackMobileNo: [null, Validators.required],
      msgTrackMessageId: [null, Validators.required],
      trackType: [null, Validators.required]
    });
    if (this.tokenInfo)
      this.getCurrentDate();

    this.messageTrackingReportsForm.get('dateType').setValue(dateType.Today);
    this.DateSelection(this.messageTrackingReportsForm.value.dateType)
    this.messageTrackingReportsForm.get('trackType').setValue("Mobile");
    this.TrackSelection(this.messageTrackingReportsForm.value.trackType);
  }
  getCurrentDate() {
    this.loading = true;
    this.msgtrackingService.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date();
      let currentDateTo = new Date();
      this.msgTrackToDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.msgTrackFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);

    });
  }
  DateSelection(selectedType) {
    console.log("selectedDateType==>", selectedType)
    if (selectedType == dateType.Today) {
      this.isToday = false;
      if (this.currentDateDate) {
        this.msgTrackFromDate = this.msgTrackToDate = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        console.log("msgTrackFromDate==>", this.msgTrackFromDate);
        console.log("msgTrackToDate==>", this.msgTrackToDate);
      } else {
        this.msgTrackFromDate = new Date();
        console.log("msgTrackFromDate==>", this.msgTrackFromDate);
        this.msgTrackToDate = new Date();
        console.log("msgTrackToDate==>", this.msgTrackToDate);
      }
      this.messageTrackingReportsForm.get('msgTrackToDate').clearValidators();
      this.messageTrackingReportsForm.get('msgTrackToDate').updateValueAndValidity();
      this.messageTrackingReportsForm.get('msgTrackFromDate').clearValidators();
      this.messageTrackingReportsForm.get('msgTrackFromDate').updateValueAndValidity();
      this.messageTrackingReportsForm.get('msgTrackFromDate').setValue(this.msgTrackFromDate + '')
      this.messageTrackingReportsForm.get('msgTrackToDate').setValue(this.msgTrackToDate + '');

    }
    else {
      this.isToday = true;
      this.messageTrackingReportsForm.get('msgTrackToDate').setValidators(Validators.required);
      this.messageTrackingReportsForm.get('msgTrackToDate').updateValueAndValidity();
      this.messageTrackingReportsForm.get('msgTrackFromDate').setValidators(Validators.required);
      this.messageTrackingReportsForm.get('msgTrackFromDate').updateValueAndValidity();
      this.messageTrackingReportsForm.get('msgTrackFromDate').setValue(null);
      this.messageTrackingReportsForm.get('msgTrackToDate').setValue(null);
      if (this.currentDateDate) {
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.msgTrackToDate = new Date(currentDateTo.setDate(currentDateTo.getDate()));
        this.msgTrackFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      else {
        let tdy = new Date();
        this.msgTrackFromDate = new Date(tdy.setMonth(tdy.getMonth() - 3));
        let tdy1 = new Date();
        this.msgTrackToDate = new Date(tdy1.setDate(tdy1.getDate()));
      }
    }
  }
  getListData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filtermsgTrackingList = this.msgTrackingList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("filtermsgTrackingList==>" + JSON.stringify(this.filtermsgTrackingList));
    this.dataSource = new MatTableDataSource(this.filtermsgTrackingList);
  }

  TrackSelection(selectedTrack) {
    console.log("selectedTrack:::::", selectedTrack);
    this.selected_flag = true;
    if (selectedTrack == "Mobile") {
      this.isMobile = true;
      this.messageTrackingReportsForm.get('msgTrackMessageId').setValue(null);
      this.messageTrackingReportsForm.get('msgTrackMobileNo').setValidators([Validators.required, Validators.maxLength(15)]);
      this.messageTrackingReportsForm.get('msgTrackMobileNo').updateValueAndValidity();
      this.messageTrackingReportsForm.get('msgTrackMessageId').clearValidators();
      this.messageTrackingReportsForm.get('msgTrackMessageId').updateValueAndValidity();

    }
    else {
      this.isMobile = false;
      this.messageTrackingReportsForm.get('msgTrackMobileNo').setValue(null);
      this.messageTrackingReportsForm.get('msgTrackMessageId').setValidators(Validators.required);
      this.messageTrackingReportsForm.get('msgTrackMessageId').updateValueAndValidity();
      this.messageTrackingReportsForm.get('msgTrackMobileNo').clearValidators();
      this.messageTrackingReportsForm.get('msgTrackMobileNo').updateValueAndValidity();
    }
  }

  onSubmit() {
    this.loading = true;
    console.log("hxrhfhzd====>", this.messageTrackingReportsForm);
    let fromdate = this.datePipe.transform(this.messageTrackingReportsForm.value.msgTrackFromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.messageTrackingReportsForm.value.msgTrackToDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";
    this.submittedData = {
      "selectionType": '' + this.messageTrackingReportsForm.value.dateType,
      "fromDate": fromdate,
      "toDate": todate,
      "mobileNumber": this.messageTrackingReportsForm.value.msgTrackMobileNo,
      "messageId": this.messageTrackingReportsForm.value.msgTrackMessageId
    }

    console.log("submittedData:::::", JSON.stringify(this.submittedData));
    this.msgtrackingService.getMessageTrackingReports(this.submittedData, this._roleCode).subscribe((result: IMessageTracking[]) => {
      console.log("Result", result);
      if (result.length > 0) {

        this.msgTrackingList = result;
        this.dataSource = new MatTableDataSource(this.msgTrackingList);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      }
      else {
        this.msgTrackingList = [];
        this.msgTrackingFlag = true;
      }
      this.loading = false;
    }, error => {
      this.msgTrackingList = [];
      this.msgTrackingFlag = true;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  ExportTOCsv() {
    console.log("msgTrackingList==>", JSON.stringify(this.msgTrackingList));
    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.msgTrackingList.map(data => _.pick(data, this.displayedColumns)), 'Message_Tracking_Reports_' + dateDownload, options);
  }

  ExportTOExcel() {
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.msgTrackingList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    /* save to file */
    XLSX.writeFile(wb, 'Message_Tracking_Reports_' + dateDownload + '.xlsx');
  }
  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let headers = [this.displayedColumns];
    let rows = [];
    let temp = [];
    this.msgTrackingList.forEach(element => {
      temp = [];
      headers[0].forEach(y => {
        temp.push(element[y + ''])
        //  console.log("element==>",element,y,element[y+'']);
      });
      console.log('temp==>', temp);
      rows.push(temp);
      console.log(headers, rows);
    });
    const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
    if (!isIEOrEdge) {
      doc.addFileToVFS('Amiri-Regular.ttf', this.arabicTTF.arbicTtfString);
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'normal');
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'bold');
      doc.setFont('arabicfont');
    }
    doc.autoTable({
      head: headers,
      body: rows,
      startY: false, tableWidth: 'auto', cellWidth: 'wrap',
      tableLineColor: 200, tableLineWidth: 0,
      columnStyles: {
        0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3:
          { cellWidth: 'auto' }, 4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' }, 6: { cellWidth: 'auto' }, 7: { cellWidth: 'auto' }, 8:
          { cellWidth: 'auto' }, 9: { cellWidth: 'auto' }, 10: { cellWidth: 'auto' }, 11: { cellWidth: 'auto' }, 12: { cellWidth: 'auto' }
      },
      headStyles: { theme: 'grid' },
      styles: {
        overflow: 'linebreak', cellWidth: 'wrap', font: "arabicfont",
        fontSize: 10,
        cellPadding: 8, overflowColumns: 'linebreak'
      },
    });
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");

    doc.save('Message_Tracking_Reports_' + dateDownload + '.pdf');
  }
  sortData() {
    this.dataSource.sort = this.sort
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
