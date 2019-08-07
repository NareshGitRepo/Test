import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IEmailTosms } from '../_model/emailtosms.model';

@Component({
  selector: 'app-emailtosmsdetails',
  templateUrl: './emailtosmsdetails.component.html',
  styleUrls: ['./emailtosmsdetails.component.scss']
})
export class EmailtosmsdetailsComponent implements OnInit {
  loading:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public _editemailToSmsdata: IEmailTosms,) { }

  ngOnInit() {
  }

}
