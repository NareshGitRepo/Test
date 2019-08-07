import * as _ from 'lodash';

import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { Component, OnInit } from '@angular/core';
import { IRoomGroup, IRoomManagementList, IRoomTypeInfo, Level } from '../_model/roomModel';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { AddroomComponent } from '../addroom/addroom.component';
import { AppConfig } from '../../_helpers/app.config';
import { RemoveroomComponent } from '../removeroom/removeroom.component';
import { RoomService } from '../_service/roomService';
import { RoomcreateComponent } from '../roomcreate/roomcreate.component';
import { RoomdetailsComponent } from '../roomdetails/roomdetails.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

declare var $: any;
@Component({
  selector: 'app-roommanage',
  templateUrl: './roommanage.component.html',
  styleUrls: ['./roommanage.component.scss']
})
export class RoommanageComponent implements OnInit {


  searchdata: any;
  loading: boolean = false;
  initPage = 0;
  pageSize = environment.pageSize;
  levelsData: Level[] = [];
  pagedlevelsData: Level[] = [];
  roomTypeData: any[] = [];
  roomTypevalues: any;
  floorId = 0;
  roomInfo:IRoomTypeInfo[];

  constructor(public dialog: MatDialog, private roomService: RoomService, private appconfig: AppConfig, private alertMessage: AlertMessageService,
    private router: Router, private translate: TranslateService) {

  }

  ngOnInit() {
    this.getLevelsByOrgId();

  }
  getLevelsByOrgId() {
    this.loading = true;
    this.roomService.getLevelsByOrgId().subscribe((response: Level[]) => {
      this.levelsData = response;
      console.log('levels', this.levelsData);
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    this.pagedlevelsData = this.levelsData.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = obj.pageIndex;
    if (this.pagedlevelsData.length > 0) {
      if (this.floorId > 0) {
        let indx = this.pagedlevelsData.findIndex(x => x.floorId == this.floorId);
        if (indx != -1)
          this.assignRooms(this.pagedlevelsData[indx]);
        else {
          this.assignRooms(this.pagedlevelsData[0]);
          this.floorId = 0;
        }
      }
      else
        this.assignRooms(this.pagedlevelsData[0]);
    }
  }


  createRoom() {
    const dialogRef = this.dialog.open(RoomcreateComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getLevelsByOrgId();
      }
    });
  }
  addRooms(roomInfo:IRoomTypeInfo,roomData:IRoomGroup) {
    console.log('roomInfo=>', roomInfo);
    if (roomInfo) {
      let data = {roomInfo:roomInfo,roomListData:roomData,action:"add"};
      const dialogRef = this.dialog.open(AddroomComponent, this.getDialogConfig(data));
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getLevelsByOrgId();
        }
      });
    }
  }

  editRooms(roomInfo:IRoomTypeInfo,roomData:IRoomGroup) {
    console.log('roomInfo=>', roomInfo);
    if (roomInfo) {
      let data = {roomInfo:roomInfo,roomListData:roomData,action:"edit"};
      const dialogRef = this.dialog.open(AddroomComponent, this.getDialogConfig(data));
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getLevelsByOrgId();
        }
      });
    }
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
  //

  activeClass(event) {
    $('#sndrActv').find('mat-card').removeClass('pbActive');
    event.currentTarget.classList.add("pbActive");
  }

  assignRooms(levelDetails: Level) {
    this.loading = true;
    this.floorId = levelDetails.floorId;
    console.log('levelDetails=>', levelDetails);
    this.roomService.getRoomsByFloorId(levelDetails.floorId).subscribe((response: IRoomTypeInfo[]) => {
      if (response) {
        this.roomInfo = response;

        // console.log(_.groupBy(response, 'roomTypeDsc'));
        this.roomTypevalues = _.groupBy(response, 'roomTypeDsc');
        this.roomTypeData = response.map(value => value.roomTypeDsc);
        console.log('keys=>', this.roomTypeData,this.roomTypevalues);
      }
      else {
        this.roomTypevalues = [];
        this.roomTypeData = [];
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
  roomDetails(roomInfo:IRoomTypeInfo,roomData:IRoomGroup) {
    console.log('roomInfo', roomInfo);
    let data = {roomInfo:roomInfo,roomListData:roomData};
    const dialogRef = this.dialog.open(RoomdetailsComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  roomremoves(roomInfo:IRoomTypeInfo,roomData:IRoomGroup){
    console.log('room', roomInfo);
    let data = {roomInfo:roomInfo,roomListData:roomData};
    const dialogRef = this.dialog.open(RemoveroomComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getLevelsByOrgId();
      }
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

}
