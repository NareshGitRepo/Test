import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-roomdetails',
  templateUrl: './roomdetails.component.html',
  styleUrls: ['./roomdetails.component.scss']
})
export class RoomdetailsComponent implements OnInit {
  roomList=[];
  constructor(private dialogRef: MatDialogRef<RoomdetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log('data', this.data);
    // this.data= _.chunk(this.data, 5); 

    this.roomList = this.data;
    this.roomList= _.chunk(this.roomList,10);
    console.log(this.roomList);

  }

}
