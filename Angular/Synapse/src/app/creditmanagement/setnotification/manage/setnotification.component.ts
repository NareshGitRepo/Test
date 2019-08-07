import { ActionType, AlertMessageService, AlertType } from '../../../_services/AlertMessageService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SetNotificationService } from '../_service/setnotification.service';
import { CreatenotificationComponent } from '../create/createnotification.component';
import { NotificationdetailsComponent } from '../details/notificationdetails.component';
import { ConfirmNotificationComponent } from './setnotifyconfirm.component';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { IPlatformAlert, ApiResponse } from '../_model/setnotification.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-setnotification',
  templateUrl: './setnotification.component.html',
  styleUrls: ['./setnotification.component.scss']
})
export class SetnotificationComponent implements OnInit {
  _filterType = '';
  searchdata: string = '';
  listflag: boolean = false;
  public loading: boolean = false;
  initPage = 0;
  listPage = 0;
  public pageSize = environment.pageSize;
  setnotificationalertList: IPlatformAlert[] = [];
  loadTotalfilternotification: IPlatformAlert[] = [];
  filternotification: IPlatformAlert[] = [];
  filterListnotification: IPlatformAlert[] = [];
  contactdata: IPlatformAlert;
  dataSource = new MatTableDataSource<any>();
  displayColumns = ['alertsName', 'channels', 'creditsMessage', 'expiringInDays', 'expiringMessage', 'actions']
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog, private setNotifyservice: SetNotificationService, private translate: TranslateService, private router: Router, private alertMessage: AlertMessageService) { }

  ngOnInit() {
    this.getNotifications();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IPlatformAlert, filter: string) => data.alertsName == null ? false : data.alertsName.toLowerCase().indexOf(filter.toLowerCase()) > -1;
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  getNotifications() {
    this.loading = true;
    this.setNotifyservice.getPlatformAlerts().subscribe((response: IPlatformAlert[]) => {
      console.log("Response==>", response);
      if (response) {
        console.log("Response==>", response);
        this.setnotificationalertList = response;
        this.loadTotalfilternotification = response;
        this.dataSource = new MatTableDataSource(this.setnotificationalertList);
        this.listPage = 0;
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      } else {
        this.setnotificationalertList = [];
        this.loadTotalfilternotification = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getNotifications==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  sortData() {
    this.dataSource.sort = this.sort
  }
  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IPlatformAlert, filter: string) => data.alertsName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });

  }

  addNotification() {
    const dialogRef = this.dialog.open(CreatenotificationComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getNotifications();
    });
  }

  editnotification(notifydetails) {
    const dialogRef = this.dialog.open(CreatenotificationComponent, this.getDialogConfig(notifydetails));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getNotifications();
      }
    })
  }

  notificationDetails(notifydetails: IPlatformAlert) {
    this.dialog.open(NotificationdetailsComponent, this.getDialogConfig(notifydetails));
  }

  deleteNotification(notifydetails: IPlatformAlert) {
    const dialogRef = this.dialog.open(ConfirmNotificationComponent, {
      width: '500px',
      data: "Do you want to delete Alert" + ' \"' + notifydetails.alertsName + ' \" ...?'
    });
  }

  updatePlatformAlertStatus(notify: IPlatformAlert, status: number) {
    let data: any = status ? this.translate.instant('CreditManagementModule.setNotification.manage.activate') + '\"' + notify.alertsName + '\" ...?' : this.translate.instant('CreditManagementModule.setNotification.manage.deActivate') + '\"' + notify.alertsName + '\" ...?';
    const dialogRef = this.dialog.open(ConfirmNotificationComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let statusObj = {
          platformAlertId: notify.platformAlertsId,
          status: status
        }
        this.setNotifyservice.updatePlatformAlertStatus(statusObj)
          .subscribe((result: ApiResponse) => {
            console.log("Status==>", result);
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getNotifications();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-updatePlatformAlertStatus==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
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
        this.setnotificationalertList = this.loadTotalfilternotification.filter(data => data.status == 1);
        console.log('setnotificationalertList=>', this.setnotificationalertList);
        if (this.setnotificationalertList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterListnotification = [];
          this.dataSource = new MatTableDataSource(this.filterListnotification);
        }
        break;
      case '0':
        this.setnotificationalertList = this.loadTotalfilternotification.filter(data => data.status == 0);
        console.log('setnotificationalertList=>', this.setnotificationalertList);
        if (this.setnotificationalertList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterListnotification = [];
          this.dataSource = new MatTableDataSource(this.filterListnotification);
        }
        break;
      default:
        this.setnotificationalertList = this.loadTotalfilternotification;
        console.log('setnotificationalertList=>', this.setnotificationalertList);
        if (this.setnotificationalertList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterListnotification = [];
          this.dataSource = new MatTableDataSource(this.filterListnotification);
        }
        break;
    }
  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filternotification = this.setnotificationalertList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("NotificationData::" + JSON.stringify(this.setnotificationalertList));
  }



  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("notificationList=>", this.setnotificationalertList);
    this.filterListnotification = this.setnotificationalertList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListnotification);
    if (this.searchdata != '') {
      this.dataSource = new MatTableDataSource(this.setnotificationalertList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
