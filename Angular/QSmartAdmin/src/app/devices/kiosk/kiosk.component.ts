import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Component, Inject, OnInit } from '@angular/core';
import { ICreateKiosk, IMenu, IkioskResponse, IprinterList, Level } from '../_model/devicesModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DevicesService } from '../_service/deviceService';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-kiosk',
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.scss']
})
export class KioskComponent implements OnInit {
  kioskform: FormGroup;
  menuItems: any;
  orgId: number;
  KioskData: ICreateKiosk;
  editData: any
  destinationPrintersList: IprinterList[];
  _tokenInfo: IUserUpdateDto;
  saveRolling: boolean = false;
  loading: boolean = false;
  levelInfo: Level[] = [];
  kioskNameFlag: boolean;
  kioskNameDisableFlag: boolean;


  constructor(private fb: FormBuilder, private _deviceservice: DevicesService, private dialogRef: MatDialogRef<KioskComponent>,
    @Inject(MAT_DIALOG_DATA) public edit: any, private translate: TranslateService, private alertMessage: AlertMessageService
    , private appConfig: AppConfig, private router: Router) {
    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    if (edit) {
      this.editData = edit.data;
    }
    // this.getDestinationPrinters();
    console.log(JSON.stringify(this.destinationPrintersList), this.editData);
    this.getLevelsInfo();
  }



