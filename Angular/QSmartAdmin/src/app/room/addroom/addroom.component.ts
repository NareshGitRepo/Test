import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoomService } from '../_service/roomService';
import { Router } from '@angular/router';
import { AppConfig } from '../../_helpers/app.config';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService, ActionType } from '../../_services/alertMessageService';
import { ICreateRoom, RoomList, Room, IRoomResponse, IRoomManagementList, IUpdateRooms } from '../_model/roomModel';
import * as _ from 'lodash';

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
  roomdata: IRoomManagementList;
  roomListData: IRoomManagementList[];
  constructor(private dialogRef: MatDialogRef<AddroomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private translate: TranslateService,
    private roomService: RoomService, private appconfig: AppConfig,
    private alertMessage: AlertMessageService,
    private router: Router) {
    this.roomListData = data.roomListData;
    console.log('roomListData=>', this.roomListData);
    this.roomdata = this.roomListData[0];

    console.log(this.roomdata);

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
      allowedToAccess:[null,[Validators.required,Validators.max(5), Validators.min(1)]]

    });
    if (this.data.action == "add") {
      this.roomForms.patchValue({
        roomType: this.roomdata.roomTypeDsc,
        roomEng: this.roomdata.roomNameEn,
        roomArb: this.roomdata.roomNameAb,
      });
    }
    else {
      this.editForms.patchValue({
        roomEng: this.roomdata.roomNameEn,
        roomArb: this.roomdata.roomNameAb,
        allowedToAccess:this.roomdata.allowedToAccess,
      })
    }

  }
  onSubmit() {
    this.loading = true;
    if (this.roomForms.value) {
      this.createRoomData = {
        floorId: this.roomdata.floorId,
        orgId: this.roomdata.orgId,
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
              if (this.roomListData.findIndex(y => y.roomNumber == x + '') == -1)
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
          if (this.roomListData.findIndex(y => y.roomNumber == element) == -1)
            rooms.push(element);
        });
      }
      else {
        if (this.roomListData.findIndex(y => y.roomNumber == this.roomForms.value.roomNumber) == -1)
          rooms.push(this.roomForms.value.roomNumber);
      }
      console.log('rooms=>', rooms, this.roomListData);
      if (rooms.length > 0) {

        let roomData = {
          allowedToAccess:this.roomdata.allowedToAccess,
          roomNameEn: this.roomdata.roomNameEn,
          roomNameAb: this.roomdata.roomNameAb,
          roomType: this.roomdata.roomType,
          roomNumber: rooms
        } as Room;

        this.createRoomData.rooms.push(roomData);
        console.log('Data', JSON.stringify(this.createRoomData));
        this.roomService.createRoom(this.createRoomData).subscribe((response: IRoomResponse) => {
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
      else {
        this.showAlert('Your Entered RoomNumbers Already Exist', ActionType.FAILED);
      }
    }
  }

  editRoom() {
    this.loading = true;
    let editRoom = {
      floorId: this.roomdata.floorId,
      roomNameEn: (this.editForms.value.roomEng as string).trim(),
      roomNameAb: (this.editForms.value.roomArb as string).trim(),
      roomType:this.roomdata.roomType,
      allowedToAccess: +this.editForms.value.allowedToAccess
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
