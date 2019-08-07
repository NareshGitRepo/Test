import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ConfirmGroupDeleteComponent } from '../_model/groupconfirm.component';
import { Group, IGroupResponse } from '../_model/groupmanagement.model';
import { GroupManagementService } from '../_service/groupmanagement.service';
import { environment } from '../../../../environments/environment';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/AlertMessageService';
import { CreategroupComponent } from '../create/creategroup.component';
import { GroupusersComponent } from '../groupusers/groupusers.component';
import { GroupdetailsComponent } from '../details/groupdetails.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-managegroup',
  templateUrl: './managegroup.component.html',
  styleUrls: ['./managegroup.component.scss']
})
export class ManageGroupComponent implements OnInit {
  listflag: boolean = false;
  groupsList: Group[] = [];
  filterGroups: Group[] = [];
  filterListGroups: Group[] = [];
  displayedColumns = ['groupName', 'description', 'login', 'status', 'actions'];
  dataSource = new MatTableDataSource();
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  searchdata: string='';
  loading: boolean = false;
  _filterType = '';
  loadTotalGroups: Group[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private service: GroupManagementService, private dialog: MatDialog,
    private alertMessage: AlertMessageService, private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    this.getGroups();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
    (data: Group, filter: string) => data.groupName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  
    
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  getGroups() {
    this.loading = true;
    this.service.getAllGroups().subscribe((response: Group[]) => {
      if (response) {
        console.log("Response==>", response);
        this.groupsList = response;
        this.loadTotalGroups = response;
        this.dataSource = new MatTableDataSource(this.groupsList);
        this.listPage=0;
        this.initPage=0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        // this.dataSource.paginator = this.paginator;
      } else {
        this.groupsList = [];
        this.loadTotalGroups = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getGroups==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
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

  getUsersDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  addGroup() {
    const dialogRef = this.dialog.open(CreategroupComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getGroups();
      }
    });
  }

  getGroupUsers(groupData) {
    const dialogRef = this.dialog.open(GroupusersComponent, this.getUsersDialogConfig(groupData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getGroups();
      }
    });
  }

  editGroup(groups: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = groups;
    const dialogRef = this.dialog.open(CreategroupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getGroups();
      }
    });
  }

  groupDetails(groupData) {
    const dialogRef = this.dialog.open(GroupdetailsComponent, this.getDialogConfig(groupData));
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //   }
    // });
  }

  loadList() {
    this.listPage=0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
    (data: Group, filter: string) => data.groupName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage=0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("getDataList=>", this.groupsList);
    this.filterGroups = this.groupsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = obj.pageIndex;
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("GroupList=>", this.groupsList);
    this.filterListGroups = this.groupsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListGroups);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.groupsList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage=0;
    this.listPage=0;
    switch (value) {
      case '1':
        this.groupsList = this.loadTotalGroups.filter(data => data.status == 1);
        console.log('GroupsList=>', this.groupsList);
        if (this.groupsList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterGroups = [];
          this.dataSource = new MatTableDataSource(this.filterGroups);
        }
        break;
      case '0':
        this.groupsList = this.loadTotalGroups.filter(data => data.status == 0);
        console.log('GroupsList=>', this.groupsList);
        if (this.groupsList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterGroups = [];
          this.dataSource = new MatTableDataSource(this.filterGroups);
        }
        break;
      default:
        this.groupsList = this.loadTotalGroups;
        console.log('GroupsList=>', this.groupsList);
        if (this.groupsList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else
          this.filterGroups = [];
        break;
    }
  }

  sortData() {
    this.dataSource.sort = this.sort
  }

  groupActiveDialog(group: Group, status: number, ) {

    let data: any = status ? this.translate.instant('groupManagementModule.manage.activateGroup') + ' \"' + group.groupName + ' \" ...?' : this.translate.instant('groupManagementModule.manage.deActivateGroup') + ' \"' + group.groupName + ' \" ...?';
    const dialogRef = this.dialog.open(ConfirmGroupDeleteComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.service.updateStatus(status, group.groupId)
          .subscribe((result: IGroupResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getGroups();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-groupActiveDialog==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }

  deleteGroup(group: Group) {
    this.loading = true;
    let data: any = this.translate.instant('groupManagementModule.manage.deleteGroup') + ' \"' + group.groupName + ' \" ...?';
    const dialogRef = this.dialog.open(ConfirmGroupDeleteComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteGroupStatus(group.groupId).subscribe((response: IGroupResponse) => {
          console.log("Response==>", response);
          if (response) {
            this.getGroups();
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          }
          this.loading = false;
        },
          error => {
            let message = error.message as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteGroup==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
      }
      this.loading = false;
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

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

}