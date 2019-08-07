import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { IGEmailTemplate, IGEmailCreate, ApiResponse } from '../_model/emailtemplate.model';
import { EmailTemplateService } from '../_service/emailtemplate.service';
import { CreateEmailTemplateComponent } from '../create/createemailtemplate.component';
import { EmailTemplateDetailsComponent } from '../details/emailtemplatedetails.component';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { AlertConfirmComponent } from '../_model/alertconfirm';

@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.scss']
})
export class EmailTemplateComponent implements OnInit {

  displayedColumns = ['templateName', 'mailFormat', 'message', 'status', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  initPage = 0;
  listPage = 0;
  _filterType = '';
  pageSize = environment.pageSize;
  loading: boolean = false;
  listflag: boolean = false;
  searchdata: string = '';
  emailTemplatesList: IGEmailTemplate[];
  filteremailTemplates: IGEmailTemplate[] = [];
  filterListemailTemplates: IGEmailTemplate[] = [];
  loadTotalTemplates: IGEmailTemplate[] = [];

  constructor(private dialog: MatDialog, private emailtemplateservice: EmailTemplateService, private translate: TranslateService,
    private alertMessage: AlertMessageService, private router: Router) { }

  ngOnInit() {
    this.getEmailTemplateList();
  }

  getEmailTemplateList() {
    this.loading = true;
    this.emailtemplateservice.getAllEmailTemp().subscribe((response: IGEmailTemplate[]) => {
      if (response) {
        console.log("getEmailTemplateList==>", response);
        this.emailTemplatesList = response;
        this.loadTotalTemplates = response;
        this.dataSource = new MatTableDataSource(this.emailTemplatesList);
        this.listPage = 0;
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      } else {
        this.emailTemplatesList = [];
        this.loadTotalTemplates = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getEmailTemplateList==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filteremailTemplates = this.emailTemplatesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    this.filterListemailTemplates = this.emailTemplatesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListemailTemplates);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.emailTemplatesList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IGEmailTemplate, filter: string) => data.templateName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  addEmailTemplate() {
    const dialogRef = this.dialog.open(CreateEmailTemplateComponent, this.getDialogConfig())
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmailTemplateList();
      }
    });
  }

  editEmailTemplate(templateDetails: IGEmailCreate) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = templateDetails;
    const dialogRef = this.dialog.open(CreateEmailTemplateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmailTemplateList();
      }
    });
  }

  emailtemplateDetails(templateDetails: IGEmailTemplate) {
    this.dialog.open(EmailTemplateDetailsComponent, this.getDialogConfig(templateDetails));
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  emailActiveDialog(email: IGEmailTemplate, status: number, ) {
    let data: any = status ? this.translate.instant('emailTemplateModule.manage.activate') + " " + "\"" + email.templateName + "\" ?"
      : this.translate.instant('emailTemplateModule.manage.deActivate') + "\"" + email.templateName + "\" ?"
    const dialogRef = this.dialog.open(AlertConfirmComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.emailtemplateservice.updateEmailStatus(email.emailTemplateId, status)
          .subscribe((result: any) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getEmailTemplateList();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-emailActiveDialog==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }

  deleteEmailTemplate(selectedEmailTemplate) {
    const dialogRef = this.dialog.open(AlertConfirmComponent, {
      width: '500px',
      data: this.translate.instant('emailTemplateModule.manage.delete') + ' \"' + selectedEmailTemplate.templateName + ' \" ...?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        selectedEmailTemplate.status = status;
        this.emailtemplateservice.deleteEmailTemplate(selectedEmailTemplate.emailTemplateId)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getEmailTemplateList();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteEmailTemplate==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IGEmailTemplate, filter: string) => data.templateName.toLowerCase().indexOf(filter.toLowerCase()) > -1
 
  }

  sortData() {
    this.dataSource.sort = this.sort
  }

  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage=0;
    this.listPage=0;
    this.filteremailTemplates = this.emailTemplatesList;
    switch (value) {
      case '1':
        this.emailTemplatesList = this.loadTotalTemplates.filter(data => data.status == 1);
        console.log('emailTemplatesList=>', this.emailTemplatesList);
        if (this.emailTemplatesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filteremailTemplates = [];
          this.dataSource = new MatTableDataSource(this.filteremailTemplates);
        }
        break;
      case '0':
        this.emailTemplatesList = this.loadTotalTemplates.filter(data => data.status == 0);
        console.log('smstoEmail=>', this.emailTemplatesList);
        if (this.emailTemplatesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else
          this.filteremailTemplates = [];
        break;
      default:
        this.emailTemplatesList = this.loadTotalTemplates;
        console.log('emailTemplatesList=>', this.emailTemplatesList);
        if (this.emailTemplatesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filteremailTemplates = [];
          this.dataSource = new MatTableDataSource(this.filteremailTemplates);
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
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
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
