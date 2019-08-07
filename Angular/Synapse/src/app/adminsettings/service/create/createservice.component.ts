import { ActionType, AlertMessageService } from "../../../_services/AlertMessageService";
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IMsgCategory, IPriority, IResponse } from '../_model/servicemanagement.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { AppConfig } from "../../../_helpers/app.config";
import { Router } from "@angular/router";
import { ServiceManagementService } from '../_service/servicemanagement.service';
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

@Component({
  selector: 'app-createservice',
  templateUrl: './createservice.component.html',
  styleUrls: ['./createservice.component.scss']
})
export class CreateServiceComponent implements OnInit {

  servicesForm: FormGroup;
  public useStatus = false;
  loading: boolean = false;
  categories: IMsgCategory[] = [];
  priorities: IPriority[] = [];
  showPriorities: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateServiceComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private Snackbar: MatSnackBar,
    private serMgtService: ServiceManagementService,
    private translate: TranslateService, private appconfig: AppConfig, private alertMessage: AlertMessageService, private router: Router) { }

  ngOnInit() {
    this.servicesForm = this.fb.group({
      serviceName: [null, Validators.required],
      //validateServiceName: [null, [Validators.required], [ServiceValidator(this.serMgtService)]],
      validateServiceName: [this.data != null ? this.data.serviceName : null, [Validators.required], [ServiceValidator(this.serMgtService, this.data != null ? this.data.serviceName : '', this.data != null ? true : false)]],
      serviceCode: [null, Validators.required],
      categoryId: [null, Validators.required],
      priorityId: [null, Validators.required],
      messageType: [''],
      status: [true],
      templateId: [null]
    });
    console.log("Countries list::::", this.categories);
    if (this.data != null) {
      this.servicesForm.patchValue(this.data);
      // this.servicesForm.get('validateServiceName').clearValidators();
      // this.servicesForm.get('validateServiceName').clearAsyncValidators();
      // this.servicesForm.get('validateServiceName').updateValueAndValidity();
      console.log("Data:::::", this.data);
    }
    this.getCategories();
  }
  getCategories() {
    this.loading = true;
    this.serMgtService.getMsgCategories().subscribe((result: IMsgCategory[]) => {
      if (result != undefined){
        this.categories = result;
      if (this.data != null) {
        this.servicesForm.get('categoryId').setValue(this.data.msgCategory.categoryId);
        this.categories.filter((item) => {
          if (item.categoryId == this.data.msgCategory.categoryId) {
            this.priorities = item.msgPriorities;
            console.log("Priorities:::::", this.priorities)
          }
        });
        this.servicesForm.get('priorityId').setValue(this.data.msgPriorityInfo.priorityId);
        this.showPriorities = true;
      }
    }
    this.loading = false;
    },error=>{
      const message = error.error.messages as string;
          const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error('E-getMsgCategories==>', JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
    });
  }
  selectCategory(categoryid, createMode) {
    this.priorities = [];
    this.servicesForm.get('priorityId').setValue(null);
    this.servicesForm.get('serviceCode').setValue(null);
    if (this.servicesForm.value.serviceName != null) {
      console.log('this.categories ', this.categories);
      this.categories.filter((item) => {
        if (item.categoryId == categoryid) {
          this.priorities = item.msgPriorities;
          console.log("Priorities:::::", this.priorities)
        }
      });
      this.showPriorities = true;
    }
    else {
      this.servicesForm.get('categoryId').setValue(null);

      this.showAlert('Please Enter Service Name', ActionType.ERROR);
    }
  }
  ServiceNameChange() {
    if (this.data != null) {
      this.selectPriority();
    }
    else {
      this.servicesForm.get('categoryId').setValue(null);
      this.servicesForm.get('priorityId').setValue(null);
      this.servicesForm.get('serviceCode').setValue(null);
      this.priorities = [];
    }
  }

  selectPriority() {
    let sericeCode = (this.servicesForm.value.serviceName.substring(0, 3)) as string;
    let category = this.categories.filter(x => x.categoryId == this.servicesForm.value.categoryId)[0].categoryCode;
    let priorityId = (this.servicesForm.value.priorityId) as string;
    priorityId = (priorityId + '').length == 1 ? '00' + priorityId : ((priorityId + '').length == 2 ? '0' + priorityId : priorityId);
    this.servicesForm.get('serviceCode').setValue(sericeCode.toLocaleUpperCase() + '_' + category + '_' + priorityId);
  }

  openSnackbar(message: string, action: string) {
    this.Snackbar.open(message, action, {
      duration: 2000
    });
  }

  createService() {
    this.loading = true;
    if (this.data == null) {
      let serviceData = {
        "msgCategory": {
          "categoryId": this.servicesForm.value.categoryId
        },
        "msgPriorityInfo": {
          "priorityId": this.servicesForm.value.priorityId
        },
        "serviceCode": this.servicesForm.value.serviceCode,
        "serviceName": this.servicesForm.value.serviceName
      };
      this.serMgtService.createServiceInfo(serviceData).subscribe((response: IResponse) => {
        if ((response as any).status) {
          console.log('Response =>', JSON.stringify(response));
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(true);
          this.clearControls();
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      },
        error => {
          const message = error.error.messages as string;
          const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error('E-createService==>', JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    } else {
      console.log("data ", this.data);
      this.data.templateId = this.servicesForm.value.templateId;
      this.data.serviceName = this.servicesForm.value.serviceName;
      this.data.serviceCode = this.servicesForm.value.serviceCode;
      this.data.msgCategory.categoryId = this.servicesForm.value.categoryId;
      this.data.msgPriorityInfo.priorityId = this.servicesForm.value.priorityId;
      console.log("Modified data ", this.data);
      this.serMgtService.updateServiceInfo(this.data).subscribe((response: IResponse) => {
        if ((response as any).status) {
          console.log('Response =>', JSON.stringify(response));
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(true);
          this.clearControls();
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      },
        error => {
          const message = error.error.messages as string;
          const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error('E-createService==>', JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    }
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  clearControls() {
    this.servicesForm.get('serviceName').setValue('');
    this.servicesForm.get('serviceCode').setValue('');
    this.servicesForm.get('categoryId').setValue('');
    this.servicesForm.get('priorityId').setValue('');
  }
}

export function ServiceValidator(service: ServiceManagementService, name: string, action?: boolean): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (action && name == (control.value as string).trim())
      return control.value != null ? service.validateServiceName1()
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }) : null;
    else
      return control.value != null ? service.validateServiceName((control.value as string).trim())
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }) : null;
  };
}