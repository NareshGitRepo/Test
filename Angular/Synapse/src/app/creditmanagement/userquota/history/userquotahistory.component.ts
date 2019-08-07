import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserGet } from '../_model/userquota.model';

@Component({
  selector: 'app-userquotahistory',
  templateUrl: './userquotahistory.component.html',
  styleUrls: ['./userquotahistory.component.scss']
})
export class UserquotahistoryComponent implements OnInit {

  userQuotaHistory: any;
  constructor(private dialogRef: MatDialogRef<UserquotahistoryComponent>, @Inject(MAT_DIALOG_DATA) public editdata:UserGet) { }

  ngOnInit() {
    this.editdata = this.userQuotaHistory;
  }

}
