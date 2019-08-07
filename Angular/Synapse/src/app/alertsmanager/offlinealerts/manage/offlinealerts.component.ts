import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IAlertDataModel, Isender, IAlertRes } from '../_model/offlineModel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';

import { CreatealertComponent } from '../create/createofflinealert.component';
import { DetailsComponent } from '../details/details.component';
import { OfflineService } from '../_service/offlineservice';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { OfflineAlertConfirmComponent } from '../_model/offlineconfirm';

@Component({
  selector: 'app-offlinealerts',
  templateUrl: './offlinealerts.component.html',
  styleUrls: ['./offlinealerts.component.scss']
})
export class OfflinealertsComponent implements OnInit {
  listflag:boolean=false;
  displayedColumns: string[] = ['alertname', 'user', 'department', 'connection', 'table', 'uniqueid', 'message','status','actions'];
  dataSource = new MatTableDataSource<IAlertDataModel>();
  offlineAlertsList:IAlertDataModel[] =[];
  filterOfflineAlerts:IAlertDataModel[] =[];
  filterListOfflineAlerts:IAlertDataModel[]=[];
  selectedAlert:IAlertDataModel;
  selectedPage: any;
  searchdata:string='';
  public page = 0;
  public size = 6;
  initPage=0;
  pageIndex = 0;
  public pageSize = environment.pageSize;
  statusdata = { '-1': 'Pending For Approval', '-2': 'Rejected', '1': 'Active', '0': 'Deactive', '2': 'Running','5':'ABORTED' };
  loginInfo: IUserUpdateDto;
  loading: boolean = false;
  _roleCode: string = '';
  selectSender: string = '';
  senderdata: Isender[] = [];
  messageVisibility:boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog, private _service : OfflineService, private translate: TranslateService,
    private alertMessage: AlertMessageService, private router: Router, private appConfig: AppConfig) {
    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      this.getsenders();
    }
    else {
      this.router.navigate(['401']);
    }
   }

  ngOnInit() {
   // this.getAllOfflineAlerts();
   // this.dataSource.paginator = this.paginator;
    //this.getData({ pageIndex: this.page, pageSize: this.size });
  }
  offlineAlertDetails(profdetails:IAlertDataModel) {
    this.dialog.open(DetailsComponent, this.getDialogConfig(profdetails));
  }
  getsenders() {
    this.loading = true;
    this._service.getsenders().subscribe((result: Isender[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result;


        }
        this.getAllOfflineAlerts();
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }
  getAllOfflineAlerts(){
    this.loading = true;
    this._service.getAllOfflineAlerts(this._roleCode).subscribe((result: IAlertDataModel[]) => {
      console.log(' offlineAlertsList : ', result);
    if (result)
      if(result.length>0){
          this.offlineAlertsList = result;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        }
      else{
        this.offlineAlertsList = [];
      }

    this.loading = false;
},
  error => {
    let message = error.error.messages as string
    let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
    console.error("E-getAllOfflineAlerts==>", JSON.stringify(error));
    this.showAlert(errorMessage, ActionType.ERROR, error.status);
    this.loading = false;

  });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  loadGrid(){
    this.listflag = false;
  }

  loadList(){
    this.listflag = true;
    this.geListData({ pageIndex: this.page, pageSize: this.size });
  }


  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterOfflineAlerts = this.offlineAlertsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    if (this.filterOfflineAlerts.length > 0) {
      if (this.selectedAlert) {
        let index = this.filterOfflineAlerts.findIndex(x => x.alertOfflineId == this.selectedAlert.alertOfflineId);
        this.activeAlert(this.filterOfflineAlerts[index != -1 ? index : 0]);
      }
      else
        this.activeAlert(this.filterOfflineAlerts[0]);

    }
    console.log("UserData::" + JSON.stringify(this.filterOfflineAlerts));
  }


  activeAlert(alert: IAlertDataModel) {
    console.log("IAlertDataModel=>", alert);
    this.selectedAlert = alert;
    this.messageVisibility=false;
    console.log('selectedAlert : ',this.selectedAlert);
    let index = this.senderdata.findIndex(x => x.senderId == alert.senderId + '');
    this.selectSender = index != -1 ? this.senderdata[index].senderName : '';


  }
  geListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.filterListOfflineAlerts = this.offlineAlertsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListOfflineAlerts);
  }

  getDialogConfig(alertdata): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    if (alertdata)
    dialogConfig.data = alertdata;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  DialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  addOfflinealert(){
    const dialogRef = this.dialog.open(CreatealertComponent, this.DialogConfig());
    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result) {
        let newalert:IAlertDataModel;
        this.selectedAlert=newalert;
        this.getAllOfflineAlerts();
      }
    });
  }

  editAlert(alertdata:IAlertDataModel){
   const dialogRef = this.dialog.open(CreatealertComponent, this.getDialogConfig(alertdata));
    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result) {
        this.getAllOfflineAlerts();
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

  updateAlertStatus(alert:IAlertDataModel,status:number){
    this.loading=true;
    let data: any ='';
    if(status==1 && alert.status==0)
    data=this.translate.instant('ActionNames.activate') + '\"' + alert.offlineAlertName + '\" ...?';
    if(status==0)
    data=this.translate.instant('ActionNames.deActivate') + '\"' + alert.offlineAlertName + '\" ...?';
    if(status==2)
    data=this.translate.instant('ActionNames.startAlert') + '\"' + alert.offlineAlertName + '\" ...?';
    if(status==1 && alert.status==2)
    data=this.translate.instant('ActionNames.stopAlert') + '\"' + alert.offlineAlertName + '\" ...?';
    const dialogRef = this.dialog.open(OfflineAlertConfirmComponent, this.getStatusConfig(data))
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._service.updateOfflineAlertStatus(alert.alertOfflineId, status).subscribe((response: IAlertRes) => {
          console.log("Response==>", response);
          if (response.status) {
            this.showAlert(response.message, ActionType.SUCCESS);
            this.selectedAlert.status = status;
            let index = this.offlineAlertsList.findIndex(x => x.alertOfflineId == alert.alertOfflineId);
            if (index != -1) {
              this.offlineAlertsList[index] = this.selectedAlert;
              index = this.filterOfflineAlerts.findIndex(x => x.alertOfflineId == alert.alertOfflineId);
              if (index != -1) {
                this.filterOfflineAlerts[index] = this.selectedAlert;
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
            console.error("E-updateAlertStatus==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
      }
      else
        this.loading = false;
    });

  }

  detailsAlert(alertdata){
    this.dialog.open(DetailsComponent, this.getDialogConfig(alertdata));
  }
  searchchange() {
    let alertData: IAlertDataModel;
    this.selectedAlert = alertData;
  }
}
