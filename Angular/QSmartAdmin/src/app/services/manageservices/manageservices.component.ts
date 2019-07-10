import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreateservicesComponent } from '../createservices/createservices.component';
import { Service } from '../_service/service.';
import { environment } from '../../../environments/environment';
import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Services, IServiceCreate } from '../_model/serviceModel';
import { ServiceAlertComponent } from '../_model/serviceAlert';
import { RoommappingComponent } from '../roommapping/roommapping.component';
import { RoomMappingDetailsComponent } from '../roommapping-details/room-mapping-details.component';
import { Router } from '@angular/router';
import { AssignservicesComponent } from '../assignservices/assignservices.component';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-manageservices',
  templateUrl: './manageservices.component.html',
  styleUrls: ['./manageservices.component.scss']
})
export class ManageservicesComponent implements OnInit {

  searchdata: string;
  searchKey: string = 'serviceEngName';
  serviceList: Services[] = [];
  filterserviceList: Services[] = [];
  levelList: any[] = [];
  filterList: string[] = [];
  initPage = 0;
  pageSize = environment.pageSize;
  loading: boolean = false;
  serviceGroupData: any;
  searchService: string;
  floorname = '';
  constructor(public dialog: MatDialog, private service: Service, private alertMessage: AlertMessageService,
    private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    this.getServicesInfo();
  }

  getServicesInfo() {
    this.searchdata = '';
    this.loading = true;
    this.service.getAllService().subscribe((response: Services[]) => {
      if (response) {
        this.serviceGroupData = _.groupBy(response, 'floorName');

        console.log('serviceList=>', this.serviceGroupData)
        this.levelList = Object.keys(this.serviceGroupData);
        console.log("Response==>", response, this.serviceGroupData, this.serviceList, _.groupBy(response, 'floorName'));
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize }, false);

      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR);
      this.loading = false;
    });
  }

  createServices() {
    let data = { data: undefined };
    const dialogRef = this.dialog.open(CreateservicesComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe((response: IServiceCreate) => {
      if (response) {
        // this.floorname='';
        // let floorid=response.floorId;
        this.getServicesInfo();
      }
    });
  }

  editServices(services) {
    let data = { data: services };
    console.log("Edit==>", services)
    const dialogRef = this.dialog.open(CreateservicesComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe((result: IServiceCreate) => {
      if (result) {
        this.getServicesInfo();

      }
    });
  }

  getData(obj, action: boolean) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    this.filterList = this.levelList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    // this.floorname=this.filterList[0];
    this.floorname = action ? '' : this.floorname;
    if (this.floorname == '')
      this.assignService(this.filterList[0]);
      else
      this.assignService(this.floorname);
    //this.serviceList = this.serviceGroupData[this.filterList[0]];
    //console.log("serviceList=>", this.serviceList)
    this.initPage = obj.pageIndex;



  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  adRoom(services) {
    console.log(services)
    const dialogRef = this.dialog.open(RoommappingComponent, {
      width: "35vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: services
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
      }
    });
  }
  assignServices(services:Services) {
    const dialogRef = this.dialog.open(AssignservicesComponent, {
      width: "40vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: services
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.getServicesInfo();
      }
    });
  }
  roomMappingDetails(data) {
    const dialogRef = this.dialog.open(RoomMappingDetailsComponent, {
      width: "35vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: data
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
      }
    });
  }

  serviceActiveDialog(services, status: number) {
    console.log("Status==>", services)
    let data: any = status ? this.translate.instant('serviceModule.manageservices.activateStatus') : this.translate.instant('serviceModule.manageservices.deactivateStatus');
    const dialogRef = this.dialog.open(ServiceAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        services.status = status;
        this.service.updateStatus(services.status, services.serviceId)
          .subscribe(response => {
            console.log("Response==>", response.messages)
            if (response.status) {
              this.alertMessage.showAlert(response.messages, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getServicesInfo();
            } else {
              this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
            }
            this.getServicesInfo();
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR);
          });
      }
    });
  }
  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '92.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '250px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  activeClass(event) {
    $('#sndrActv').find('mat-card').removeClass('pbActive');
    event.currentTarget.classList.add("pbActive");
  }
  assignService(services) {
    this.floorname = services;
    this.serviceList = this.serviceGroupData[services];
    // this.getServiceData({ pageIndex: this.initServicePage, pageSize: this.pageSize });
    console.log('Services=>', services, this.serviceGroupData[services]);
  }
}
