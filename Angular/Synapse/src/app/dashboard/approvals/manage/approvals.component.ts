import * as _ from "lodash";

import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { CheckerData, ModulesInfo } from '../_model/approvals.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { ApprovalsService } from '../_service/approvals.service';
import { ApprovalsconfirmComponent } from '../confirm/approvalsconfirm.component';
import { ConfirmcampaignComponent } from '../confirmcampaign/confirmcampaign.component';
import { ConfirmcustomerComponent } from '../confirmcustomer/confirmcustomer.component';
import { ConfirmdepartmentComponent } from '../confirmdepartment/confirmdepartment.component';
import { ConfirmdeptquotaComponent } from '../confirmdeptquota/confirmdeptquota.component';
import { ConfirmgroupComponent } from '../confirmgroup/confirmgroup.component';
import { ConfirminterfaceComponent } from '../confirminterface/confirminterface.component';
import { ConfirmsegmentComponent } from '../confirmsegment/confirmsegment.component';
import { ConfirmsenderComponent } from '../confirmsender/confirmsender.component';
import { ConfirmserviceComponent } from '../confirmservice/confirmservice.component';
import { ConfirmspamComponent } from '../confirmspam/confirmspam.component';
import { ConfirmtemplateComponent } from '../confirmtemplate/confirmtemplate.component';
import { ConfirmuserComponent } from '../confirmuser/confirmuser.component';
import { ConfirmsmstoemailComponent } from '../confirmsmstoemail/confirmsmstoemail.component';
import { ConfirmmailserverComponent } from '../confirmmailserver/confirmmailserver.component';
import { ConfirmemailtosmsComponent } from '../confirmemailtosms/confirmemailtosms.component';
import { ConfirmemailtemplateComponent } from '../confirmemailtemplate/confirmemailtemplate.component';
import { ConfirmsetnotificationComponent } from '../confirmsetnotification/confirmsetnotification.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

import { ConfirmofflinealertsComponent } from "../confirmofflinealerts/confirmofflinealerts.component";
import { ConfirmalertmanagerComponent } from "../confirmalertmanager/confirmalertmanager.component";

