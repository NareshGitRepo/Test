import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Component, Inject, OnInit } from '@angular/core';
import { IPrintersData, IkioskResponse, IprinterList, Level } from '../_model/devicesModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DevicesService } from '../_service/deviceService';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss']
})
export class PrintersComponent implements OnInit {
  printerform: FormGroup;
  printersList: IprinterList[];
  orgId: number;
  PrinterData: IPrintersData;
  editData: any;
  _tokenInfo: IUserUpdateDto;
  loading: boolean = false;
  levelInfo: Level[] = [];
  printerNameFlag: boolean;
  printerNameDisableFlag: boolean;

  constructor(private fb: FormBuilder, private _deviceservice: DevicesService, private dialogRef: MatDialogRef<PrintersComponent>,
    @Inject(MAT_DIALOG_DATA) public edit: any, private translate: TranslateService, private alertMessage: AlertMessageService,
    private appConfig: AppConfig, private router: Router) {

    this.getPrinters();
    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    if (edit) {
      this.editData = edit.data;
    }
    this.getLevelsInfo();
  }

  ngOnInit() {
    this.printerform = this.fb.group({
      printId: [0],
      printerName: ['', Validators.compose([Validators.required])],
      // validatePrinterName: [null, [Validators.required], [PrinterValidator(this._deviceservice)]],
      orgId: [this.orgId, Validators.required],
      printerNo: ['', Validators.required],
      destPrinter: [null, Validators.required],
      printerLevel: [null, Validators.required]
    });
    if (this.editData) {
      this.printerNameFlag =true;
      this.getPrinters();
      console.log("PrintersEdit ......" + JSON.stringify(this.editData));
      this.printerform.patchValue(this.editData);
      this.printerform.patchValue({ printerLevel: this.editData.floorId });
      // this.printerform.get("validatePrinterName").clearValidators();
      // this.printerform.get("validatePrinterName").clearAsyncValidators();
      // this.printerform.get("validatePrinterName").updateValueAndValidity();
    }
  }
  levelChange(floorId){
    if (this.editData != null || this.editData != undefined) {
      console.log("printerLevel=>", this.printerform.value.printerLevel, this.editData.floorId);
      if (this.editData.floorId == floorId) {
        this.printerform.patchValue(this.editData);
        this.printerform.patchValue({ printerLevel: this.editData.floorId });
      }
      else {
        this.printerform.get('printerName').setValue(null);
        this.printerform.get('printerNo').setValue(null);
        this.printerform.get('destPrinter').setValue(null);

      }
    }
    else {
      this.printerform.get('printerName').setValue(null)
    }
  }

  printerNameExist() {
    console.log("PrinterLevel" + this.printerform.getRawValue().printerLevel);
      if (this.printerform.getRawValue().printerLevel == null)
      this.alertMessage.showAlert(this.translate.instant('DevicesModule.errorSelectLevel'), ActionType.FAILED);
    else {
      if ((this.editData != null || this.editData != undefined) && (this.printerform.value.printerName as string).trim()== this.editData.printerName && this.printerform.value.printerLevel == this.editData.floorId) {
        this.printerNameFlag = true;
        this.printerNameDisableFlag = false;
      }
      else
        this._deviceservice.validatePrinterName((this.printerform.value.printerName as string).trim(), this.printerform.getRawValue().printerLevel).subscribe((response: IkioskResponse) => {
          if (response.status) {
            this.printerNameFlag = true;
            this.printerNameDisableFlag = false;
          } else {
            this.printerNameFlag = false;
            this.printerNameDisableFlag = true;
          }
        });
    }
  }

  getLevelsInfo() {
    this.loading = true;
    this._deviceservice.getlevelsInfo().subscribe((response) => {
      if (response) {
        console.log("Response==>", response)
        this.levelInfo = response;
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getPrinters() {
    this.loading = true;
    this._deviceservice.getPrinters().subscribe((response: IprinterList[]) => {
      if (response) {
        this.printersList = response;
      } else {
        this.printersList = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  createPrinter() {
    this.loading = true;
    this.PrinterData = {
      destPrinter: this.printerform.value.destPrinter,
      orgId: this.orgId,
      printerName: (this.printerform.value.printerName as string).trim(),
      printerNo: this.printerform.value.printerNo,
      floorId: this.printerform.value.printerLevel
    } as IPrintersData;

    console.log('PrinterData=>' + JSON.stringify(this.PrinterData));
    if (this.printerform.value.printId == 0 || (this.printerform.value.printId == (null || undefined))) {
      this._deviceservice.validatePrinterName((this.printerform.value.printerName as string).trim(), this.printerform.value.printerLevel).subscribe((response: IkioskResponse) => {
        this._deviceservice.createPrinter(this.PrinterData).subscribe(response => {
          if (response.status == true) {
            this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
            this.dialogRef.close("Printers");
          }
          else {
            this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
          }
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
      });
    } else {

      this.PrinterData.printId = this.editData.printId;
      this.PrinterData.status = this.editData.status;
      console.log('PrinterData=>' + JSON.stringify(this.PrinterData));

      this._deviceservice.UpdatePrinter(this.PrinterData).subscribe(response => {
        if (response) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close("Printers");
        }
        else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
        }
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }

}

// export function PrinterValidator(service: DevicesService): AsyncValidatorFn {
//   return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//     console.log("response=>", control.value);
//     return control.value != null ? service.validatePrinterName(control.value)
//       .map(response => { return !response.status ? { invalid: true } : null }) : null;
//   };
// }
