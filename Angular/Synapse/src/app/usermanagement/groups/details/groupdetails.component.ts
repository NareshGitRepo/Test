import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../_model/groupmanagement.model';
declare var $: any; 
@Component({
  selector: 'app-groupdetails',
  templateUrl: './groupdetails.component.html',
  styleUrls: ['./groupdetails.component.scss']
})
export class GroupdetailsComponent implements OnInit {
  groupDetails: any;
  userData : User[] =[];
  constructor(private dialogRef: MatDialogRef<GroupdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data != null) {
      this.groupDetails = this.data;
    }
  }

  ngOnInit() {
    console.log("Details==>", this.groupDetails.users);
    this.userData = this.groupDetails.users;
  }
  close(e) {
    this.dialogRef.close();
    $(e.path).parent().find('.rightdailog').removeClass('rightdailog').addClass('closeRgtdailog');
  }
}
