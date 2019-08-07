import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo } from '../../../_helpers/app.config';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDepartment, IEmployeeReport, ILevelData } from '../_model/performanceModel';
import { MatDatepickerInputEvent, MatOption, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { PerformanceService } from '../_service/performance.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs-compat/operator/delay';
import { environment } from '../../../../environments/environment';

//import {moment} from 'ngx-bootstrap/chronos/test/chain';



@Component({
  selector: 'app-empperformance',
  templateUrl: './empperformance.component.html',
  styleUrls: ['./empperformance.component.scss']
})
export class EmpperformanceComponent implements OnInit {

  displayedColumns: string[] = ['staff_Name', 'loginId', 'avg_Idle_Time', 'avg_Serve_Time', 'total_Serve_Time', 'total_Token_Serve'];
  dataSource = new MatTableDataSource<IEmployeeReport>();
  empForm: FormGroup;
  year:boolean=false;
  Quarter:boolean=false;
  month:boolean=false;
  week:boolean=false;
  Date:boolean=false;
  levellist: ILevelData[] = [];
  deptList :IDepartment[]= [];
  filterGroup: ILevelData[] = [];
  loading: boolean = false;
  selPeriods={year:"Year Wise",quarter:"Quarter Wise",month:"Month Wise",week:"Week Wise",date:"Date Wise"};
  weekData={0:'1st',1:'2nd',2:'3rd',3:'4th',4:'5th',5:'6th'};
  years = [];
  months = [{monthId:1,monthName:'Jan'}, {monthId:2,monthName:'Feb'}, {monthId:3,monthName:'Mar'},{monthId:4,monthName:'Apr'},
            {monthId:5,monthName:'May'},{monthId:6,monthName:'June'},{monthId:7,monthName:'July'},
            {monthId:8,monthName:'Aug'},{monthId:9,monthName:'Sept'},{monthId:10,monthName:'Oct'},
            {monthId:11,monthName:'Nov'},{monthId:12,monthName:'Dec'}];
  quarters = [];
  weeks = [];
  fromDate : string;
  toDate : string;
  startDate: Date;
  endDate: Date;
  reportsList:IEmployeeReport[]=[];
  filterListReports:IEmployeeReport[]=[];
  _tokenInfo: any;
  orgId:number;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  gridLoad:boolean=false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('allFloorSelected') private allFloorSelected: MatOption;
  @ViewChild('allDeptSelected') private allDeptSelected: MatOption;

  constructor( private fb: FormBuilder, private performanceService : PerformanceService,
    private alertMessage: AlertMessageService,private cdref: ChangeDetectorRef,  private appConfig: AppConfig, private router: Router, private translate: TranslateService) {
      var d = new Date();
      d.setMonth(d.getMonth() - 3);
      this.startDate = new Date(d);
      this.endDate = new Date();


      let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
      if (tokenData)
        this._tokenInfo = tokenData.tokenSub;
      if (this._tokenInfo && tokenData) {
        this.orgId = this._tokenInfo.orgId;
      }

     }

  ngOnInit() {
    this.empForm = this.fb.group({
      selectValue: [''],
      floor:['',[Validators.required]],
      department:['',[Validators.required]],
      year:['',[Validators.required]],
      month:['',[Validators.required]],
      quarters:['',[Validators.required]],
      weeks:['',[Validators.required]],
      fromDate:['',[Validators.required]],
      toDate:['',[Validators.required]]
    });
    this.dataSource.paginator = this.paginator;
    this.getFloorsWithDeptsByFacilitateId();
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  getFloorsWithDeptsByFacilitateId() {
    this.loading = true;
    this.performanceService.getFloorsWithDeptsByFacilitateId().subscribe((response: ILevelData[]) => {
      console.log("response::", response);
      this.levellist = response;

      this.loading = false;
    }, err => {
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
      this.loading = false;
    });
  }

  toggleAllSelection(type){
    if(type=='floor'){
    if (this.allFloorSelected.selected) {
      this.empForm.controls.floor
        .patchValue([...this.levellist.map(item => item.floorId), 0]);
    } else {
      this.empForm.controls.floor.patchValue([]);
      this.filterGroup = [];
    }
  }else if(type='department'){
    this.deptList=[];
    if (this.allDeptSelected.selected) {
      this.filterGroup.map(item =>
      {
        // this.empForm.controls.department
        // .patchValue([...item.departments.map(item1 => item1.deptId), 0]);

       let deptObj = item.departments;
       this.deptList = this.deptList.concat(deptObj);
                console.log('depts ', this.deptList);
      }
      );
      this.empForm.controls.department
      .patchValue([... this.deptList.map(dept => dept.deptId), 0]);

    } else {
      this.empForm.controls.department.patchValue([]);
    }
  }
  }

  togglePerOne(type){
    if(type=='floor'){
        if (this.allFloorSelected.selected) {
          this.allFloorSelected.deselect();
          return false;
      }
        if(this.empForm.controls.floor.value.length==this.levellist.length)
          this.allFloorSelected.select();
    }else if(type='department'){
      if (this.allDeptSelected.selected) {
        this.allDeptSelected.deselect();
        return false;
      }
    console.log(this.empForm.controls.department.value.length);
   // console.log(this.deptList.length);
    console.log(" selected items :",this.empForm.controls.department.value.length);
    console.log( 'items in dropdown ', this.filterGroup.length);
    let count=0;
    this.filterGroup.forEach(x=>{
      count+=x.departments.length;
    })
      if(this.empForm.controls.department.value.length==count)//pending
        this.allDeptSelected.select();
    }
  }


  loadDepartments(floors){console.log('selected floors : ', floors);

      if(this.allFloorSelected.selected){
        floors = this.getFields(this.levellist, "floorId");
      }
      console.log('selected floors : ', floors);

      this.filterGroup= this.levellist.filter(x =>floors.findIndex(y => y == x.floorId) != -1);

  }
  getFields(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  selectPeriod(value){
    let current_year = new Date().getFullYear();
    console.log('current year :: ', current_year);

    this.years=[];
    this.years.push(current_year-4);
    this.years.push(current_year-3);
    this.years.push(current_year-2);
    this.years.push(current_year-1);
    this.years.push(current_year);

    if(value == "year"){
        this.year = true;
        this.Quarter = false;
        this.month = false;
        this.week = false;
        this.Date = false;


        this.empForm.get('fromDate').clearValidators();
        this.empForm.get('fromDate').updateValueAndValidity();

        this.empForm.get('toDate').clearValidators();
        this.empForm.get('toDate').updateValueAndValidity();

        this.empForm.get('month').clearValidators();
        this.empForm.get('month').updateValueAndValidity();

        this.empForm.get('weeks').clearValidators();
        this.empForm.get('weeks').updateValueAndValidity();

        this.empForm.get('quarters').clearValidators();
        this.empForm.get('quarters').updateValueAndValidity();



        this.empForm.get('fromDate').setValue('');
        this.empForm.get('toDate').setValue('');
        this.empForm.get('month').setValue('');
        this.empForm.get('weeks').setValue('');
        this.empForm.get('quarters').setValue('');
      }
      else if(value == "quarter"){
        this.Quarter = false;
        this.year = true;
        this.month = false;
        this.week = false;
        this.Date = false;

        this.empForm.get('fromDate').clearValidators();
        this.empForm.get('fromDate').updateValueAndValidity();

        this.empForm.get('toDate').clearValidators();
        this.empForm.get('toDate').updateValueAndValidity();

        this.empForm.get('month').clearValidators();
        this.empForm.get('month').updateValueAndValidity();

        this.empForm.get('weeks').clearValidators();
        this.empForm.get('weeks').updateValueAndValidity();


      this.empForm.get('year').setValue('');
      this.empForm.get('month').setValue('');
      this.empForm.get('quarters').setValue('');
      this.empForm.get('weeks').setValue('');
      this.empForm.get('fromDate').setValue('');
      this.empForm.get('toDate').setValue('');
      }
      else if(value == "month"){
        this.month = false;
        this.year = true;
        this.Quarter = false;
        this.week = false;
        this.Date = false;

        this.empForm.get('fromDate').clearValidators();
        this.empForm.get('fromDate').updateValueAndValidity();

        this.empForm.get('toDate').clearValidators();
        this.empForm.get('toDate').updateValueAndValidity();

        this.empForm.get('weeks').clearValidators();
        this.empForm.get('weeks').updateValueAndValidity();

        this.empForm.get('quarters').clearValidators();
        this.empForm.get('quarters').updateValueAndValidity();

        this.empForm.get('year').setValue('');
        this.empForm.get('month').setValue('');
        this.empForm.get('quarters').setValue('');
        this.empForm.get('weeks').setValue('');
        this.empForm.get('fromDate').setValue('');
        this.empForm.get('toDate').setValue('');
      }
      else if(value == "week"){
        this.week = false;
        this.year = true;
        this.Quarter = false;
        this.month = false;
        this.Date = false;


        this.empForm.get('fromDate').clearValidators();
        this.empForm.get('fromDate').updateValueAndValidity();

        this.empForm.get('toDate').clearValidators();
        this.empForm.get('toDate').updateValueAndValidity();

        this.empForm.get('quarters').clearValidators();
        this.empForm.get('quarters').updateValueAndValidity();


          this.empForm.get('year').setValue('');
          this.empForm.get('month').setValue('');
          this.empForm.get('quarters').setValue('');
          this.empForm.get('fromDate').setValue('');
          this.empForm.get('toDate').setValue('');
          this.empForm.get('weeks').setValue('');

      }
      else{
        this.Date = true;
        this.year = false;
        this.Quarter = false;
        this.month = false;
        this.week = false;


        this.empForm.get('year').clearValidators();
        this.empForm.get('year').updateValueAndValidity();

        this.empForm.get('month').clearValidators();
        this.empForm.get('month').updateValueAndValidity();

        this.empForm.get('weeks').clearValidators();
        this.empForm.get('weeks').updateValueAndValidity();

        this.empForm.get('quarters').clearValidators();
        this.empForm.get('quarters').updateValueAndValidity();


        this.empForm.get('year').setValue('');
        this.empForm.get('quarters').setValue('');
        this.empForm.get('weeks').setValue('');
        this.empForm.get('month').setValue('');
        this.empForm.get('fromDate').setValue('');
        this.empForm.get('toDate').setValue('');

      }
      this.cdref.detectChanges();
  }
  selectedYear(){
    this.empForm.get('month').setValue('');
    this.empForm.get('weeks').setValue('');
    this.empForm.get('quarters').setValue('');
    this.empForm.get('fromDate').setValue('');
        this.empForm.get('toDate').setValue('');


      if(this.empForm.value.selectValue=='month' || this.empForm.value.selectValue=='week')
          this.month = true;
      else if(this.empForm.value.selectValue=='quarter')
          this.Quarter = true;


  }
selectedMonth(){
        this.empForm.get('weeks').setValue('');
        this.empForm.get('quarters').setValue('');

  if(this.empForm.value.selectValue=='week')
   {

        this.week = true;
        let datestring = this.empForm.value.year +'-'+ (this.empForm.value.month<10?'0'+this.empForm.value.month:this.empForm.value.month);
        console.log('datestring ', datestring)
        let month = moment(datestring, 'YYYY-MM');
        let first = month.startOf('month').endOf('week').date();
        console.log('first ', first)
        let last = month.daysInMonth();
        let count = (last-first)/7;
        // let weeks = [];
        this.weeks = [];
        this.weeks.push([datestring+'-'+'01', datestring+'-'+ ((first+'').length==1? '0'+first:first)]);
        for (var i=0; i < count; i++) {
        let fromDate=(first+1);
        let toDate=(Math.min(first+=7, last));
        this.weeks.push([ datestring+'-'+((fromDate+'').length==1? '0'+fromDate:fromDate), datestring+'-'+ ((toDate+'').length==1? '0'+toDate:toDate)]);
        }
        console.log("Initial page loading ......", this.weeks);
      }

}


    getReports(){

    let year = this.empForm.value.year;

      if(this.Quarter){


        if(this.empForm.value.quarters==1){

          let month = moment(year+'-01', 'YYYY-MM');

          let last = month.daysInMonth();


          this.fromDate = year+'-01-01';
          this.toDate = year+'-03-'+last ;

        }else if(this.empForm.value.quarters==2){
          let month = moment(year+'-04', 'YYYY-MM');
          let last = month.daysInMonth();

          this.fromDate = year+'-04-01';
          this.toDate = year+'-06-'+last ;

        }else if(this.empForm.value.quarters==3){

          let month = moment(year+'-07', 'YYYY-MM');
          let last = month.daysInMonth();

          this.fromDate = year+'-07-01';
          this.toDate = year+'-09-'+last ;

        }else if(this.empForm.value.quarters==4){

          let month = moment(year+'-10', 'YYYY-MM');
          let last = month.daysInMonth();

          this.fromDate = year+'-10-01';
          this.toDate = year+'-12-'+last ;

        }



      }else if(this.month && !this.week){


        let datestring = this.empForm.value.year +'-'+ (this.empForm.value.month<10?'0'+this.empForm.value.month:this.empForm.value.month);

        let month = moment(datestring, 'YYYY-MM');

        let last = month.daysInMonth();

        this.fromDate = datestring+'-01';
        this.toDate = datestring+'-'+last;


     }else if(this.year && !this.month){

      this.fromDate = year+'-01-01';
      this.toDate = year+'-12-31';



     }else if(this.week){
      console.log(this.empForm.value.weeks);

      this.fromDate = this.empForm.value.weeks[0];
      this.toDate = this.empForm.value.weeks[1];

     }else if(this.Date){

      let d1 = new Date(this.empForm.value.fromDate);
      // this.toDate = this.empForm.value.toDate;
     let month1 = '' + (d1.getMonth() + 1);
     let day1 = '' + d1.getDate();
     let year1 = d1.getFullYear();

      if (month1.length < 2) month1 = '0' + month1;
      if (day1.length < 2) day1 = '0' + day1;

      this.fromDate = year1+'-'+month1+'-'+day1;



      let d2= new Date(this.empForm.value.toDate);
         let month2 = '' + (d2.getMonth() + 1);
        let  day2 = '' + d2.getDate();
         let year2 = d2.getFullYear();

          if (month2.length < 2) month2 = '0' + month2;
          if (day2.length < 2) day2 = '0' + day2;

          this.toDate = year2+'-'+month2+'-'+day2;


    }
    console.log(this.fromDate);
    console.log(this.toDate);

    let selDeptList:Array<number> = this.empForm.value.department;

    console.log(selDeptList);


   // selDeptList = this.getFields(selDeptList, "deptId");


    let searchData = {


      "depts": selDeptList,
      "endDate": this.toDate,
      "floors": this.empForm.value.floor,
      "orgId": this.orgId,
      "services": [],
      "startDate": this.fromDate
    };
    console.log('searchData : ', searchData);
    this.loading = true;
    this.performanceService.getEmpReport(searchData).subscribe((result:IEmployeeReport[])=>{
    console.log('result : ',result);
      if(result!=undefined)
      if(result.length>0){
        this.reportsList = result;
        this.dataSource = new MatTableDataSource(this.reportsList);
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.gridLoad=false;
      }else{
        this.reportsList = [];
        this.gridLoad=true;
      }

     this.loading = false;

      }, err => {
        let message = err.error.messages as string
        let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
        console.log("Failed :: ", JSON.stringify(err));
        this.showAlert(errorMessage, ActionType.ERROR, err.status);
        this.loading = false;
        this.gridLoad=true;
      });

    }
    getListData(obj) {
      let index = 0,
        startingIndex = obj.pageIndex * obj.pageSize,
        endingIndex = startingIndex + obj.pageSize;
      console.log("reports=>", this.reportsList);

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

    clearAllFields(){
      this.empForm.get('floor').setValue('');
      this.empForm.get('department').setValue('');
      this.empForm.get('year').setValue('');
      this.empForm.get('quarters').setValue('');
      this.empForm.get('weeks').setValue('');
      this.empForm.get('month').setValue('');
      this.empForm.get('fromDate').setValue('');
      this.empForm.get('toDate').setValue('');

      this.reportsList=[];
      this.filterGroup = [];

    }

    ExportTOExcel() {
      //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportsList.map(data=> _.pick(data, this.displayedColumns)));
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'EmpPerformance.xlsx');

    }

    ExportTOCsv() {
      console.log("EmpPerformceList==>", JSON.stringify(this.reportsList));
      console.log("this.menuInfo", this.reportsList[0]);
      console.log("this.menuInfo", Object.keys(this.reportsList[0]));
      var options = {
        noDownload: false,
        headers:this.displayedColumns,
      };
      new Angular5Csv(this.reportsList.map(data=> _.pick(data, this.displayedColumns)), 'EmpPerformance_Reports',options);
    }


}
