import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDepartment } from '../_model/departmentquota.model';

@Component({
  selector: 'app-deptquotadetails',
  templateUrl: './deptquotadetails.component.html',
  styleUrls: ['./deptquotadetails.component.scss']
})
export class DeptquotadetailsComponent implements OnInit {
 
  constructor(private dialogRef: MatDialogRef<DeptquotadetailsComponent>,
     @Inject(MAT_DIALOG_DATA) public departmentQuotaDetails:IDepartment) { }

  ngOnInit() {
   
  }

}
