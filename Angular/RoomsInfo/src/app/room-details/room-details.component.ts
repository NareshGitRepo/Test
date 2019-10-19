import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Room} from '../get-rooms-by-floor-id/get-rooms-by-floor-id.component';

export interface RoomName{
  rname:string;
  value:string;
}

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss']
})
export class RoomDetailsComponent implements OnInit {
  room_form:FormGroup;
  roomname: RoomName[] = [
    {rname: 'Pharmacy station', value:'Pharamacy Station'},
    {rname: 'Examine room', value:'Examine Room'},
    {rname: 'Doctor room', value:'Doctor Room'},
    {rname: 'Lab room', value:'Lab Room'},
    {rname: 'Nurse station', value:'Nurse Station'}
  ];

  roomnameEN: RoomName[] = [
    {rname: 'Pharmacy station', value:'Pharamacy Station'},
    {rname: 'Examine room', value:'Examine Room'},
    {rname: 'Doctor room', value:'Doctor Room'},
    {rname: 'Lab room', value:'Lab Room'},
    {rname: 'Nurse station', value:'Nurse Station'}
  ];
  constructor(
    public dialogRef: MatDialogRef<RoomDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:Room, private fb:FormBuilder) {
      this.room_form = this.fb.group({
        allowedToAccess:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(1)]],
        floorId:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(1)]],
        orgId:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(2)]],
        roomId:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(1)]],
        roomNameAb:['', [ Validators.required]],
        roomNameEn:['', [ Validators.required]],
        roomNumber:['', [ Validators.required]],
        roomType:['', [ Validators.required]],
        roomTypeDsc:['',[Validators.required,Validators.pattern('[a-zA-Z ]+$')]]
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
    
  }

  ngOnInit() {
  }

}
