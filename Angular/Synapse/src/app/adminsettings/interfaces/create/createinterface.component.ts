import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IInterfaceRes, InterfaceInfo } from '../_model/interfaces.model';
import { InterfacesService } from '../_service/interfaces.service';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-createinterface',
  templateUrl: './createinterface.component.html',
  styleUrls: ['./createinterface.component.scss']
})
export class CreateinterfaceComponent implements OnInit {

  interfacesForm: FormGroup;
  public useStatus = false;
  IInterfacedata: InterfaceInfo;
  loading: boolean = false;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateinterfaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterfaceInfo, private router: Router,
    private translate: TranslateService, private alertmessage: AlertMessageService, public Interfaceservice: InterfacesService) { }

  ngOnInit() {
    console.log("data=>", this.data);
    this.interfacesForm = this.fb.group({
      interfaceCode: [''],
      interfaceName: ['', Validators.required],
      interfaceDesc: ['', Validators.required],
      validateInterfaceName: [null, [Validators.required], [InterfaceValidator(this.Interfaceservice)]],
      // interfaceStatus:[true,Validators.required]
    });
    if (this.data != null) {
      this.interfacesForm.patchValue(this.data);
      this.interfacesForm.get('validateInterfaceName').clearValidators();
      this.interfacesForm.get('validateInterfaceName').clearAsyncValidators();
      this.interfacesForm.get('validateInterfaceName').updateValueAndValidity();
    }
  }

  createInterface() {
    this.loading = true;
    if (!this.data) {
      this.IInterfacedata = {
        interfaceCode: (this.interfacesForm.value.interfaceCode).trim(),
        interfaceName: (this.interfacesForm.value.interfaceName as string),
        interfaceDesc: (this.interfacesForm.value.interfaceDesc as string)
      }
      this.Interfaceservice.validateInterfaceName((this.interfacesForm.value.interfaceName as string).trim()).subscribe((response: IInterfaceRes) => {
        this.Interfaceservice.createInterface(this.IInterfacedata).subscribe((response: IInterfaceRes) => {
          if (response) {
            this.alertmessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(this.IInterfacedata);
          } else {
            this.alertmessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createInterface==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
      });
    }
    else {
      this.IInterfacedata = {
        interfaceCode: (this.interfacesForm.value.interfaceCode).trim(),
        interfaceName: (this.interfacesForm.value.interfaceName as string),
        interfaceDesc: (this.interfacesForm.value.interfaceDesc as string),
        interfaceId: this.data.interfaceId,
        status: this.data.status
      }
      this.Interfaceservice.UpdateInterface(this.IInterfacedata).subscribe((response: IInterfaceRes) => {
        if (response) {
          this.alertmessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.IInterfacedata);
        } else {
          this.alertmessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createInterface==>", JSON.stringify(error));
        this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertmessage.showAlert(error, action));
  }

  // createInterface() {
  //   if (!this.data) {
  //     this.IInterfacedata = {
  //       interfaceCode: (this.interfacesForm.value.interfaceCode).trim(),
  //       interfaceName: (this.interfacesForm.value.interfaceName as string),
  //       interfaceDesc: (this.interfacesForm.value.interfaceDesc as string)
  //     }
  //     this.Interfaceservice.createInterface(this.IInterfacedata).subscribe((response: IInterfaceRes) => {
  //       if (response) {
  //         this.alertmessage.showAlert(response.message, ActionType.SUCCESS);
  //         this.dialogRef.close(this.IInterfacedata);
  //       } else {
  //         this.alertmessage.showAlert(response.message, ActionType.FAILED);

  //       }
  //     })
  //   }
  //   else {
  //     this.IInterfacedata = {
  //       interfaceCode: (this.interfacesForm.value.interfaceCode).trim(),
  //       interfaceName: (this.interfacesForm.value.interfaceName as string),
  //       interfaceDesc: (this.interfacesForm.value.interfaceDesc as string),
  //       interfaceId: this.data.interfaceId,
  //       status: this.data.status
  //     }
  //     this.Interfaceservice.UpdateInterface(this.IInterfacedata).subscribe((response: IInterfaceRes) => {
  //       if (response) {
  //         this.alertmessage.showAlert(response.message, ActionType.SUCCESS);
  //         this.dialogRef.close(this.IInterfacedata);
  //       } else {
  //         this.alertmessage.showAlert(response.message, ActionType.FAILED);

  //       }
  //     }, error => {
  //       let message = error.error.messages as string
  //       let errorMessage = error.status == 404 ? "Failed for you request" : message ? message : error.message;
  //       console.log("Failed :: ", JSON.stringify(error));
  //       this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);

  //     });

  //   }
  // }
}

export function InterfaceValidator(service: InterfacesService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateInterfaceName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}