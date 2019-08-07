import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Group, User } from '../_model/groupmanagement.model';
declare var $: any;

@Component({
  selector: 'app-groupusers',
  templateUrl: './groupusers.component.html',
  styleUrls: ['./groupusers.component.scss']
})
export class GroupusersComponent implements OnInit {
  groupDetails: User[];
  constructor(private dialogRef: MatDialogRef<GroupusersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group) {
    if (this.data != null) {
      this.groupDetails = this.data.users;
    }
  }

  ngOnInit() {
    console.log("GroupUsers==>", this.groupDetails)
  }

  close(e) {
    this.dialogRef.close();
    $(e.path).parent().find('.rightdailog').removeClass('rightdailog').addClass('closeRgtdailog');
  }
}