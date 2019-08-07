import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { SMStoEmailService } from '../_service/smstoemail.service';
import { CreatesmstoemailComponent } from '../create/createsmstoemail.component';
import { SmstoemaildetailsComponent } from '../details/smstoemaildetails.component';
import { environment } from '../../../../environments/environment';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { ISmsToEmail, ISenderInfo, ApiResponse, IEmailTemplate } from '../_model/smstoemail.model';
import { TranslateService } from '@ngx-translate/core';
import { SmsToEmailConfirm } from '../_model/smstoemailConfirm';


@Component({
  selector: 'app-smstoemail',

  templateUrl: './smstoemail.component.html',
  styleUrls: ['./smstoemail.component.scss']
})
export class SmstoemailComponent implements OnInit {

  listflag: boolean = false;
  displayedColumns = ['smsToEmailName', 'emailServerName', 'toEmail', 'ccEmail', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchdata: string = '';
  smstoEmailList: ISmsToEmail[] = [];
  loadSMStoEmailList: ISmsToEmail[] = [];
  filtersmstoEmailList: ISmsToEmail[] = [];
  filterListsmstoEmail: ISmsToEmail[] = [];
  emailTemplate: IEmailTemplate[] = [];
  selectedPage: any;
  initPage = 0;
  public listPage = 0;
  public pageSize = environment.pageSize;
  dataSource = new MatTableDataSource();
  loading: boolean;
  _filterType = '';
  senderdata: ISenderInfo[] = []
  constructor(private dialog: MatDialog, private translate: TranslateService, private smstoemailservice: SMStoEmailService, private alertMessage: AlertMessageService, private router: Router) {

  }

  ngOnInit() {
    this.getSmsToEmail();
  }
  getSmsToEmailTemplate() {
    this.loading = true;
    this.smstoemailservice.getEmailTemplate().subscribe((result: IEmailTemplate[]) => {
      if (result) {
        this.emailTemplate = result;
      }
      else
        this.emailTemplate = [];
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSmsToEmailTemplate==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });

  }
  getSmsToEmail() {

    this.loading = true;
    this.smstoemailservice.getSmsToEmail().subscribe((result: ISmsToEmail[]) => {
      console.log(' getSmsToEmail : ', result);
      if (result) {
        this.smstoEmailList = result;
        this.loadSMStoEmailList = result;
        this.dataSource = new MatTableDataSource(this.smstoEmailList);
        this.listPage = 0;
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        // this.dataSource.paginator = this.paginator;
      }
      else {
        this.smstoEmailList = [];
        this.loadSMStoEmailList = [];
        this.dataSource = new MatTableDataSource(this.smstoEmailList);
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.dataSource.paginator = this.paginator;
      }
      this.getSmsToEmailTemplate();
    },
      error => {

        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getSmsToEmail==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }
  addSmstoEmail() {
    const dialogRef = this.dialog.open(CreatesmstoemailComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSmsToEmail();
      }
    });
  }
  editSMStoEmail(smstoemailDetails: ISmsToEmail) {
    const dialogRef = this.dialog.open(CreatesmstoemailComponent, this.getDialogConfig(smstoemailDetails));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("resultqewqreteyetu", result);

        this.getSmsToEmail();
      }
    });
  }
  deleteSmsToEmail(selectedsmstoemail) {
    console.log("deleteSmsToEmail :", selectedsmstoemail);
    const dialogRef = this.dialog.open(SmsToEmailConfirm, {
      width: '500px',
      data: this.translate.instant('smsto ') + ' \"' + selectedsmstoemail.smsToEmailName + ' \" ...?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        selectedsmstoemail.status = status;
        this.smstoemailservice.deleteSmsToEmail(selectedsmstoemail.sms2emailId)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getSmsToEmail();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
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
    this.selectedPage = _pageData.pageIndex;

    this.filtersmstoEmailList = this.smstoEmailList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
  }
  smstoEmailDetails(smstoemaildetails: ISmsToEmail) {
    let index = this.emailTemplate.findIndex(x => x.emailTemplateId == smstoemaildetails.emailTemplate);
    if (index != -1)
      smstoemaildetails.emailTemplateData = this.emailTemplate[index].emailMessage;
    else
      smstoemaildetails.emailTemplateData = '';
    this.dialog.open(SmstoemaildetailsComponent, this.getDialogConfig(smstoemaildetails));
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.filterListsmstoEmail = this.smstoEmailList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListsmstoEmail);
    if (this.searchdata != '') {
      this.dataSource = new MatTableDataSource(this.smstoEmailList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: ISmsToEmail, filter: string) => data.smsToEmailName.toLowerCase().indexOf(filter.toLowerCase()) > -1

  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: ISmsToEmail, filter: string) => data.smsToEmailName.toLowerCase().indexOf(filter.toLowerCase()) > -1

  }
  sortData() {
    this.dataSource.sort = this.sort
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  searchFilter(value) {
    console.log("value,", value);
    this.initPage = 0;
    this.listPage = 0;
    this._filterType = value;
    this.searchdata = '';
    this.filtersmstoEmailList = this.smstoEmailList;
    switch (value) {
      case '1':
        this.smstoEmailList = this.loadSMStoEmailList.filter(data => data.status == 1);
        console.log('smstoEmail=>', this.smstoEmailList);
        if (this.smstoEmailList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filtersmstoEmailList = [];
          this.dataSource = new MatTableDataSource(this.filtersmstoEmailList);
        }
        break;
      case '0':
        this.smstoEmailList = this.loadSMStoEmailList.filter(data => data.status == 0);
        console.log('smstoEmail=>', this.smstoEmailList);
        if (this.smstoEmailList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else
          this.filtersmstoEmailList = [];
        break;
      default:
        this.smstoEmailList = this.loadSMStoEmailList;
        console.log('smstoEmail=>', this.smstoEmailList);
        if (this.smstoEmailList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filtersmstoEmailList = [];
          this.dataSource = new MatTableDataSource(this.filtersmstoEmailList);
        }
        break;
    }
  }
  applyFilterStatus(smstoemail: ISmsToEmail, status: number) {
    console.log("IEmailtoSms", smstoemail);


    let data: any = status ? this.translate.instant('ActionNames.activate') + ' \"' + smstoemail.smsToEmailName + '\" ...?' : this.translate.instant('ActionNames.deActivate') + ' \"' + smstoemail.smsToEmailName + '\" ...?';
    const dialogRef = this.dialog.open(SmsToEmailConfirm, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        console.log("IEmailtoSms", smstoemail);
        this.smstoemailservice.updateSmsToEmailStatus(smstoemail.sms2emailId, status)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getSmsToEmail();
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

  smstoemailDetails(deptdetails) {
    this.dialog.open(SmstoemaildetailsComponent, this.getDialogConfig(deptdetails));
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
