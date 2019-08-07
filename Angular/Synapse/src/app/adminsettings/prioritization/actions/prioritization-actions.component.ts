import { ActionType, AlertMessageService } from "../../../_services/AlertMessageService";
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { IResponse } from '../_model/prioritizationmodel';
import {PrioritizationService} from "../_services/prioritizationService";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector : 'app-prioritization-actions',
  templateUrl: './prioritization-actions.component.html',
  styleUrls: ['./prioritization-actions.component.scss']
})
export class PrioritizationActionsComponent implements OnInit {
priorityForm :  FormGroup;
loading: boolean = false;

  constructor(private fb: FormBuilder,private _prioritizationService : PrioritizationService,
    private translate: TranslateService,
    private alertMessage: AlertMessageService,private router: Router,private dialogRef: MatDialogRef<PrioritizationActionsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.priorityForm = this.fb.group({
      priorityDesc: ["", [Validators.required]]
    });

    this.priorityForm.patchValue(this.data);
  }
  onSave(){
	  this.loading = true;
    console.log(this.priorityForm.value.priorityDesc);

    if(this.priorityForm.value.priorityDesc!=this.data.priorityDesc){
      let priorityDesc = this.data.priorityDesc;
      this.data.priorityDesc = this.priorityForm.value.priorityDesc;

      console.log('data ',this.data);

      this._prioritizationService.updatePriorityDescription(this.data).subscribe((response:IResponse)=>{


       if(response.status){
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.dialogRef.close(this.data);
        // this.clearControls();
      } else {
        this.data.priorityDesc = priorityDesc;
        this.alertMessage.showAlert(response.message, ActionType.FAILED);
      }
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-onSave==>", JSON.stringify(error));

        this.data.priorityDesc = priorityDesc;

        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });

      //this.dialogRef.close(this.data);
    }else
    {
    this.showAlert(this.translate.instant('PriorityModule.prioritizationAction.priorityUpdated'), ActionType.ALERT);
     this.dialogRef.close();
    this.loading=false;
    }
    }
    showAlert(error: any, action: ActionType, status: number = 0) {
      if (status == 401)
        this.router.navigate(['401']);
      else setTimeout(() => this.alertMessage.showAlert(error, action));
    }

}
