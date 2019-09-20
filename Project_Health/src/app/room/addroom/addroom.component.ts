import * as _ from 'lodash';

import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateRoom, IRoomGroup, IRoomManagementList, IRoomResponse, IRoomTypeInfo, IUpdateRooms, Room, RoomList } from '../_model/roomModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { RoomService } from '../_service/roomService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.scss']
})
export class AddroomComponent implements OnInit {
  roomForms: FormGroup;
  editForms: FormGroup;
  loading: boolean = false;
  createRoomData: ICreateRoom;
  roomdata: IRoomGroup;
  roomListData: IRoomGroup;
  orgId: number;
  _tokenInfo: IUserUpdateDto;
  maxtoken:number=0;



  constructor(private dialogRef: MatDialogRef<AddroomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private translate: TranslateService,
    private roomService: RoomService, private appconfig: AppConfig,
    private alertMessage: AlertMessageService,
    private router: Router) {


      let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
      if (tokenData)
        this._tokenInfo = tokenData.tokenSub;
      if (this._tokenInfo && tokenData) {
        this.orgId = this._tokenInfo.orgId;
      }


    this.roomListData = data.roomListData;
    console.log('roomListData=>', this.roomListData);
    //this.roomdata = this.roomListData[0];

   // console.log(this.roomdata);
    this.maxtoken=this.appconfig.getMaxServeToken();
    console.log('this.maxtoken=>',this.maxtoken);

  }

  ngOnInit() {
    this.roomForms = this.fb.group({
      roomType: [null],
      roomEng: [null],
      roomArb: [null],
      roomNumber: [null, Validators.required],
    });
    this.editForms = this.fb.group({
      roomEng: [null, Validators.required],
      roomArb: [null, Validators.required],
      allowedToAccess:[null,[Validators.required,Validators.max(this.maxtoken), Validators.min(1)]]

    });
    if (this.data.action == "add") {
      this.roomForms.patchValue({
        roomType:  this.data.roomInfo.roomTypeDsc,
        roomEng: this.roomListData.roomNameEn,
        roomArb: this.roomListData.roomNameAb,
      });
    }
    else {
      this.editForms.patchValue({
        roomEng: this.roomListData.roomNameEn,
        roomArb: this.roomListData.roomNameAb,
        allowedToAccess:this.roomListData.rooms[0].allowedToAccess,
      })
    }

  }
  onSubmit() {
    this.loading = true;
    if (this.roomForms.value) {
      this.createRoomData = {
        floorId: this.roomListData.rooms[0].floorId,
        orgId: this.roomListData.rooms[0].orgId,
        rooms: []
      };
      let roomList: RoomList;

      roomList = this.roomForms.value.roomNumber;
      let rangevalidate = false;
      let rooms: string[] = [];

      if (this.roomForms.value.roomNumber.includes("-")) {
        let roomrange = this.roomForms.value.roomNumber.split("-");
        if (roomrange.length > 1) {
          if (+roomrange[0] <= +roomrange[1]) {
            _.range(+roomrange[0], +roomrange[1] + 1).forEach(x => {
              if (this.roomListData['rooms'].findIndex(y => y.roomNumber == x + '') == -1)
                rooms.push(x + '');
            });
          }
          else
            rangevalidate = true;
        }
        else
          rangevalidate = true;

      }
      else if (this.roomForms.value.roomNumber.includes(",")) {
        this.roomForms.value.roomNumber.split(",").forEach(element => {
          if (this.roomListData['rooms'].findIndex(y => y.roomNumber == element) == -1)
            rooms.push(element);
        });
      }
      else {console.log('rooms=>', this.roomListData['rooms']);

        if (this.roomListData['rooms'].findIndex(y => y.roomNumber == this.roomForms.value.roomNumber) == -1)
          rooms.push(this.roomForms.value.roomNumber);
      }
      console.log('rooms=>', rooms, this.roomListData);
      if (rooms.length > 0 && !rangevalidate) {

        let roomData = {
          allowedToAccess:this.roomListData.rooms[0].allowedToAccess,
          roomNameEn: this.roomListData.roomNameEn,
          roomNameAb: this.roomListData.roomNameAb,
          roomType: this.data.roomInfo.roomType,
          roomNumber: rooms
        } as Room;

        this.createRoomData.rooms.push(roomData);
        console.log('Data', JSON.stringify(this.createRoomData));
        this.roomService.addRoom(this.createRoomData).subscribe((response: IRoomResponse) => {
          if (response.status) {
            this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
            this.dialogRef.close(this.createRoomData);
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
      }
      else if(rangevalidate){
        this.showAlert(this.translate.instant('roomModule.addRoom.invalidRange'), ActionType.FAILED);
      }else{
        this.showAlert(this.translate.instant('roomModule.addRoom.roomsExistErr'), ActionType.FAILED);
      }
    }
  }

  editRoom() {
    this.loading = true;
    let editRoom = {
      floorId: this.roomListData.rooms[0].floorId,
      roomNameEn: (this.editForms.value.roomEng as string).trim(),
      roomNameAb: (this.editForms.value.roomArb as string).trim(),
      roomType:this.data.roomInfo.roomType,
      allowedToAccess: this.editForms.value.allowedToAccess,
      orgId: this.orgId,
      roomNameAbOld:this.roomListData.roomNameAb,
      roomNameEnOld:this.roomListData.roomNameEn
    } as IUpdateRooms;
    console.log('editRoom=>', editRoom);
    if (editRoom)
      this.roomService.updateRooms(editRoom).subscribe((response: IRoomResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(editRoom);
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
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


}
