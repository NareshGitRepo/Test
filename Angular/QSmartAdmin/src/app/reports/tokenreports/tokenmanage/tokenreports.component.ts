import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenReportService } from '../_service/tokenreports.service';
import { IFloor, IDepartment, IService, ITokenReport } from '../_model/tokenreports.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tokenreports',
  templateUrl: './tokenreports.component.html',
  styleUrls: ['./tokenreports.component.scss']
})
export class TokenreportsComponent implements OnInit {
  tokenForm:FormGroup;
  fromDate : string;
  toDate : string;
  startDate: Date;
  endDate: Date;
  departmentlist:IDepartment[]=[];
  levellist:IFloor[]=[];
  servicelist:IService[]=[];
  dataSource = new MatTableDataSource<ITokenReport>();
  displayedColumns: string[] = ['tokenNo', 'mrnNo', 'patientName', 'appointmentTime', 'checkinTime', 'checkinMode', 'department', 'service'];
  filterListReports:ITokenReport[]=[];
  reportsList:ITokenReport[]=[];
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }];

  constructor(private fb: FormBuilder, private tokenservice:TokenReportService) {
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    this.startDate = new Date(d);
    this.endDate = new Date();
   }

  ngOnInit() {
    this.tokenForm = this.fb.group({
      dateRange: ['',[Validators.required]],
      fromDate:['',[Validators.required]],
      toDate:['',[Validators.required]],
      floor:['',[Validators.required]],
      department:['',[Validators.required]],
      service:['',[Validators.required]],
      tokennumber:['',[Validators.required]],
    });

    this.levellist = this.tokenservice.getAllFloors();
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
      this.reportsList = this.tokenservice.getTokenReport();
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

  loadDepartments(floors){
    console.log("Floors=>",floors);
    let deptdata = [];
    let datalist = [];
       for(var i=0; i<floors.length; i++){
         let data = this.levellist.find(x => x.floorId == floors[i]);
        console.log("DeptData=>",data);
        deptdata.push(data.department);
       }

       if(deptdata.length > 0){
        deptdata.forEach(dept => {
          dept.forEach(deptId => {
            datalist.push(deptId);
          })
        })
       }
       this.departmentlist = datalist;
  }

  loadServices(departments){
    let servedata = [];
    let servelist = [];
    for(var i=0; i<departments.length; i++){
      let sdata = this.departmentlist.find(x => x.deptId == departments[i]);
      servedata.push(sdata.service);
     }
     if(servedata.length > 0){
      servedata.forEach(service => {
        service.forEach(serviceId => {
          servelist.push(serviceId);
        })
      })
     }
      this.servicelist = servelist;

  }

  getReports(){
   let d1 = new Date(this.tokenForm.value.fromDate);
   let month1 = '' + (d1.getMonth() + 1);
   let day1 = '' + d1.getDate();
   let year1 = d1.getFullYear();

    if (month1.length < 2) month1 = '0' + month1;
    if (day1.length < 2) day1 = '0' + day1;

    this.fromDate = year1+'-'+month1+'-'+day1;



    let d2= new Date(this.tokenForm.value.toDate);
       let month2 = '' + (d2.getMonth() + 1);
      let  day2 = '' + d2.getDate();
       let year2 = d2.getFullYear();

        if (month2.length < 2) month2 = '0' + month2;
        if (day2.length < 2) day2 = '0' + day2;

        this.toDate = year2+'-'+month2+'-'+day2;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
  }

  clearAllFields(){
    this.reportsList=[];
  }

}
