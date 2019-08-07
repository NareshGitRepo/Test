import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { ErrorStateMatcher, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-deptquotasetlimit',
  templateUrl: './deptquotasetlimit.component.html',
  styleUrls: ['./deptquotasetlimit.component.scss']
})
export class DeptquotasetlimitComponent implements OnInit {

  deptQuotaSetlimitForm: FormGroup;
  selectedCreditType = "prepaid";
  prepaidFlag: boolean = false;
  postPaidFlag: boolean = false;
  loading: boolean = false;
  today = new Date();
  add = "Set";
  constructor(private fb: FormBuilder, private Snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<DeptquotasetlimitComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any, private alertMessage: AlertMessageService,
     private translate: TranslateService,
    private router: Router) { }

  ngOnInit() {
    this.deptQuotaSetlimitForm = this.fb.group({
      platformCredits:['',Validators.required],
      department: ['',Validators.required],
      accountType: ['', Validators.required],
      currentThresholdLimit:['',Validators.required],
      availableBalance: ['', Validators.required],
      adjustmentType: ['', Validators.required],
      credits: ['', Validators.required],
     expiryDate:['',Validators.required],

    });

    if(this.editData != null){
      this.add = "Update";
      this.deptQuotaSetlimitForm.patchValue(this.editData);
    }
  }

 
  
}
