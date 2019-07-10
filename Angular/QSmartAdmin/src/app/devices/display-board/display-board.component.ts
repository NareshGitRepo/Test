import * as _ from 'lodash';

import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  Department,
  DepartmentCollection,
  DepartmentCollection1,
  DisplayBoard,
  Floor,
  IDepartements,
  IDepartment,
  IDisplay,
  IService,
  IkioskResponse,
  Service,
  ServiceCollection,
  displayType
} from '../_model/devicesModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DevicesService } from '../_service/deviceService';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-display-board',
  templateUrl: './display-board.component.html',
  styleUrls: ['./display-board.component.scss']
})
export class DisplayBoardComponent implements OnInit {

  displaylist: displayType[] = [
    { id: "R", displaybrdtype: "Reception" },
    { id: "W", displaybrdtype: "Waiting" }
  ];

  orgId: number;
  displaybordform: FormGroup;
  displatBoardData: IDisplay;
  editData: DisplayBoard;
  totalDepartements: IDepartements[];
  totalDepartements1: IDepartment[] = [];
  _tokenInfo: IUserUpdateDto;
  loading: boolean = false;
  levelInfo: Floor[] = [];
  departments: Department[] = [];
  serviceList: Service[] = [];
  displayNameFlag: boolean;
  displayNameDisableFlag: boolean;

  constructor(private fb: FormBuilder, private _deviceservice: DevicesService, private dialogRef: MatDialogRef<DisplayBoardComponent>,
    @Inject(MAT_DIALOG_DATA) public edit: any, private translate: TranslateService, private alertMessage: AlertMessageService,
    private appConfig: AppConfig, private cdref: ChangeDetectorRef, private router: Router) {
    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    console.log('editData=>', this.edit);
    if (edit != null) {
      this.editData = edit.data;
      // console.log('editData=>', this.editData);
    }

  }

  changeLevel(floorId, action?: boolean) {
    if (!this.editData)
       this.displaybordform.get('displayName').setValue(null);
       console.log("floorId::::::::::::::::", floorId);



    let indx = this.levelInfo.findIndex(con => con.floorId == floorId);
    if (indx != -1)
      this.totalDepartements1 = this.levelInfo[indx].departments;
    else
      this.totalDepartements1 = [];

    console.log("this.totalDepartements1 ", this.totalDepartements1, this.editData);
     this.displaybordform.get('departmentCollection').setValue(null);
      this.displaybordform.get('serviceCollection').setValue(null);


      if (this.editData){
        if(this.editData.floorId == floorId){
          this.displaybordform.patchValue(this.editData);
          this.displaybordform.patchValue({ serviceCollection: this.editData.services });
          action = false;
          }
          else{
          this.displaybordform.get('displayName').setValue(null);
          this.displaybordform.get('departmentCollection').setValue(null);
          this.displaybordform.get('serviceCollection').setValue(null);
          if(this.editData.displayType=="W")
          {
          this.displaybordform.get('departmentCollection').setValidators(Validators.required);
          this.displaybordform.get('departmentCollection').updateValueAndValidity();
          this.displaybordform.get('serviceCollection').setValidators(Validators.required);
          this.displaybordform.get('serviceCollection').updateValueAndValidity();
          }
          else{
            this.displaybordform.get('departmentCollection').clearValidators();
          this.displaybordform.get('departmentCollection').updateValueAndValidity();
          this.displaybordform.get('serviceCollection').clearValidators();
          this.displaybordform.get('serviceCollection').updateValueAndValidity();
          }
          action = true;
          }

      }
    if (!action) {
      this.displaybordform.get('displayLevel').setValue(floorId);
      this.displaybordform.get('departmentCollection').setValue(this.editData.departments.length > 0 ? this.editData.departments : null);

      this.changeDepartment(this.editData.departments, false)
    }
    else{
      this.displaybordform.get('displayName').setValue(null);
      this.serviceList=[];
    }

  }

  changeDepartment(departments, action?: boolean) {
    let servicedata = [];
    departments.forEach(element => {
      this.totalDepartements1.filter(con => con.deptId == element).forEach(x => {
        x.services.forEach(y => {
          servicedata.push(y);
        })
      })
    });

    this.serviceList = servicedata;
    console.log("totalDepartements ::", this.totalDepartements1, departments, this.serviceList);
    if (!action) {
      let serdata = [];
      this.editData.services.forEach(x => {
        serdata.push(x.serviceId);
      });
      console.log("depts list length :::::::::::::::", serdata, this.editData);
      this.displaybordform.get('serviceCollection').setValue(serdata.length > 0 ? serdata : null);
    }
  }

