import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit } from '@angular/core';
import { HospitalCollection, HospitalDropDown, HospitalList, IGroupResponse } from '../_model/group.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { GroupService } from '../_service/group.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrls: ['./creategroup.component.scss']
})

export class CreateGroupComponent implements OnInit {
  hosp = [];
  loading: boolean = false;
  groupForm: FormGroup;
  hospitalslist = [];
  selectedhosp: HospitalList[];
  pageTitle: any = "Create Group";
  orgName: string;
  orgId: number;
  confirmed = [];
  target = [];
  _tokenInfo: IUserUpdateDto;
  source = [];
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public row: any,
    private dialogRef: MatDialogRef<CreateGroupComponent>, private alertMessage: AlertMessageService, private appConfig: AppConfig,
    private fb: FormBuilder, private groupservice: GroupService,private translate:TranslateService,private router:Router) { }

  ngOnInit() {

    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;

    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgName = this._tokenInfo.orgName;
      this.orgId = this._tokenInfo.orgId;
    }
    this.groupForm = this.fb.group({
      orgId: [''],
      organization: ['', [Validators.required, Validators.minLength(5)],[this.appConfig.UserMinValidator(5)]],
      validateNodalName: [null, [Validators.required], [NodalnameValidator(this.groupservice)]],
      parentId: [this.orgName],
      facilities: ['']
    });
    if (this.row != null) {
      console.log("row value=>", this.row);
      this.pageTitle = "Edit Group";
      this.groupForm.get("validateNodalName").clearValidators();
      this.groupForm.get("validateNodalName").clearAsyncValidators();
      this.groupForm.get("validateNodalName").updateValueAndValidity();
      this.loading = true;
      this.groupservice.getFacilitiesByGroupId(this.row.orgId).subscribe(response => {
        console.log("response of hospitals::::::=>", response);
        this.selectedhosp = response.hospitals;
        this.selectedhosp.forEach(data => {
          this.hosp.push(data.orgId);

        });
        this.row.facilities = this.hosp;
        this.groupForm.patchValue(this.row);
        this.loading = false;
      }, err => {
        this.alertMessage.showAlert(err.message, ActionType.FAILED);
        this.loading = false;
      });

    }
    this.loading = true;
    this.groupservice.getFacilitiesByClientId().subscribe((result: HospitalDropDown) => {
      console.log("result:::", result);
      this.hospitalslist = result.hospitals;
      console.log("Hospitals=>", this.hospitalslist);
      this.loading = false;
    }, err => {
      this.alertMessage.showAlert(err.message, ActionType.FAILED);
      this.loading = false;
    });
  }

  onSubmit() {
    this.loading = true;
    let hospitalsCollection: HospitalCollection[] = [];
    this.groupForm.value.facilities.forEach(data => {
      console.log("Hospitals=>", data);
      let hospitaldata = this.hospitalslist.filter(xdata => xdata.orgId == data);
      if (hospitaldata.length > 0) {
        hospitaldata.forEach(ydata => {
          hospitalsCollection.push({ orgId: ydata.orgId, organization: ydata.organization });
        })
      }
    });

    if (this.groupForm.value.orgId == 0 || this.groupForm.value.orgId == (null || undefined)) {
      console.log("Hospitals=>", this.groupForm.value.hospitals);
      let groupcreate = {
        facilities: hospitalsCollection,
        organization: this.groupForm.value.organization,
        parentId: this.orgId
      }

      this.groupservice.createGroup(groupcreate).subscribe((response: IGroupResponse) => {
        console.log("Group Response for Create", response);
        if (response.status == true) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(response);
        }else{
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
          this.dialogRef.close(response);
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
    else {
      let groupupdate = {
        facilities: hospitalsCollection,
        organization: this.groupForm.value.organization,
        parentId: this.orgId,
        orgId: this.row.orgId,
        status: this.row.status
      }
      this.groupservice.updateGroup(groupupdate).subscribe((response:IGroupResponse) => {
        this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
        this.dialogRef.close(response);
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR,error.status);
        this.loading = false;
      });
    }
  }


  showAlert(error: any, action: ActionType,status:number=0) {
    if(status==401)
    this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

}

export function NodalnameValidator(service: GroupService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    console.log("response=>", control.value);
    return control.value != null ? service.validateGroupName(control.value)
      .map(response => { return !response.status ? { invalid: true } : null }) : null;
  };

}
