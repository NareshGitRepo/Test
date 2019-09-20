import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo } from '../../../_helpers/app.config';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IDepartment, ILevelData, IService, IServiceReport, IDateInfo } from '../_model/appointmentsModel';
import { MatOption, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { AppointmentsService } from '../_service/appointments.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { DFormatTimePipe } from '../_pipe/filterPipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['serviceName','totalAppt', 'patientsArrived', 'arrivedEarly', 'arrivedLate', 'avgServedTime', 'avgWaitingTime', 'noshowCount', 'totalVisit','totalCalled' ];
  dataSource = new MatTableDataSource<IServiceReport>();
  appointmentForm: FormGroup;
  year:boolean=false;
  Quarter:boolean=false;
  month:boolean=false;
  week:boolean=false;
  Date:boolean=false;
  levellist: ILevelData[] = [];
  deptList :IDepartment[]= [];
  serviceList : IService[]= [];
  filterFloorGroup: ILevelData[] = [];
  filterDeptGroup: IDepartment[]=[];
  loading: boolean = false;
  floorName:string = '';
  deptName:string='';
  servicename:string='';
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
  reportsList:IServiceReport[]=[];
  filterListReports:IServiceReport[]=[];
  _tokenInfo: any;
  orgId:number;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  gridLoad : boolean = false;
  d=new Date();

  defaultFloorData:ILevelData={
    departments: [],
    floorArbName: '',
    floorId: 0,
    floorName: '',
    orgId: 0
  };
defaultDeptData:IDepartment={
  deptArbName: '',
  deptId: 0,
  deptName: '',
  deptType: 0,
  floorId: 0,
  orgId: 0,
  services: [],
  status: 0,
  doctors:[]
};
defaultServieData:IService={
  deptId: 0,
    deptName: '',
    endToken: 0,
    floorId: 0,
    floorName: '',
    npEarlyCheckin: 0,
    npLateCheckin: 0,
    orgId: 0,
    serviceArName: '',
    serviceEngName: '',
    serviceId: 0,
    servicePrefix: '',
    serviceType: 0,
    startToken: 0,
    status: 0
};

filterPipe = new DFormatTimePipe();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('allFloorSelected') private allFloorSelected: MatOption;
  @ViewChild('allDeptSelected') private allDeptSelected: MatOption;
  @ViewChild('allServiceSelected') private allServiceSelected: MatOption;

  constructor(private fb: FormBuilder, private appointmentsService:AppointmentsService,
    private alertMessage: AlertMessageService, private cdref: ChangeDetectorRef, 
    private appConfig: AppConfig, private router: Router, private translate: TranslateService,private datePipe: DatePipe) {


      let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
      if (tokenData)
        this._tokenInfo = tokenData.tokenSub;
      if (this._tokenInfo && tokenData) {
        this.orgId = this._tokenInfo.orgId;
        
        this.appointmentsService.getCurrentDate().subscribe((response:IDateInfo)=>{
          console.log("date response::",response)
          this.d = new Date((response.dateTime).replace(/\s/g, "T")); console.log("date::",this.d);
          let dd= new Date((response.dateTime).replace(/\s/g, "T"));
          let currMonth =dd.getMonth();
          dd.setMonth(currMonth - 3);
          this.startDate = new Date(dd);
          this.endDate = new Date(this.d);
          console.log('this.startDate=>',this.startDate);
          console.log(' this.endDate=>', this.endDate);
                  
          });
     }

    }

  ngOnInit() {
    this.appointmentForm = this.fb.group({
      selectValue: [''],
      floor:['',[Validators.required]],
      department:['',[Validators.required]],
      service:['',[Validators.required]],
      year:['',[Validators.required]],
      month:['',[Validators.required]],
      quarters:['',[Validators.required]],
      weeks:['',[Validators.required]],
      fromDate:['',[Validators.required]],
      toDate:['',[Validators.required]]
    });

    this.getFloorsWithDeptsByFacilitateId();
  }

  getFloorsWithDeptsByFacilitateId() {
    this.loading = true;
    this.appointmentsService.getFloorsWithDeptsByFacilitateId().subscribe((response: ILevelData[]) => {
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

  toggleAllSelection(type){console.log(type)
    if(type =='floor') {
  
      if (this.allFloorSelected.selected) {
        this.appointmentForm.controls.floor
            .patchValue([...this.levellist.map(item => item.floorId), this.defaultFloorData]);
            this.floorName = this.levellist[0].floorName;
      } else if(!this.allFloorSelected.selected){
        this.appointmentForm.controls.floor.patchValue([]);
        this.filterFloorGroup = [];
        this.filterDeptGroup = [];
        this.floorName = '';
         this.serviceList = [];
            this.appointmentForm.get('department').setValue([]);
            this.appointmentForm.get('service').setValue([]);
      }
    }else if(type == 'department'){
      this.deptList=[];
      this.serviceList = [];
      if (this.allDeptSelected.selected) {
        this.filterFloorGroup.map(item =>
        {
         let deptObj = item.departments;
         this.deptList = this.deptList.concat(deptObj);
                  console.log('depts ', this.deptList);
        }
        );
        this.appointmentForm.controls.department
        .patchValue([... this.deptList.map(dept => dept), this.defaultDeptData]);
        this.filterDeptGroup = this.appointmentForm.value.department;
        console.log('All dept filterDeptGroup : ', this.filterDeptGroup);
        this.deptName = this.deptList[0].deptName;


        let count=0;
        this.filterDeptGroup.forEach(x=>{//console.log(x.services)
          if(x.services)
            count+=x.services.length;
        });
  
      //console.log('count=>',count,'service.value.length=>',this.appointmentForm.controls.service.value.length);
  
       if(this.appointmentForm.controls.service.value.length!=count && this.allServiceSelected){ 
          this.allServiceSelected.deselect();
         // this.deptName=this.tokenForm.value.department[1].deptName;
        }



      } else if(!this.allDeptSelected.selected) {
        this.appointmentForm.controls.department.patchValue([]);
        this.filterDeptGroup = [];
        this.deptName = '';
       this.serviceList = [];
       this.appointmentForm.get('service').setValue([]);
      }
    }else if(type == 'service'){
        this.serviceList = [];
      if (this.allServiceSelected.selected) {
  
        this.filterDeptGroup.map(item =>{
          if(item.services!=undefined)
          {
            let serviceObj = item.services;
            this.serviceList = this.serviceList.concat(serviceObj);
          }
        });
        console.log('Services ', this.serviceList);
  
        this.appointmentForm.controls.service
        .patchValue([... this.serviceList.map(item => item), this.defaultServieData]);
        this.servicename =  this.serviceList[0].serviceEngName;
        // this.filterDeptGroup = this.appointmentForm.value.service;
        // console.log("this.filterDeptGroup : ",this.filterDeptGroup);
      } else {
        this.appointmentForm.controls.service.patchValue([]);
        this.servicename = '';
      }
    }
  }
  
  togglePerOne(type){
    if(type =='floor') {
        if (this.allFloorSelected.selected) {
          this.allFloorSelected.deselect();
          return false;
        }
      else if(this.appointmentForm.value.floor.length==0){
        this.filterFloorGroup=[];
        this.filterDeptGroup=[];
        this.appointmentForm.get('department').setValue([]);      
        this.appointmentForm.get('service').setValue([]);      
      }
      console.log('fc',this.appointmentForm.controls.floor.value.length);
      console.log('list',this.levellist.length);
        if(this.appointmentForm.controls.floor.value.length==this.levellist.length)
       {   this.allFloorSelected.select();
         this.floorName=  this.levellist[0].floorName;
  }
    }else if(type == 'department'){
  
      if (this.allDeptSelected.selected) {
        this.allDeptSelected.deselect();
        return false;
      }
      console.log(this.appointmentForm.controls.department.value.length);
      console.log(this.filterFloorGroup.length);
      if (this.appointmentForm.value.department.length==0){
        this.filterDeptGroup=[];
        this.appointmentForm.get('department').setValue([]); 
        this.appointmentForm.get('service').setValue([]); 
      }
      let count=0;
      this.filterFloorGroup.forEach(x=>{
        count+=x.departments.length;
      })
      if(this.appointmentForm.controls.department.value.length==count)
      {  this.allDeptSelected.select();
        this.deptName=this.appointmentForm.value.department[1].deptName;
  }
    }else if(type == 'service'){
  
      if (this.allServiceSelected.selected) {
        this.allServiceSelected.deselect();
        return false;
      }
  
      let count=0;
      this.filterDeptGroup.forEach(x=>{console.log(x.services)
       if(x.services)
         count+=x.services.length;
      })
      if(this.appointmentForm.controls.service.value.length==count)
  {
        this.allServiceSelected.select();
        this.servicename = this.appointmentForm.value.service[1].serviceEngName;
  }
    }
  }
  
  loadDepartments(floors){console.log('selected floors : ', floors);
  let deptData1 = [];
    if(floors && floors.length>0){
    if(this.allFloorSelected.selected){
      floors = this.getFields(this.levellist, "floorId");
    }
    console.log('selected floors : ', floors);
  
    this.filterFloorGroup= this.levellist.filter(x =>floors.findIndex(y => y == x.floorId) != -1);
  
   this.floorName = '';
    let userSelected: number[] = [];
    userSelected = this.appointmentForm.value.floor
    if(userSelected){
      
        if(floors[0].floorId!=0){ 
        let findex=this.levellist.findIndex(y=>y.floorId==floors[0]);
        console.log("findex=>",findex);      
      if (findex != -1) {
        this.floorName = this.levellist[findex].floorName;
        console.log("floorName=>",this.floorName)
          }
        }
        deptData1=this.appointmentForm.value.department; 
      if(deptData1){
        deptData1 = deptData1.filter(x => this.filterFloorGroup.findIndex(y => y.departments.findIndex(z => z == x) != -1) != -1);
        console.log("dept-servicedata-2 ==>", deptData1);
  
  
        if(deptData1.length > 0){ 
          this.appointmentForm.get('department').setValue(deptData1) ;
        
  
        let count=0;
        this.filterFloorGroup.forEach(x=>{
          count+=x.departments.length;
        });
        console.log('count=>',count);
        this.deptName=deptData1[0].deptName;
        console.log(' this.deptName at 279=>', this.deptName);

        let newDeptData = deptData1;
          if(deptData1.length==count)//pending
         {  
            console.log('select dept All');
              newDeptData.splice(0, 0, this.defaultDeptData);
            this.appointmentForm.get('department').setValue(newDeptData);
           this.allDeptSelected.select();
  
           console.log('is depts all sel =>',this.allDeptSelected.selected);
        
         }else{
           console.log('not select dept all');
           this.appointmentForm.get('department').setValue(newDeptData);
         }
      
         console.log('this.deptName=>',this.deptName);
        
      }else{
        this.appointmentForm.get('department').setValue([]);
        this.appointmentForm.get('service').setValue([]);
        this.deptName = '';
        this.servicename='';
    }
    this.loadServices(deptData1);
   
      }else{
       this.loadServices(deptData1);
      }
  }
}
  }
  loadServices(departments){
  this.servicename='';
    let servicedata = [];

    if(departments){
    this.filterDeptGroup = departments;
    console.log("filtergroup=>",this.filterDeptGroup);

    let deptSelected: IDepartment[] = [];
    deptSelected=this.appointmentForm.value.department;
    
    if(deptSelected){
      let findex = this.filterDeptGroup.findIndex(y => y.deptId == deptSelected[0].deptId);
      servicedata = this.appointmentForm.value.service;
      console.log("findex=>",findex)
      if (findex != -1) {
        this.deptName = (this.filterDeptGroup.length>1 && this.filterDeptGroup[0].deptId == 0) ?this.filterDeptGroup[1].deptName:this.filterDeptGroup[0].deptName;
        console.log("deptName=>",this.deptName)
      }
      }
    console.log('this.filterDeptGroup=>',this.filterDeptGroup);
  
      if(servicedata)
     {
      let servicedatatemp:IService[]=servicedata;

        if(servicedatatemp.length>0)
       servicedatatemp[0].serviceId==0? servicedatatemp.shift():false;
      console.log( servicedatatemp);
    
     let deptTemp:IDepartment[] =this.filterDeptGroup;
       if( this.filterDeptGroup.length>0)
     this.filterDeptGroup[0].deptId==0? deptTemp.splice(0,1):false;
     let servicedata1 = [];
        servicedata1 = servicedatatemp.filter(x => deptTemp.findIndex(y => y.services.findIndex(z => z == x) != -1) != -1);
      console.log("servicedata1 ==>", servicedata1);
  
      let count=0;
      this.filterDeptGroup.forEach(x=>{
        count+=x.services.length;
      });
      console.log('count=>',count,this.appointmentForm.value.department);
      this.servicename=servicedata1.length>0?servicedata1[0].serviceEngName:'';
  
        if(servicedata1.length==count && count!=0)//pending
       {  
         console.log('select all');
       
         this.allServiceSelected.select();
  
         console.log('serv value=>',this.appointmentForm.value.service);
          servicedata1.splice(0, 0,this.defaultServieData);
         
       }
   
        this.appointmentForm.get('service').setValue(servicedata1);
       
      
    }
    
    
    }else{
    this.filterDeptGroup = [];
  }
  if(this.allDeptSelected)
   { if(this.allDeptSelected.selected)
     {
      this.filterDeptGroup.splice(0,0,this.defaultDeptData);
      
      
      this.allDeptSelected.select();
     }
    }
  console.log('filterDeptGroup : ', this.filterDeptGroup);
  }
  selectedModule(services){
  //this.servicename = '';
    if (services) {
       if(services[0].serviceId!=0){// all not selected 
          this.serviceList=services;
      console.log("serviceList=>",this.serviceList)
      let serviceSelected: IService[] = [];
      serviceSelected = this.appointmentForm.value.service;
      if (serviceSelected.length > 0) {
            console.log("servicename=>",serviceSelected)
              this.servicename = serviceSelected[0].serviceEngName;
            }
        console.log('this.servicename=>',this.servicename); 
      }
    }
    else{
      this.serviceList=[];
    }
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
  let current_year = this.d.getFullYear();
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


      this.appointmentForm.get('fromDate').clearValidators();
      this.appointmentForm.get('fromDate').updateValueAndValidity();

      this.appointmentForm.get('toDate').clearValidators();
      this.appointmentForm.get('toDate').updateValueAndValidity();

      this.appointmentForm.get('month').clearValidators();
      this.appointmentForm.get('month').updateValueAndValidity();

      this.appointmentForm.get('weeks').clearValidators();
      this.appointmentForm.get('weeks').updateValueAndValidity();

      this.appointmentForm.get('quarters').clearValidators();
      this.appointmentForm.get('quarters').updateValueAndValidity();



      this.appointmentForm.get('fromDate').setValue('');
      this.appointmentForm.get('toDate').setValue('');
      this.appointmentForm.get('month').setValue('');
      this.appointmentForm.get('weeks').setValue('');
      this.appointmentForm.get('quarters').setValue('');
    }
    else if(value == "quarter"){
      this.Quarter = false;
      this.year = true;
      this.month = false;
      this.week = false;
      this.Date = false;

      this.appointmentForm.get('fromDate').clearValidators();
      this.appointmentForm.get('fromDate').updateValueAndValidity();

      this.appointmentForm.get('toDate').clearValidators();
      this.appointmentForm.get('toDate').updateValueAndValidity();

      this.appointmentForm.get('month').clearValidators();
      this.appointmentForm.get('month').updateValueAndValidity();

      this.appointmentForm.get('weeks').clearValidators();
      this.appointmentForm.get('weeks').updateValueAndValidity();


    this.appointmentForm.get('year').setValue('');
    this.appointmentForm.get('month').setValue('');
    this.appointmentForm.get('quarters').setValue('');
    this.appointmentForm.get('weeks').setValue('');
    this.appointmentForm.get('fromDate').setValue('');
    this.appointmentForm.get('toDate').setValue('');
    }
    else if(value == "month"){
      this.month = false;
      this.year = true;
      this.Quarter = false;
      this.week = false;
      this.Date = false;

      this.appointmentForm.get('fromDate').clearValidators();
      this.appointmentForm.get('fromDate').updateValueAndValidity();

      this.appointmentForm.get('toDate').clearValidators();
      this.appointmentForm.get('toDate').updateValueAndValidity();

      this.appointmentForm.get('weeks').clearValidators();
      this.appointmentForm.get('weeks').updateValueAndValidity();

      this.appointmentForm.get('quarters').clearValidators();
      this.appointmentForm.get('quarters').updateValueAndValidity();

      this.appointmentForm.get('year').setValue('');
      this.appointmentForm.get('month').setValue('');
      this.appointmentForm.get('quarters').setValue('');
      this.appointmentForm.get('weeks').setValue('');
      this.appointmentForm.get('fromDate').setValue('');
      this.appointmentForm.get('toDate').setValue('');
    }
    else if(value == "week"){
      this.week = false;
      this.year = true;
      this.Quarter = false;
      this.month = false;
      this.Date = false;


      this.appointmentForm.get('fromDate').clearValidators();
      this.appointmentForm.get('fromDate').updateValueAndValidity();

      this.appointmentForm.get('toDate').clearValidators();
      this.appointmentForm.get('toDate').updateValueAndValidity();

      this.appointmentForm.get('quarters').clearValidators();
      this.appointmentForm.get('quarters').updateValueAndValidity();


        this.appointmentForm.get('year').setValue('');
        this.appointmentForm.get('month').setValue('');
        this.appointmentForm.get('quarters').setValue('');
        this.appointmentForm.get('fromDate').setValue('');
        this.appointmentForm.get('toDate').setValue('');
        this.appointmentForm.get('weeks').setValue('');

    }
    else{
      this.Date = true;
      this.year = false;
      this.Quarter = false;
      this.month = false;
      this.week = false;


      this.appointmentForm.get('year').clearValidators();
      this.appointmentForm.get('year').updateValueAndValidity();

      this.appointmentForm.get('month').clearValidators();
      this.appointmentForm.get('month').updateValueAndValidity();

      this.appointmentForm.get('weeks').clearValidators();
      this.appointmentForm.get('weeks').updateValueAndValidity();

      this.appointmentForm.get('quarters').clearValidators();
      this.appointmentForm.get('quarters').updateValueAndValidity();


      this.appointmentForm.get('year').setValue('');
      this.appointmentForm.get('quarters').setValue('');
      this.appointmentForm.get('weeks').setValue('');
      this.appointmentForm.get('month').setValue('');
      this.appointmentForm.get('fromDate').setValue('');
      this.appointmentForm.get('toDate').setValue('');

    }
    this.cdref.detectChanges();
}
selectedYear(){
  this.appointmentForm.get('month').setValue('');
  this.appointmentForm.get('weeks').setValue('');
  this.appointmentForm.get('quarters').setValue('');
  this.appointmentForm.get('fromDate').setValue('');
      this.appointmentForm.get('toDate').setValue('');


    if(this.appointmentForm.value.selectValue=='month' || this.appointmentForm.value.selectValue=='week')
        this.month = true;
    else if(this.appointmentForm.value.selectValue=='quarter')
        this.Quarter = true;


}
selectedMonth(){
      this.appointmentForm.get('weeks').setValue('');
      this.appointmentForm.get('quarters').setValue('');

if(this.appointmentForm.value.selectValue=='week')
 {

      this.week = true;
      let datestring = this.appointmentForm.value.year +'-'+ (this.appointmentForm.value.month<10?'0'+this.appointmentForm.value.month:this.appointmentForm.value.month);
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
  let year = this.appointmentForm.value.year;
  if(this.Quarter){
    if(this.appointmentForm.value.quarters==1){


      let month = moment(year+'-01', 'YYYY-MM');

      let last = month.daysInMonth();


      this.fromDate = year+'-01-01';
      this.toDate = year+'-03-'+last ;

    }else if(this.appointmentForm.value.quarters==2){

          let month = moment(year+'-04', 'YYYY-MM');
          let last = month.daysInMonth();

          this.fromDate = year+'-04-01';
          this.toDate = year+'-06-'+last ;

    }else if(this.appointmentForm.value.quarters==3){
          let month = moment(year+'-07', 'YYYY-MM');
          let last = month.daysInMonth();

          this.fromDate = year+'-07-01';
          this.toDate = year+'-09-'+last ;

    }else if(this.appointmentForm.value.quarters==4){
      let month = moment(year+'-10', 'YYYY-MM');
      let last = month.daysInMonth();

      this.fromDate = year+'-10-01';
      this.toDate = year+'-12-'+last ;

    }
  }else if(this.month && !this.week){

    let datestring = this.appointmentForm.value.year +'-'+ (this.appointmentForm.value.month<10?'0'+this.appointmentForm.value.month:this.appointmentForm.value.month);

    let month = moment(datestring, 'YYYY-MM');

    let last = month.daysInMonth();

    this.fromDate = datestring+'-01';
    this.toDate = datestring+'-'+last;

  }else if(this.year && !this.month){

    this.fromDate = year+'-01-01';
    this.toDate = year+'-12-31';

  }else if(this.week){
    console.log(this.appointmentForm.value.weeks);

    this.fromDate = this.appointmentForm.value.weeks[0];
    this.toDate = this.appointmentForm.value.weeks[1];
  }else if(this.Date){
    let d1 = new Date(this.appointmentForm.value.fromDate);
    // this.toDate = this.appointmentForm.value.toDate;
   let month1 = '' + (d1.getMonth() + 1);
   let day1 = '' + d1.getDate();
   let year1 = d1.getFullYear();

    if (month1.length < 2) month1 = '0' + month1;
    if (day1.length < 2) day1 = '0' + day1;

    this.fromDate = year1+'-'+month1+'-'+day1;



    let d2= new Date(this.appointmentForm.value.toDate);
       let month2 = '' + (d2.getMonth() + 1);
      let  day2 = '' + d2.getDate();
       let year2 = d2.getFullYear();

        if (month2.length < 2) month2 = '0' + month2;
        if (day2.length < 2) day2 = '0' + day2;

        this.toDate = year2+'-'+month2+'-'+day2;

  }
  console.log(this.fromDate);
  console.log(this.toDate);

  let selDeptList:Array<number> = this.appointmentForm.value.department;

  console.log(selDeptList);


  selDeptList = this.getFields(selDeptList, "deptId");

  console.log('selDeptList ',selDeptList);


  if(selDeptList.indexOf(0)!=-1)
  selDeptList.splice(selDeptList.indexOf(0),1);

  
  let selServList:Array<number> = this.appointmentForm.value.service;

  console.log(selServList);
  
  selServList = this.getFields(selServList, "serviceId");

  if(selServList.indexOf(0)!=-1)
  selServList.splice(selServList.indexOf(0),1);

  console.log('selServList ',selServList);

  this.appointmentForm.value.service
  console.log( this.appointmentForm.value.floor);
  let selFloors = this.appointmentForm.value.floor;
  let indx=0;
  selFloors.forEach(element => {
    
   if(typeof element!='number')
    selFloors.splice(indx,1);
   indx++;
  });

  
  
console.log('selFloors=>',selFloors);

  
 
  let searchData = {
    "depts":selDeptList,
    "endDate": this.toDate,
    "floors": selFloors,
    "orgId": this.orgId,
    "services": selServList,
    "startDate": this.fromDate
  };

  console.log('searchData : ', JSON.stringify(searchData));
  this.loading = true;

  this.appointmentsService.getServiceReport(searchData).subscribe((result:IServiceReport[])=>{
    console.log('result : ',result);
        if(result!=undefined && result.length>0){
          this.reportsList = result;
          this.reportsList.forEach(element => {  
            let result:any= this.filterPipe.transform(parseInt(element.avgServedTime));
            element.avgServedTime = result + '(hh:mm)';
            let result2:any= this.filterPipe.transform(parseInt(element.avgWaitingTime));
            element.avgWaitingTime = result2 + '(hh:mm)';
          });
          this.dataSource = new MatTableDataSource(this.reportsList);
          this.dataSource.paginator = this.paginator;
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.gridLoad = false;
        }else{
          this.reportsList = [];
          this.filterListReports=[];
          this.gridLoad = true;
        }

       this.loading = false;

        }, err => {
          let message = err.error.messages as string
          let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
          console.log("Failed :: ", JSON.stringify(err));
          this.showAlert(errorMessage, ActionType.ERROR, err.status);
          this.loading = false;
          this.gridLoad = true;
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
//  this.initPage = obj.pageIndex;
  this.dataSource = new MatTableDataSource(this.filterListReports);
}
sortData() {
  this.dataSource.sort = this.sort;
}
clearAllFields(){
  this.reportsList = [];
  this.filterListReports=[];
  this.appointmentForm.reset();
  this.gridLoad = false; 
}

ExportTOExcel() {
  //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportsList.map(data=> _.pick(data, this.displayedColumns)));
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  let tdy = new Date();
  let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
  
  /* save to file */
  XLSX.writeFile(wb, 'Service_Reports_' + dateDownload + '.xlsx');

}

ExportTOCsv() {
  console.log("serviceList==>", JSON.stringify(this.reportsList));
  // console.log("this.menuInfo", this.reportsList[0]);
  // console.log("this.menuInfo", Object.keys(this.reportsList[0]));
  var options = {
    noDownload: false,
    headers:this.displayedColumns,
  };
  let tdy = new Date();
  let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
  
  new Angular5Csv(this.reportsList.map(data=> _.pick(data, this.displayedColumns)), 'Service_Reports_' + dateDownload,options);
}
}
