import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog, MatDialogRef, MatSort } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { PatientcompletejourneyComponent } from '../patientcompletejourney/patientcompletejourney.component';
import { AppConfig, ITokenInfo } from '../../../_helpers/app.config';
import { PatientJourneyService } from '../_service/patientjounery.service';
import { IDateInfo, IPatienttokenjourney } from '../_model/patientjourneymodel';
import { DatePipe } from '@angular/common';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DFormatTimePipe } from '../_pipe/filterPipe';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-patientjourneymanage',
  templateUrl: './patientjourneymanage.component.html',
  styleUrls: ['./patientjourneymanage.component.scss']
})
export class PatientjourneymanageComponent implements OnInit {
  dataSource = new MatTableDataSource<IPatienttokenjourney>();
  toDay: Date;
  loading: boolean = false;
  pJourneyform: FormGroup;
  fromDate: string;
  toDate: string;
  startDate: Date;
  endDate: Date;
  _tokenInfo: any;
  orgId: number;
  d = new Date();
  hide: boolean = false;
  previousRequest: any = {
    "endDate": "",
    "startDate": "",
    "mrnNo": ""
  };
  reportsList: IPatienttokenjourney[] = [];

  // displayedColumns= ['date', 'tokenNum', 'room', 'srvResource', 'waitTime', 'careStartTime', 'careEndTime', 'status'];
  displayedColumns = ['date', 'tokenNo', 'waititme', 'careStartTime', 'careEndTime', 'status'];

  filterListReports: IPatienttokenjourney[] = [];
  Date: boolean = false;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;

