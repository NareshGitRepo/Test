import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomersData } from '../../_model/segement-manage.model';

@Component({
  selector: 'app-customerdetails',
  templateUrl: './customerdetails.component.html',
  styleUrls: ['./customerdetails.component.scss']
})
export class CustomerdetailsComponent implements OnInit {
customerDetails: CustomersData;
channels="";


  constructor(private dialogRef: MatDialogRef<CustomerdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:CustomersData) { }

  ngOnInit() {
    if(this.data != null){
      this.customerDetails = this.data;
      if(this.data.smsChannel==1){
        this.channels+="sms";
        }
      else if(this.data.pushChannel==2){
        this.channels+="push";
      }else if(this.data.emailChannel==3)
      this.channels+="email";
    }
  }

}
