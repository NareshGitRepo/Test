import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogConfig, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ICreateProfile } from '../_model/onlinealerts.model';

@Component({
  selector: 'app-profiledetails',
  templateUrl: './profiledetails.component.html',
  styleUrls: ['./profiledetails.component.scss']
})
export class ProfiledetailsComponent implements OnInit {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<ProfiledetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICreateProfile) { }
    profiletDetails:any;
  ngOnInit() {
    console.log("DETAILS==>",this.data);
    
    if (this.data != null) {
      this.profiletDetails = this.data;
    }
  }
}