  getLevelsInfo(action?: boolean) {
    this.loading = true;
    this._deviceservice.getlevelsDeptSeviceInfo().subscribe((response: Floor[]) => {
      if (response) {
        this.levelInfo = response;
        if (!action)
          this.changeLevel(this.editData.floorId, false);
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

  dispalyNameExist() {
    console.log("Display" + this.displaybordform.getRawValue().displayLevel);
    if (this.displaybordform.getRawValue().displayLevel == null)
      this.alertMessage.showAlert(this.translate.instant('DevicesModule.errorSelectLevel'), ActionType.FAILED);
    else {
      if ((this.editData != null || this.editData != undefined) && (this.displaybordform.value.displayName as string).trim() == this.editData.displayName && this.displaybordform.value.displayLevel == this.editData.floorId) {
        this.displayNameFlag = true;
        this.displayNameDisableFlag = false;
      }
      else
        this._deviceservice.validateDisplayName((this.displaybordform.value.displayName as string).trim(), this.displaybordform.getRawValue().displayLevel).subscribe((response: IkioskResponse) => {
          if (response.status) {
            this.displayNameFlag = true;
            this.displayNameDisableFlag = false;
          } else {
            this.displayNameFlag = false;
            this.displayNameDisableFlag = true;
          }
        });
    }


  }

  ngOnInit() {
    this.displaybordform = this.fb.group({
      displayId: [''],
      displayName: ['', Validators.compose([Validators.required])],
      // validateDisplayName: [null, [Validators.required], [DisplayValidator(this._deviceservice)]],
      displayArea: ['Reception'],
      orgId: [this.orgId, Validators.required],
      displayType: ['', Validators.required],
      departmentCollection: [null, Validators.required],
      displayLevel: [null, Validators.required],
      serviceCollection: [null, Validators.required],
    });

    //this.getDepartementsInfo();
    console.log("this.editData =>" + JSON.stringify(this.editData));
    if (this.editData) {
      this.displayNameFlag = true;
      this.getLevelsInfo(false);
      console.log("this.editData=>" + JSON.stringify(this.editData));
      if (this.editData.departments.length <= 0) {
        this.displaybordform.get("departmentCollection").clearValidators();
        this.displaybordform.get("departmentCollection").updateValueAndValidity();
      }
      if (this.editData.services.length <= 0) {
        this.displaybordform.get("serviceCollection").clearValidators();
        this.displaybordform.get("serviceCollection").updateValueAndValidity();
      }
      let deptcollection = [];
      this.editData.departments.forEach(data => {
        deptcollection.push(data.deptId);
      });
      console.log("this.editData floor =>" + this.editData.floorId);
      this.editData.departments = deptcollection;
      this.displaybordform.patchValue(this.editData);
      //this.displaybordform.patchValue({ displayLevel: this.editData.floorId });
      // this.displaybordform.patchValue({ departmentCollection: this.editData.departments });
      this.displaybordform.patchValue({ serviceCollection: this.editData.services });
      // this.displaybordform.get("validateDisplayName").clearValidators();
      // this.displaybordform.get("validateDisplayName").clearAsyncValidators();
      // this.displaybordform.get("validateDisplayName").updateValueAndValidity();
    }
    else {
      this.getLevelsInfo(true);
    }
    this.cdref.detectChanges();
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


  getDepartementsInfo(value?: number) {
    this.loading = true;
    this._deviceservice.getDepartementsInfo(value)
      .subscribe((response: IDepartements[]) => {
        if (response.length != 0) {
          this.totalDepartements = response;
        }
        else {
          this.totalDepartements = [];
          this.alertMessage.showAlert(this.translate.instant('DevicesModule.displayboard.noDepartmentError'), ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        this.totalDepartements = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  createDisplayboard() {
    this.loading = true;
    let departmentCollections: DepartmentCollection1[] = [];
    let serviceCollections: ServiceCollection[] = [];
    if (this.displaybordform.value.displayType == 'W') {
      console.log("departmentCollections data::" + JSON.stringify(this.displaybordform.value.departmentCollection));
      departmentCollections.push({ departments: this.displaybordform.value.departmentCollection });
      console.log("serviceCollections data::" + JSON.stringify(this.displaybordform.value.serviceCollection));
      serviceCollections.push({ services: this.displaybordform.value.serviceCollection });
    } else {
      departmentCollections = [];
      serviceCollections = [];
    }

    this.displatBoardData = {
      orgId: this.displaybordform.value.orgId,
      floorId: this.displaybordform.value.displayLevel,
      displayName: (this.displaybordform.value.displayName as string).trim(),
      displayType: this.displaybordform.value.displayType,
      displayArea: this.displaybordform.value.displayArea,
      departmentCollection: departmentCollections,
      serviceCollection: serviceCollections
    } as IDisplay;

    console.log("form value:::::::::" + JSON.stringify(this.displatBoardData));
    if (this.displaybordform.value.displayId == 0 || (this.displaybordform.value.displayId == (null || undefined))) {
      this._deviceservice.validateDisplayName((this.displaybordform.value.displayName as string).trim(), this.displaybordform.value.displayLevel).subscribe((response: IkioskResponse) => {
        if (response.status == true) {
          console.log(response.status)
          this._deviceservice.addDisplay(this.displatBoardData).subscribe(response => {
            if (response) {
              this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
              this.dialogRef.close("DisplayBoards");
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
      this.displatBoardData.displayId = this.editData.displayId;
      console.log("Display:::" + JSON.stringify(this.displatBoardData));
      this._deviceservice.updateDisplay(this.displatBoardData).subscribe(response => {
        if (response) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close("DisplayBoards");
        }
        else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }

  displayType() {
    if (this.displaybordform.value.displayType == 'R') {
      // this.totalDepartements1 = [];
      // this.serviceList = [];
      this.displaybordform.get('departmentCollection').clearValidators();
      this.displaybordform.get('departmentCollection').updateValueAndValidity();
      this.displaybordform.get('serviceCollection').clearValidators();
      this.displaybordform.get('serviceCollection').updateValueAndValidity();
    } else {
      this.displaybordform.get('departmentCollection').setValidators(Validators.required);
      this.displaybordform.get('departmentCollection').updateValueAndValidity();
      this.displaybordform.get('serviceCollection').setValidators(Validators.required);
      this.displaybordform.get('serviceCollection').updateValueAndValidity();
    }
  }
}

// export function DisplayValidator(service: DevicesService): AsyncValidatorFn {
//   return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//     console.log("response=>", control.value);
//     return control.value != null ? service.validateDisplayName(control.value)
//       .map(response => { return !response.status ? { invalid: true } : null }) : null;
//   };
// }
