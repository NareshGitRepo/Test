import * as _ from 'lodash';

import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Service } from '../_service/service.';
import { AlertMessageService, ActionType } from '../../_services/alertMessageService';
import { IRoom, ServiceType } from '../_model/serviceModel';

@Component({
  selector: "app-client-details",
  template: `
  <mat-card>
  <mat-card-header>
    <div fxLayout="row wrap" class="w80">
      <h4 class="wrap-word">{{ 'serviceModule.roomMappingDetails.assignRooms' | translate }}</h4>
    </div>
    <button mat-icon-button [mat-dialog-close] style="position: absolute; right: 1%; "><i class="ti-close"></i></button>
  </mat-card-header>

  <mat-card-content class="pad-all2 wrap-word">
    <div fxLayout="row wrap" class="mar-btm">
      <div fxFlex.gt-sm="100" class="example-container mar-rgt" >

<div *ngIf="!noData">

<div class="clearfix pad-top" *ngFor="let key of asignedRoomTypeKeys">
<div fxFlex>
  <div cdkFocusInitial class="bord-all pad-all-sm" style="background: #fafafa"> <strong>{{ 'serviceModule.roomMappingDetails.roomType' | translate }}</strong> </div>
  <div class="bord-all pad-all-sm"> {{key}}</div>
</div>


<div fxFlex>
  <div cdkFocusInitial class="bord-all pad-all-sm" style="background: #fafafa"> <strong>{{ 'serviceModule.roomMappingDetails.roomNumber' | translate }}</strong> </div>
  <div class="bord-all pad-all-sm"> <span *ngFor="let item of assignedRooms[key];let i=index">
  {{item.roomNumber}}<span *ngIf="i < assignedRooms[key].length - 1">,</span>
  </span></div>
</div>



</div>
 </div>

 <div class="clearfix pad-top" *ngIf="noData">
 <div fxFlex>
 <div class="bord-all pad-all-sm" style="background: #fafafa"> <font size="3" color="red">{{ 'serviceModule.roomMappingDetails.noRoomsAssigned' | translate }}</font> </div> 
</div>
 </div>

 


</div></div>

 <div class="clearfix">
<div fxFlex class="clearfix pad-top" >

<table class="w100" *ngIf="destinationList?.length !=0">
<tr> 
<td class="bord-all pad-all-sm" style="background: #fafafa"><strong>{{ 'serviceModule.createservice.serviceEngName' | translate }}</strong> </td>
<td class="bord-all pad-all-sm" style="background: #fafafa"><strong>{{ 'serviceModule.createservice.location' | translate }} </strong></td>
</tr>

<tr *ngFor="let sericedata of destinationList"> 
<td  class="bord-all pad-all-sm"> {{sericedata?.srTypeName}}</td>
<td  class="bord-all pad-all-sm"> {{sericedata?.srTypeLocation}}</td>
</tr>

</table>


</div>
</div>

</mat-card-content></mat-card>
  `
})
export class RoomMappingDetailsComponent implements OnInit {
  asignedRoomTypeKeys = [] = [];
  assignedRooms: any = [];
  destinationList: ServiceType[] = [];
  loading: boolean = false;
  noData: boolean = false;
  constructor(private service: Service, private alertMessage: AlertMessageService,
    private translate: TranslateService, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public Data: any, private router: Router) { }

  ngOnInit() {
    this.getRoomsByServiceId();
    this.getDestByServiceId();
  }
  getRoomsByServiceId() {
    this.service.getRoomsByServiceId(this.data.serviceId).subscribe((response: IRoom[]) => {
      this.assignedRooms = response;
      console.log('assignedRooms :: ', this.assignedRooms);
      if (this.assignedRooms.length > 0) {
        this.noData = false;
        this.assignedRooms = _.groupBy(this.assignedRooms, 'roomTypeDsc');
        this.asignedRoomTypeKeys = Object.keys(this.assignedRooms);
      } else {
        this.noData = true;
        //this.showNewRoomsBtn=true;
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

  getDestByServiceId() {
    this.loading = true;
    this.service.getServiceType(this.data.serviceId + '').subscribe((response: ServiceType[]) => {
      console.log("Destination==>", response);
      if (response) {
        this.destinationList = response;
      }
      else
        this.destinationList = [];
      this.loading = false;
    }, error => {
      this.destinationList = [];
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
