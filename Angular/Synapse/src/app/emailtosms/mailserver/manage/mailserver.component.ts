import { Component, OnInit, ViewChild } from '@angular/core';
import { ICreateMailServer } from '../_model/mailserver.model';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { MailServerService } from '../_service/mailserver.service';
import { CreatemailserverComponent } from '../create/createmailserver.component';
import { MailserverdetailsComponent } from '../details/mailserverdetails.component';
import { environment } from '../../../../environments/environment';
import { ActionType, AlertMessageService, AlertType } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { AlertConfirmComponent } from '../_model/alertconfirm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mailserver',
  templateUrl: './mailserver.component.html',
  styleUrls: ['./mailserver.component.scss']
})
export class MailserverComponent implements OnInit {
  searchdata: string = '';
  listflag: boolean = false;
  initPage = 0;
  listPage = 0;
  _filterType = '';
  pageSize = environment.pageSize;
  loading: boolean = false;
  totalMails: ICreateMailServer[] = [];
  loadTotalMails: ICreateMailServer[] = [];
  filtermailserverList: ICreateMailServer[] = [];
  filterListmailserver: ICreateMailServer[] = [];
  public filterMails: any[] = [];
  dataSource = new MatTableDataSource();
  boxMessage: string = '';
  displayedColumns = ['emailServerName', 'emailFromId', 'emailBoxType', 'serverIp', 'serverPort', 'emailSsl', 'checkInterval', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private mailservice: MailServerService, private alertMessage: AlertMessageService,
    private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    this.getAllMailServer();
  }

  getAllMailServer() {
    this.loading = true;
    this.mailservice.getMailserversList().subscribe((response: ICreateMailServer[]) => {
      if (response) {
        console.log("Response==>", response);
        this.totalMails = response;
        this.loadTotalMails = response;
        this.dataSource = new MatTableDataSource(this.totalMails);
        this.listPage = 0;
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      } else {
        this.totalMails = [];
        this.loadTotalMails = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllMailServer==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR);
      this.loading = false;
    });
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filtermailserverList = this.totalMails.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
  }

  addmailserver() {
    const dialogRef = this.dialog.open(CreatemailserverComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      console.log("Result :: " + result);
      if (result) {
        this.getAllMailServer();
      }
    });
  }

  editmailserver(msdetails: ICreateMailServer) {
    console.log("editmailserver==>", msdetails);

    const dialogRef = this.dialog.open(CreatemailserverComponent, this.getDialogConfig(msdetails));
    dialogRef.afterClosed().subscribe(result => {
      console.log("Result :: " + result);
      if (result) {
        this.getAllMailServer();
      }
    });
  }

  mailserverDetails(msdetails: ICreateMailServer) {
    this.dialog.open(MailserverdetailsComponent, this.getDialogConfig(msdetails));
  }
  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    this.filterListmailserver = this.totalMails.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListmailserver);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.totalMails);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  loadList() {
    this.listflag = true;
    this.listPage = 0;
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: ICreateMailServer, filter: string) => data.emailServerName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  sortData() {
    this.dataSource.sort = this.sort
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
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  mailActiveDialog(mail: ICreateMailServer, status: number) {
    let data: any = status ? this.translate.instant('MailServer.manage.mailServerActivate') + " " + "\"" + mail.emailServerName + "\" ?"
      : this.translate.instant('MailServer.manage.mailServerDeactivate') + "\"" + mail.emailServerName + "\" ?"
    const dialogRef = this.dialog.open(AlertConfirmComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.mailservice.updatMailStatus(mail.emailServerId, status)
          .subscribe((result: any) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getAllMailServer();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
              this.loading = false;
            }
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-mailActiveDialog==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }
  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage=0;
    this.listPage=0;
    this.filtermailserverList = this.totalMails;
    switch (value) {
      case '1':
        this.totalMails = this.loadTotalMails.filter(data => data.status == 1);
        console.log('totalMails=>', this.totalMails);
        if (this.totalMails.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filtermailserverList = [];
          this.dataSource = new MatTableDataSource(this.filtermailserverList);
        }
        break;
      case '0':
        this.totalMails = this.loadTotalMails.filter(data => data.status == 0);
        console.log('totalMails=>', this.totalMails);
        if (this.totalMails.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filtermailserverList = [];
          this.dataSource = new MatTableDataSource(this.filtermailserverList);
        }
        break;
      default:
        this.totalMails = this.loadTotalMails;
        console.log('totalUsers=>', this.totalMails);
        if (this.totalMails.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else
          this.filtermailserverList = [];
        break;
    }
  }

  applyFilterDataSouce(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: ICreateMailServer, filter: string) => data.emailServerName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  
  }


  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}