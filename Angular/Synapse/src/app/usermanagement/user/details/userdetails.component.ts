import { Component, OnInit, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { ILoginDto, IUser } from '../_model/usermodel';
declare var $: any;

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {
  apiKeyHide:boolean;
  constructor(
    private dialogRef: MatDialogRef<UserdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser) {
      console.log("User Details==>",data)
  }

  ngOnInit() {
  }

  close(e) {
    this.dialogRef.close();
    $(e.path).parent().find('.rightdailog').removeClass('rightdailog').addClass('closeRgtdailog');
  }
}