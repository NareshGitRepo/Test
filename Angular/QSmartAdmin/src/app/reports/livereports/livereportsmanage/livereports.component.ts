import * as XLSX from 'xlsx';
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { ActionType } from '../../../_services/alertMessageService';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { AppConfig, IUserUpdateDto, ITokenInfo } from '../../../_helpers/app.config';
import { DatePipe } from '@angular/common';
import { ILiveReports } from '../_model/livereports.model';
import { LiveReportsDetailsComponent } from '../live-reports-details/live-reports-details.component';
import { LiveReportsService } from '../_service/livereports.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: "app-livereports",
  templateUrl: "./livereports.component.html",
  styleUrls: ["./livereports.component.scss"]
})
export class LiveReportsComponent implements OnInit {
  livereportsForm: FormGroup;
  searchdata: string;
  reportsData: ILiveReports[] = [];
  totalreportsData: ILiveReports[] = [];
  filterCheckedIns: ILiveReports[] = [];
  startDate: Date;
  endDate: Date;
  exportFlag: boolean = true;
  listflag: boolean = true;
  reportsFlag: boolean = true;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  [x: string]: any;
  displayedColumns: string[] = ['mrnNo', 'apptType', 'drFstName', 'mobileNo', 'ptFstName', 'regStatus', 'serviceLocation', 'serviceName','reason'];
  searchType: string;
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  dataSource: any;
  loading: boolean = false;
  reportData : any;
  constructor(private _livereportsService: LiveReportsService, private fb: FormBuilder, public dialog: MatDialog, private datePipe: DatePipe,
    private translate: TranslateService, private appconfig: AppConfig) {


    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._orgid = this._tokenInfo.orgId;
      var d = new Date();
      d.setMonth(d.getMonth() - 3);
      this.startDate = new Date(d);
      this.endDate = new Date();
    } else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this.livereportsForm = this.fb.group({
      searchType: ['drFstName'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      searchValue: [null],
    });
  }

  filterSearch() {
    if (this.livereportsForm.value.searchValue != '' && this.livereportsForm.value.searchValue != null && this.totalreportsData.length > 0) {
      console.log("Search==>", this.livereportsForm.value.searchType, this.livereportsForm.value.searchValue, Object.keys(this.totalreportsData[0]), Object.keys(this.totalreportsData[0]).findIndex(x => x == this.livereportsForm.value.searchType));
      let keyData = Object.keys(this.totalreportsData[0]);
      if (keyData.findIndex(x => x == this.livereportsForm.value.searchType) != -1) {
        this.reportsData = this.totalreportsData.filter((data) => data[this.livereportsForm.value.searchType].toLowerCase().indexOf(this.livereportsForm.value.searchValue.toLowerCase()) > -1);
        this.listPage = 0;
        this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
    }
    else if (this.livereportsForm.value.searchValue == '') {
      this.reportsData = this.totalreportsData;
      this.listPage = 0;
      this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      this.initPage = 0;
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
    }
  }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }

  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.reportsData=>", this.reportsData);
    this.filterCheckedIns = this.reportsData.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("this.filterCheckedIns=>", this.filterCheckedIns);
  }

  geListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.reportsData=>", this.reportsData);

    this.filterCheckedIns = this.reportsData.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterCheckedIns);
  }

  loadList() {
    this.listflag = true;
  }

  loadGrid() {
    this.listflag = false;
  }

  getReport() {
    

    let strtdate = this.datePipe.transform(this.livereportsForm.value.startDate, "yyyy-MM-dd");
    let enddate = this.datePipe.transform(this.livereportsForm.value.endDate, "yyyy-MM-dd");


    strtdate = strtdate + " 00:00:00";
    enddate = enddate + " 23:59:59";

    let reportData = {
      startdate: strtdate,
      enddate: enddate
    };
    console.log(reportData);
    if (!_.isEqual(this.reportData, reportData)) {
      this.reportsData = [];
    this.totalreportsData = [];
      this.reportData = reportData;
    this.loading = true;
    this._livereportsService.getHl7CdrReportByDate(reportData).subscribe((result) => {
      console.log("Result from Server::::::::", result);
      if (result == null)
        this.reportsFlag = false;
      else if (result.length > 0) {
        this.reportsData = result;
        this.totalreportsData = result;
        this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.dataSource = new MatTableDataSource(this.filterCheckedIns);
        // this.dataSource.paginator = this.paginator;
        console.log(this.dataSource)
        this.dataSource.sort = this.sort;
        this.exportFlag = false;
        this.reportsFlag = true;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
      else {
        this.exportFlag = true;
        this.reportsFlag = false;
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
}
  clear() {
    this.livereportsForm.reset();
    this.livereportsForm.patchValue({searchType: 'department'})
  }

  validateCampTime() {
    let stDate = this.datePipe.transform(this.livereportsForm.value.startDate, 'yyyy-MM-dd HH:mm:ss');
    let enDate = this.datePipe.transform(this.livereportsForm.value.endDate, 'yyyy-MM-dd HH:mm:ss');
    if (stDate > enDate) {
      setTimeout(() => {
        //this.campDtTime.nativeElement.value = this.datePipe.transform(new Date(), 'MM/dd/yyyy, hh:mm a');
        this.livereportsForm.controls.startDate.reset("");
        this.livereportsForm.controls.endDate.reset("");
      }, 1000);
    }
  }
  reportsDetails(details) {
    console.log("Reports Details : " + JSON.stringify(details));
    const dialogRef = this.dialog.open(LiveReportsDetailsComponent, {
      width: "40vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: details
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
  ExportTOExcel() {
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportsData.map(data=> _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, "LiveReports.xlsx");
  }

  ExportTOCsv() {
    console.log("this.menuInfo", this.reportsData[0]);
    console.log("this.menuInfo", Object.keys(this.reportsData[0]));
    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    new Angular5Csv(this.reportsData.map(data=> _.pick(data, this.displayedColumns)), "LiveReports",options);
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


}
