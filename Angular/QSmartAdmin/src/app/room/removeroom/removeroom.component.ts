import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import * as _ from 'lodash';
import { element } from '@angular/core/src/render3/instructions';
import { UserAlertComponent } from '../../users/_model/userAlert';
import { AlertMessageService, ActionType, AlertType } from '../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { RoomService } from '../_service/roomService';
import { IRoomManagementList, IDeleteData, IDeleteRoom } from '../_model/roomModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-removeroom',
  templateUrl: './removeroom.component.html',
  styleUrls: ['./removeroom.component.scss']
})
export class RemoveroomComponent implements OnInit {
  delform: FormGroup;
  roomList: IRoomManagementList[] = [];
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<RemoveroomComponent>, private translate: TranslateService, @Inject(MAT_DIALOG_DATA) public data: IRoomManagementList[], public dialog: MatDialog
    , private alertMessage: AlertMessageService, private RoomService: RoomService) { }

  ngOnInit() {
    this.delform = this.fb.group({
      roomdel: [null, Validators.required]
    });
    console.log('data', this.data);
    // this.data= _.chunk(this.data, 5); 

    this.roomList = this.data;
    // this.roomList= _.chunk(this.roomList,10);
    // console.log(this.roomList);

  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '250px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  // Displayrooms(deleteroom:any[]){
  //   console.log("deleted",deleteroom);
  // if(deleteroom.length>0){
  //   deleteroom.forEach(element=>{
  //     let obj=_.filter(this.roomList,function(n){ return n.roomNumber===element})
  //     console.log("obj",obj);
  // this.deletedata.push(obj);
  //   })
  // }

  // }
  remove() {
    if (this.delform.value.roomdel != null && this.roomList.length > 0) {
      let selectedRooms = (this.delform.value.roomdel) as number[];
      let roomNumber = [];
      this.roomList.filter(x => selectedRooms.findIndex(y => y == x.roomId) != -1).forEach(z => {
        roomNumber.push(z.roomNumber);
      });
      let deleteRoom = {
        roomNameAb: this.roomList[0].roomNameAb,
        roomNameEn: this.roomList[0].roomNameEn,
        roomNumber: roomNumber,
        roomType: this.roomList[0].roomType
      } as IDeleteRoom;
      let deleteRoomList: IDeleteRoom[] = [];
      deleteRoomList.push(deleteRoom);
      let deleteData = {
        floorId: this.roomList[0].floorId,
        orgId: this.roomList[0].orgId,
        rooms: deleteRoomList
      } as IDeleteData;
      console.log("removeroom", this.delform.value.roomdel, JSON.stringify( deleteData));
      this.RoomService.deleteRooms(deleteData)
        .subscribe(responce => {
          if (responce.status) {
            this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);
            this.dialogRef.close(selectedRooms);
          } else {
            this.alertMessage.showAlert(responce.messages, ActionType.FAILED, AlertType.ERROR);
          }
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        });
    }
  }

  deleteRoom() {

    //  const dialogRef = this.dialog.open(UserAlertComponent, this.getStatusConfig(this.deletedata));
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.RoomService.deleteRooms(this.deletedata)
    //         .subscribe(responce => {
    //           if (responce.status) {
    //             this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);
    //             this.getUserInfo();
    //           } else {
    //             this.alertMessage.showAlert(responce.messages, ActionType.FAILED, AlertType.ERROR);
    //           }
    //         }, error => {
    //           let message = error.error.messages as string
    //           let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
    //           console.log("Failed :: ", JSON.stringify(error));
    //           this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
    //         });
    //     }
    //   });
  }

}

