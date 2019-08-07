import * as XLSX from 'xlsx';
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActionType } from '../../../_services/alertMessageService';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { DatePipe } from '@angular/common';
import { INotEligibleKiosk } from '../_model/notEligiblekiosk.model';
import { MatTableDataSource } from '@angular/material';
import { NotEligibleService } from '../_service/notEligible.service.';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: "app-noteligible",
  templateUrl: "./noteligible.component.html",
  styleUrls: ["./noteligible.component.scss"]
})
export class NoteligibleComponent implements OnInit {
  notEligibleForm: FormGroup;
  searchdata: string;
  kioskCheckedinList: INotEligibleKiosk[] = [];
  totalkioskCheckedinList: INotEligibleKiosk[] = [];
  filterCheckedIns: INotEligibleKiosk[] = [];
  startDate: Date;
  endDate: Date;
  exportFlag: boolean = true;
  listflag: boolean = true;
  reportsFlag: boolean = true;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  [x: string]: any;
  displayedColumns: string[] = ['floorName', 'mrnNo', 'apptType', 'firstName', 'department', 'reason'];
  searchType: string;
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  dataSource: any;
  loading: boolean = false;
  reportData : any;
  constructor(private _notEligibleService: NotEligibleService, private fb: FormBuilder, private datePipe: DatePipe,
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
    this.notEligibleForm = this.fb.group({
      searchType: ['department'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      searchValue: [null],
    });
  }

  filterSearch() {
    if (this.notEligibleForm.value.searchValue != '' && this.notEligibleForm.value.searchValue != null && this.totalkioskCheckedinList.length > 0) {
      console.log("Search==>", this.notEligibleForm.value.searchType, this.notEligibleForm.value.searchValue, Object.keys(this.totalkioskCheckedinList[0]), Object.keys(this.totalkioskCheckedinList[0]).findIndex(x => x == this.notEligibleForm.value.searchType));
      let keyData = Object.keys(this.totalkioskCheckedinList[0]);
      if (keyData.findIndex(x => x == this.notEligibleForm.value.searchType) != -1) {
        this.kioskCheckedinList = this.totalkioskCheckedinList.filter((data) => data[this.notEligibleForm.value.searchType].toLowerCase().indexOf(this.notEligibleForm.value.searchValue.toLowerCase()) > -1);
        this.listPage = 0;
        this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
    }
    else if (this.notEligibleForm.value.searchValue == '') {
      this.kioskCheckedinList = this.totalkioskCheckedinList;
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
    console.log("this.kioskCheckedinList=>", this.kioskCheckedinList);
    this.filterCheckedIns = this.kioskCheckedinList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("this.filterCheckedIns=>", this.filterCheckedIns);
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
   

    let strtdate = this.datePipe.transform(this.notEligibleForm.value.startDate, "yyyy-MM-dd");
    let enddate = this.datePipe.transform(this.notEligibleForm.value.endDate, "yyyy-MM-dd");


    strtdate = strtdate + " 00:00:00";
    enddate = enddate + " 23:59:59";

    let reportData = {
      startdate: strtdate,
      enddate: enddate,
      orgId: this._orgid
    };
    console.log(reportData);
    if (!_.isEqual(this.reportData, reportData)) {
      this.reportData = reportData;
      this.kioskCheckedinList = [];
      this.totalkioskCheckedinList = [];
    this.loading = true;
    this._notEligibleService.getFailedCheckins(reportData).subscribe((result) => {
      console.log("Result from Server::::::::", result);
      if(result==null)
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
      this.showAlert(errorMessage, ActionType.ERROR,error.status);
      this.loading=false;
    });
  }
}
  clear() {
    this.notEligibleForm.reset();
    this.notEligibleForm.patchValue({searchType: 'department'});
  }

  validateCampTime() {
    let stDate = this.datePipe.transform(this.notEligibleForm.value.startDate, 'yyyy-MM-dd HH:mm:ss');
    let enDate = this.datePipe.transform(this.notEligibleForm.value.endDate, 'yyyy-MM-dd HH:mm:ss');
    if (stDate > enDate) {
      setTimeout(() => {
        //this.campDtTime.nativeElement.value = this.datePipe.transform(new Date(), 'MM/dd/yyyy, hh:mm a');
        this.notEligibleForm.controls.startDate.reset("");
        this.notEligibleForm.controls.endDate.reset("");
      }, 1000);
    }
  }

  ExportTOExcel() {
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.kioskCheckedinList.map(data=> _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, "NotEligible_Reports.xlsx");
  }
  ExportTOCsv() {
    console.log("this.menuInfo", this.kioskCheckedinList[0]);
    console.log("this.menuInfo", Object.keys(this.kioskCheckedinList[0]));
    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    new Angular5Csv(this.kioskCheckedinList.map(data=> _.pick(data, this.displayedColumns)), "NotEligible_Reports",options);
  }

  showAlert(error: any, action: ActionType,status:number=0) {
    if(status==401)
    this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  

}