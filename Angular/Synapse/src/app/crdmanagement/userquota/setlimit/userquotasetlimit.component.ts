import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IUserQuota} from '../_model/userquota.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserQuotaService } from '../_service/userquota.service';
@Component({
  selector: 'app-userquotasetlimit',
  templateUrl: './userquotasetlimit.component.html',
  styleUrls: ['./userquotasetlimit.component.scss']
})
export class UserquotasetlimitComponent implements OnInit {
  action: string = "Set";
  userQuotaSetlimitForm: FormGroup;
  loading:boolean = false;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UserquotasetlimitComponent>, @Inject(MAT_DIALOG_DATA) public userquotadata: IUserQuota) { }

  ngOnInit() {
    this.userQuotaSetlimitForm = this.fb.group({
      department: [null, Validators.required],
      userName: [null, Validators.required],
      accountType: [null, Validators.required],
      availableBalance: [null, Validators.required],
      adjustmentType: [null, Validators.required],
      credits: [null, Validators.required],
      currentThresholdLimit: [null, Validators.required],
      platformCredits:[],
      departmentCredit:[],
      expiryDate:[null, Validators.required],
    });
    if(this.userquotadata != null){
      this.userQuotaSetlimitForm.patchValue(this.userquotadata); 
      this.action = "Update";
    }
  }

}
