import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-userquotadetails',
  templateUrl: './userquotadetails.component.html',
  styleUrls: ['./userquotadetails.component.scss']
})
export class UserquotadetailsComponent implements OnInit {
  userQuotaDetails:any;
  constructor(private dialogRef: MatDialogRef<UserquotadetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    if(this.data != null){
      this.userQuotaDetails = this.data;
    }
  }

}
