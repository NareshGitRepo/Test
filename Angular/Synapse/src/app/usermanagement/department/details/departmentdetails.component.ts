import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-departmentdetails',
  templateUrl: './departmentdetails.component.html',
  styleUrls: ['./departmentdetails.component.scss']
})
export class DepartmentdetailsComponent implements OnInit {
  departmentDetails:any;
  constructor(private dialogRef: MatDialogRef<DepartmentdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    if(this.data != null){
      this.departmentDetails = this.data;
    }
  }

}
