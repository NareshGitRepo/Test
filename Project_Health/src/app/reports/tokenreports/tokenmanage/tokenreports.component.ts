import * as XLSX from 'xlsx';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as _ from 'lodash';

import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenReportService } from '../_service/tokenreports.service';
import { IFloor, IDepartment, IService, ITokenReport, IDateInfo } from '../_model/tokenreports.model';
import { MatTableDataSource, MatSort, MatPaginator, MatOption } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { Router } from '@angular/router';
import { AppConfig, ITokenInfo } from '../../../_helpers/app.config';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-tokenreports',
  templateUrl: './tokenreports.component.html',
  styleUrls: ['./tokenreports.component.scss']
})
export class TokenreportsComponent implements OnInit {

  toDay: Date;
  loading: boolean = false;
  tokenForm: FormGroup;
  fromDate: string;
  toDate: string;
  startDate: Date;
  endDate: Date;
  _tokenInfo: any;
  orgId: number;
  departmentlist: IDepartment[] = [];
  levellist: IFloor[] = [];
  servicelist: IService[] = [];
  filterDeptGroup: IDepartment[] = [];
  filterFloorGroup: IFloor[] = [];
  dataSource = new MatTableDataSource<ITokenReport>();
  displayedColumns: string[] = ['tokenNo', 'mrnNo', 'patientName', 'appointmentTime', 'checkInTime', 'checkInMode', 'floorName', 'deptEngName', 'serviceEngName', 'printedBy'];
  filterListReports: ITokenReport[] = [];
  reportsList: ITokenReport[] = [];

  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  floorName: string;
  deptName: string;
  servicename: string;
  hide: boolean = false;
  d = new Date();

