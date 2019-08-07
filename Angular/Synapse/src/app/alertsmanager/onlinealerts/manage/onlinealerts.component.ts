import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatDialogConfig, MatTabChangeEvent } from '@angular/material';
import { OnlineAlert, ISenderList, ApiResponse } from '../_model/onlinealerts.model';
import { OnlineAlertsService } from '../_service/onlinealerts.service';
import { CreateonlinealertComponent } from '../create/createonlinealert.component';
import { OnlinealertdetailsComponent } from '../details/onlinealertdetails.component';
import { AlertConfirmComponent } from '../_model/alertconfirm';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { environment } from '../../../../environments/environment';
import { AppConfig, IUserUpdateDto, ITokenInfo, userType } from '../../../_helpers/app.config';

@Component({
  selector: 'app-onlinealerts',
  templateUrl: './onlinealerts.component.html',
  styleUrls: ['./onlinealerts.component.scss']
})
export class OnlinealertsComponent implements OnInit {
  //Online Manager
  initPage = 0;
  pageSize = environment.pageSize;
  listflag: boolean = false;
  selectedTab: number = 0;
  selectSender: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  statusdata = { '-1': 'Pending For Approval', '-2': 'Rejected', '1': 'Active', '0': 'Deactive', '2': 'Running', '5': 'ABORTED' };
  searchdata: string ='';
  totalAlertsList: OnlineAlert[] = [];
  pagedAlert: OnlineAlert[] = [];
  selectedAlertList: OnlineAlert;
  loading: boolean = false;
  senderdata: ISenderList[] = [];
  _roleCode: string = "";
  _arabic = /[\u0621-\u064A]/;
  loginInfo: IUserUpdateDto;
  profilemanageFlag:boolean=true;
  messageVisibility: boolean;
  constructor(private dialog: MatDialog, private onlineAlertService: OnlineAlertsService, private translate: TranslateService,
    private router: Router, private alertMessage: AlertMessageService, private appconfig: AppConfig) {

    let tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
      if(userType.NormalUser==this._roleCode)
      this.profilemanageFlag=false;
      this.getsenders();
    }
    else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
   // this.getonlineAlertData();
  }
  getonlineAlertData() {
    this.loading = true;
    this.onlineAlertService.getAllAlerts(this._roleCode).subscribe((response: OnlineAlert[]) => {
      if (response) {
        if (response.length > 0) {
          console.log("AllAlertResponse==>", response);
          this.totalAlertsList = response;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        }
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getonlineAlertData==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getsenders() {
    this.loading = true;
    this.onlineAlertService.getAllSenders().subscribe((result: ISenderList[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result;
        }
      this.getonlineAlertData();
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  onTabChange(tabChangeEvent: MatTabChangeEvent) {
    console.log("tabChangeEvent=>", tabChangeEvent.index);
    switch (tabChangeEvent.index) {
      case 0:
        this.getonlineAlertData();
        break;
      default:
        this.getonlineAlertData();
        break;
    }
  }

  addOnlineAlert() {
    const dialogRef = this.dialog.open(CreateonlinealertComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newalert:OnlineAlert;
        this.selectedAlertList=newalert;
        this.getonlineAlertData();
      }
    });
  }

  loadList() {
    this.listflag = true;
  }

  loadGrid() {
    this.listflag = false;
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

  editAlert(alertData) {
    const dialogRef = this.dialog.open(CreateonlinealertComponent, this.getDialogConfig(alertData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getonlineAlertData();
      }
    });
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.pagedAlert = this.totalAlertsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    if (this.pagedAlert.length > 0) {
      if (this.selectedAlertList) {
        let index = this.pagedAlert.findIndex(x => x.alertOnlineId == this.selectedAlertList.alertOnlineId);
        this.activeAlert(this.pagedAlert[index != -1 ? index : 0]);
      }
      else
        this.activeAlert(this.pagedAlert[0]);

    }
    console.log("UserData::" + JSON.stringify(this.pagedAlert));
  }

  alertDetails(alertData) {
    this.dialog.open(OnlinealertdetailsComponent, this.getDialogConfig(alertData));
  }


  updateStatusAlert(alert: OnlineAlert, status: number) {
    this.loading = true;
    let data: any = '';
    if (status == 1 && alert.status == 0)
    data = this.translate.instant('ActionNames.activate') + '\"' + alert.onlineAlertName + '\" ...?';
    if (status == 0)
    data = this.translate.instant('ActionNames.deActivate') + '\"' + alert.onlineAlertName + '\" ...?';
    if (status == 2)
    data =  this.translate.instant('ActionNames.startAlert') + '\"' + alert.onlineAlertName + '\" ...?';
    if (status == 1 && alert.status == 2)
    data = this.translate.instant('ActionNames.stopAlert') + '\"' + alert.onlineAlertName + '\" ...?';
    const dialogRef = this.dialog.open(AlertConfirmComponent, this.getStatusConfig(data))
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onlineAlertService.updateOnlineAlertStatus(alert.alertOnlineId, status).subscribe((response: ApiResponse) => {
          console.log("Response==>", response);
          if (response.status) {
            this.showAlert(response.message, ActionType.SUCCESS);
            this.selectedAlertList.status = status;
            let index = this.totalAlertsList.findIndex(x => x.alertOnlineId == alert.alertOnlineId);
            if (index != -1) {
              this.totalAlertsList[index] = this.selectedAlertList;
              index = this.pagedAlert.findIndex(x => x.alertOnlineId == alert.alertOnlineId);
              if (index != -1) {
                this.pagedAlert[index] = this.selectedAlertList;
              }
            }
          }
          else
            this.showAlert(response.message, ActionType.SUCCESS);

          this.loading = false;
        },
          error => {
            let message = error.message as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-updateStatusAlert==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
      }
      else
        this.loading = false;
    });

  }

  deleteAlert(alert: OnlineAlert) {
    this.loading = true;
    console.log("deleteDepartment :", alert);
    let data: any =  this.translate.instant('ActionNames.deleteConfirm') + '\"' + alert.onlineAlertName + '\" ...?';
    // let data: any = "Do You want delete alert "+alert.onlineAlertName+" ...?";
    const dialogRef = this.dialog.open(AlertConfirmComponent, this.getStatusConfig(data))
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onlineAlertService.deleteAlertStatus(alert.alertOnlineId).subscribe((response: ApiResponse) => {
          console.log("Response==>", response);
          if (response) {
            this.getonlineAlertData();
            this.showAlert(response.message, ActionType.SUCCESS);
          }
          this.loading = false;
        },
          error => {
            let message = error.message as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteAlert==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
      }
      this.loading = false;
    });
  }

  activeAlert(alert: OnlineAlert) {
    console.log("Alert::::::", alert);
    this.selectedAlertList = alert;
    this.messageVisibility=false;
    let index = this.senderdata.findIndex(x => x.senderId == alert.senderId);
    this.selectSender = index != -1 ? this.senderdata[index].senderName : '';
    console.log("sender==>", this.selectSender);
  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  searchchange() {
    let alertData: OnlineAlert;
    this.selectedAlertList = alertData;
  }
}