import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { ISmsTemplate, ApiResponse } from '../_model/smstemplate.model';
import { SmsTemplateService } from '../_service/smstemplate.service';
import { ConfirmSmsTemplateComponent } from './smstemplateconfirm.component';
import { CreateSmsTemplateComponent } from '../create/createsmstemplate.component';
import { SmsTempaltedetailsComponent } from '../details/smatemplatedetails.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-smstemplate',
  templateUrl: './smstemplate.component.html',
  styleUrls: ['./smstemplate.component.scss']
})
export class SmsTemplateComponent implements OnInit {
  public initPage = 0;
  public listPage = 0;
  searchdata: string = '';
  public pageSize = environment.pageSize;
  listflag: boolean = false;
  loading: boolean = false;
  SmsTemplatesList: ISmsTemplate[] = [];
  filterListSmsTemplates: ISmsTemplate[] = [];
  filterSmsTemplates: ISmsTemplate[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns = ['templateName', 'message', 'description', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  loadTotalSmsTemplates: ISmsTemplate[] = [];
  _filterType = '';

  constructor(private dialog: MatDialog, private router: Router, private SmsTemplatesService: SmsTemplateService,
    private alertMessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.getSmsTemplates();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: ISmsTemplate, filter: string) => data.templateName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  getSmsTemplates() {
    this.loading = true;
    this.SmsTemplatesService.getSmsTemplates().subscribe((result: ISmsTemplate[]) => {
      if (result) {
        console.log("Result", result)
        this.SmsTemplatesList = result;
        this.dataSource = new MatTableDataSource(this.SmsTemplatesList);
        this.loadTotalSmsTemplates = result;
        this.initPage = 0;
        this.listPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.dataSource.paginator = this.paginator;
      }
      else {
        this.SmsTemplatesList = [];
        this.loadTotalSmsTemplates = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSmsTemplates==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("SmsTemplatesList=>", this.SmsTemplatesList);
    this.filterListSmsTemplates = this.SmsTemplatesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListSmsTemplates);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.SmsTemplatesList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterSmsTemplates = this.SmsTemplatesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
  }
  applyFilterStatus(smsTempate: ISmsTemplate, status: number) {
    console.log("templateId==>", smsTempate.smsTemplateId)
    let data: any = status ? this.translate.instant('smsTemplateModule.manage.activateTemplate') + '\"' + smsTempate.templateName + '\" ...?' :
      this.translate.instant('smsTemplateModule.manage.deActivateTemplate') + '\"' + smsTempate.templateName + '\" ...?';
    const dialogRef = this.dialog.open(ConfirmSmsTemplateComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        smsTempate.status = status;
        this.SmsTemplatesService.updateSmsTemplateStatus(smsTempate.smsTemplateId, smsTempate.status)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getSmsTemplates();
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
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  addSmsTemplate() {
    console.log("Create SmsTemplate:");
    const dialogRef = this.dialog.open(CreateSmsTemplateComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSmsTemplates();
      }
    });
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: ISmsTemplate, filter: string) => data.templateName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage=0;
    this.listPage=0;
    switch (value) {
      case '1':
        this.SmsTemplatesList = this.loadTotalSmsTemplates.filter(data => data.status == 1);
        console.log('SmsTemplatesList=>', this.SmsTemplatesList);
        if (this.SmsTemplatesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterSmsTemplates = [];
          this.dataSource = new MatTableDataSource(this.filterSmsTemplates);
        }
        break;
      case '0':
        this.SmsTemplatesList = this.loadTotalSmsTemplates.filter(data => data.status == 0);
        console.log('departments=>', this.SmsTemplatesList);
        if (this.SmsTemplatesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterSmsTemplates = [];
          this.dataSource = new MatTableDataSource(this.filterSmsTemplates);
        }
        break;
      default:
        this.SmsTemplatesList = this.loadTotalSmsTemplates;
        console.log('departments=>', this.SmsTemplatesList);
        if (this.SmsTemplatesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterSmsTemplates = [];
          this.dataSource = new MatTableDataSource(this.filterSmsTemplates);
        }
        break;
    }
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

  editSmsTemplate(smsDetails: ISmsTemplate) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = smsDetails;
    const dialogRef = this.dialog.open(CreateSmsTemplateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSmsTemplates();
      }
    });
  }



  sortData() {
    this.dataSource.sort = this.sort
  }

  SmsTemplateDetails(smsTemplatedetails) {
    this.dialog.open(SmsTempaltedetailsComponent, this.getDialogConfig(smsTemplatedetails));
  }

  deleteSmstemplate(selectedSmsTemplate) {
    console.log("deleteSmsTemplate :");
    const dialogRef = this.dialog.open(ConfirmSmsTemplateComponent, {
      width: '500px',
      data: this.translate.instant('smsTemplateModule.manage.deleteTemplate') + selectedSmsTemplate.templateName
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        selectedSmsTemplate.status = status;
        this.SmsTemplatesService.deleteSmsTemplate(selectedSmsTemplate.smsTemplateId)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getSmsTemplates();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteSmstemplate==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }
}