import * as _ from 'lodash';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService } from "../../../../_services/AlertMessageService";
import { ChannelsInfo, CustomersData, SegementCustomerData, creteProfileOpenData, ApiResponse } from '../../_model/segement-manage.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { AppConfig } from "../../../../_helpers/app.config";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { SegmentManageService } from '../../_service/segment-manage.service';
import { TranslateService } from "@ngx-translate/core";
// import { CustomerProfilingService } from '../../customerprofiling/_service/customerprofiling.service';

@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.component.html',
  styleUrls: ['./createprofile.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  customerProfileForm: FormGroup;
  channelsList: ChannelsInfo[] = [];
  segmentList: SegementCustomerData[] = [];
  loading: boolean = false;
  currentTime: Date = new Date();
  customerModel: CustomersData = {} as any;
  editCustomersData: CustomersData;
  addSegementCustomerData: SegementCustomerData;
  pushChannel = 0;
  smsChannel = 0;
  emailChannel = 0;
  maxDate: Date;
  maxTime: Date;
  minTime: Date;
  patternEmail = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
  constructor(private fb: FormBuilder, private service: SegmentManageService, public dialogRef: MatDialogRef<CreateCustomerComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public rowData: creteProfileOpenData, private Snackbar: MatSnackBar,
    private translate: TranslateService, private appconfig: AppConfig, private alertMessage: AlertMessageService, private router: Router
    , private datePipe: DatePipe) {
    this.maxTime = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), 23, 59);
    this.minTime = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), 0, 0);
    this.maxDate = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate());
    console.log("row::::", rowData, this.maxTime, this.minTime);
    if (rowData.type == 2)
      this.editCustomersData = rowData.CustomersDataData;
    if (rowData.type == 1)
      this.addSegementCustomerData = rowData.SegementCustomerData;

    this.currentTime.setHours(this.currentTime.getHours() + 2);
  }

  ngOnInit() {
    // this.startTime=new Date(this.currentTime);
    //  this.currentTime.setHours(this.currentTime.getHours() + 2);
    //  this.endTime = new Date(this.currentTime.getHours()+2);
    this.customerProfileForm = this.fb.group({
      customerName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      mobileNo: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern(this.patternEmail)]],
      dob: ['', Validators.required],
      pob: ['', Validators.required],
      residenceType: ['', Validators.required],
      nationality: ['', Validators.required],
      passportNo: ['', Validators.required],
      nationalId: ['', Validators.required],
      segmentMaster: ['', Validators.required],
      channelId: ['', Validators.required],
      language: ['', Validators.required],
      startTime: [new Date(), Validators.required],
      endTime: [new Date(this.currentTime), Validators.required],
      validateCustomerName: [null, [Validators.required], [CustomerValidator(this.service)]]
    });
    this.loading = true;
    this.service.getChannelsInfo().subscribe((response: ChannelsInfo[]) => {
      if (response != undefined) {
        console.log('Response =>', JSON.stringify(response));
        this.channelsList = response;
      }
      this.loading = false;
      this.getAllSegments();
    },
      error => {
        const message = error.error.messages as string;
        const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error('E-getChannelsInfo==>', JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    if (this.rowData.type == 2) {
      const str = this.editCustomersData.dob.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      const strstart = this.editCustomersData.prefStartTime.split(':');
      const strend = this.editCustomersData.prefEndTime.split(':');
      let date1 = new Date(year, month, date);

      const shour = Number(strstart[0]);
      const sminit = Number(strstart[1]);
      const ehour = Number(strend[0]);
      const eminit = Number(strend[1]);
      let dates = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), shour, sminit);
      let datee = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), ehour, eminit);
      console.log("editCustomersData=>", this.editCustomersData, shour, sminit, dates);
      this.customerProfileForm.get('validateCustomerName').clearValidators();
      this.customerProfileForm.get('validateCustomerName').clearAsyncValidators();
      this.customerModel = this.editCustomersData;
      this.customerProfileForm.patchValue({
        customerName: this.customerModel.customerName,
        address: this.customerModel.address,
        city: this.customerModel.city,
        country: this.customerModel.country,
        mobileNo: this.customerModel.mobileNo,
        emailId: this.customerModel.emailId,
        dob: date1,
        pob: this.customerModel.pob,
        residenceType: this.customerModel.residenceType,
        nationality: this.customerModel.nationality,
        passportNo: this.customerModel.passportNo,
        nationalId: this.customerModel.nationalId,
        segmentMaster: this.rowData.segmentId,
        language: this.customerModel.language + '',
        startTime: dates,
        endTime: datee,
      });
      let arry = [];
      if (this.customerModel.smsChannel == 1)
        arry.push(1);
      if (this.customerModel.emailChannel == 1)
        arry.push(2);
      if (this.customerModel.pushChannel == 1)
        arry.push(3);
      console.log('array : ', arry);
      this.customerProfileForm.get('channelId').setValue(arry);
      // this.customerProfileForm.get('language').setValue(this.customerModel.language+'');
    }
    if (this.rowData.type == 1) {
      this.customerProfileForm.get('segmentMaster').setValue(this.addSegementCustomerData.segmentId);
    }

  }

  getAllSegments() {
    this.loading = true;
    this.service.getSegmentwithCustomers().subscribe((result: SegementCustomerData[]) => {
      console.log('result of all segments : ', this.segmentList)
      if (result != undefined)
        this.segmentList = result.filter(x => x.status == 1);
      console.log("segments dropdown list:::::", this.segmentList);
      this.loading = false;
    },
      error => {
        const message = error.error.messages as string;
        const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error('E-getAllSegments==>', JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  createProfile() {
    this.loading = true;
    console.log('data : ', this.customerProfileForm.value);
    let segmentId = this.customerProfileForm.controls.segmentMaster.value;
    let segmentData = _.filter(this.segmentList, function (row) { return row.segmentId == segmentId })[0];
    console.log('segmentData : ', segmentData);
    let channels = this.customerProfileForm.value.channelId;
    if (channels.length > 0) {
      channels.forEach(element => {
        if (element == 1) {
          this.smsChannel = 1;
        }
        else if (element == 2) {
          this.emailChannel = 1;
        } else if (element == 3)
          this.pushChannel = 1;
      });
    }

    // if (channels.length > 0) {
    //   channels.forEach(element => {
    //   if (element == 1) {
    //   this.smsChannel = 1;
    //   } else if (element == 2) {
    //   this.emailChannel = 1;
    //   } else if (element == 3)
    //   this.pushChannel = 1;
    //   });
    //   }
    let dob = this.datePipe.transform(this.customerProfileForm.value.dob, "dd/MM/yyyy");
    const dataObj = {
      'address': this.customerProfileForm.controls.address.value,
      'city': this.customerProfileForm.controls.city.value,
      'country': this.customerProfileForm.value.country,
      'customerName': this.customerProfileForm.value.customerName,
      'dob': dob,
      'emailId': this.customerProfileForm.value.emailId,
      'mobileNo': this.customerProfileForm.value.mobileNo,
      'nationalId': this.customerProfileForm.value.nationalId,
      'nationality': this.customerProfileForm.value.nationality,
      'passportNo': this.customerProfileForm.value.passportNo,
      'pob': this.customerProfileForm.value.pob,
      'residenceType': this.customerProfileForm.value.residenceType,
      'segmentMaster': {
        "segmentDesc": segmentData.segmentDesc,
        "segmentId": segmentData.segmentId,
        "segmentName": segmentData.segmentName
      },
      'emailChannel': this.emailChannel,
      'pushChannel': this.pushChannel,
      'smsChannel': this.smsChannel,
      'language': this.customerProfileForm.value.language,
      'prefStartTime': this.datePipe.transform(this.customerProfileForm.value.startTime, "HH:mm"),
      'prefEndTime': this.datePipe.transform(this.customerProfileForm.value.endTime, 'HH:mm')
    };
    console.log('dataObj : ', dataObj, this.customerProfileForm.value.startTime);
    if (this.rowData.type != 2) {
      this.service.createCustomer(dataObj).subscribe((response: ApiResponse) => {
        if (response.status) {
          console.log('Response =>', JSON.stringify(response));
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(true);

        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      },
        error => {
          const message = error.error.messages as string;
          const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error('E-createProfile==>', JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    }
    else {
      dataObj['customerId'] = this.rowData.CustomersDataData.customerId;
      console.log('dataObj : ', dataObj, this.customerProfileForm.value.startTime, this.datePipe.transform(this.customerProfileForm.value.startTime, "HH:mm"));
      this.service.updateCustomerInfo(dataObj).subscribe((response: ApiResponse) => {
        if ((response as any).status) {
          console.log('Response =>', JSON.stringify(response));
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(true);

        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      },
        error => {
          const message = error.error.messages as string;
          const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error('E-createProfile==>', JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    }
  }
  setEndTimeMinVal() {
    console.log('inside setEndTimeMinVal :: ', this.customerProfileForm.value.startTime)
  }

}
export function CustomerValidator(service: SegmentManageService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateCustomerName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}