@Component({
  selector: 'app-approvalspage',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalspageComponent implements OnInit {

  public page = 0;
  public size = 6;
  public initPage = 0;
  public listPage = 0;
  public pageSize = environment.pageSize;
  selectedPage: any;
  listflag: boolean = false;
  loading: boolean = false;
  displayedColumns = ['moduleName', 'createdBy', 'createdOn', 'info','actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  moduleInfo: ModulesInfo[] = [];
  searchdata: any;
  ApprovalsList: CheckerData[] = [];
  filterApprovals: CheckerData[] = [];
  loadTotalApprovals: CheckerData[] = [];
  filterListApprovals: CheckerData[] = [];
  dataSource = new MatTableDataSource<CheckerData>();
  approvalForm: FormGroup;
  loginInfo: IUserUpdateDto;
  notfound: boolean;
  modulename: string = '';
  _roleCode: string = '';
  constructor(private fb: FormBuilder, private approvalsService: ApprovalsService, private router: Router,
    private dialog: MatDialog, private alertMessage: AlertMessageService, private translate: TranslateService, private appConfig: AppConfig) {
    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("Depts && Role info ", this.loginInfo.depts, this.loginInfo.roles);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      this.getApprovals();
    }
    else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {

    this.approvalForm = this.fb.group({
      module: null
    });
    this.getModules();
  }

  getModules() {
    //this.loading = true;
    this.approvalsService.getModules().subscribe((result: ModulesInfo[]) => {
      if (result) {
        this.moduleInfo = result;
       // this.notfound = false;
        console.log("moduleInfo:::::", this.moduleInfo);
        if (result.length > 0) {
          // this.dataSource.paginator = this.paginator;
          // this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          // this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
        //  this.notfound = true;
          this.alertMessage.showAlert("No Records Found", ActionType.ERROR);
        }
      }
      else {
        this.moduleInfo = [];
      }
      //this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
      console.error("E-getModules==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      // this.loading = false;
    });
  }

  getApprovals() {
    this.loading = true;
    this.notfound = false;
    this.approvalsService.getApprovals(this._roleCode).subscribe((result: CheckerData[]) => {
      if (result) {
        this.ApprovalsList = result;
        this.notfound = this.ApprovalsList.length>0?false:true;
        // this.ApprovalsList.forEach(element => {
        //   const str = element.requestTime.split(" ");
        //   const splitDate = str[0].split('-')
        //   const year = Number(splitDate[2]);
        //   const month = Number(splitDate[1]) - 1;
        //   const date = Number(splitDate[0]);
        //   const splitTime = str[1].split(':')
        //   const shour = Number(splitTime[0]);
        //   const sminit = Number(splitTime[1]);
        //   element.requestTime = ''+new Date(year, month, date,shour,sminit);
        //   return element;
        // })

        this.loadTotalApprovals = result;
        console.log("ApprovalsList:::::", this.ApprovalsList);
        this.dataSource.paginator = this.paginator;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        if(this.approvalForm.value.module !=null)
        this.selectedModule(this.approvalForm.value.module);
      }
      else {
        this.ApprovalsList = [];
        this.alertMessage.showAlert(this.translate.instant("ActionNames.noDataFound"), ActionType.SUCCESS);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
      console.error("E-getApprovals==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });

  }

  selectedModule(moduleIds) {
    console.log("selected Module::::", moduleIds);
    this.modulename = '';
    if (moduleIds.length != 0) {
      let moduleSelected: number[] = [];
      //Selected Multiple items with + others
      moduleSelected = this.approvalForm.value.module;
      if (moduleSelected.length > 0) {
        let findex = this.moduleInfo.findIndex(y => y.moduleId == moduleSelected[0]);
        if (findex != -1) {
          this.modulename = this.moduleInfo[findex].modulename;
        }
      }
      this.ApprovalsList = [];
      moduleIds.forEach(element => {
        //this.ApprovalsList = this.loadTotalApprovals.filter(data => data.moduleId == element);
        this.loadTotalApprovals.forEach(data => {
          if (data.moduleId == element) {
            this.ApprovalsList.push(data);
          }
        });
      });

      if (this.ApprovalsList.length > 0) {
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      }
      else {
        this.filterApprovals = [];
        this.dataSource = new MatTableDataSource(this.filterApprovals);
        this.notfound = true;
      }
    }
    else {
      this.ApprovalsList = this.loadTotalApprovals;
      if (this.ApprovalsList.length > 0) {
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      }
    }
    // console.log("JSON ", JSON.stringify(this.ApprovalsList));
    
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

  sortData() {
    this.dataSource.sort = this.sort
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.departmentsList=>", this.ApprovalsList);

    this.filterListApprovals = this.ApprovalsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListApprovals);
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;
    this.filterApprovals = this.ApprovalsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("UserData::" + JSON.stringify(this.ApprovalsList));
  }

  confirmApproval(approvalDetail: CheckerData) {
    console.log("ConfirmApproval ::", approvalDetail.moduleName);
    switch (approvalDetail.moduleName) {
      case "Users": {
        console.log("user");
        const dialogRef = this.dialog.open(ConfirmuserComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Customer Profiling": {
        console.log("Customer Profiling");
        const dialogRef = this.dialog.open(ConfirmcustomerComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "OffLine Alerts": {
        console.log("Offline Alerts");
        const dialogRef = this.dialog.open(ConfirmofflinealertsComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Alert Manager": {
        console.log("Alert Manager");
        const dialogRef = this.dialog.open(ConfirmalertmanagerComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Departments": {
        console.log("Departments");
        const dialogRef = this.dialog.open(ConfirmdepartmentComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Service Management": {
        console.log("Service");
        const dialogRef = this.dialog.open(ConfirmserviceComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Customer Segments": {
        console.log("Customer Segments");
        const dialogRef = this.dialog.open(ConfirmsegmentComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Interfaces": {
        console.log("Interface");
        const dialogRef = this.dialog.open(ConfirminterfaceComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Group Management": {
        console.log("Group");
        const dialogRef = this.dialog.open(ConfirmgroupComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Senders": {
        console.log("Senders");
        const dialogRef = this.dialog.open(ConfirmsenderComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Campaigns": {
        console.log("Campaigns");
        const dialogRef = this.dialog.open(ConfirmcampaignComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Departments Credit": {
        console.log("Departments Credit");
        const dialogRef = this.dialog.open(ConfirmdeptquotaComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Template Studio": {
        console.log("Template Studio");
        const dialogRef = this.dialog.open(ConfirmtemplateComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      case "Spam Control": {
        console.log("Spam Control");
        const dialogRef = this.dialog.open(ConfirmspamComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
	   case "Email Template": {
        console.log("Email Template");
        const dialogRef = this.dialog.open(ConfirmemailtemplateComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
	     case "Sms to Email": {
        console.log("Sms to Email");
        const dialogRef = this.dialog.open(ConfirmsmstoemailComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
        break;
      }
      default:
        console.log("Service not exist ..");
        const dialogRef = this.dialog.open(ApprovalsconfirmComponent, this.getDialogConfig(approvalDetail));
        dialogRef.afterClosed().subscribe(result => {
          console.log("Result :: " + result);
          if (result) {
            this.getApprovals();
          }
        });
    }
  }

  confirmSMStoemailApproval()
  {
    this.dialog.open(ConfirmsmstoemailComponent,this.getDialogConfig())
  }
  confirmMailserverApproval()
  {
    this.dialog.open(ConfirmmailserverComponent,this.getDialogConfig())
  }
  confirmEmailtoSMSApproval() {
    this.dialog.open(ConfirmemailtosmsComponent,this.getDialogConfig())
  }

  confirmEmailTemplateApproval(){
    this.dialog.open(ConfirmemailtemplateComponent,this.getDialogConfig())
  }
  confirmSetnotificationApproval(){
    this.dialog.open(ConfirmsetnotificationComponent,this.getDialogConfig())
  }
}
