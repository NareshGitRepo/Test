import * as _ from 'lodash';

import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICreateRoom, IRoom, IRoomResponse, IRoomsList, Level, Room, RoomList, RoomType } from '../_model/roomModel';

import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { RoomService } from '../_service/roomService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-roomcreate',
  templateUrl: './roomcreate.component.html',
  styleUrls: ['./roomcreate.component.scss']
})
export class RoomcreateComponent implements OnInit {
  roomForm: FormGroup;
  direction: boolean = false;

  createRoomData: ICreateRoom;
  roleData: RoomType[];
  totalRooms: RoomType[];
  orgId: number;
  _tokenInfo: IUserUpdateDto;
  roomsData:IRoomsList[];
  loading: boolean = false;

  @ViewChild('roomArbName') type: ElementRef;


  levelsData: Level[];
  maxtoken:number=0;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<RoomcreateComponent>, private translate: TranslateService,
    private roomService: RoomService, private appconfig: AppConfig, private alertMessage: AlertMessageService,
    private router: Router) {
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    this.maxtoken=this.appconfig.getMaxServeToken();
    console.log('this.maxtoken=>',this.maxtoken);
    
  }
  ngOnInit() {
    this.roomForm = this.fb.group({
      level: [null],
      roomType: [null],
      roomNoList: this.fb.array([]),
    });
    this.getLevelsByOrgId();
    this.getRoomTypes();
  }

  getRoomTypes() {
    this.loading = true;
    this.roomService.getRoomTypes().subscribe((response: RoomType[]) => {

      this.totalRooms = response;
      console.log('getRoomTypes', this.roleData);
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  levelSelected(){
    if(this.roomForm.value.level){
    this.getRoomTypesByLevelId(this.roomForm.value.level);
    }
  }
  getRoomTypesByLevelId(levelId?:number){
    this.loading = true;
    this.roomService.getRoomTypesByLevelId(levelId).subscribe((response: IRoomsList[]) => {
      this.roomsData = response;
      console.log('getRoomTypes', this.roomsData);
      this.roleData= this.totalRooms;//.filter(data=> this.roomsData.findIndex(x=>x.roomTypeDsc == data.roomName) == -1);
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  getLevelsByOrgId() {
    this.loading = true;
    this.roomService.getLevelsByOrgId().subscribe((response: Level[]) => {
      this.levelsData = response;
      console.log('levels', this.levelsData);
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  createData(rmTypeId, roomnumber?, roomname?, arabicname?) {
    const roomObj = this.fb.group({
      roomNameEn: [roomname == null ? "" : roomname,],
      roomNameAb: [arabicname == null ? "" : arabicname],
      roomNumber: [roomnumber == null ? "" : roomnumber, Validators.compose([Validators.required])],
      allowedToAccess:[1,[Validators.required,Validators, Validators.min(1),Validators.max(this.maxtoken)]],
      rmTypeId: [rmTypeId]
    })
    this.checkedForms.push(roomObj);
  }
  get checkedForms() {
    return <FormArray>this.roomForm.get('roomNoList');
    // return <FormArray>this.Data.departementForm.get('roomNoList');
  }

  pasteUrl(e) {
    let oldMessage = this.type.nativeElement.value + e;
    var arabic = /[\u0621-\u064A]/;
    if (oldMessage.match(arabic)) {
      this.direction = true;
    }
    else {
      this.direction = false;
    }
  }


  onChange(event) {
    console.log(event.value);
    if (event.value.length > 0) {

      event.value.forEach(element => {
        let roomListIndex = this.checkedForms.controls.findIndex(x => x.value.rmTypeId === element);
        if (roomListIndex == -1)
          this.createData(element);
      });

      this.checkedForms.controls.forEach(data => {
        let indx = event.value.findIndex(x => x === data.value.rmTypeId);
        console.log('index=>',indx,this.checkedForms.value,data.value.rmTypeId);
        if (indx == -1)
        {
          indx= this.checkedForms.controls.findIndex(x => x.value.rmTypeId === data.value.rmTypeId)
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
     
   
    this.loading = true;
    if (this.roomForm.value) {
      this.createRoomData = {
        floorId: this.roomForm.value.level,
        orgId: this.orgId,
        rooms: []
      };
      let roomList: RoomList[];
      roomList = this.roomForm.value.roomNoList;
      let rangevalidate = false;
      roomList.forEach((data: RoomList) => {
        let rooms: string[] = [];

        if (data.roomNumber.includes("-")) {
          let roomrange = data.roomNumber.split("-");
          if (roomrange.length > 1) {
            if (+roomrange[0] <= +roomrange[1]) {
              _.range(+roomrange[0], +roomrange[1]+1).forEach(x => {
                rooms.push(x + '');
              });
            }
            else
              rangevalidate = true;
          }
          else
            rangevalidate = true;

        }
        else if (data.roomNumber.includes(",")) {
          rooms = data.roomNumber.split(",")
        }
        else {
          rooms.push(data.roomNumber);
        }
        let roomType=this.roleData.find(x=>x.roomName == data.rmTypeId).rmTypeId;

        let roomData = {
          allowedToAccess:(data.allowedToAccess),
          roomNameEn: (data.roomNameEn  as string).trim(),
          roomNameAb: (data.roomNameAb  as string).trim(),
          roomType: roomType,
          roomNumber: rooms
        } as Room;

        this.createRoomData.rooms.push(roomData);
      });
      console.log('Data',JSON.stringify(this.createRoomData));
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
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


}



export function EnglishroomValidator(service: RoomService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    console.log("response=>", control.value);
    return control.value != null ? service.validateRoomNameinEn(control.value)
      .map(response => { return !response.status ? { invalid: true } : null }) : null;
  };
}

export function ArabicroomValidator(service: RoomService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    console.log("response=>", control.value);
    return control.value != null ? service.validateRoomNameinAb(control.value)
      .map(response => { return !response.status ? { invalid: true } : null }) : null;
  };
}