  ngOnInit() {
    let emailregex: RegExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
    this.kioskform = this.fb.group({
      kioskId: [""],
      kioskName: [null, Validators.compose([Validators.required])],
      validateKioskIp: [null],
      orgId: [this.orgId, Validators.required],
      kioskIp: [null,],
      kioskMenuCollection: this.fb.array([], Validators.required),
      destPrinter: [null, Validators.required],
      kioskLevel: [null, Validators.required]
    });
    this.getMenus();

    if (this.editData) {
      console.log("Edit : " + JSON.stringify(this.editData));
      this.loading = true;
      this.kioskNameFlag = true;
      this.kioskform.patchValue(this.editData);
      this.kioskform.patchValue({ kioskLevel: this.editData.floorId });
      this._deviceservice.getPrintersByDest().subscribe((response: IprinterList[]) => {
        if (response) {
          this.destinationPrintersList = response;
          console.log(' this.destinationPrintersList=>', this.destinationPrintersList);
        }
        else
          this.destinationPrintersList = [];

        let printName = '';
        if (this.editData.printerName == '1' || this.editData.printerName == '0') {
          let printIndex = this.destinationPrintersList.findIndex(data => data.printId + "" == this.editData.printerName);
          if (printIndex > -1) {
            printName = this.destinationPrintersList[printIndex].destPrinter;
          }
        }
        else {
          printName = this.editData.printerName;
        }

        // this.kioskform.patchValue(this.editData);
        this.kioskform.patchValue({ destPrinter: printName });

        this.loading = false;

      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
      console.log(this.editData.kioskMenuCollection)
      this.kioskform.get('validateKioskIp').clearValidators();
      this.kioskform.get('validateKioskIp').clearAsyncValidators();
      this.kioskform.get('validateKioskIp').updateValueAndValidity();
      const menus = this.kioskform.controls.kioskMenuCollection as FormArray;
    }
    else {
      this.getDestinationPrinters();
    }
  }

  levelChange(floorId) {
    if (this.editData != null || this.editData != undefined) {


      const menus = this.kioskform.controls.kioskMenuCollection as FormArray;
      let value = menus.length;
      while (value) {
        value--;
        menus.removeAt(value);
      }
      console.log("editData=>", this.editData, menus.length);
      if (this.editData.floorId == floorId) {
        // this.kioskform.get('kioskName').setValue(this.editData.kioskName);
        this.kioskform.patchValue(this.editData);
        let printName = '';
        if (this.editData.printerName == '1' || this.editData.printerName == '0') {
          let printIndex = this.destinationPrintersList.findIndex(data => data.printId + "" == this.editData.printerName);
          if (printIndex > -1) {
            printName = this.destinationPrintersList[printIndex].destPrinter;
          }
        }
        else {
          printName = this.editData.printerName;
        }
        this.kioskform.patchValue({ destPrinter: printName });





        this.editData.kioskMenuCollection.forEach(kiosk => {
          console.log(' this.menuItems=>', this.menuItems);
          this.menuItems.forEach(value => {
            if (kiosk.typeId == value.typeId) {
              console.log(value.typeId)
              value.checked = true;
              menus.push(this.fb.group({ typeId: value.typeId }));
            } else {
              if (!value.checked) {
                value.checked = false;
              }
            }
          });
        });
      }
      else {
        this.kioskform.get('kioskName').setValue(null);
        this.kioskform.get('kioskIp').setValue(null);

        console.log(' this.menuItems=>', this.menuItems);
        this.menuItems.forEach(kiosk => {
          if (kiosk.typeId == 1 || kiosk.typeId == 2) {
            kiosk.checked = true;
            menus.push(this.fb.group({ typeId: kiosk.typeId }));
          }
          else
          kiosk.checked = false;
        });
        let indx = this.destinationPrintersList.findIndex(x => x.printId == 1);
        if (indx != -1)
          this.kioskform.get('destPrinter').setValue(this.destinationPrintersList[indx].destPrinter);
        else
          this.kioskform.get('destPrinter').setValue(null);
      }
    }
    else {
      this.kioskform.get('kioskName').setValue(null)
    }
  }


  kioskNameExist() {
    console.log("this.kioskform.getRawValue().kioskLevel:" + this.kioskform.getRawValue().kioskLevel);
    if (this.kioskform.getRawValue().kioskLevel == null)
      this.alertMessage.showAlert(this.translate.instant('DevicesModule.errorSelectLevel'), ActionType.FAILED);
    else {
      if ((this.editData != null || this.editData != undefined) && (this.kioskform.value.kioskName as string).trim() == this.editData.kioskName && this.kioskform.value.kioskLevel == this.editData.floorId) {
        this.kioskNameFlag = true;
        this.kioskNameDisableFlag = false;
      }
      else
        this._deviceservice.validateKioskName((this.kioskform.value.kioskName as string).trim(), this.kioskform.getRawValue().kioskLevel).subscribe((response: IkioskResponse) => {
          if (response.status) {
            this.kioskNameFlag = true;
            this.kioskNameDisableFlag = false;
          } else {
            this.kioskNameFlag = false;
            this.kioskNameDisableFlag = true;
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

  getMenus() {
    this.loading = true;
    const menus = this.kioskform.controls.kioskMenuCollection as FormArray;
    this._deviceservice.getAllMenus().subscribe((response: IMenu) => {
      if (response) {
        response[0].destPrinter = "No printer selectd";
        this.menuItems = response;
        if (!this.editData) {
          this.menuItems.forEach(kiosk => {
            if (kiosk.typeId == 1 || kiosk.typeId == 2) {
              kiosk.checked = true;
              menus.push(this.fb.group({ typeId: kiosk.typeId }));
            }
          });
        }
        else {
          this.editData.kioskMenuCollection.forEach(kiosk => {
            console.log(' this.menuItems=>', this.menuItems);
            this.menuItems.forEach(value => {
              if (kiosk.typeId == value.typeId) {
                console.log(value.typeId)
                value.checked = true;
                menus.push(this.fb.group({ typeId: value.typeId }));
              } else {
                if (!value.checked) {
                  value.checked = false;
                }
              }
            });
          });
        }
      } else {
        this.menuItems = [];
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
  get menuForms() {
    return <FormArray>this.kioskform.controls['kioskMenuCollection'];
  }

  getDestinationPrinters() {
    this.loading = true;
    this._deviceservice.getPrintersByDest().subscribe((response: IprinterList[]) => {
      if (response) {
        this.destinationPrintersList = response;
        console.log(' this.destinationPrintersList=>', this.destinationPrintersList);
        let indx = this.destinationPrintersList.findIndex(x => x.printId == 1);
        if (indx != -1)
          this.kioskform.get('destPrinter').setValue(this.destinationPrintersList[indx].destPrinter);
      }
      else
        this.destinationPrintersList = [];
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });

  }
  addMenuItems(menu, event) {
    const menus = this.kioskform.controls.kioskMenuCollection as FormArray;
    if (event.checked) {
      menus.push(this.fb.group({ typeId: menu.typeId }));
    }
    else {
      let index = menus.controls.findIndex(data => data.value.typeId == menu.typeId);
      menus.removeAt(index);
    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  //
  createKisok() {
    this.saveRolling = true;
    this.loading = true;
    this.KioskData = {
      kioskIp: this.kioskform.value.kioskIp,
      kioskMenuCollection: this.kioskform.value.kioskMenuCollection,
      kioskName: (this.kioskform.value.kioskName as string).trim(),
      orgId: this.kioskform.value.orgId,
      floorId: this.kioskform.value.kioskLevel
    } as ICreateKiosk;

    if (this.kioskform.value.destPrinter == 'No printer Selected' || this.kioskform.value.destPrinter == 'Local Printer') {
      this.KioskData.printerName = this.destinationPrintersList.filter(data => data.destPrinter == this.kioskform.value.destPrinter)[0].printId;
    }
    else {
      this.KioskData.printerName = this.kioskform.value.destPrinter;
    }
    console.log('create' + JSON.stringify(this.KioskData));
    if (this.kioskform.value.kioskId == 0 || (this.kioskform.value.kioskId == (null || undefined))) {
      this._deviceservice.validateKioskName((this.kioskform.value.kioskName as string).trim(), this.kioskform.value.kioskLevel).subscribe((response: IkioskResponse) => {
        if (response.status == true) {
          this._deviceservice.addKiosk(this.KioskData).subscribe(response => {
            if (response) {
              this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
              this.dialogRef.close("Kiosks");
              this.kioskform.reset();
            }
            else {
              this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
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
      });
    }
    else {
      this.KioskData.kioskId = this.editData.kioskId;
      this._deviceservice.updateKiosk(this.KioskData).subscribe(response => {
        if (response) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close("Kiosks");
          this.kioskform.reset();
        }
        else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR);
        this.loading = false;
      });
    }
  }
}

// export function KioskValidator(service: DevicesService): AsyncValidatorFn {
//   return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//     console.log("response=>", control.value);
//     return control.value != null ? service.validateKioskName(control.value)
//       .map(response => { return !response.status ? { invalid: true } : null }) : null;
//   };
// }

export function KioskIpValidator(service: DevicesService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    console.log("response=>", control.value);
    return control.value != null ? service.validateKioskIpAddress(control.value)
      .map(response => { return !response.status ? { invalid: true } : null }) : null;
  };
}
