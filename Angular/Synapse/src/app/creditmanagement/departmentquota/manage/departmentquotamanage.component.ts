import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { CreditManagementService } from '../_service/departmentquota.service';
import { DeptquotadetailsComponent } from '../details/deptquotadetails.component';
import { DeptquotahistoryComponent } from '../history/deptquotahistory.component';
import { DeptquotasetlimitComponent } from '../setlimit/deptquotasetlimit.component';
import { IDepartment } from '../_model/departmentquota.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-departmentquotamanage',
  templateUrl: './departmentquotamanage.component.html',
  styleUrls: ['./departmentquotamanage.component.scss']
})
export class DepartmentquotamanageComponent implements OnInit {

  listflag: boolean = false;
  displayedColumns: string[] = ['deptName', 'creditTypeId', 'thresoldLimit', 'availableCredit', 'actions'];
  departmentQuotaList: IDepartment[] = [];
  filterDepartmentQuota: IDepartment[] = [];
  filterListDepartmentQuota: IDepartment[] = [];
  searchdata: string ='';
  public page = 0;
  public size = 6;
  selectedPage: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();

  public loading: boolean = false;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;

  constructor(private dialog: MatDialog, private _deptquotaService: CreditManagementService,
    private translate: TranslateService, private router: Router, private alertMessage: AlertMessageService) { }

  ngOnInit() {
    this.getDepartmentsWithCredit();
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

  getDepartmentsWithCredit() {
    this.loading = true;
    this._deptquotaService.getDepartmentsWithCredit().subscribe((response: IDepartment[]) => {
      if (response) {
        console.log("Response==>", response);
        this.departmentQuotaList = response;
        this.dataSource = new MatTableDataSource(this.departmentQuotaList);
        this.listPage = 0;
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDepartmentsWithCredit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }


  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


  loadList() {
    this.listPage=0;
     this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
    (data: IDepartment, filter: string) => data.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage=0;
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

  sortData() {
    this.dataSource.sort = this.sort
  }


  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;
    this.filterDepartmentQuota = this.departmentQuotaList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("UserData::" + JSON.stringify(this.departmentQuotaList));
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.departmentsList=>", this.departmentQuotaList);
    this.filterListDepartmentQuota = this.departmentQuotaList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListDepartmentQuota);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.departmentQuotaList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  setLimit(quotaDetails) {

    let dialogRef = this.dialog.open(DeptquotasetlimitComponent, this.getDialogConfig(quotaDetails));
    dialogRef.afterClosed().subscribe(result => {
      console.log("result ", result);
      if (result) {
        this.getDepartmentsWithCredit();
      }
    });

    //  this.dialog.open(DeptquotasetlimitComponent, this.getDialogConfig(quotaDetails));
    // this.getDepartmentsWithCredit();
  }

  deptQuotaDetails(quotaDetails) {
    let dialogRef = this.dialog.open(DeptquotadetailsComponent, this.getDialogConfig(quotaDetails));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDepartmentsWithCredit();
      }
    })
  }

  deptQuotaHistory(deptQuotaHistory) {
    this.dialog.open(DeptquotahistoryComponent, this.getDialogConfig());
  }


}
