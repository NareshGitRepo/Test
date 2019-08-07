import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserGet } from '../_model/userquota.model';

@Component({
  selector: 'app-userquotadetails',
  templateUrl: './userquotadetails.component.html',
  styleUrls: ['./userquotadetails.component.scss']
})
export class UserquotadetailsComponent implements OnInit {
  userQuotaDetails:any;
  constructor(private dialogRef: MatDialogRef<UserquotadetailsComponent>, @Inject(MAT_DIALOG_DATA) public editdata:UserGet) { }

  ngOnInit() {
    console.log("EDITDETAILS==>",this.editdata)

    if(this.editdata != null){
      this.userQuotaDetails = this.editdata;
    }
  }

}
