import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { ICheckedinKiosk } from '../_model/checkedinModel';
import { CheckedinService } from '../_service/checkedinService';
import { environment } from '../../../../environments/environment';
import { MatTableDataSource } from '@angular/material';
import { ActionType } from '../../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig, IUserUpdateDto, ITokenInfo } from '../../../_helpers/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkedinmanage',
  templateUrl: './checkedinmanage.component.html',
  styleUrls: ['./checkedinmanage.component.scss']
})
export class CheckedinmanageComponent implements OnInit {

  checkedinKioskForm: FormGroup;
  search: string;
  kioskCheckedinList: ICheckedinKiosk[] = [];
  totalkioskCheckedinList: ICheckedinKiosk[] = [];
  filterCheckedIns: ICheckedinKiosk[] = [];
  startDate: Date;
  endDate: Date;
  exportFlag: boolean = true;
  listflag: boolean = true;
  reportsFlag: boolean = true;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  [x: string]: any;
  displayedColumns: string[] = ['floorName', 'mrnNo', 'apptType', 'firstName', 'department'];
  searchType: string;
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  loading: boolean = false;
  reportData: any;

  constructor(private _checkinService: CheckedinService, private fb: FormBuilder, private datePipe: DatePipe,
    private translate: TranslateService, private appconfig: AppConfig, private router: Router) {

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
    this.checkedinKioskForm = this.fb.group({
      searchType: ['department'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      searchValue: [null],
    });
  }

  filterSearch() {
    if (this.checkedinKioskForm.value.searchValue != '' && this.checkedinKioskForm.value.searchValue != null && this.totalkioskCheckedinList.length > 0) {
      console.log("Search==>", this.checkedinKioskForm.value.searchType, this.checkedinKioskForm.value.searchValue, Object.keys(this.totalkioskCheckedinList[0]), Object.keys(this.totalkioskCheckedinList[0]).findIndex(x => x == this.checkedinKioskForm.value.searchType));
      let keyData = Object.keys(this.totalkioskCheckedinList[0]);
      if (keyData.findIndex(x => x == this.checkedinKioskForm.value.searchType) != -1) {
        this.kioskCheckedinList = this.totalkioskCheckedinList.filter((data) => data[this.checkedinKioskForm.value.searchType].toLowerCase().indexOf(this.checkedinKioskForm.value.searchValue.toLowerCase()) > -1);
        this.listPage = 0;
        this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
    }
    else if (this.checkedinKioskForm.value.searchValue == '') {
      this.kioskCheckedinList = this.totalkioskCheckedinList;
      this.listPage = 0;
      this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      this.initPage = 0;
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
    }
  }

  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.kioskCheckedinList=>", this.kioskCheckedinList);
    this.filterCheckedIns = this.kioskCheckedinList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  geListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.kioskCheckedinList=>", this.kioskCheckedinList);

    this.filterCheckedIns = this.kioskCheckedinList.filter(() => {
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
   
    let strtdate = this.datePipe.transform(this.checkedinKioskForm.value.startDate, "yyyy-MM-dd");
    let enddate = this.datePipe.transform(this.checkedinKioskForm.value.endDate, "yyyy-MM-dd");
    strtdate = strtdate + " 00:00:00";
    enddate = enddate + " 23:59:59";
    let reportData = {
      startdate: strtdate,
      enddate: enddate,
      orgId: this._orgid
    };
    if (!_.isEqual(this.reportData, reportData)) {
      this.kioskCheckedinList = [];
      this.totalkioskCheckedinList = [];
      this.reportData = reportData;
      console.log("checkin", + JSON.stringify(reportData));
      this.loading = true;
      this._checkinService.getSuccessCheckins(reportData).subscribe((result) => {
        console.log("Result from Server::::::::", result);
        if (result == null)
          this.reportsFlag = false;
        else if (result.length > 0) {
          this.kioskCheckedinList = result;
          this.totalkioskCheckedinList = result;
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
    this.checkedinKioskForm.reset();
    this.checkedinKioskForm.patchValue({searchType: 'department'});
  }

  validateCampTime() {
    let stDate = this.datePipe.transform(this.checkedinKioskForm.value.startDate, 'yyyy-MM-dd HH:mm:ss');
    let enDate = this.datePipe.transform(this.checkedinKioskForm.value.endDate, 'yyyy-MM-dd HH:mm:ss');
    if (stDate > enDate) {
      setTimeout(() => {
        //this.campDtTime.nativeElement.value = this.datePipe.transform(new Date(), 'MM/dd/yyyy, hh:mm a');
        this.checkedinKioskForm.controls.startDate.reset("");
        this.checkedinKioskForm.controls.endDate.reset("");
      }, 1000);
    }
  }

  ExportTOExcel() {
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.kioskCheckedinList.map(data=> _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Checkin_Report.xlsx');

  }

  ExportTOCsv() {
    console.log("CheckinList==>", JSON.stringify(this.kioskCheckedinList));
    console.log("this.menuInfo", this.kioskCheckedinList[0]);
    console.log("this.menuInfo", Object.keys(this.kioskCheckedinList[0]));
    var options = {
      noDownload: false,
      headers:this.displayedColumns,
    };
    new Angular5Csv(this.kioskCheckedinList.map(data=> _.pick(data, this.displayedColumns)), 'Checkin_Report',options);
  }
  

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}