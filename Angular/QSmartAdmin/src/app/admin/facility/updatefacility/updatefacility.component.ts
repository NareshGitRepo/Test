import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilityService } from '../_service/facility.service';
import { IFacilityModel, IResponse } from '../_model/facility.model';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { AppConfig } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-updatefacility',
  templateUrl: './updatefacility.component.html',
  styleUrls: ['./updatefacility.component.scss']
})

export class UpdateFacilityComponent implements OnInit {

  facilityForm: FormGroup;
  country: string;
  mobileNumber: string;
  loading: boolean = false;
  constructor(private fb: FormBuilder, private hcservice: FacilityService, private alertMessage: AlertMessageService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public editData: IFacilityModel, private appconfig: AppConfig,
    private dialogRef: MatDialogRef<UpdateFacilityComponent>, private cdrf: ChangeDetectorRef,
    private router: Router,private translate:TranslateService) {
    this.country = this.appconfig.getCountry();
  }

  ngOnInit() {
    // let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.facilityForm = this.fb.group({
      organization: [null,Validators.required],
      address: [null,Validators.required],
      mobileNo: [null,Validators.compose([Validators.required, Validators.minLength(8)])], 
      emailId: [null, [Validators.required, Validators.pattern("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$")]],
      status: [null]
    })

    if (this.editData != null) {
      console.log("this.row.mobileNo: " ,JSON.stringify( this.editData));
      // if (this.editData.mobileNo) {
      //   this.mobileNumber = this.editData.mobileNo.startsWith('+') ? this.editData.mobileNo : '+' + this.editData.mobileNo
      // } else {
      //   this.mobileNumber = this.editData.mobileNo;
      // }
      this.facilityForm.patchValue({
        orgId: this.editData.orgId, organization: this.editData.organization, emailId: this.editData.emailId,
        mobileNo: this.editData.mobileNo,
        address: this.editData.address,
        logoPath: this.editData.logoPath,
         status: this.editData.status
      });
      this.cdrf.detectChanges();
    }
  }

  onSubmit() {
    this.loading = true;
    console.log(this.editData);
    console.log(this.facilityForm.value);
    var formData = this.facilityForm.value;
    console.log("row in onSubmit() :: " + JSON.stringify(this.editData));
    console.log("formData :: " + JSON.stringify(formData));
    for (let key in this.editData) {
      if (formData[key] != undefined) {
        this.editData[key] = formData[key];
      }
    }
    console.log("row in onSubmit() :: " + JSON.stringify(this.editData));
    this.hcservice.updateFacility(this.editData).subscribe((res: IResponse) => {
      if (res.status == true) {
        console.log("res of updateFacility :: " + JSON.stringify(res));
        this.alertMessage.showAlert(res.messages, ActionType.SUCCESS);
        this.dialogRef.close(true);
      } else {
        this.alertMessage.showAlert(res.messages, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR,error.status);
      this.loading = false;
    });
 
  }

  showAlert(error: any, action: ActionType,status:number=0) {
    if(status==401)
    this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}