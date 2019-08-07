import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatTabChangeEvent } from '@angular/material';
import { IEmailTosms, ApiResponse, ISenderData } from '../_model/emailtosms.model';
import { EmailtoSmsService } from '../_service/emailtosms.service';
import { CreateemailtosmsComponent } from '../create/createemailtosms.component';
import { EmailtosmsdetailsComponent } from '../details/emailtosmsdetails.component';
import { environment } from '../../../../environments/environment';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { EmailToSmsConfirmComponent } from '../_model/emailtosms.confirm';
import { TranslateService } from '@ngx-translate/core';
import { AppyFilter } from '../../../_helpers/app.config';

@Component({
  selector: 'app-emailtosms',
  templateUrl: './emailtosms.component.html',
  styleUrls: ['./emailtosms.component.scss']
})
export class EmailtosmsComponent implements OnInit {
  public initPage = 0;
  public listPage = 0;
  public pageSize = environment.pageSize;
  statusdata = { '-1': 'Pending For Approval', '-2': 'Rejected', '1': 'Active', '0': 'Deactive', '2': 'Running', '5': 'ABORTED' };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchdata: string = '';
  emailToSmsList: IEmailTosms[] = [];
  pagedemailtosms: IEmailTosms[] = [];
  selectedemailtosmsList: IEmailTosms;
  senderdata: ISenderData[] = [];
  loading: boolean;

  constructor(private dialog: MatDialog, private emailtoSmsService: EmailtoSmsService,
    private router: Router, private alertMessage: AlertMessageService, private translate: TranslateService) {
    this.getsenders();
  }

  ngOnInit() {
  }

  getsenders() {
    this.loading = true;
    this.emailtoSmsService.getAllActiveSenders().subscribe((result: ISenderData[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result;
        }
      this.getEmailToSms();
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse')  : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  getEmailToSms() {
    this.loading = true;
    this.emailtoSmsService.getEmailToSms().subscribe((result: IEmailTosms[]) => {
      if (result) {
        console.log("emailtosmsResult", result)
        this.emailToSmsList = result;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
      else {
        this.emailToSmsList = [];
      }
      this.loading = false;

    }, error => {
      this.emailToSmsList = [];
      let message = error.error.message as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getEmailToSms==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401) this.router.navigate(["401"]);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
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

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.pagedemailtosms = this.emailToSmsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    if (this.pagedemailtosms.length > 0) {
      if (this.selectedemailtosmsList) {
        let index = this.pagedemailtosms.findIndex(x => x.name == this.selectedemailtosmsList.name);
        this.activeEmailtosms(this.pagedemailtosms[index != -1 ? index : 0]);
      }
      else
        this.activeEmailtosms(this.pagedemailtosms[0]);

    }
    console.log("UserData::" + JSON.stringify(this.pagedemailtosms));
  }

  activeEmailtosms(alert: IEmailTosms) {
    console.log("Alert::::::", alert);
    this.selectedemailtosmsList = alert;
    let index = this.senderdata.findIndex(x => x.senderId == alert.senderInfo.senderId);
  }

  updateStatusemailtosms(emailtosms: IEmailTosms, status: number) {
    this.loading = true;
    let data: any = '';
    if (status == 1 && emailtosms.status == 0)
      data = this.translate.instant('ActionNames.activate') + '\"' + emailtosms.name + '\" ...?';
    if (status == 0)
      data = this.translate.instant('ActionNames.deActivate') + '\"' + emailtosms.name + '\" ...?';
    if (status == 2)
      data = this.translate.instant('ActionNames.startAlert') + '\"' + emailtosms.name + '\" ...?';
    if (status == 1 && emailtosms.status == 2)
      data = this.translate.instant('ActionNames.stopAlert') + '\"' + emailtosms.name + '\" ...?';
    const dialogRef = this.dialog.open(EmailToSmsConfirmComponent, this.getStatusConfig(data))
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emailtoSmsService.updateEmailToSmsStatus(emailtosms.email2smsId, status).subscribe((response: ApiResponse) => {
          console.log("Response==>", response);
          if (response.status) {
            this.showAlert(response.message, ActionType.SUCCESS);
            this.selectedemailtosmsList.status = status;
            let index = this.emailToSmsList.findIndex(x => x.email2smsId == emailtosms.email2smsId);
            if (index != -1) {
              this.emailToSmsList[index] = this.selectedemailtosmsList;
              index = this.pagedemailtosms.findIndex(x => x.email2smsId == emailtosms.email2smsId);
              if (index != -1) {
                this.pagedemailtosms[index] = this.selectedemailtosmsList;
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

  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  addEmailtoSms() {
    const dialogRef = this.dialog.open(CreateemailtosmsComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newemailtosms: IEmailTosms;
        this.selectedemailtosmsList = newemailtosms;
        this.getEmailToSms();
      }
    });
  }

  editEmailtoSms(emailToSms: IEmailTosms) {
    const dialogRef = this.dialog.open(CreateemailtosmsComponent, this.getDialogConfig(emailToSms));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmailToSms();
      }
    });
  }

  deleteEmailtoSms(emailtosmsObj: IEmailTosms) {
    this.loading = true;
    let data: any = '';
    data = this.translate.instant('ActionNames.deleteConfirm') + ' \"' + emailtosmsObj.name + '\" ...?'
    const dialogRef = this.dialog.open(EmailToSmsConfirmComponent, this.getStatusConfig(data))
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emailtoSmsService.deleteEmailToSms(emailtosmsObj.email2smsId).subscribe((response: ApiResponse) => {
          console.log("Response==>", response);
          if (response.status) {
            this.showAlert(response.message, ActionType.SUCCESS);
            this.getEmailToSms();
          }
          else
            this.showAlert(response.message, ActionType.SUCCESS);
          this.loading = false;
        },
          error => {
            let message = error.message as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-DeleteEmailToSms==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
      }
      else
        this.loading = false;
    });

  }

  searchchange() {
    let emailtosmsData: IEmailTosms;
    this.selectedemailtosmsList = emailtosmsData;
  }

  emailToSmsDetails(emailToSms: IEmailTosms) {
    this.dialog.open(EmailtosmsdetailsComponent, this.getDialogConfig(emailToSms))
  }

}
