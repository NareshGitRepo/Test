import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Department, ISMS2EmailReport, Idate } from '../_model/sms2emailreports.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { TranslateService } from '@ngx-translate/core';
import { SMS2EmailService } from '../_service/sms2emailreports.service';
import { environment } from '../../../../environments/environment';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare let jsPDF;
@Component({
  selector: 'app-emailtosmsreports',
  templateUrl: './smstoemailreports.component.html',
  styleUrls: ['./smstoemailreports.component.scss']
})
export class SMStoEmailReportsComponent implements OnInit {
  sms2EmailReportsFlag: boolean = false;
  sms2EmailReportsForm: FormGroup;
  sms2EmailReportsList: ISMS2EmailReport[] = [];
  filtersms2EmailReportsList: ISMS2EmailReport[] = [];
  dataSource: MatTableDataSource<ISMS2EmailReport>;
  displayedColumns = ['senderName', 'message', 'mobileNo', 'forwardMailTolist', 'forwardMailCclist', 'receivedDate', 'forwardTime', 'reason'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loginInfo: IUserUpdateDto;
  loading: boolean = false;
  _roleCode: string = "";
  fromDate: Date;
  toDate: Date;
  tokenInfo: ITokenInfo
  usersList: User[] = [];
  pageSize = environment.pageSize;
  public listPage = 0;
  currentDateDate: Idate;
  departmentWithUsersList: Department[] = [];
  constructor(private fb: FormBuilder, private _service: SMS2EmailService, private appconfig: AppConfig,
    private router: Router, private alertMessage: AlertMessageService, private arabicTTF: ArabicTtfValue,
    private translate: TranslateService, private datePipe: DatePipe) {
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    }
    else
      this.router.navigate(['401'])
  }

  ngOnInit() {
    this.sms2EmailReportsForm = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    if (this.tokenInfo) {
      this.getcurrentDate()
    }
  }
  getcurrentDate() {
    this.loading = true
    this._service.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.toDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
        this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      this.loading = false
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
      let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
      this.toDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
      this.loading = false
    });
  }

  onSubmit() {
    this.loading = true;
    let fromdate = this.datePipe.transform(this.sms2EmailReportsForm.value.fromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.sms2EmailReportsForm.value.toDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";
    let searchData = {
      "fromDate": fromdate,
      "toDate": todate,
      // "selectionType": this.sms2EmailReportsForm.value.dateType,
      //"userId": this.sms2EmailReportsForm.value.user
    };
    console.log('searchData', JSON.stringify(searchData));
    this.loading = true;
    this._service.getSMS2EmailReports(searchData).subscribe((result: ISMS2EmailReport[]) => {
      if (result.length > 0) {
        console.log("SMSToEmailReports Response==>Active", result)
        this.sms2EmailReportsList = result;
        this.dataSource = new MatTableDataSource(this.sms2EmailReportsList);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.sms2EmailReportsFlag = false;
      } else {
        this.sms2EmailReportsList = [];
        this.sms2EmailReportsFlag = true;
      }
      this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("SmsToEmailReports E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getListData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filtersms2EmailReportsList = this.sms2EmailReportsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("filtersms2EmailReportsList==>" + JSON.stringify(this.filtersms2EmailReportsList));
    this.dataSource = new MatTableDataSource(this.filtersms2EmailReportsList);
  }


  sortData() {
    this.dataSource.sort = this.sort;
  }

  getDetails() {
    this.loading = true;
    this._service.getDepartmentswithUser().subscribe((result: Department[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.departmentWithUsersList = result;
        console.log('departmentWithUsersList=>', this.departmentWithUsersList, this.loginInfo);
        if (userType.DepartementAdmin == this._roleCode) {
          this.sms2EmailReportsForm.get('department').setValue(this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0);
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
    console.log("department=>", this.sms2EmailReportsForm.value.department);
    this.sms2EmailReportsForm.get('user').setValue(null);
    this.usersList = [];
    let deptData = (this.sms2EmailReportsForm.value.department) as Department;
    if (this.sms2EmailReportsForm.value.department != null) {
      let index = this.departmentWithUsersList.findIndex(x => x.deptId == deptData.deptId);
      if (index != -1) {
        this.usersList = this.departmentWithUsersList[index].users;
      }
    }
  }

  ExportTOCsv() {

    console.log("sms2EmailReportsList==>", JSON.stringify(this.sms2EmailReportsList));

    var options = {
      noDownload: false,
      headers: this.displayedColumns
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.sms2EmailReportsList.map(data => _.pick(data, this.displayedColumns)), 'SmsToEmail_Reports_' + dateDownload, options);
  }

  ExportTOExcel() {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.sms2EmailReportsList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    /* save to file */
    XLSX.writeFile(wb, 'SmsToEmail_Reports_' + dateDownload + '.xlsx');

  }
  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let getColumnHeaders = [['senderName', 'message', 'mobileNo', 'forwardMailTolist', 'forwardMailCclist', 'receivedDate', 'forwardTime', 'reason']];
    let groupedDataRows = [];

    this.sms2EmailReportsList.forEach(item => {
      let temp = [item.senderName,
      item.message,
      item.mobileNo,
      item.forwardMailTolist, item.forwardMailCclist, item.receivedDate, item.forwardTime, item.reason];
      groupedDataRows.push(temp);
    });
    console.log("Smstoemail reports groupedDataRows==>", groupedDataRows);
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
        0: { cellWidth: 'auto' }, 1: { cellWidth: 200 }, 2: { cellWidth: 'auto' }, 3:
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
    doc.save('SmstoEmail_Reports' + dateDownload + '.pdf');
  }

}
