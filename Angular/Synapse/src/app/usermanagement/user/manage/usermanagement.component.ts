import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UsercreateComponent } from '../create/usercreate.component';
import { Router } from '@angular/router';
import { UserdetailsComponent } from '../details/userdetails.component';
import { UserActions, ILoginDto, IUser } from '../_model/usermodel';
import { UserActionsComponent } from '../actions/useractions.component';
import * as _ from 'lodash';
import { UserService } from '../_services/_user.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';


@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermanagementComponent implements OnInit {
  listflag: boolean = false;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  public searchdata: string ='';
  totalUsers: IUser[];
  public filterUsers: any[] = [];
  loading: boolean = false;
  displayedColumns = ['firstname', 'login', 'departmentName', 'roleName', 'checker', 'actions'];
  searchUsers: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  loginInfo: IUserUpdateDto;
  _deptStatus: number = 1;
  _filterType = '';
  loadTotalUsers: IUser[] = [];

  constructor(private dialog: MatDialog, private router: Router, private userService: UserService,
    private translate: TranslateService, private alertMessage: AlertMessageService, private appConfig: AppConfig
  ) {
    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      if (this.loginInfo.depts.length > 0)
        this._deptStatus = this.loginInfo.depts[0].status;
    }
    else {
      this.router.navigate(['401']);
    }
    this.getAllUsers();
  }

  ngOnInit() {
  }

  applyFilterDataSouce(filterValue: string) {
    console.log('totalUsers=>', this.totalUsers);
  if(filterValue=='' || filterValue==null)
  {
    this.dataSource = new MatTableDataSource(this.totalUsers);
  this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
  }
  else
  {
    
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.dataSource.paginator=null;
    this.dataSource.filterPredicate =
      (data: IUser, filter: string) => (data.lastname != null && data.lastname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
      data.firstname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
      data.login.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
      (data.depts.length>0?data.depts.findIndex(x=>x.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1)>-1:false));
  }
  }

  searchFilter(value) {
    this._filterType = value;
   // this.searchdata = '';
    this.initPage=0;
    this.listPage=0;
    switch (value) {
      case '1':
        this.totalUsers = this.loadTotalUsers.filter(data => data.isactive == 1);
        console.log('totalUsers=>', this.totalUsers);
        if (this.totalUsers.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.dataSource = new MatTableDataSource(this.totalUsers);
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.applyFilterDataSouce(this.searchdata);
        }
        else
        { 
			this.filterUsers = [];
			this.dataSource = new MatTableDataSource(this.filterUsers); 
		}
        break;
      case '0':
        this.totalUsers = this.loadTotalUsers.filter(data => data.isactive == 0);
        console.log('totalUsers=>', this.totalUsers);
        if (this.totalUsers.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.dataSource = new MatTableDataSource(this.totalUsers);
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.applyFilterDataSouce(this.searchdata);
        }
        else
        { 
			this.filterUsers = [];
			this.dataSource = new MatTableDataSource(this.filterUsers); 
		}
        break;
      default:
        this.totalUsers = this.loadTotalUsers;
        console.log('totalUsers=>', this.totalUsers);
        if (this.totalUsers.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.dataSource = new MatTableDataSource(this.totalUsers);
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.applyFilterDataSouce(this.searchdata);
        }
        else
          this.filterUsers = [];
        break;
    }
  }


  getAllUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe((response: IUser[]) => {
      if (response) {
        console.log("Response==>", response);
        this.totalUsers = response;
        this.loadTotalUsers = response;
        this.dataSource = new MatTableDataSource(this.totalUsers);
        this.dataSource.paginator=null;
        this.listPage=0;
        this.initPage=0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      } else {
        this.totalUsers = [];
        this.loadTotalUsers = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllUsers==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterUsers = this.totalUsers.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
     this.initPage = _pageData.pageIndex;
    console.log("UserData::" + JSON.stringify(this.filterUsers));
  }

  getListData(_pageData) {
    this.dataSource.paginator=this.paginator;
    // let index = 0;
    // let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    // let endingIndex = startingIndex + _pageData.pageSize;
    // this.filterUsers = this.totalUsers.filter(() => {
    //   index++;
    //   return (index > startingIndex && index <= endingIndex) ? true : false;
    // });
    // //console.log("UserData::" + JSON.stringify(this.filterUsers));
   
    // if(this.searchdata!=''){
    //   this.dataSource = new MatTableDataSource(this.totalUsers);
    //   this.dataSource.filter = this.searchdata.toLowerCase().trim();
    //   this.dataSource.filterPredicate =
    //   (data: IUser, filter: string) => (data.lastname != null && data.lastname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
    //   data.firstname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
    //   data.login.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
    //   (data.depts.length>0?data.depts.findIndex(x=>x.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1)>-1:false));
    // }
    // else
    // this.dataSource = new MatTableDataSource(this.filterUsers);
    //  this.listPage = _pageData.pageIndex;
  }

  addUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw'; dialogConfig.height = '92%';
    dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    this.dialogOpen(dialogConfig);
  }

  dialogOpen(dialogConfig: any) {
    dialogConfig.width = "40%";
    const dialogRef = this.dialog.open(UsercreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log("Result :: " + result);
      if (result) {
        this.getAllUsers();
      }
    });
  }

  editUser(userdetails: IUser) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw'; dialogConfig.height = '92%';
    dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = userdetails;
    this.dialogOpen(dialogConfig);
  }

  editDetailsUser(userdetails: IUser) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = userdetails;
    this.dialog.open(UserdetailsComponent, dialogConfig);
  }

  deleteUser(userdetails: IUser): void {
    this.openUserActionDialog({ "data": userdetails, "action": UserActions.DELETE });
  }

  resetPwdDialog(userdetails: IUser): void {
    this.openUserActionDialog({ "data": userdetails, "action": UserActions.RESET_PASSWROD });
  }

  activeUser(userdetails: IUser): void {
    this.openUserActionDialog({ "data": userdetails, "action": UserActions.ACTIVE });
  }

  inactiveUser(userdetails: IUser): void {
    this.openUserActionDialog({ "data": userdetails, "action": UserActions.INACTIVE });
  }

  openUserActionDialog(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = data;
    let dialogRef = this.dialog.open(UserActionsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log("Result :: " + result);
      if (result) {
        this.getAllUsers();
      }
    });
  }

  loadList() {
    this.listflag = true;
    this.listPage=0;
    this.dataSource.paginator=this.paginator;
    this.dataSource.filterPredicate =
    (data: IUser, filter: string) =>(data.lastname != null && data.lastname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
    data.firstname.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
    data.login.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
    (data.depts.length>0?data.depts.findIndex(x=>x.deptName.toLowerCase().indexOf(filter.toLowerCase()) > -1)>-1:false));
    //this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
  }

  loadGrid() {
    this.listflag = false;
    this.initPage=0;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  sortData() {
    this.dataSource.sort = this.sort
  }
}
