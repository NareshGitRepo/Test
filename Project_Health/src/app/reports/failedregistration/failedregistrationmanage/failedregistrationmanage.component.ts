import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as _ from "lodash";
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { MatTableDataSource } from '@angular/material';
import { IRegistration, IDateInfo } from '../_model/failedModel';
import { FailedRegistrationService } from '../_service/failedRegistrationServie';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-failedregistrationmanage',
  templateUrl: './failedregistrationmanage.component.html',
  styleUrls: ['./failedregistrationmanage.component.scss']
})
export class FailedregistrationmanageComponent implements OnInit {

  failedRegistraionForm: FormGroup;
  [x: string]: any;
  registrationsList: IRegistration[] = [];
  totalregistrationsList: IRegistration[] = [];
  filterRegistrations: IRegistration[] = [];
  startDate: Date;
  endDate: Date;
  exportFlag: boolean = true;
  listflag: boolean = true;
  reportsFlag: boolean = true;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  displayedColumns: string[] = ['floorName', 'mrnNo', 'firstName', 'createdOn', 'reason'];
  searchType: string;
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  loading: boolean = false;
  failedData: any;
  dataSource = new MatTableDataSource<IRegistration>();
  d = new Date();
  constructor(private _failedregistrationService: FailedRegistrationService,
    private fb: FormBuilder, private appconfig: AppConfig, private alertMessage: AlertMessageService,
    private datePipe: DatePipe, private router: Router, private translate: TranslateService) {

    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._orgid = this._tokenInfo.orgId;
      this._failedregistrationService.getCurrentDate().subscribe((response: IDateInfo) => {
        console.log("date response::", response)
        this.d = new Date((response.dateTime).replace(/\s/g, "T")); console.log("date::", this.d);
        let dd = new Date((response.dateTime).replace(/\s/g, "T"));
        let currMonth = dd.getMonth();
        dd.setMonth(currMonth - 3);
        this.startDate = new Date(dd);
        this.endDate = new Date(this.d);
      });
    } else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this.failedRegistraionForm = this.fb.group({
      searchType: ['floorName'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      searchValue: [null],
    });
  }

  filterSearch() {
    this.failedData = {}
    if (this.failedRegistraionForm.value.searchValue != '' && this.failedRegistraionForm.value.searchValue != null && this.totalregistrationsList.length > 0) {
      console.log("Search==>", this.failedRegistraionForm.value.searchType, this.failedRegistraionForm.value.searchValue, Object.keys(this.totalregistrationsList[0]), Object.keys(this.totalregistrationsList[0]).findIndex(x => x == this.failedRegistraionForm.value.searchType));
      let keyData = Object.keys(this.totalregistrationsList[0]);
      if (keyData.findIndex(x => x == this.failedRegistraionForm.value.searchType) != -1) {
        this.registrationsList = this.totalregistrationsList.filter((data) => data[this.failedRegistraionForm.value.searchType].toLowerCase().indexOf(this.failedRegistraionForm.value.searchValue.toLowerCase()) > -1);
        if (this.registrationsList.length > 0) {
          this.reportsFlag = true;
          this.listPage = 0;
          this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.initPage = 0;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        }
        else {
          this.reportsFlag = false;
          this.filterRegistrations = [];
        }
      }
    }
    else if (this.failedRegistraionForm.value.searchValue == '') {
      this.reportsFlag = true;
      this.registrationsList = this.totalregistrationsList;
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
    console.log("registrationsList=>", this.registrationsList);
    this.filterRegistrations = this.registrationsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  geListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("registrationsList=>", this.registrationsList);

    this.filterRegistrations = this.registrationsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterRegistrations);
  }

  loadList() {
    this.listflag = true;
  }

  loadGrid() {
    this.listflag = false;
  }

  getReport() {
    this.failedRegistraionForm.get('searchValue').setValue(null)
    let strtdate = this.datePipe.transform(this.failedRegistraionForm.value.startDate, "yyyy-MM-dd");
    let enddate = this.datePipe.transform(this.failedRegistraionForm.value.endDate, "yyyy-MM-dd");
    strtdate = strtdate + " 00:00:00";
    enddate = enddate + " 23:59:59";
    let failedData = {
      startdate: strtdate,
      enddate: enddate,
      orgId: this._orgid
    };
    if (!_.isEqual(this.failedData, failedData) && this.registrationsList.length == 0) {
      this.failedData = failedData;
      this.registrationsList = [];
      this.totalregistrationsList = [];
      this.filterRegistrations = [];
      this.loading = true
      this._failedregistrationService.getFailedRegistration(failedData)
        .subscribe((result: IRegistration[]) => {
          if (result == null)
            this.reportsFlag = false;
          else if (result.length > 0) {
            this.registrationsList = result;
            this.totalregistrationsList = result;
            this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
            this.dataSource = new MatTableDataSource(this.filterRegistrations);
            // this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.exportFlag = false;
            this.reportsFlag = true;
            this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          }
          else {
            this.filterRegistrations = [];
            this.registrationsList = [];
            this.totalregistrationsList = []
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

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  clear() {
    this.reportsFlag = true;
    this.failedData = {};
    this.failedRegistraionForm.reset();
    this.failedRegistraionForm.patchValue({ searchType: 'floorName' });
    this.filterRegistrations = [];
    this.registrationsList = [];
    this.totalregistrationsList = []
  }

  validateCampTime() {
    let stDate = this.datePipe.transform(this.failedRegistraionForm.value.startDate, 'yyyy-MM-dd HH:mm:ss');
    let enDate = this.datePipe.transform(this.failedRegistraionForm.value.endDate, 'yyyy-MM-dd HH:mm:ss');
    if (stDate > enDate) {
      setTimeout(() => {
        //this.campDtTime.nativeElement.value = this.datePipe.transform(new Date(), 'MM/dd/yyyy, hh:mm a');
        this.failedRegistraionForm.controls.startDate.reset("");
        this.failedRegistraionForm.controls.endDate.reset("");
      }, 1000);
    }
  }

  ExportTOExcel() {
    var options = {
      headers: this.displayedColumns,
    };
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.totalregistrationsList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // const wo: XLSX.WritingOptions = ;
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
      let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
      
      /* save to file */
      XLSX.writeFile(wb, 'Failed_Registration_Report_' + dateDownload + '.xlsx');
  }

  ExportTOCsv() {

    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    
    new Angular5Csv(this.reportsList.map(data=> _.pick(data, this.displayedColumns)), 'Failed_Registration_Report_' + dateDownload,options);
  }

}