  defaultFloorData: IFloor = {
    departments: [],
    floorArbName: '',
    floorId: 0,
    floorName: '',
    orgId: 0
  };
  defaultDeptData: IDepartment = {
    deptArbName: '',
    deptId: 0,
    deptName: '',
    deptType: 0,
    dept_Multiple_Token: 0,
    floorId: 0,
    orgId: 0,
    services: [],
    status: 0
  };
  defaultServieData: IService = {
    deptId: 0,
    deptName: '',
    endToken: 0,
    floorId: 0,
    floorName: '',
    npEarlyCheckin: 0,
    npLateCheckin: 0,
    orgId: 0,
    serviceArName: '',
    serviceColor: '',
    serviceEngName: '',
    serviceId: 0,
    servicePrefix: '',
    serviceType: 0,
    startToken: 0,
    status: 0
  };


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('allFloorSelected') private allFloorSelected: MatOption;
  @ViewChild('allDepartmentSelected') private allDepartmentSelected: MatOption;
  @ViewChild('allServiceSelected') private allServiceSelected: MatOption;

  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }];

  previousRequesrData: any = {
    "endDate": "",
    "orgId": 0,
    "selectionType": 1,// this.tokenForm.value.dateRange,  
    "services": [],
    "startDate": "",
    "tokenNo": '',
    "depts": [],
    "floors": [],
    "mrnNo": ''
  }
  constructor(private datePipe: DatePipe, private fb: FormBuilder, private tokenservice: TokenReportService, private appConfig: AppConfig, private router: Router, private alertMessage: AlertMessageService, private translate: TranslateService) {



    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      console.log('ifffff');

      this.orgId = this._tokenInfo.orgId;
      this.loading = true;
      this.tokenservice.getCurrentDate().subscribe((response: IDateInfo) => {
        console.log("date response::", response)
        this.d = new Date((response.dateTime).replace(/\s/g, "T")); console.log("date::", this.d);
        let dd = new Date((response.dateTime).replace(/\s/g, "T"));
        let currMonth = dd.getMonth();
        dd.setMonth(currMonth - 3);
        this.startDate = new Date(dd);
        this.endDate = new Date(this.d);
        console.log('this.startDate=>', this.startDate);
        console.log(' this.endDate=>', this.endDate);
        this.getFloorsWithDeptsByFacilitateId();
      });
    }

  }

  ngOnInit() {
    this.tokenForm = this.fb.group({
      // dateRange: ['',[Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      floor: [''],
      department: [''],
      service: [''],
      tokennumber: [''],//,[Validators.required]],
      mrnnumber: ['']
    });



  }

  getFloorsWithDeptsByFacilitateId() {
    // this.loading = true;
    this.tokenservice.getFloorsWithDeptsByFacilitateId().subscribe((response: IFloor[]) => {
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

  toggleAllSelection(type) {
    console.log(type);
    // this.servicename ='';
    if (type == 'floor') {

      if (this.allFloorSelected.selected) {
        this.tokenForm.controls.floor
          .patchValue([...this.levellist.map(item => item.floorId), this.defaultFloorData]);
        this.floorName = this.levellist[0].floorName;
      } else if (!this.allFloorSelected.selected) {
        this.tokenForm.controls.floor.patchValue([]);
        this.filterFloorGroup = [];
        this.filterDeptGroup = [];
        this.floorName = '';
        this.servicelist = [];
        this.tokenForm.get('department').setValue([]);
        this.tokenForm.get('service').setValue([]);
      }
    } else if (type == 'department') {
      this.departmentlist = [];
      this.servicelist = [];
      //  this.tokenForm.get('service').setValue('');
      if (this.allDepartmentSelected.selected) {
        this.filterFloorGroup.map(item => {
          let deptObj = item.departments;
          this.departmentlist = this.departmentlist.concat(deptObj);
        }
        );
        this.tokenForm.controls.department
          .patchValue([... this.departmentlist.map(dept => dept), this.defaultDeptData]);
        this.filterDeptGroup = this.tokenForm.value.department;
        console.log('All dept filterDeptGroup : ', this.filterDeptGroup);
        this.deptName = this.departmentlist[0].deptName;


        let count = 0;
        this.filterDeptGroup.forEach(x => {//console.log(x.services)
          if (x.services)
            count += x.services.length;
        });

        //console.log('count=>',count,'service.value.length=>',this.tokenForm.controls.service.value.length);

        if (this.tokenForm.controls.service.value.length != count && this.allServiceSelected) {
          this.allServiceSelected.deselect();
          // this.deptName=this.tokenForm.value.department[1].deptName;
        }


      } else if (!this.allDepartmentSelected.selected) {
        this.tokenForm.controls.department.patchValue([]);
        this.filterDeptGroup = [];
        this.deptName = '';
        this.servicelist = [];
        this.tokenForm.get('service').setValue([]);
      }
    } else if (type == 'service') {
      this.servicelist = [];
      if (this.allServiceSelected.selected) {

        this.filterDeptGroup.map(item => {
          if (item.services != undefined) {
            let serviceObj = item.services;
            this.servicelist = this.servicelist.concat(serviceObj);
          }
        });
        console.log('Services ', this.servicelist);

        this.tokenForm.controls.service
          .patchValue([... this.servicelist.map(item => item), this.defaultServieData]);
        this.servicename = this.servicelist[0].serviceEngName;
      } else {
        this.tokenForm.controls.service.patchValue([]);
        this.servicename = '';
      }
    }
  }

  togglePerOne(type) {
    if (type == 'floor') {
      if (this.allFloorSelected.selected) {
        this.allFloorSelected.deselect();
        //return false;
      }
      if (this.tokenForm.value.floor.length == 0) {
        this.filterFloorGroup = [];
        this.filterDeptGroup = [];
        this.tokenForm.get('department').setValue([]);
        this.tokenForm.get('service').setValue([]);
      }


      if (this.tokenForm.controls.floor.value.length == this.levellist.length) {
        this.allFloorSelected.select();
        this.floorName = this.levellist[0].floorName;

      }

    } else if (type == 'department') {

      if (this.allDepartmentSelected.selected) {
        this.allDepartmentSelected.deselect();
        // return false;
      }
      console.log(this.tokenForm.controls.department.value.length);
      console.log(this.filterFloorGroup.length);
      if (this.tokenForm.value.department.length == 0) {
        this.filterDeptGroup = [];
        this.tokenForm.get('department').setValue([]);
        this.tokenForm.get('service').setValue([]);
      }
      let count = 0;
      this.filterFloorGroup.forEach(x => {
        count += x.departments.length;
      })
      if (this.tokenForm.controls.department.value.length == count) {
        this.allDepartmentSelected.select();
        this.deptName = this.tokenForm.value.department[1].deptName;
      }
    } else if (type == 'service') {

      if (this.allServiceSelected.selected) {
        this.allServiceSelected.deselect();
        // return false;
      }

      let count = 0;
      this.filterDeptGroup.forEach(x => {//console.log(x.services)
        if (x.services)
          count += x.services.length;
      })
      if (this.tokenForm.controls.service.value.length == count) {

        this.allServiceSelected.select();
        this.servicename = this.tokenForm.value.service[1].serviceEngName;
      }
    }
  }

  loadDepartments(floors) {
    console.log('selected floors : ', floors);
    let deptData1 = [];


    if (floors && floors.length > 0) {
      if (this.allFloorSelected.selected) {
        floors = this.getFields(this.levellist, "floorId");
      }
      console.log('selected floors : ', floors);
      this.filterFloorGroup = this.levellist.filter(x => floors.findIndex(y => y == x.floorId) != -1);


      this.floorName = '';
      let userSelected: number[] = [];
      userSelected = this.tokenForm.value.floor;

      if (userSelected) {
        deptData1 = this.tokenForm.value.department;
        console.log('deptData1=>', deptData1);

        floors = floors.length > 0 ? floors : [];

        if (floors[0].floorId != 0) {
          let findex = this.levellist.findIndex(y => y.floorId == floors[0]);
          console.log("findex=>", findex);

          if (findex != -1) {
            this.floorName = this.levellist[findex].floorName;
            console.log("floorName=>", this.floorName)
          }
        }
        if (deptData1) {
          deptData1 = deptData1.filter(x => this.filterFloorGroup.findIndex(y => y.departments.findIndex(z => z == x) != -1) != -1);
          console.log("dept-servicedata-2 ==>", deptData1);


          if (deptData1.length > 0) {
            this.tokenForm.get('department').setValue(deptData1);
            console.log("dept-servicedata-3 ==>", deptData1.length);


            let count = 0;
            this.filterFloorGroup.forEach(x => {
              count += x.departments.length;
            });
            console.log('count=>', count);
            this.deptName = deptData1[0].deptName;
            console.log(' this.deptName at 279=>', this.deptName);
            let newDeptData = deptData1;
            if (deptData1.length == count)//pending
            {
              console.log('select dept All');
              newDeptData.splice(0, 0, this.defaultDeptData);
              this.tokenForm.get('department').setValue(newDeptData);
              this.allDepartmentSelected.select();

            } else {
              console.log('not select dept all');
              this.tokenForm.get('department').setValue(newDeptData);
            }

            console.log('this.deptName=>', this.deptName);

          } else {
            this.tokenForm.get('department').setValue([]);
            this.tokenForm.get('service').setValue([]);
            this.deptName = '';
            this.servicename = '';
          }
          this.loadServices(deptData1);

        } else {
          this.loadServices(deptData1);
        }
      }
    }

  }

  loadServices(departments) {
    console.log('departments', departments);


    this.servicename = '';
    let servicedata = [];
    if (departments) {

      this.filterDeptGroup = departments;
      this.departmentlist = [];


      let deptSelected: IDepartment[] = [];
      deptSelected = this.tokenForm.value.department;
      console.log('deptSelected : ', deptSelected);
      if (deptSelected) {

        let findex = this.filterDeptGroup.findIndex(y => y.deptId == deptSelected[0].deptId);
        servicedata = this.tokenForm.value.service;
        console.log("findex=>", findex)

        if (findex != -1) {
          this.deptName = (this.filterDeptGroup.length > 1 && this.filterDeptGroup[0].deptId == 0) ? this.filterDeptGroup[1].deptName : this.filterDeptGroup[0].deptName;
          console.log("deptName in loadServices() =>", this.deptName);
        }
      }

      if (servicedata) {
        let servicedatatemp: IService[] = servicedata;
        if (servicedatatemp.length > 0)
          servicedatatemp[0].serviceId == 0 ? servicedatatemp.shift() : false;
        console.log('servicedata=>', servicedata);

        let deptTemp: IDepartment[] = this.filterDeptGroup;
        if (this.filterDeptGroup.length > 0)
          this.filterDeptGroup[0].deptId == 0 ? deptTemp.splice(0, 1) : false;
        console.log('filterDeptGroup=>', this.filterDeptGroup.length);
        let servicedata1 = [];

        servicedata1 = servicedatatemp.filter(x => deptTemp.findIndex(y => y.services.findIndex(z => z == x) != -1) != -1);
        console.log("servicedata1 ==>", servicedata1);

        let count = 0;
        this.filterDeptGroup.forEach(x => {
          count += x.services.length;
        });
        console.log('count=>', count, servicedata1.length);
        this.servicename = servicedata1.length > 0 ? servicedata1[0].serviceEngName : '';

        if (servicedata1.length == count && count != 0)//pending
        {
          console.log('select all', servicedata1);

          this.allServiceSelected.select();

          servicedata1.splice(0, 0, this.defaultServieData);

        }

        this.tokenForm.get('service').setValue(servicedata1);

      }


    } else {
      this.filterDeptGroup = [];
    }
    if (this.allDepartmentSelected) {
      if (this.allDepartmentSelected.selected) {
        this.filterDeptGroup.splice(0, 0, this.defaultDeptData);


        this.allDepartmentSelected.select();
      }
    } console.log('filterDeptGroup : ', this.filterDeptGroup);
  }

  selectedModule(services) {
    console.log('services =>', services);

    if (services && services.length > 0) {
      if (services[0].serviceId != 0) {// all not selected 


        this.servicelist = services;
        let serviceSelected: IService[] = [];
        serviceSelected = this.tokenForm.value.service;
        console.log("serviceSelected=>", serviceSelected)
        if (serviceSelected.length > 0) {

          this.servicename = serviceSelected[0].serviceEngName;
        }
        console.log('this.servicename=>', this.servicename);
      }
    }
    else {
      this.servicelist = [];
    }
  }

  getFields(input, field) {
    var output = [];
    for (var i = 0; i < input.length; ++i)
      output.push(input[i][field]);

    if (output.indexOf(0) != -1)
      output.splice(output.indexOf(0), 1);
    return output;
  }
  getLevel(input) {
    var output = [];
    for (var i = 0; i < input.length; ++i) {
      if (typeof (input[i]) == 'number')
        output.push(input[i]);
    }
    return output;
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
    // if(this.tokenForm.value.dateRange == 1){//fromdate
    let d1 = new Date(this.tokenForm.value.fromDate);
    let month1 = '' + (d1.getMonth() + 1);
    let day1 = '' + d1.getDate();
    let year1 = d1.getFullYear();

    if (month1.length < 2) month1 = '0' + month1;
    if (day1.length < 2) day1 = '0' + day1;

    this.fromDate = year1 + '/' + month1 + '/' + day1 + ' ' + '00:00:00';


    let d2 = new Date(this.tokenForm.value.toDate);
    let month2 = '' + (d2.getMonth() + 1);
    let day2 = '' + d2.getDate();
    let year2 = d2.getFullYear();

    if (month2.length < 2) month2 = '0' + month2;
    if (day2.length < 2) day2 = '0' + day2;
    this.toDate = year2 + '/' + month2 + '/' + day2 + ' ' + '23:59:59';
    // }
    // if(this.tokenForm.value.dateRange == 0){//todate
    //   let toDay = this.d;
    //   let currentMonth = '' + (toDay.getMonth() + 1);
    //   console.log('currentMonth=>',toDay,currentMonth);

    //   let currentDate = '' + toDay.getDate();
    //   let currentYear = '' + toDay.getFullYear();
    //   if (currentMonth.length < 2) currentMonth = '0' + currentMonth;
    //   if (currentDate.length < 2) currentDate = '0' + currentDate;

    //   let toDayStart = currentYear+'/'+currentMonth+'/'+currentDate+ ' '+'00:00:00';
    //   let toDayEnd = currentYear+'/'+currentMonth+'/'+currentDate+ ' '+'23:59:59';

    //   this.fromDate = toDayStart;
    //   this.toDate =  toDayEnd;
    // }

    console.log("FromDate ==>", this.fromDate);
    console.log("ToDate ==>", this.toDate);


    // let selServList:Array<number> = this.tokenForm.value.service ? this.getFields(this.tokenForm.value.service,"serviceId"):[];

    // console.log(selServList);

    // selServList = this.getFields(selServList, "serviceId");
    // console.log('selServList ',selServList);

    // if(selServList.indexOf(0)!=-1)
    // selServList.splice(selServList.indexOf(0),1);




    let searchData = {
      "endDate": this.toDate,
      "orgId": this.orgId,
      "selectionType": 1,// this.tokenForm.value.dateRange,  
      "services": this.tokenForm.value.service ? this.getFields(this.tokenForm.value.service, "serviceId") : [],
      "startDate": this.fromDate,
      "tokenNo": this.tokenForm.value.tokennumber ? (this.tokenForm.value.tokennumber).trim() : '',
      "depts": this.tokenForm.value.department ? this.getFields(this.tokenForm.value.department, "deptId") : [],
      "floors": this.tokenForm.value.floor ? this.getLevel(this.tokenForm.value.floor) : [],
      "mrnNo": this.tokenForm.value.mrnnumber ? (this.tokenForm.value.mrnnumber).trim() : ''
    };
    console.log("searchData ==>", JSON.stringify(searchData));
    if (!_.isEqual(this.previousRequesrData, searchData)) {

      this.tokenservice.getTokenReport(searchData).subscribe((result: ITokenReport[]) => {
        console.log("Result ==>", result);
        this.previousRequesrData = searchData;
        if (result == null)
          this.hide = true;
        else if (result.length > 0) {

          this.reportsList = [];
          this.filterListReports = [];
          result.forEach(element => {

            if ((element.checkInMode).toLowerCase() != 'web' && (element.checkInMode).toLowerCase() != 'manual')
              element.printedBy = element.checkInMode;

            console.log('element.appointmentTime,element.checkInTime=>', element.appointmentTime, element.checkInTime);
            if (element.mrnNo ==null || element.mrnNo == '')
              element.mrnNo = 'N/A';
            if (element.appointmentTime)
              element.appointmentTime = this.datePipe.transform(element.appointmentTime.replace(/\s/g, "T"), 'dd/MM/yyyy, HH:mm')
            if (element.checkInTime)
              element.checkInTime = this.datePipe.transform(element.checkInTime.replace(/\s/g, "T"), 'dd/MM/yyyy, HH:mm')
            this.reportsList.push(element);
          });
          console.log(' this.reportsList=>', this.reportsList);

          this.dataSource = new MatTableDataSource(this.reportsList);
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.hide = false;

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
    this.previousRequesrData = {
      "endDate": "",
      "orgId": 0,
      "selectionType": 1,// this.tokenForm.value.dateRange,  
      "services": [],
      "startDate": "",
      "tokenNo": '',
      "depts": [],
      "floors": [],
      "mrnNo": ''
    };
    if (this.filterListReports.length > 0) {
      this.reportsList = [];
      this.filterListReports = [];

    }
    this.hide = false;
    this.tokenForm.reset();
  }

  ExportTOExcel() {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportsList.map(data =>
      _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    
    /* save to file */
    XLSX.writeFile(wb, 'Token_Report_' + dateDownload + '.xlsx');

  }

  ExportTOCsv() {

    var options = {
      noDownload: false,
      headers: this.displayedColumns
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    
    new Angular5Csv(this.reportsList.map(data=> _.pick(data, this.displayedColumns)), 'Token_Reports_' + dateDownload,options);
  }

}
