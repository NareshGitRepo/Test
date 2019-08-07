import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IGlobalGet, IGlobalupdateRes, IGlobalGetRes } from '../Model/_globalModel';
import { GlobalSettingService } from '../service/_globalService';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-globalsettings',
  templateUrl: './globalsettings.component.html',
  styleUrls: ['./globalsettings.component.scss']
})
export class GlobalsettingsComponent implements OnInit {

  appSettingForm: FormGroup;
  appSettingFormsub: FormGroup;
  mainKeys: string[] = [];
  currentTime: Date = new Date();
  maxTime: Date;
  minTime: Date;
  loading: boolean = false;
  startTime: number = 0;
  endTime: number = 1;
  globallist: IGlobalGet[] = [];
  systemParamsList: IGlobalGetRes;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private _service: GlobalSettingService,
    private translate: TranslateService, private alertmessage: AlertMessageService, private datePipe: DatePipe, private router: Router, ) {

    this.maxTime = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), 23, 59);
    this.minTime = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), 0, 0);
  }
  ngOnInit() {
    this.appSettingForm = this.fb.group({});
    this.getAllSystemParameter();
  }
  getAllSystemParameter() {
    this.loading = true;
    this._service.getAllSystemParameter().subscribe((result: IGlobalGetRes) => {
      this.systemParamsList = result;
      this.globallist = result.systemParameter;
      console.log("result=>", result, this.globallist);
      this.getProperties();
      this.loading = false;
    }, error => {

      this.globallist = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllSystemParameter==> :: ", JSON.stringify(error));
      this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;

    });
  }
  getProperties() {
    this.loading = false;
    console.log('jsonData=>', this.systemParamsList);
    this.mainKeys = this.systemParamsList ? Object.keys(this.systemParamsList) : [];
    console.log("main", this.mainKeys);

    if (this.systemParamsList) {
      let datakeys = this.systemParamsList ? Object.keys(this.systemParamsList) : [];
      let appData = this.appSettingForm as FormGroup;
      let index = 0;
      datakeys.forEach(x => {
        this.appSettingFormsub = this.fb.group({});
        let appDatasub = this.appSettingFormsub as FormGroup;
        Object.keys(this.systemParamsList[x]).forEach(y => {
          let pushformgroupSub: FormGroup;

          console.log("this.jsonData=>", this.systemParamsList[x][y]);
          let data = this.systemParamsList[x][y];
          if (data.parameterType.toLowerCase() == 'time') {
            let strend = (data.value.trim()).split(':');
            console.log("strend", strend);

            const ehour = Number(strend[0].trim());
            const eminit = Number(strend.length > 1 ? strend[1].trim() : '00');
            data.value = new Date(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), ehour, eminit);
          }
          else if (data.parameterType.toLowerCase() == 'boolean') {
            data.value = data.value == 'true' ? true : false;
          }
          if (data.parameterName == 'CTT_START_TIME')
            this.startTime = index;
          if (data.parameterName == 'CTT_END_TIME')
            this.endTime = index;
          pushformgroupSub = this.fb.group(data);
          appDatasub.addControl(y, pushformgroupSub)
          index++;
        });
        appData.addControl(x, appDatasub);
        this.appSettingForm.patchValue(this.systemParamsList);
      });
    }
    this.cdr.detectChanges();

    console.log("this.appSettingForm=>", this.appSettingForm);
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertmessage.showAlert(error, action));
  }
  Submit() {
    this.loading = true;
    console.log("Submit=>", this.appSettingForm.get('systemParameter')['controls'][0].get('value').value);
    console.log("submit:::", this.systemParamsList);
    let count = 0;
    this.systemParamsList.systemParameter.forEach(x => {
      if (x.parameterName == 'CTT_START_TIME') {
        x.value = this.datePipe.transform(this.appSettingForm.get('systemParameter')['controls'][count].get('value').value, "HH:mm");
      }
      else if (x.parameterName == 'CTT_END_TIME') {
        x.value = this.datePipe.transform(this.appSettingForm.get('systemParameter')['controls'][count].get('value').value, "HH:mm");
      }
      else {
        x.value = this.appSettingForm.get('systemParameter')['controls'][count].get('value').value;
      }
      count++;
    });
    console.log("submit:::", JSON.stringify(this.systemParamsList));

    this._service.updateSystemParameterValues(this.systemParamsList).subscribe((result: IGlobalupdateRes) => {
      if (result) {
        this.showAlert(result.message, ActionType.SUCCESS);
      } else {
        this.showAlert(result.message, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-updateSystemParameterValues==> ", JSON.stringify(error));
      this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;

    });
  }

}
































