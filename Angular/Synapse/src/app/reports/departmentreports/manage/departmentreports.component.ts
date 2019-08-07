import * as XLSX from 'xlsx';
import * as _ from 'lodash';

import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType } from '../../../_helpers/app.config';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDepartmentRep, IDepartmentReport, Idate, dateType } from '../_model/departmentreports.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { DatePipe } from '@angular/common';
import { DepartmentReportsService } from '../_service/departmentreports.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare let jsPDF;

@Component({
  selector: 'app-departmentreports',
  templateUrl: './departmentreports.component.html',
  styleUrls: ['./departmentreports.component.scss']
})
export class DepartmentreportsComponent implements OnInit {
  public initPage = 0;
  public listPage = 0;
  public pageSize = environment.pageSize;
  loginInfo: IUserUpdateDto;
  departmentReportsForm: FormGroup;
  departmentReportsList: IDepartmentReport[] = [];
  filterListdepartments: IDepartmentReport[] = [];
  filterdepartmentReportsList: IDepartmentReport[] = [];
  dataSource: MatTableDataSource<IDepartmentReport>;
  displayedColumns = ['Date', 'Department', 'Sent', 'Delivered', 'Failed'];
  dateFormatFlag = false;
  _roleCode: string = "";
  departmentWithUsersList: IDepartmentRep[] = []
  loading: boolean = false;
  departmentFromDate: Date;
  departmentToDate: Date;
  isToday: boolean = false;
  tokenInfo: ITokenInfo;
  currentDateDate: Idate;
  deptName: string = '';
  gridLoad = false;
  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private fb: FormBuilder, private alertMessage: AlertMessageService, private translate: TranslateService, private arabicTTF: ArabicTtfValue,
    private departmentService: DepartmentReportsService, private cdref: ChangeDetectorRef, private appconfig: AppConfig, private datePipe: DatePipe) {
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
    this.departmentReportsForm = this.fb.group({
      departmentName: [''],
      dateType: [null, Validators.required],
      departmentFromDate: ['', Validators.required],
      departmentToDate: ['', Validators.required]
    });

    if (this.tokenInfo) {
      this.loading = true;
      this.getCurrentDate();
    }
  }
  getCurrentDate() {
    this.departmentService.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
      }
      this.AfterCurrentDateLoading();
    }, error => {
      this.loading = false;
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      console.error("E-onSubmit==>", JSON.stringify(error));
      let currentDateFrom = new Date();
      let currentDateTo = new Date();
      this.departmentToDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.departmentFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
      this.AfterCurrentDateLoading();
    });
  }
  AfterCurrentDateLoading() {
    this.loading = true;
    this.departmentReportsForm.get('dateType').setValue(dateType.Today);
    if (userType.SuperAdmin == this._roleCode || userType.PlatFormAdmin == this._roleCode)
      this.getDetails(true);
    else {
      this.departmentReportsForm.patchValue({
        departmentName: this.loginInfo.depts.length > 0 ? [this.loginInfo.depts[0].deptId] : 0
      });
      this.DateSelection(this.departmentReportsForm.value.dateType);
    }
  }
  DateSelection(selectedType) {
    console.log("selectedDateType==>", selectedType)
    if (selectedType == dateType.Today) {
      this.isToday = false;
      if (this.currentDateDate) {
        this.departmentFromDate = this.departmentToDate = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        console.log("departmentFromDate==>", this.departmentFromDate);
        console.log("departmentToDate==>", this.departmentToDate);
      }
      else {
        this.departmentFromDate = new Date();
        console.log("departmentFromDate", this.departmentFromDate);
        this.departmentToDate = new Date();
        console.log("departmentToDate==>", this.departmentToDate);
      }
      this.departmentReportsForm.get('departmentToDate').clearValidators();
      this.departmentReportsForm.get('departmentToDate').updateValueAndValidity();
      this.departmentReportsForm.get('departmentFromDate').clearValidators();
      this.departmentReportsForm.get('departmentFromDate').updateValueAndValidity();
      this.departmentReportsForm.get('departmentFromDate').setValue(this.departmentFromDate + '')
      this.departmentReportsForm.get('departmentToDate').setValue(this.departmentToDate + '');
    }
    else {
      this.isToday = true;
      this.departmentReportsForm.get('departmentToDate').setValidators(Validators.required);
      this.departmentReportsForm.get('departmentToDate').updateValueAndValidity();
      this.departmentReportsForm.get('departmentFromDate').setValidators(Validators.required);
      this.departmentReportsForm.get('departmentFromDate').updateValueAndValidity();
      this.departmentReportsForm.get('departmentFromDate').setValue(null);
      this.departmentReportsForm.get('departmentToDate').setValue(null);
      if (this.currentDateDate) {
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.departmentToDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
        this.departmentFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      else {
        let tdy = new Date();
        this.departmentFromDate = new Date(tdy.setMonth(tdy.getMonth() - 3));
        let tdy1 = new Date();
        this.departmentToDate = new Date(tdy1.setDate(tdy1.getDate() - 1));
      }
    }
    this.loading = false;
  }

  getDetails(action?: boolean) {
    this.loading = true;
    this.departmentService.getDepartmentswithUser().subscribe((result: IDepartmentRep[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.departmentWithUsersList = result;
        console.log('departmentWithUsersList=>', this.departmentWithUsersList);
        if (userType.DepartementAdmin == this._roleCode) {
          this.departmentReportsForm.get('departmentFromDate').setValue(this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0);
        }
      } if (action) {
        this.DateSelection(this.departmentReportsForm.value.dateType)
      }
      else
        this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDetails==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      if (action) {
        this.DateSelection(this.departmentReportsForm.value.dateType)
      }
      else
        this.loading = false;
    });
    this.cdref.detectChanges();
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  departSelected() {
    console.log("DepartmentReportselect=>", this.departmentReportsForm.value.departmentName);
    this.deptName = '';
    let deptSelected = this.departmentReportsForm.value.departmentName;
    if (deptSelected.length > 0) {
      let findex = this.departmentWithUsersList.findIndex(y => y.deptId == deptSelected[0]);
      if (findex != -1) {
        this.deptName = this.departmentWithUsersList[findex].deptName;
      }
    }
  }

  onSubmit() {
    this.loading = true;
    this.dateFormatFlag = false;

    let fromdate = this.datePipe.transform(this.departmentReportsForm.value.departmentFromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.departmentReportsForm.value.departmentToDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";

    let searchData = {
      "depts": this.departmentReportsForm.value.departmentName,
      "selectionType": this.departmentReportsForm.value.dateType,
      "fromDate": fromdate,
      "toDate": todate
    };

    console.log('searchData', searchData);

    this.departmentService.getDepartmentReports(searchData).subscribe((result: IDepartmentReport[]) => {
      if (result) {
        if (result.length > 0) {

          console.log("Response==>Active", result)
          this.departmentReportsList = result;
          this.dataSource = new MatTableDataSource(this.departmentReportsList);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.gridLoad = false;
        } else {
          this.departmentReportsList = [];
          this.filterListdepartments = [];
          this.gridLoad = true;
        }
      }
      this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==> ", JSON.stringify(error));
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
    this.filterdepartmentReportsList = this.departmentReportsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("filterdepartmentReportsList==>" + JSON.stringify(this.filterdepartmentReportsList));
    this.dataSource = new MatTableDataSource(this.filterdepartmentReportsList);
    this.gridLoad = false;
  }

  ExportTOExcel() {

    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.departmentReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.departmentReportsList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    XLSX.writeFile(wb, 'Department_Reports_' + dateDownload + '.xlsx');

  }
  convertData(value) {
    return value == null ? '' : new Date((value).replace(/\s/g, "T"));
  }
  ExportTOCsv() {

    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.departmentReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    console.log("departmentReportsList==>", JSON.stringify(this.departmentReportsList));
    // console.log("this.menuInfo", this.reportsList[0]);
    // console.log("this.menuInfo", Object.keys(this.reportsList[0]));
    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.departmentReportsList.map(data => _.pick(data, this.displayedColumns)), 'Department_Reports_' + dateDownload, options);
  }
  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let getColumnHeaders = [['Date', 'Department', 'Sent', 'Delivered', 'Failed']];
    let groupedDataRows = [];
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.departmentReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    this.departmentReportsList.forEach(item => {
      let temp = [item.Date,
      item.Department,
      item.Sent,
      item.Delivered,
      item.Failed];
      groupedDataRows.push(temp);
    });
    console.log("Dept reports groupedDataRows==>", groupedDataRows);
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
    doc.save('Department_Reports_' + dateDownload + '.pdf');
  }
}
