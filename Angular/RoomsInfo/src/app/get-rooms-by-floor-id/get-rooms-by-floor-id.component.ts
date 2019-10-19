import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { RoomDetailsComponent } from '../room-details/room-details.component';
import { UpdateRoomInfoComponent } from '../update-room-info/update-room-info.component';
import * as _ from 'lodash';
export interface Room {
  allowedToAccess: number;
  floorId: number;
  orgId: number;
  roomId: number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string;
  roomType: number;
  roomTypeDsc: string;
}

export interface UpdateRoom {
  allowedToAccess: number;
  floorId: number;
  roomNameAb: string;
  roomNameEn: string;
  roomType: number;
}

export interface DRoom {
  allowedToAccess: number;
  roomNameAb: string;
  roomNameEn: string;
  roomNumber: string[];
  roomType: number;
}

export interface RootObject {
  floorId: number;
  orgId: number;
  rooms: DRoom[];
}
@Component({
  selector: 'app-get-rooms-by-floor-id',
  templateUrl: './get-rooms-by-floor-id.component.html',
  styleUrls: ['./get-rooms-by-floor-id.component.scss']
})
export class GetRoomsByFloorIdComponent implements OnInit {
  floorId=12;
  loginid=1;
  roomslist:Room[];
  UpdateRoom:object={};
  droom:DRoom[]=[];
  RootObject:any={};
  roomId=[417,425,426,1453,1454,1456,1457];
  SRoom:any=[];

  opensnackbar(message:string, action:string){
    this.snackBar.open(message, action, {
      duration: 1500,
    });
  }
  
  constructor(private mainservice:MainService,private snackBar:MatSnackBar,public dialog: MatDialog) { 
    this.mainservice.getfloorid(this.loginid,this.floorId).subscribe(
      res =>{
        console.log(res);
        this.opensnackbar('Loading Data','Success');
        this.roomslist=res['rooms'];
        console.log('roomlist',this.roomslist);
        
      },
      error =>{
        this.opensnackbar('Unable to Load Data','Failed');
        console.log('error');
       }
      );
  }
  ngOnInit() {
  }
  AddRoom():void{
    const dialogRef = this.dialog.open(RoomDetailsComponent, { width: '600px' });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.mainservice.createRoom(result,this.loginid).subscribe(
        res =>{
          console.log('Add room info',res);
          this.opensnackbar('Create Room Info','Success');
          this.roomslist=res['rooms'];
        },
        error =>{
          this.opensnackbar('Unable to Load Data','Failed');
          console.log('error');
         }
      )
    });
  }
 
  updateRoom(room){
    const dialogRef = this.dialog.open(UpdateRoomInfoComponent, { width: '600px',data:room });

    dialogRef.afterClosed().subscribe(updateresult => {
      console.log('The dialog was closed',updateresult);
        this.UpdateRoom=updateresult;
        console.log('updateroom',this.UpdateRoom);
        
      this.mainservice.updateRoom(this.UpdateRoom,this.loginid).subscribe(
        res =>{
          console.log('update room info',res);
          this.opensnackbar('Update Room Data','Success');
        },
        error =>{
          this.opensnackbar('Unable to Update Data','Failed');
          console.log('error');
         }
      )
    });
  }
 
  SelectRNo(data){
    console.log('selectId',data);
    this.SRoom=_.find(this.roomslist,function(value){
      return value.roomId==data;
    })
    console.log('selected room',this.SRoom);
    this.droom.push({allowedToAccess:this.SRoom.allowedToAccess,roomNameAb:this.SRoom.roomNameAb,
      roomNameEn:this.SRoom.roomNameEn,roomNumber:this.SRoom.roomNumber,roomType:this.SRoom.roomType});
    console.log('droom',this.droom);

    this.RootObject.floorId=this.roomslist[1].floorId;
    this.RootObject.orgId=this.roomslist[2].orgId;
    this.RootObject.rooms=this.droom;
    
    console.log('RootObject',this.RootObject);
    this.mainservice.deleteRoom(this.RootObject,this.loginid).subscribe(res=>{
      console.log('Delete Room',res)
      this.opensnackbar('Delete Room Data','Success');
    },
    error =>{
      this.opensnackbar('Unable to Delete Data','Failed');
      console.log('error');
     }
    )
  }

  
 /* DeleteRNo(value){
     console.log('delete value',value);
     this.roomslist= this.roomslist.filter(data =>data != value);
     console.log('delete rooms',this.roomslist);
     this.mainservice.deleteRoom(this.roomslist).subscribe(
       res =>{
         console.log('delete room',res);
       },
       error =>{
        console.log('error');
        this.opensnackbar('Data Not Delete','Failed');
       }
     )
  } */
  
}
