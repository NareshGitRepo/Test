import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDepartment, IUpdateCredit, User, UserGet } from '../_model/userquota.model';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserQuotaService } from '../_service/userquotaquota.service';
import { UserquotadetailsComponent } from '../details/userquotadetails.component';
import { UserquotahistoryComponent } from '../history/userquotahistory.component';
import { UserquotasetlimitComponent } from '../setlimit/userquotasetlimit.component';
import { environment } from '../../../../environments/environment';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType } from '../../../_helpers/app.config';

@Component({
  selector: 'app-userquotamanage',
  templateUrl: './userquotamanage.component.html',
  styleUrls: ['./userquotamanage.component.scss']
})
export class UserquotamanageComponent implements OnInit {
  listflag: boolean = false;
  displayedColumns: string[] = ['login', 'creditTypeId', 'thresoldLimit', 'availableCredit', 'actions'];
  userQuotaList: UserGet[] = [];
  loadTotalQuota: UserGet[] = [];
  filterUserQuota: UserGet[] = [];
  filterListUserQuota: UserGet[] = [];
  deptList: IDepartment[] = [];
  searchdata: string = '';
  deptName: string = '';
  initPage = 0;
  listPage = 0;
  public pageSize = environment.pageSize;
  isEdit: boolean = false;
  loading: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  userquotaForm: FormGroup;
  loginInfo: IUserUpdateDto;
  _roleCode: string = "";
  constructor(private dialog: MatDialog, private userquotaService: UserQuotaService, private alertMessage: AlertMessageService,
    private translate: TranslateService, private router: Router, private fb: FormBuilder, private appconfig: AppConfig) {
    let tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
      this.getAllUsers(false);
    }
    else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this.userquotaForm = this.fb.group({
      depts: [null]
    })
  }

  getAllUsers(action) {
    this.loading = true;
    this.initPage = 0;
    this.listPage = 0;
    this.userquotaService.getAllUserCreditsByRoleId().subscribe((response: UserGet[]) => {
      if (response) {
        console.log("UResponse==>", response);
        this.userQuotaList = response;
        this.loadTotalQuota = response;
        if (action) {
          this.selectedDepts(true);
        } else {
          this.dataSource = new MatTableDataSource(this.userQuotaList);
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
      }
      if ((this._roleCode == userType.SuperAdmin || this._roleCode == userType.PlatFormAdmin) && !action)
        this.getAllDepartments();
      else
        this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllUsers==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: UserGet, filter: string) => data.login.toLowerCase().indexOf(filter.toLowerCase()) > -1
  
  }

  reset() {
    if (this.userquotaForm.value.depts) {
      this.userquotaForm.get('depts').setValue(null);
      this.userQuotaList = this.loadTotalQuota;
      console.log('deptId=>', this.userQuotaList, this.loadTotalQuota);
      this.initPage = 0;
      this.dataSource = new MatTableDataSource(this.userQuotaList);
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    }

  }
  selectedDepts(action?: boolean) {
    if (this.userquotaForm.value.depts) {
      let deptId = this.userquotaForm.value.depts;
      console.log('deptId=>', deptId);
      //  this.userQuotaList=this.loadTotalQuota;
      this.userQuotaList = this.loadTotalQuota.filter(y => y.userCredit == null ? false : y.userCredit.deptId == deptId);
      console.log('deptId=>', deptId, this.userQuotaList, this.loadTotalQuota);
      this.initPage = 0;
      // this.listPage = 0;
      this.dataSource = new MatTableDataSource(this.userQuotaList);
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    }
	  else if(action){
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    }
  }

  getAllDepartments() {
    this.loading = true;
    this.userquotaService.getAllDepartmentsWithUsers(this._roleCode).subscribe((response: IDepartment[]) => {
      if (response) {
        console.log("Response==>", response)
        this.deptList = response;
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllDepartments==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  setLimit(quotaDetails: UserGet) {
    const dialogRef = this.dialog.open(UserquotasetlimitComponent, this.getDialogConfig(quotaDetails));
    dialogRef.afterClosed().subscribe((result: IUpdateCredit) => {
      console.log("result=>", result, quotaDetails);

      if (result) {
        // let index = this.filterUserQuota.findIndex(x => x.userId == result.userId);
        // if (index != -1) {
        //   this.filterUserQuota[index].userCredit.availableCredit = result.availableCredit;
        //   let index1 = this.loadTotalQuota.findIndex(x => x.userId == result.userId);
        //   if (index1 != -1)
        //     this.loadTotalQuota[index1] = this.filterUserQuota[index];
        //   let index2 = this.userQuotaList.findIndex(x => x.userId == result.userId);
        //   if (index2 != -1)
        //     this.userQuotaList[index2] = this.filterUserQuota[index];
        // }
        this.getAllUsers(true);
      }
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: UserGet, filter: string) => data.login.toLowerCase().indexOf(filter.toLowerCase()) > -1
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

  sortData() {
    this.dataSource.sort = this.sort
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterUserQuota = this.userQuotaList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("UserData::", this.userQuotaList.length);
    this.initPage = _pageData.pageIndex;
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.departmentsList=>", this.userQuotaList);

    this.filterListUserQuota = this.userQuotaList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListUserQuota);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.userQuotaList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  userQuotaDetails(quotaDetails) {
    const dialogRef = this.dialog.open(UserquotadetailsComponent, this.getDialogConfig(quotaDetails));
  }

  userQuotaHistory() {
    this.dialog.open(UserquotahistoryComponent, this.getDialogConfig());
  }


}
