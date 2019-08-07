import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mailserverdetails',
  templateUrl: './mailserverdetails.component.html',
  styleUrls: ['./mailserverdetails.component.scss']
})
export class MailserverdetailsComponent implements OnInit {
  mailserverDetails:any;
  constructor(private dialogRef: MatDialogRef<MailserverdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    if(this.data != null){
      this.mailserverDetails = this.data;
    }
  }

}
