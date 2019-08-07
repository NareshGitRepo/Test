import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-servicedetails',
  templateUrl: './servicedetails.component.html',
  styleUrls: ['./servicedetails.component.scss']
})
export class ServicedetailsComponent implements OnInit {
  serviceDetails:any;
  constructor(private dialogRef: MatDialogRef<ServicedetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    if(this.data != null){
      this.serviceDetails = this.data;
    }
  }

}
