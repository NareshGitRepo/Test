import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Filterkeyword } from '../_model/filterkey.model';

@Component({
  selector: 'app-filterkeydetails',
  templateUrl: './filterkeydetails.component.html',
  styleUrls: ['./filterkeydetails.component.scss']
})
export class FilterkeydetailsComponent implements OnInit {
  FilterkeyDetails:Filterkeyword;
  constructor(private dialogRef: MatDialogRef<FilterkeydetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:Filterkeyword) { }

  ngOnInit() {
    if(this.data != null){
      this.FilterkeyDetails = this.data;
    }
  }

}
