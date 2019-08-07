import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-smstemplatedetails',
  templateUrl: './smstemplatedetails.component.html',
  styleUrls: ['./smstemplatedetails.component.scss']
})
export class SmsTempaltedetailsComponent implements OnInit {
  departmentDetails:any;
  constructor(private dialogRef: MatDialogRef<SmsTempaltedetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    console.log("DETAILS==>",this.data)

    if(this.data != null){
      this.departmentDetails = this.data;
    }
  }

}
