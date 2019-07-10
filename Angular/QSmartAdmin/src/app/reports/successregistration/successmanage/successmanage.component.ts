import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { RegistrationService } from '../_service/registrationService';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { MatTableDataSource } from '@angular/material';
import { IRegistration } from '../_model/registration.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successmanage',
  templateUrl: './successmanage.component.html',
  styleUrls: ['./successmanage.component.scss']
})
export class SuccessmanageComponent implements OnInit {

  registrationList: IRegistration[] = [];
  totalregistrationList: IRegistration[] = [];
  filterregistration: IRegistration[] = [];
  startDate: Date;
  endDate: Date;
  exportFlag: boolean = true;
  reportsFlag: boolean = true;
  listflag: boolean = true;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  [x: string]: any;
  displayedColumns: string[] = ['floorName', 'mrnNo', 'firstName', 'gender', 'createdOn'];
  searchType: string;
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  successRegistrationForm: FormGroup;
  search: any;
  loading: boolean = false;
  successData: any;
  constructor(private registration: RegistrationService, private alertMessage: AlertMessageService, private appconfig: AppConfig,
    private fb: FormBuilder, private datePipe: DatePipe, private translate: TranslateService, private router: Router) {

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

    this.successRegistrationForm = this.fb.group({
      searchType: ['floorName'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      searchValue: [null],
    });
  }

  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("registrationList=>", this.registrationList);
    this.filterregistration = this.registrationList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  geListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("registrationList=>", this.registrationList);

    this.filterregistration = this.registrationList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterregistration);
  }

  loadList() {
    this.listflag = true;
  }

  loadGrid() {
    this.listflag = false;
  }

  getReport() {
    let strtdate = this.datePipe.transform(this.successRegistrationForm.value.startDate, "yyyy-MM-dd");
    let enddate = this.datePipe.transform(this.successRegistrationForm.value.endDate, "yyyy-MM-dd");
    strtdate = strtdate + " 00:00:00";
    enddate = enddate + " 23:59:59";
    let successData = {
      startdate: strtdate,
      enddate: enddate,
      orgId: this._orgid
    };
    console.log("from value=>", successData, _.isEqual(this.successData, successData));
    if (!_.isEqual(this.successData, successData)) {
      this.successData = successData;
      this.registrationList = [];
      this.totalregistrationList = [];
      this.loading = true;
      this.registration.getSuccessRegistration(successData).subscribe(result => {
        console.log("Result", result)
        if (result == null)
          this.reportsFlag = false;
        else if (result.length > 0) {
          this.registrationList = result;
          this.totalregistrationList = result;
          this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.dataSource = new MatTableDataSource(this.filterregistration);
          // this.dataSource.paginator = this.paginator;
          console.log(this.dataSource)
          this.dataSource.sort = this.sort;
          this.exportFlag = false;
          this.reportsFlag = true;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        }
        else {
          this.reportsFlag = false;
          this.exportFlag = true;
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

  filterSearch() {
    if (this.successRegistrationForm.value.searchValue != '' && this.successRegistrationForm.value.searchValue != null && this.totalregistrationList.length > 0) {
      console.log("Search==>", this.successRegistrationForm.value.searchType, this.successRegistrationForm.value.searchValue, Object.keys(this.totalregistrationList[0]), Object.keys(this.totalregistrationList[0]).findIndex(x => x == this.successRegistrationForm.value.searchType));
      let keyData = Object.keys(this.totalregistrationList[0]);
      if (keyData.findIndex(x => x == this.successRegistrationForm.value.searchType) != -1) {
        this.registrationList = this.totalregistrationList.filter((data) => data[this.successRegistrationForm.value.searchType].toLowerCase().indexOf(this.successRegistrationForm.value.searchValue.toLowerCase()) > -1);
        this.listPage = 0;
        this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
    }
    else if (this.successRegistrationForm.value.searchValue == '') {
      this.registrationList = this.totalregistrationList;
      this.listPage = 0;
      this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      this.initPage = 0;
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
    }
  }
  clear() {
    this.successRegistrationForm.reset();
    this.successRegistrationForm.patchValue({searchType: 'floorName'});
  }
  validateCampTime() {
    let stDate = this.datePipe.transform(this.successRegistrationForm.value.startDate, 'yyyy-MM-dd HH:mm:ss');
    let enDate = this.datePipe.transform(this.successRegistrationForm.value.endDate, 'yyyy-MM-dd HH:mm:ss');
    if (stDate > enDate) {
      setTimeout(() => {
        this.successRegistrationForm.controls.startDate.reset("");
        this.successRegistrationForm.controls.endDate.reset("");
      }, 1000);
    }
  }
  ExportTOExcel() {
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.registrationList.map(data=> _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SuccessRegistration_Report.xlsx');
  }
  ExportTOCsv() {
    console.log("this.menuInfo", this.registrationList[0]);
    console.log("this.menuInfo", Object.keys(this.registrationList[0]));
    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    new Angular5Csv( this.registrationList.map(data=> _.pick(data, this.displayedColumns)), 'SuccessRegistration_Report',options);
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


}

