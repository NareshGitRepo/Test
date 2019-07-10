import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { IServiceMapping, IServiceResponse, ServiceType, Services } from '../_model/serviceModel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { DualListComponent } from 'angular-dual-listbox';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../_service/service.';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assignservices',
  templateUrl: './assignservices.component.html',
  styleUrls: ['./assignservices.component.scss']
})
export class AssignservicesComponent implements OnInit {

  ServiceNameList: Array<ServiceType> = [];
  LocationList: Array<ServiceType> = [];
  SubminAction: boolean = false;;
  key: string = 'srTypeName';
  display: any;
  format: any = DualListComponent.DEFAULT_FORMAT;
  assignServiceForm: FormGroup;
  loading: boolean = false;
  constructor(private translate: TranslateService, @Inject(MAT_DIALOG_DATA) public data: Services,
    public dialog: MatDialog, public dialogRef: MatDialogRef<AssignservicesComponent>,
    private alertMessage: AlertMessageService, private router: Router, private service: Service) {
    // this.data = data;
  }

  ngOnInit() {
    console.log("Assign==>", this.data);
    this.assignServices();
    // this.getDestServices()
    this.format = {
      add: this.translate.instant('ActionNames.dualListadd'),
      remove: this.translate.instant('ActionNames.dualListremove'),
      all: this.translate.instant('ActionNames.dualListall'),
      none: this.translate.instant('ActionNames.dualListnone'),
    };
    this.display = this.stationLabel;
  }
  private stationLabel(item: any) {
    return item.svcSegmentId + " / " + item.srTypeName + " / " + item.srTypeLocation;
  }

  assignServices() {
    this.loading = true;
    this.service.unMapServiceType(this.data.floorId + '').subscribe((response: ServiceType[]) => {
      console.log("Unmp==>", response);
      if (response) {
        this.ServiceNameList = response;

        this.service.getServiceType(this.data.serviceId + '').subscribe((response: ServiceType[]) => {
          console.log("Destination==>", response);

          console.log("Destination==>", response);
          if (response) {
            this.SubminAction = response.length > 0 ? true : false;
            this.LocationList = response;
            this.LocationList.forEach(x => {
              this.ServiceNameList.push(x);
            });
            // this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          }
          else {
            this.LocationList = [];
          }
          // this.loading = false;
        }, error => {
          this.LocationList = [];
          // this.loading = false;
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
        });
      }
      else
        this.ServiceNameList = [];
      this.loading = false;
    }, error => {
      this.ServiceNameList = [];
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
    });
  }

  getDestServices() {
    this.loading = true;
    this.service.getServiceType(this.data.serviceId + '').subscribe((response: ServiceType[]) => {
      console.log("Destination==>", response);

      console.log("Destination==>", response);
      if (response) {
        this.LocationList = response;
        this.LocationList.forEach(x => {
          this.ServiceNameList.push(x);
        });
        // this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
      }
      else
        this.LocationList = [];
      this.loading = false;
    }, error => {
      this.LocationList = [];
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
    });
  }

  CreateServices() {
    this.loading = true;
    let assignData = {
      serviceId: this.data.serviceId,
      serviceTypes: this.LocationList
    } as IServiceMapping;
    console.log("JSon" + JSON.stringify(assignData));

    this.service.mapServiceWithServiceType(assignData).subscribe((response: IServiceResponse) => {
      if (response) {
        this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
        this.dialogRef.close(assignData);
      } else {
        this.alertMessage.showAlert(response.messages, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });

    console.log("Submit==>", assignData);

  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
