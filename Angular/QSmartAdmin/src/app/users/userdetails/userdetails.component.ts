import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IGetUser, Doctor } from '../_model/IUsers';
declare var $: any;

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {

  editData: any;
  doctorsData: Doctor[];
  constructor(private dialogRef: MatDialogRef<UserdetailsComponent>, @Inject(MAT_DIALOG_DATA) private data: IGetUser) {
    this.editData = data;
    this.doctorsData = this.editData.doctors;
    console.log(this.doctorsData);
  }

  ngOnInit() {
    console.log("Data==>", this.data);
  }

  close(e) {
    this.dialogRef.close();
    $(e.path).parent().find('.rightdailog').removeClass('rightdailog').addClass('closeRgtdailog');
  }
}
