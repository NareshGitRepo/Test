import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { Appointment, ICheckin, ICheckinRes, IGetappoinmentRequest } from './_model/ICheckin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppConfig, menuType } from '../_helpers/app.config';
import { CheckinService } from './_service/checkin.service';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { IRegistration } from '../registration/_model/IRegistration';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { TranslateService } from '@ngx-translate/core';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit, AfterViewChecked {


  checkinForm: FormGroup;
  check = 1;
  showError: boolean = false;
  errorMessage: boolean;
  ErrorMessageText: string;
  invalidOtp: boolean = false;
  public apiCheckinResponse: ICheckin;
  public apiCheckinToken: ICheckinRes;
  public apiRegisterResponse: IRegistration;
  public appointmentList: Appointment[] = [];
  showmrnFlag: boolean = false;
  timeoutconfig: number = 60;
  timeoutValue: number = 0;

  @ViewChild('mrnNo') mrn: ElementRef;

  constructor(private checkinServie: CheckinService, private dashboard: DashboardService, public dialog: MatDialog,
    private fb: FormBuilder, private appconfig: AppConfig, public router: Router, private userIdle: UserIdleService,
    private translate: TranslateService) {

    if (this.appconfig.getMenus()) {
      this.userIdle.resetTimer();
      this.timeoutconfig = this.appconfig.getTimeoutforcheckIn();
      this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
      this.userIdle.onTimerStart().subscribe(count=>{
        this.timeoutValue=count;
      });
    } else if (localStorage.getItem('kioskid')) {
      this.router.navigate(['/'], { queryParams: { kioskid: localStorage.getItem('kioskid') } });
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.showmrnFlag = true;

    console.log("Checkin ngOnInit() ::", new Date());
    this.userIdle.startWatching();
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      console.log("ontimeOut");

      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });

    this.checkinForm = this.fb.group({
      mrnNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      nationalId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });

    this.checkinForm.get('mrnNumber').valueChanges.subscribe(val => {
      this.userIdle.resetTimer();
      console.log('changes', val);
    });

    this.checkinForm.get('nationalId').valueChanges.subscribe(val => {
      this.userIdle.resetTimer();
      console.log('changes', val);
    });

  }

  // Validating Both Mrn Number And National Id...
  getAppointments() {
    this.userIdle.resetTimer();
    this.errorMessage = false;
    this.showError = false;
    let apiCheckinResponse: ICheckin;
    this.apiCheckinResponse = apiCheckinResponse;
    console.log("mrn and nationalId", this.checkinForm.value.mrnNumber, this.checkinForm.value.nationalId);
    let getappoinmentRequest = { mrnNumber: this.checkinForm.value.mrnNumber, nationalId: this.checkinForm.value.nationalId } as IGetappoinmentRequest
    console.log("getVerificationMrnNatIdOtp_Request", getappoinmentRequest);
    this.checkinServie.getAppointments(getappoinmentRequest).subscribe((response: ICheckin) => {
      console.log("getVerificationMrnNatIdOtp_Response", response);
      if (response) {
        this.apiCheckinResponse = response;
        if (this.apiCheckinResponse.status) {

          if (this.apiCheckinResponse.appointments.length > 0) {
            this.appointmentList = this.apiCheckinResponse.appointments;
            this.check = 2;

          } else {
            console.log("showerror");
            this.showError = true;
            this.HttpTimeoutError();
          }
        }
        else if (this.apiCheckinResponse.appointments.length > 0) {
          this.check = 2;
        }
        else {
          this.showError = true;
          this.HttpTimeoutError();
        }
      }
      else {
        this.errorMessage = true;
        this.HttpTimeoutError();
      }

    }, err => {
      console.log("Http timeout Error : " + JSON.stringify(err))
      this.errorMessage = true;
      this.HttpTimeoutError();
    });

  }

  public ngAfterViewChecked() {
    if (this.showmrnFlag) {
      setTimeout(() => {
        if (this.mrn)
          this.mrn.nativeElement.focus();
        this.showmrnFlag = false
      }, 1);
    }
  }

  tokenValid(id: any, name: string, deptName: string, checkinStatus: number) {
    this.userIdle.resetTimer();
    let error: string;
    this.ErrorMessageText = error;
    this.errorMessage = false;
    let icheckinRes: ICheckinRes;
    this.apiCheckinToken = icheckinRes;
    if (this.apiCheckinResponse.status && checkinStatus == 0) {
      console.log("generateCheckinToken_Request", id);
      this.checkinServie.generateCheckinToken(id).subscribe((response: ICheckinRes) => {
        console.log("generateCheckinToken_Response", response);
        if (response) {
          this.apiCheckinToken = response;
          if (this.apiCheckinToken.status) {
            let template = this.apiCheckinToken.template; //'Successfully message sent to printer';
            console.log('generateTokenPrinterPost_Request=>', name, deptName, this.apiCheckinToken.token, menuType.CK, template);

            this.dashboard.generateTokenPrinterPost(name, deptName, this.apiCheckinToken.token, menuType.CK, template);

            this.check = 3; // CheckIn Token Message
          }
          else {
            this.check = 4;
            this.ErrorMessageText = response.messages;
            this.HttpTimeoutError();
          }
        }
        else {
          this.check = 4;
          this.ErrorMessageText = response.messages;
          this.HttpTimeoutError();
        }
        console.log("TokenValid response:" + JSON.stringify(response));
      }, err => {
        console.log("Http timeout Error : " + JSON.stringify(err));
        this.check = 4;
        this.errorMessage = true;
        this.HttpTimeoutError();
      });
    } else {

      if (checkinStatus != 0) {
        this.ErrorMessageText = checkinStatus == 1 ? this.translate.instant('HOME.CheckInStatus1') : this.translate.instant('HOME.CheckInStatus2');
      }
      else
        this.ErrorMessageText = this.apiCheckinResponse.messages;

      this.check = 4;
      this.HttpTimeoutError();
    }

  }

  HttpTimeoutError() {
    this.userIdle.stopWatching();
    this.timeoutconfig=10;
    this.userIdle.setConfigValues({ idle: -1, timeout: 10, ping: 1 });
    this.userIdle.startWatching();
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });
  }

  ngOnDestroy() {
    console.log("Checkin Destroy .....");
    this.userIdle.stopWatching();
  }
}

