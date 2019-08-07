import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ISmsToEmail } from '../_model/smstoemail.model';

@Component({
  selector: 'app-smstoemaildetails',
  templateUrl: './smstoemaildetails.component.html',
  styleUrls: ['./smstoemaildetails.component.scss']
})
export class SmstoemaildetailsComponent implements OnInit {
  smstoemaildetails: ISmsToEmail
  loading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ISmsToEmail) { }

  ngOnInit() {
    if (this.data != null) {
      this.smstoemaildetails = this.data;
      console.log("smstoemaildetails", this.smstoemaildetails);

    }
  }

}
