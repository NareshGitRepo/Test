import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CreatedepartmentComponent } from '../create/createdepartment.component';
import { IDepartment, ApiResponse } from '../_model/department.model';
import { DepartmentService } from '../_service/department.service';
import * as _ from 'lodash';
import { DepartmentdetailsComponent } from '../details/departmentdetails.component';
import { ConfirmDepartmentComponent } from './departmentconfirm.component';
import { environment } from '../../../../environments/environment';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  public initPage = 0;
  public listPage = 0;
  public pageSize = environment.pageSize;
  selectedPage: any;
  listflag: boolean = false;
  displayedColumns = ['deptName', 'description', 'creditType', 'status', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  searchdata: string = '';
  departmentsList: IDepartment[] = [];
  filterDepartments: IDepartment[] = [];
  filterListdepartments: IDepartment[] = [];
  dataSource = new MatTableDataSource();
  loading: boolean;
  _filterType = '';
  loadTotalDepartments: IDepartment[] = [];
  constructor(private dialog: MatDialog, private router: Router, private departmentsService: DepartmentService,
    private alertMessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.getDepartments();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IDepartment, filter: string) => data.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  
  }


  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  getDepartments() {
    this.loading = true;
    this.departmentsService.getDepartments().subscribe((result: IDepartment[]) => {
      if (result) {
        console.log("Result", result)
        this.departmentsList = result;
        this.dataSource = new MatTableDataSource(this.departmentsList);
        this.listPage = 0;
        this.initPage = 0;
        this.loadTotalDepartments = result;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.dataSource.paginator = this.paginator;
      }
      else {
        this.departmentsList = [];
        this.loadTotalDepartments = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDepartments==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  applyFilterStatus(depart: IDepartment, status: number) {

    let data: any = status ? this.translate.instant('departmentModule.manage.activateDept') + ' \"' + depart.deptName + '\" ...?' : this.translate.instant('departmentModule.manage.deActivateDep') + ' \"' + depart.deptName + '\" ...?';
    const dialogRef = this.dialog.open(ConfirmDepartmentComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        depart.status = status;
        this.departmentsService.updateDepartmentStatus(depart.deptId, depart.status)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getDepartments();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-applyFilterStatus==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }

    });
  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  addDepartment() {
    console.log("Create Department:");
    const dialogRef = this.dialog.open(CreatedepartmentComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDepartments();
      }
    });
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IDepartment, filter: string) => data.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  editDepartment(deptDetails: IDepartment) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = deptDetails;
    const dialogRef = this.dialog.open(CreatedepartmentComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDepartments();
      }
    });
  }

  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage = 0;
    this.listPage = 0;
    switch (value) {
      case '1':
        this.departmentsList = this.loadTotalDepartments.filter(data => data.status == 1);
        console.log('departments=>', this.departmentsList);
        if (this.departmentsList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterDepartments = [];
          this.dataSource = new MatTableDataSource(this.filterDepartments);
        }
        break;
      case '0':
        this.departmentsList = this.loadTotalDepartments.filter(data => data.status == 0);
        console.log('departments=>', this.departmentsList);
        if (this.departmentsList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else
          this.filterDepartments = [];
        break;
      default:
        this.departmentsList = this.loadTotalDepartments;
        console.log('departments=>', this.departmentsList);
        if (this.departmentsList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterDepartments = [];
          this.dataSource = new MatTableDataSource(this.filterDepartments);
        }
        break;
    }
  }

  sortData() {
    this.dataSource.sort = this.sort
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.departmentsList=>", this.departmentsList);

    this.filterListdepartments = this.departmentsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListdepartments);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.departmentsList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;
    this.filterDepartments = this.departmentsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("Department data::" + JSON.stringify(this.departmentsList));
  }

  departmentDetails(deptdetails) {
    this.dialog.open(DepartmentdetailsComponent, this.getDialogConfig(deptdetails));
  }

  deleteDepartment(selectedDepartment) {
    console.log("deleteDepartment :");
    const dialogRef = this.dialog.open(ConfirmDepartmentComponent, {
      width: '500px',
      data: this.translate.instant('departmentModule.manage.deleteDep') + ' \"' + selectedDepartment.deptName + ' \" ...?'
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
        this.loading = true;
        selectedDepartment.status = status;
        this.departmentsService.deleteDepartment(selectedDepartment.deptId)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getDepartments();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
              this.getDepartments();
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteDepartment===>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }

    });
  }

}
