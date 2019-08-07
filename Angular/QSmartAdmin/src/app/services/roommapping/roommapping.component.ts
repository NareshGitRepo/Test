import * as _ from 'lodash';

import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateRoom, IRoom, IRoomTypeInfo } from '../_model/serviceModel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { AppConfig } from '../../_helpers/app.config';
import { Router } from '@angular/router';
import { Service } from '../_service/service.';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-roommapping',
  templateUrl: './roommapping.component.html',
  styleUrls: ['./roommapping.component.scss']
})
export class RoommappingComponent implements OnInit {

  loading: boolean = false;
  roomMappingForm: FormGroup;
  totalRoomTypes:IRoomTypeInfo[] = [];
  roomsData: any;
  createRoomData: ICreateRoom;
  roomTypes: any[] = [];
  assignedRooms: IRoom[] = [];
  roomTypeGroupData: any;

  constructor(private fb: FormBuilder, private _mapRoomsService: Service, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<RoommappingComponent>, private router: Router, private alertMessage: AlertMessageService, private appconfig: AppConfig, private translate: TranslateService, ) {
  }

  ngOnInit() {
    this.roomMappingForm = this.fb.group({
      roomType: [null, Validators.required],
      // assignRoom:[null, Validators.required]
      roomNoList: this.fb.array([])
    });
    console.log('data in oninit ', this.data);
    this.getRoomsByServiceId();
  }
  getRoomsByServiceId() {
    this.loading = true;
    this._mapRoomsService.getRoomsByServiceId(this.data.serviceId).subscribe((response: IRoom[]) => {
      this.assignedRooms = response;
      if(response.length>0)
      console.log('rooms=>', this.assignedRooms);
      this.loading = false;
      this.getRoomsByFloorId();
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }


  getRoomsByFloorId() {
    console.log("data :: ", this.data)
    this.loading = true;
    this._mapRoomsService.getRoomsByFloorId(this.data.floorId).subscribe((response: IRoomTypeInfo[]) => {
      if (response.length > 0) {
        this.totalRoomTypes = response;
        console.log("totalRoomTypes :: ", this.totalRoomTypes);
        this.roomTypeGroupData = _.groupBy(this.totalRoomTypes, 'roomType');
        let assignedRoomsGroupvalues=Object.values(_.groupBy(this.assignedRooms,'roomTypeDsc'));
        let roomTypevalues=[];
        if(assignedRoomsGroupvalues.length>0)
        {
          assignedRoomsGroupvalues.forEach(x=>{
            roomTypevalues.push(x[0]['roomType']+'');
          });
          this.roomMappingForm.get('roomType').setValue(roomTypevalues);
          this.roomTypeSelect(roomTypevalues);
        }
        else
        this.roomMappingForm.get('roomType').setValue(null);
        console.log('roomTypeGroupData ', this.roomTypeGroupData,roomTypevalues,assignedRoomsGroupvalues);
      } else {
        this.alertMessage.showAlert(this.translate.instant('serviceModule.roomMapping.roomsMappedError'), ActionType.FAILED);
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
  createData(data, assignData,roomType,roomTypeDsc) {
    console.log('inside createData', data);
    const roomObj = this.fb.group({
      assignRoom: [assignData, Validators.required],
      rooms: [data],
      roomType:roomType,
      roomTypeDsc:roomTypeDsc
    });

    this.checkedForms.push(roomObj);
  }
  get checkedForms() {
    return <FormArray>this.roomMappingForm.get('roomNoList');
  }
  roomTypeSelect(roomTypes, action?: boolean) {
    console.log('roomTypes selected are ', roomTypes);

    if (roomTypes.length > 0) {
      roomTypes.forEach(element => {console.log('element =>',element);

        this.roomsData = this.roomTypeGroupData['' + element];
        console.log('this.roomsData::: ', this.roomsData);
        let roomListIndex = this.checkedForms.controls.findIndex(x =>x.value.roomType == element);
        console.log('roomListIndex :: ', roomListIndex);
        if (roomListIndex == -1) {
          let roomdata = [];
          console.log('this.assignedRooms => ',this.assignedRooms);

          this.roomsData[0].roomGroups.forEach(room => {console.log('room => ',room);

            this.assignedRooms.forEach(data => (data.roomNameEn == room.roomNameEn) ?  roomdata.push(data.roomId+'') :false );

          });
          console.log('roomdata=>', roomdata);
          this.createData(this.roomsData[0].roomGroups, roomdata, element, this.roomsData[0].roomTypeDsc);
        }

      });
      this.checkedForms.controls.forEach(data => {

        let indx = roomTypes.findIndex(x => x == data.value.roomType);
        console.log('indx :: ', indx);

        if (indx == -1) {
          indx = this.checkedForms.controls.findIndex(x => x.value.roomType == data.value.roomType);
          this.checkedForms.removeAt(indx);
        }
      });
    }
    else {
      for (let i = 0; i < this.checkedForms.controls.length; i++) {
        this.checkedForms.removeAt(i);
      }
    }
  }



  onSubmit() {
    console.log("Submit==>", this.roomMappingForm.value);
    let arr = [];
    this.roomMappingForm.value.roomNoList.forEach(element => {
      console.log('element ::', element)
      let roomList = {
        roomType: element.roomType,
        rooms: element.assignRoom
      };
      arr.push(roomList);
    });

    this.createRoomData = {
      serviceId: this.data.serviceId,
      rooms: arr
    };

    console.log('createRoomData :: ', this.createRoomData);
    this._mapRoomsService.mapServiceWithRooms(this.createRoomData).subscribe((response) => {

      if (response.status) {
        this.alertMessage.showAlert(response.messages, ActionType.SUCCESS, AlertType.SUCCESS);
      } else {
        this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });

    this.dialogRef.close();
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
