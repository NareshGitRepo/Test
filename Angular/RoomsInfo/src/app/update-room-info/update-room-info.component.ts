import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Room } from '../get-rooms-by-floor-id/get-rooms-by-floor-id.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface RoomName{
  rname:string;
  value:string;
}

@Component({
  selector: 'app-update-room-info',
  templateUrl: './update-room-info.component.html',
  styleUrls: ['./update-room-info.component.scss']
})
export class UpdateRoomInfoComponent implements OnInit {

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
    public dialogRef: MatDialogRef<UpdateRoomInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:Room, private fb:FormBuilder) {
      this.room_form = this.fb.group({
        allowedToAccess:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(1)]],
        floorId:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(1)]],
        roomNameAb:['', [ Validators.required]],
        roomNameEn:['', [ Validators.required]],
        roomType:['', [ Validators.required]],
      });
      if(data)
      {
        this.room_form.patchValue(data);
        //this.example_form.get('id').setValue(data.empid);  
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
