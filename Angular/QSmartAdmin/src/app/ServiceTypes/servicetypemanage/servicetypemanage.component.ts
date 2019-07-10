import { Component, OnInit } from '@angular/core';
import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ServiceTypecreateComponent } from '../servicetypecreate/servicetypecreate.component';
import { ServiceTypeService } from '../_service/serviceTypeservice';
import { ILevelData, IServiceType, ILevel } from '../_model/serviceModel';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-servicetypemanage',
  templateUrl: './servicetypemanage.component.html',
  styleUrls: ['./servicetypemanage.component.scss']
})
export class ServiceTypeManageComponent implements OnInit {
  serviceList: IServiceType[] = [];
  filterServices: IServiceType[] = [];
  initPage = 0;
  servicePage = 0;
  pageSize = environment.pageSize;
  searchdata: any;
  searchservice: any;
  levellist: ILevel[] = [];
  pagedlevelsData: any[] = [];
  loading: boolean = false;
  floorId = 0;
  constructor(public dialog: MatDialog, private alertMessage: AlertMessageService,
    private router: Router, private translate: TranslateService,
    private serviceTypeservice: ServiceTypeService, ) { }

  ngOnInit() {
    this.getAllFloorServiceTypeByOrgId();
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.height = '92.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  createServices() {
    let data = { floorId: null, data: null, addflag: "newService" };
    const dialogRef = this.dialog.open(ServiceTypecreateComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllFloorServiceTypeByOrgId();
      }
    });

  }

  addServices(floorId: number) {
    if (floorId > 0) {
      let data = { floorId: floorId, data: null, addflag: "addservice" };
      const dialogRef = this.dialog.open(ServiceTypecreateComponent, this.getDialogConfig(data));
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAllFloorServiceTypeByOrgId();
        }
      });
    }
  }

  getAllFloorServiceTypeByOrgId() {
    this.loading = true;
    this.serviceTypeservice.getAllFloorServiceTypeByOrgId().subscribe((response: ILevel[]) => {
      this.levellist = response;
      console.log('response=>', response)
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      this.loading = false;
    }, err => {
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
      this.loading = false;
    });
  }
  editServices(editData: IServiceType) {
    console.log('editData=>', editData);
    let data = { floorId: editData.floorId, data: editData, addflag: "addservice" };
    const dialogRef = this.dialog.open(ServiceTypecreateComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllFloorServiceTypeByOrgId();
      }
    });
  }
  getData(_pageData) {
    let index = 0;
    const startingIndex = _pageData.pageIndex * _pageData.pageSize;
    const endingIndex = startingIndex + _pageData.pageSize;
    this.pagedlevelsData = this.levellist.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    this.serviceList = this.pagedlevelsData.length > 0 ? this.pagedlevelsData[0].serviceTpes : [];
    if (this.pagedlevelsData.length > 0) {
      if (this.floorId > 0) {
        let indx = this.pagedlevelsData.findIndex(x => x.floorId == this.floorId);
        if (indx != -1)
          this.assignServices(this.pagedlevelsData[indx]);
        else {
          this.assignServices(this.pagedlevelsData[0].serviceTpes);
          this.floorId = 0;
        }
      }
      else
        this.assignServices(this.pagedlevelsData[0].serviceTpes);
    }
    else
      this.serviceList = [];

  }

  assignServices(serviceTypes: IServiceType[]) {
    this.loading = true;
    if (serviceTypes) {
      this.serviceList = serviceTypes;
      console.log('serviceList=>', this.serviceList);
      this.getServiceData({ pageIndex: this.servicePage, pageSize: this.pageSize });
      this.loading = false;
    }
  }

  getServiceData(pageObj) {
    let index = 0;
    const startingIndex = pageObj.pageIndex * pageObj.pageSize;
    const endingIndex = startingIndex + pageObj.pageSize;
    this.filterServices = this.serviceList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.servicePage = pageObj.pageIndex;
  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '250px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  activeClass(event) {
    $('#sndrActv').find('mat-card').removeClass('pbActive');
    event.currentTarget.classList.add("pbActive");
  }
}
