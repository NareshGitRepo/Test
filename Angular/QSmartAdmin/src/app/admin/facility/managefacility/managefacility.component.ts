import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator } from '@angular/material';
import * as _ from 'lodash';
import { UpdateFacilityComponent } from '../updatefacility/updatefacility.component';
import { IFacilityModel } from '../_model/facility.model';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { FacilityService } from '../_service/facility.service';
import { FacilityAlertComponent } from '../_model/facilityAlert';

import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-managefacility',
  templateUrl: './managefacility.component.html',
  styleUrls: ['./managefacility.component.scss']
})

export class ManageFacilityComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hospList: IFacilityModel[] = [];
  filterfacility: IFacilityModel[] = [];
  searchdata: any;
  selectedPage: any;
  _filterType = '';
  initPage = 0;
  pageSize = environment.pageSize;
  loading: boolean = false;
  constructor(public dialog: MatDialog, private translate: TranslateService, private alertMessage: AlertMessageService,
    private facilityservice: FacilityService, private router: Router) { }

  ngOnInit() {
    this.getFacilityInfo();
  }

  getFacilityInfo() {
    this.loading = true;
    this.facilityservice.getFacilityByClientId().subscribe((response: IFacilityModel[]) => {
      if (response) {
        console.log("Response==>", response)
        this.hospList = response;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  editFacility(element:IFacilityModel) {
    const dialogRef = this.dialog.open(UpdateFacilityComponent, this.getDialogConfig(element));
    dialogRef.afterClosed().subscribe(result => {
      console.log("row in onUpdate() :: " + JSON.stringify(result));
      if (result) {
        this.getFacilityInfo();
      }
    });
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

  facilityActiveDialog(facility: IFacilityModel, status: number) {
    console.log("Facility Status Response:", facility);
    let data: any = status ? this.translate.instant('FacilityModule.activeStatus') : this.translate.instant('FacilityModule.deactiveStatus');
    const dialogRef = this.dialog.open(FacilityAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      console.log("Result===>", result);
      if (result) {
        facility.status = status;
        this.facilityservice.statusUpdate(facility).subscribe((response: any) => {
          console.log("facility Status Response", response);
          if (response.status === true) {
            this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          } else {
            this.alertMessage.showAlert(response.messages, ActionType.FAILED);
          }
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
        });
      }
    });
  }

  applyFilterStatus(filterValue: string) {
    console.log("applyFilterStatus:" + filterValue);
    if (filterValue != "") {
      this.filterfacility = this.hospList;
      let obj = _.filter(this.filterfacility, function (dataObj) {
        return dataObj.status + "" == filterValue;
      });
      this.filterfacility = obj;
    }
  }

  clearFilter() {
    console.log("clearFilter:");
    this.filterfacility = this.hospList;
  }

  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    this.filterfacility = this.hospList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;

    });
    console.log(this.filterfacility);
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

}