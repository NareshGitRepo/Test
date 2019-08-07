import { ActionType, AlertMessageService, AlertType } from '../../../_services/AlertMessageService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IResponse, IService } from '../_model/servicemanagement.model';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { ConfirmServiceDeleteComponent } from './serviceconfirm.component';
import { CreateServiceComponent } from '../create/createservice.component';
import { ServiceManagementService } from '../_service/servicemanagement.service';
import { ServicedetailsComponent } from '../details/servicedetails.component';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-servicemanagement',
  templateUrl: './servicemanagement.component.html',
  styleUrls: ['./servicemanagement.component.scss']
})
export class ServicemanagementComponent implements OnInit {

  servicesList: IService[] = [];
  filterServices: IService[] = [];
  filterListServices: IService[] = [];
  loadTotalServices: IService[] = [];
  listflag: boolean = false;
  displayedColumns = ['serviceName', 'serviceCode', 'categoryDesc', 'priorityName', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  public listPage = 0;
  public page = 0;
  public initPage = 0;
  public pageSize = environment.pageSize;
  selectedPage: any;
  searchdata: string = '';
  loading: boolean = false;
  _filterType = "";
  constructor(private dialog: MatDialog, private serMgtService: ServiceManagementService, private alertMessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.getAllServiceInfo();
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IService, filter: string) => data.serviceName.toLowerCase().indexOf(filter.toLowerCase()) > -1;

  }

  getAllServiceInfo() {
    this.loading = true;
    this.serMgtService.getAllServiceInfo().subscribe((result: IService[]) => {
      console.log("Result", result)
      if (result) {
        this.servicesList = result;
        this.loadTotalServices = result;
        this.initPage = 0;
        this.listPage = 0;
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.getData({ pageIndex: this.listPage, pageSize: this.pageSize });
      } else {
        this.servicesList = [];
        this.loadTotalServices = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllServiceInfo==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  addService() {
    const dialogRef = this.dialog.open(CreateServiceComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getAllServiceInfo();
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

  serviceDetails(servicedetails) {
    const dialogRef = this.dialog.open(ServicedetailsComponent, this.getDialogConfig(servicedetails));
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getAllServiceInfo();
      }
    });
  }

  editService(serviceData) {
    const dialogRef = this.dialog.open(CreateServiceComponent, this.getDialogConfig(serviceData));
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getAllServiceInfo();
      }
    });
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;

    this.filterServices = this.servicesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("UserData::" + JSON.stringify(this.servicesList));
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.servicesList=>", this.servicesList);

    this.filterListServices = this.servicesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListServices);
    if (this.searchdata != '') {
      this.dataSource = new MatTableDataSource(this.servicesList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IService, filter: string) => data.serviceName.toLowerCase().indexOf(filter.toLowerCase()) > -1;

  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  applyFilterStatus(service: IService, status: number) {

    let data: any = status ? this.translate.instant('ServiceManagementModule.servicemanagement.activate') + '\"' + service.serviceName + '\" ...?' : this.translate.instant('ServiceManagementModule.servicemanagement.deActivate') + '\"' + service.serviceName + '\" ...?';
    const dialogRef = this.dialog.open(ConfirmServiceDeleteComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        service.status = status;
        this.serMgtService.updateServiceInfoStatus(service.templateId, service.status)
          .subscribe((result: IResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getAllServiceInfo();
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
    dialogConfig.width = "400px";
    dialogConfig.disableClose = true;
    data ? (dialogConfig.data = data) : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  clearFilter() {

  }
  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage = 0;
    this.listPage = 0;
    this.filterServices = this.servicesList;
    switch (value) {
      case '1':
        this.servicesList = this.loadTotalServices.filter(data => data.status == 1);
        console.log('departments=>', this.servicesList);
        if (this.servicesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterServices = [];
          this.dataSource = new MatTableDataSource(this.filterServices);
        }
        break;
      case '0':
        this.servicesList = this.loadTotalServices.filter(data => data.status == 0);
        console.log('servicesList =>', this.servicesList);
        if (this.servicesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterServices = [];
          this.dataSource = new MatTableDataSource(this.filterServices);
        }
        break;
      default:
        this.servicesList = this.loadTotalServices;
        console.log('departments=>', this.servicesList);
        if (this.servicesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterServices = [];
          this.dataSource = new MatTableDataSource(this.filterServices);
        }
        break;
    }
  }
  sortData() {
    this.dataSource.sort = this.sort
  }

  getCategoryName(categoryId) {
    //   let selrow = this.serMgtService.getMsgCategories().find((item) => item.id == categoryId);
    //  console.log("Selected Row:::",selrow);
    return '';//selrow.categoryName;
  }

  deleteService(selectedService) {
    console.log("deleteCampaign :", JSON.stringify(selectedService));
    const dialogRef = this.dialog.open(ConfirmServiceDeleteComponent, {
      width: '400px',

      data: this.translate.instant('ServiceManagementModule.servicemanagement.delete') + '\"' + selectedService.serviceName + '\" ...?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        selectedService.status = status;
        this.serMgtService.deleteService(selectedService.templateId)
          .subscribe((result: IResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getAllServiceInfo();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteService==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });

  }

}
