import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';
import { OnlineAlert } from '../_model/onlinealerts.model';

@Component({
  selector: 'app-onlinealertdetails',
  templateUrl: './onlinealertdetails.component.html',
  styleUrls: ['./onlinealertdetails.component.scss']
})
export class OnlinealertdetailsComponent implements OnInit {

  alerttDetails:OnlineAlert;
  constructor(private dialogRef: MatDialogRef<OnlinealertdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:OnlineAlert) { }

    ngOnInit() {
      if(this.data != null){
        this.alerttDetails = this.data;
      }
    }

}
