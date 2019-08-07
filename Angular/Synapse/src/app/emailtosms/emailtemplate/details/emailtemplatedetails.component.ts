import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IGEmailCreate } from '../_model/emailtemplate.model';
@Component({
  selector: 'app-emailtemplatedetails',
  templateUrl: './emailtemplatedetails.component.html',
  styleUrls: ['./emailtemplatedetails.component.scss']
})
export class EmailTemplateDetailsComponent implements OnInit {

  loading: boolean = false;
  emailTemplateDetails: any;

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<EmailTemplateDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGEmailCreate) { }

  ngOnInit() {
    console.log("emailTemplateDetails==>", this.data);
    if (this.data != null) {
      this.emailTemplateDetails = this.data;
    }
  }
}
