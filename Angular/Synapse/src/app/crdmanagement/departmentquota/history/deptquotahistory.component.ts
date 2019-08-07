import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IHistory } from '../_model/departmentquota.model';

@Component({
  selector: 'app-deptquotahistory',
  templateUrl: './deptquotahistory.component.html',
  styleUrls: ['./deptquotahistory.component.scss']
})
export class DeptquotahistoryComponent implements OnInit {
  gridHistroyForm: FormGroup;
  historyDisplayedColumns: string[] = ['txnDateTime', 'platformCredits','adjustmentType', 'accountType', 'availableBalance','credits', 'expiryDate'];
  historyDetails:IHistory[]=[];
  constructor(private fb :FormBuilder) { }

  ngOnInit() {
    this.gridHistroyForm = this.fb.group({
      fromDate:[''],
      toDate:[''],
      creditsFrom:[''],
      creditsUpto:['']
    });

  }

}
