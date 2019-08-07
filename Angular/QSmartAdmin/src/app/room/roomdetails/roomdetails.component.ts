import * as _ from 'lodash';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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

    this.roomList = this.data.roomListData.rooms;
    this.roomList= _.chunk(this.roomList,10);
    console.log(this.roomList);

  }

}
