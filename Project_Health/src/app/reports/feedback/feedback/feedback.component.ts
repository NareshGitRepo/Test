import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { IFeedback, IDateInfo } from '../_model/IFeedback';
import { FeedbackService } from '../_service/feedbackService';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

import * as XLSX from 'xlsx';
import { AppConfig, IUserUpdateDto, ITokenInfo } from '../../../_helpers/app.config';
import { MatTableDataSource } from '@angular/material';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  pageSize = environment.pageSize;
  feedbackForm: FormGroup;
  initPage = 0;
  listPage = 0;
  search: any;
  exportFlag: boolean = true;
  listflag: boolean = true;
  [x: string]: any;
  totalFeedbackList: IFeedback[] = [];
  feedbackList: IFeedback[] = [];
  filterFeedback: IFeedback[] = [];
  displayedColumns: string[] = ['feedback', 'mrnNo', 'comment', 'clarityPerformance', 'easeUse', 'techPerformance', 'createdOn'];
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  loading: boolean = false;
  reportsFlag: boolean = true;
   reportData : any;
  dataSource = new MatTableDataSource<IFeedback>();
  d=new Date();
  constructor(private _FeedbackService: FeedbackService, private fb: FormBuilder, private datePipe: DatePipe, private appconfig: AppConfig
    , private translate: TranslateService, private alertMessage: AlertMessageService, private router: Router) {

    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._orgid = this._tokenInfo.orgId;
      this._FeedbackService.getCurrentDate().subscribe((response:IDateInfo)=>{
        console.log("date response::",response)
        this.d = new Date((response.dateTime).replace(/\s/g, "T")); console.log("date::",this.d);
        let dd= new Date((response.dateTime).replace(/\s/g, "T"));
        let currMonth =dd.getMonth();
        dd.setMonth(currMonth - 3);
        this.startDate = new Date(dd);
        this.endDate = new Date(this.d);
        });
    } else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {

    this.feedbackForm = this.fb.group({
      searchType: ['feedback'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      searchValue: [null],
    });
  }

  filterSearch() {this.reportData={};
    console.log("Search==>", this.feedbackForm.value.searchValue, this.feedbackForm.value.searchType)
    if (this.feedbackForm.value.searchValue != '' && this.feedbackForm.value.searchValue != null && this.totalFeedbackList.length > 0) {
      console.log("Search==>", this.feedbackForm.value.searchType, this.feedbackForm.value.searchValue, Object.keys(this.totalFeedbackList[0]), Object.keys(this.totalFeedbackList[0]).findIndex(x => x == this.feedbackForm.value.searchType));
      let keyData = Object.keys(this.totalFeedbackList[0]);
      if (keyData.findIndex(x => x == this.feedbackForm.value.searchType) != -1) {
        this.feedbackList = this.totalFeedbackList.filter((data) => data[this.feedbackForm.value.searchType].toLowerCase().indexOf(this.feedbackForm.value.searchValue.toLowerCase()) > -1);
        if(this.feedbackList.length>0) { 
          this.reportsFlag = true;
        this.listPage = 0;
        this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        }else{
          this.reportsFlag = false;
          this.filterFeedback = [];
        }
      }
    }
    else if (this.feedbackForm.value.searchValue == '') {
      this.reportsFlag = true;
      this.feedbackList = this.totalFeedbackList;
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
    console.log("this.feedbackList=>", this.feedbackList);
    this.filterFeedback = this.feedbackList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  geListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.feedbackList=>", this.feedbackList);

    this.filterFeedback = this.feedbackList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterFeedback);
  }

  getReport() {
   
    this.feedbackForm.get('searchValue').setValue(null);

    let strtdate = this.datePipe.transform(this.feedbackForm.value.startDate, "yyyy-MM-dd");
    let enddate = this.datePipe.transform(this.feedbackForm.value.endDate, "yyyy-MM-dd");
    strtdate = strtdate + " 00:00:00";
    enddate = enddate + " 23:59:59";
    let reportData = {
      startdate: strtdate,
      enddate: enddate,
      orgid: this._orgid
    };
    if (!_.isEqual(this.reportData, reportData)  && this.totalFeedbackList.length==0) {
      this.reportData = reportData;
      this.feedbackList = [];
      this.totalFeedbackList = [];
      this.loading = true;
    console.log("Re" + JSON.stringify(reportData));
    this._FeedbackService.getFeedBackByDate(reportData).subscribe(result => {
      console.log("Result from Server::::::::", result)
      if (result == null)
        this.reportsFlag = false;
      else if (result.length > 0) {
        this.feedbackList = result;
        this.totalFeedbackList = result;
        this.geListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.dataSource = new MatTableDataSource(this.filterFeedback);
        this.dataSource.sort = this.sort;
        this.exportFlag = false;
        this.reportsFlag = true;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      } else {
        this.exportFlag = true;
        this.reportsFlag = false;
        this.feedbackList = [];
        this.totalFeedbackList = [];
        this.filterFeedback = [];

      }
      this.loading = false;
      // console.log("Checkedin kiosk:::::::::::", this.feedbackList)
      // this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  }
  loadList() {
    this.listflag = true;
  }

  loadGrid() {
    this.listflag = false;
  }

  clear() {
    this.feedbackForm.reset();
    this.feedbackForm.patchValue({searchType: 'feedback'});
    this.totalFeedbackList=[];
    this.feedbackList=[];
    this.filterFeedback=[];
	this.reportsFlag = true;
    this.reportData ={};
  }
  validateCampTime() {
    let stDate = this.datePipe.transform(this.feedbackForm.value.startDate, 'yyyy-MM-dd HH:mm:ss');
    let enDate = this.datePipe.transform(this.feedbackForm.value.endDate, 'yyyy-MM-dd HH:mm:ss');
    if (stDate > enDate) {
      setTimeout(() => {
        //this.campDtTime.nativeElement.value = this.datePipe.transform(new Date(), 'MM/dd/yyyy, hh:mm a');
        this.feedbackForm.controls.startDate.reset("");
        this.feedbackForm.controls.endDate.reset("");
      }, 1000);
    }
  }

  ExportTOExcel() {
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.totalFeedbackList.map(data=> _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    
    /* save to file */
    XLSX.writeFile(wb, 'Feedback_Report_' + dateDownload + '.xlsx');

  }

  ExportTOCsv() {
    console.log("FeedBack==>", JSON.stringify(this.totalFeedbackList));
    // console.log("this.menuInfo", this.feedbackList[0]);
    // console.log("this.menuInfo", Object.keys(this.feedbackList[0]));
    var options = {
      noDownload: false,
      headers:this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    
    new Angular5Csv(this.reportsList.map(data=> _.pick(data, this.displayedColumns)), 'Feedback_Report_' + dateDownload,options);

  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


}