import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IEmail2SMSReport, User, Department, Idate } from '../_model/email2smsreports.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { Email2SmsService } from '../_service/email2smsreports.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare let jsPDF;

@Component({
  selector: 'app-emailtosmsreports',
  templateUrl: './emailtosmsreports.component.html',
  styleUrls: ['./emailtosmsreports.component.scss']
})
export class EmailtosmsreportsComponent implements OnInit {
  email2SmsReportsFlag: boolean = false;
  email2SmsReportsForm: FormGroup;
  email2SmsReportsList: IEmail2SMSReport[] = [];
  dataSource: MatTableDataSource<IEmail2SMSReport>;
  displayedColumns = ['campaignName', 'userName', 'fromEmail', 'message', 'mobileNumberCount', 'formatName', 'senderName', 'receivedTime', 'submitTime', 'reason'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loginInfo: IUserUpdateDto;
  loading: boolean = false;
  _roleCode: string = "";
  fromDate: Date;
  toDate: Date;
  usersList: User[] = [];
  departmentWithUsersList: Department[] = [];
  filterEmailSmsReportsList: IEmail2SMSReport[] = [];
  pageSize = environment.pageSize;
  listPage = 0;
  currentDateDate: Idate;
  tokenInfo: ITokenInfo;
  constructor(private fb: FormBuilder, private _service: Email2SmsService, private appconfig: AppConfig, private arabicTTF: ArabicTtfValue,
    private router: Router, private alertMessage: AlertMessageService, private translate: TranslateService, private datePipe: DatePipe) {
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    } else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this.email2SmsReportsForm = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });

    if (this.tokenInfo) {
      this.loading = true;
      this.getCurrentDate();
    }
  }

  getCurrentDate() {
    this._service.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.toDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
        this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
      let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
      this.toDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
    });
  }

  onSubmit() {
    this.loading = true;
    let fromdate = this.datePipe.transform(this.email2SmsReportsForm.value.fromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.email2SmsReportsForm.value.toDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";
    let searchData = {
      "fromDate": fromdate,
      "toDate": todate,
    };
    console.log('searchData', JSON.stringify(searchData));
    this.loading = true;
    this._service.getEmail2SmsReports(searchData).subscribe((result: IEmail2SMSReport[]) => {
      if (result.length > 0) {
        console.log("EmailToSMSReports Response==>Active", result)
        this.email2SmsReportsList = result;
        this.dataSource = new MatTableDataSource(this.email2SmsReportsList);
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.email2SmsReportsFlag = false;
      } else {
        this.email2SmsReportsList = [];
        this.email2SmsReportsFlag = true;
      }
      this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("EmailToSMSReports E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  sortData() {
    this.dataSource.sort = this.sort;
  }

  getListData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterEmailSmsReportsList = this.email2SmsReportsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("IemailSmsReportsList==>" + JSON.stringify(this.filterEmailSmsReportsList));
    this.dataSource = new MatTableDataSource(this.filterEmailSmsReportsList);
  }

  getDetails() {
    this.loading = true;
    this._service.getDepartmentswithUser().subscribe((result: Department[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.departmentWithUsersList = result;
        console.log('departmentWithUsersList=>', this.departmentWithUsersList, this.loginInfo);
        if (userType.DepartementAdmin == this._roleCode) {
          this.email2SmsReportsForm.get('department').setValue(this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0);
          let index = this.departmentWithUsersList.findIndex(x => x.deptId == (this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0));
          if (index != -1) {
            this.usersList = this.departmentWithUsersList[index].users;
          }
        }
      }
      this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDetails==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  departSelected() {
    console.log("department=>", this.email2SmsReportsForm.value.department);
    this.email2SmsReportsForm.get('user').setValue(null);
    this.usersList = [];
    let deptData = (this.email2SmsReportsForm.value.department) as Department;
    if (this.email2SmsReportsForm.value.department != null) {
      let index = this.departmentWithUsersList.findIndex(x => x.deptId == deptData.deptId);
      if (index != -1) {
        this.usersList = this.departmentWithUsersList[index].users;
      }
    }
  }

  ExportTOCsv() {
    //console.log("email2SmsReportsList==>", JSON.stringify(this.email2SmsReportsList));
    var options = {
      noDownload: false,
      headers: this.displayedColumns
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.email2SmsReportsList.map(data => _.pick(data, this.displayedColumns)), 'EmailToSMS_Reports_' + dateDownload, options);
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.email2SmsReportsList.map(data => _.pick(data, this.displayedColumns)));
    console.log("email2SmsReportsList==>", this.email2SmsReportsList.map(data => _.pick(data, this.displayedColumns)))
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    /* save to file */
    XLSX.writeFile(wb, 'EmailToSMS_Reports_' + dateDownload + '.xlsx');
  }

  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let getColumnHeaders = [['campaignName', 'userName', 'fromEmail', 'message', 'mobileNumberCount', 'formatName', 'senderName', 'receivedTime', 'submitTime', 'reason']];
    let groupedDataRows = [];
    this.email2SmsReportsList.forEach(item => {
      let temp = [item.campaignName,
      item.userName,
      item.fromEmail,
      item.message,
      item.mobileNumberCount,
      item.formatName,
      item.senderName,
      item.receivedTime,
      item.submitTime,
      item.reason];
      groupedDataRows.push(temp);
    });
    console.log("Email2Sms reports groupedDataRows==>", groupedDataRows);
    console.log("GETFONTS==>", doc.getFontList());

    const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
    if (!isIEOrEdge) {
      doc.addFileToVFS('Amiri-Regular.ttf', this.arabicTTF.arbicTtfString);
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'normal');
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'bold');
      doc.setFont('arabicfont');
    }
    doc.autoTable({
      head: getColumnHeaders,
      body: groupedDataRows,
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
    doc.save('Email2SMS_Reports_' + dateDownload + '.pdf');
  }
}