  mrnNumber: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }
  ];
  filterPipe = new DFormatTimePipe();

  constructor(private datePipe: DatePipe, private router: Router, private fb: FormBuilder, private alertMessage: AlertMessageService, private dialog: MatDialog,
    private appConfig: AppConfig, private patientjourneyService: PatientJourneyService, private translate: TranslateService) {

    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;

      this.loading = true;
      this.patientjourneyService.getCurrentDate().subscribe((response: IDateInfo) => {
        console.log("date response::", response)
        this.d = new Date((response.dateTime).replace(/\s/g, "T")); console.log("date::", this.d);
        let dd = new Date((response.dateTime).replace(/\s/g, "T"));
        let currMonth = dd.getMonth();
        dd.setMonth(currMonth - 3);
        this.startDate = new Date(dd);
        this.endDate = new Date(this.d);
        console.log('this.startDate=>', this.startDate);
        console.log(' this.endDate=>', this.endDate);
        this.loading = false;
      });
    }
  }

  ngOnInit() {
    this.pJourneyform = this.fb.group({
      // dateRange: ['',[Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      mrnNum: ['']
    });
    this.dataSource.paginator = this.paginator;
  }

  // selectPeriod(value){
  //   console.log("SelectPeriod ==>", value);
  //   if(value==0){
  //     this.pJourneyform.get('fromDate').clearValidators();
  //     this.pJourneyform.get('fromDate').updateValueAndValidity();
  //     this.pJourneyform.get('toDate').clearValidators();
  //     this.pJourneyform.get('toDate').updateValueAndValidity();

  //     this.pJourneyform.get('fromDate').setValue(null);  
  //     this.pJourneyform.get('toDate').setValue(null); 
  //     //   this.pJourneyform.get('mrnNum').setValue(null);
  //     // } else if(value == 1){
  //     //   this.pJourneyform.get('mrnNum').setValue(null);
  //   }
  // }

  getJourneyConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'nurstknview';
    dialogConfig.width = "70vw";
    dialogConfig.height = '70%';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  patientJourney(element: IPatienttokenjourney) {
    const dialogRef = this.dialog.open(PatientcompletejourneyComponent, this.getJourneyConfig(element));
    dialogRef.afterClosed().subscribe(result => {
      console.log("row in onUpdate() :: " + JSON.stringify(result));
    })
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.filterListReports = this.reportsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = obj.pageIndex;
    this.dataSource = new MatTableDataSource(this.filterListReports);
  }

  sortData() {
    this.dataSource.sort = this.sort;
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  getReports() {
    this.loading = true;
    // if(this.pJourneyform.value.dateRange == 1){
    let d1 = new Date(this.pJourneyform.value.fromDate);
    let month1 = '' + (d1.getMonth() + 1);
    let day1 = '' + d1.getDate();
    let year1 = d1.getFullYear();

    if (month1.length < 2)
      month1 = '0' + month1;
    if (day1.length < 2)
      day1 = '0' + day1;



    let d2 = new Date(this.pJourneyform.value.toDate);
    let month2 = '' + (d2.getMonth() + 1);
    let day2 = '' + d2.getDate();
    let year2 = d2.getFullYear();

    if (month2.length < 2)
      month2 = '0' + month2;
    if (day2.length < 2)
      day2 = '0' + day2;

    let searchData = {
      "endDate": year2 + '/' + month2 + '/' + day2 + ' ' + '23:59:59',
      "startDate": year1 + '/' + month1 + '/' + day1 + ' ' + '00:00:00',
      "mrnNo": (this.pJourneyform.value.mrnNum).trim(),
      "orgId": this.orgId
    };
    console.log("searchData ==>", searchData);
    console.log("searchData ==>", JSON.stringify(searchData));
    if (!_.isEqual(this.previousRequest, searchData)) {

      this.patientjourneyService.getPatientJourneyReport(searchData).subscribe((result: IPatienttokenjourney[]) => {
        console.log("Result ==>", result);
        this.previousRequest = searchData;
        this.reportsList = result;
        if (result == null)
          this.hide = true;
        else if (result.length > 0) {

          this.reportsList = [];
          this.filterListReports = [];
          result.forEach(element => {
            if (element.careStartTime && element.careStartTime != '') {
              if (element.waititme) {
                let result: any = this.filterPipe.transform(parseInt(element.waititme));
                element.waititme = result + '(hh:mm)';
              }
              element.status = 'End';
            }
            else {
              element.waititme = 'N/A';
              element.careStartTime = 'N/A';
              element.status = this.translate.instant('patientJourneyModule.manage.statusRow');
            }
            this.reportsList.push(element);
          });
          this.fromDate = month1 + '/' + day1 + '/' + year1;
          this.toDate = month2 + '/' + day2 + '/' + year2;
          this.mrnNumber = this.pJourneyform.value.mrnNum ? this.pJourneyform.value.mrnNum : '';
          console.log(' this.reportsList=>', this.reportsList);

          this.dataSource = new MatTableDataSource(this.reportsList);
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });

        } else {
          this.reportsList = [];
          this.filterListReports = [];
          this.hide = true;
        } this.loading = false;

      },
        err => {
          let message = err.error.messages as string
          let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
          console.log("Failed :: ", JSON.stringify(err));
          this.showAlert(errorMessage, ActionType.ERROR, err.status);
          this.loading = false;
        });
    }
    else
      this.loading = false;
  }



  clearAllFields() {
    this.previousRequest = {
      "endDate": "",
      "startDate": "",
      "mrnNo": ""
    };
    this.reportsList = [];
    this.hide = false;
    //if(this.pJourneyform.value.dateRange == 1){
    this.pJourneyform.get('fromDate').setValue(null);
    this.pJourneyform.get('toDate').setValue(null);
    this.pJourneyform.get('mrnNum').setValue(null);
    // } else if(this.pJourneyform.value.dateRange == 0){
    //       this.pJourneyform.get('mrnNum').setValue(null);
    // } else {
    //       this.pJourneyform.reset();
    // }
  }

  ExportTOExcel() {

    console.log(' this.reportsList', this.reportsList);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportsList.map(data =>
      _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    
    /* save to file */
    XLSX.writeFile(wb, 'Patient_Report_' + dateDownload + '.xlsx');
  }

  ExportTOCsv() {

    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    
    new Angular5Csv(this.reportsList.map(data=> _.pick(data, this.displayedColumns)), 'Patient_Report_' + dateDownload,options);
  }

}
